from __future__ import annotations

import json
import os
import re
import logging
from typing import Any, Dict, Iterable, List, Optional

from ..llm_client import LLMClient
from ..task3.task import (
    recommend_recipes,
    rag_cooking_instructions,
    rag_required_ingredients,
)
from ..task2.task import cooking_instructions as fallback_cooking_instructions, required_ingredients as fallback_required_ingredients
from .prompts import ROUTER_SYSTEM_PROMPT, ROUTER_USER_PROMPT


ChatMessage = Dict[str, str]


class ChatRouter:
    """Route chat requests to Task 3 RAG functions based on LLM intent classification."""

    def __init__(self, model: Optional[str] = None) -> None:
        router_model = model or os.getenv("LLM_ROUTER_MODEL")
        self._model_override = router_model
        self._llm = LLMClient(model=router_model) if router_model else LLMClient()
        self._logger = logging.getLogger(__name__)

    def route(self, history: Iterable[ChatMessage]) -> Dict[str, Any]:
        messages = [m for m in history if isinstance(m, dict)]
        if not messages:
            return self._error_response("unknown", "I need at least one user message to help.")

        latest_user = next((m for m in reversed(messages) if m.get("role") == "user" and m.get("content")), None)
        if not latest_user:
            return self._error_response("unknown", "Please provide a user message for me to process.")

        decision = self._classify(messages)
        raw_def_name: str = ""
        arguments: Dict[str, Any] = {}
        if isinstance(decision, dict):
            raw_def = decision.get("def_name")
            raw_def_name = str(raw_def).strip() if isinstance(raw_def, str) else ""
            raw_args = decision.get("arguments")
            if isinstance(raw_args, dict):
                arguments = raw_args
        else:
            raw_def_name = str(decision).strip()

        self._logger.debug("Router decision: %s", decision)

        def_name = raw_def_name

        if not def_name or def_name.lower() == "none":
            return self._error_response("unknown", "I'm not sure which tool fits your request. Try rephrasing your question.")

        if def_name == "recommend_recipes":
            ingredients = self._normalize_ingredients(arguments.get("ingredients") if arguments else None, latest_user.get("content", ""))
            if not ingredients:
                return self._error_response(def_name, "I could not detect which ingredients you have. Please list them.")
            result = recommend_recipes(ingredients)
            structured = self._build_recommendations(result)
            if structured is None:
                return self._error_response(def_name, "I couldn't interpret the recommendation results.")
            return structured

        if def_name == "rag_cooking_instructions":
            title = self._normalize_title(arguments.get("title") if arguments else None, latest_user.get("content", ""))
            if not title:
                return self._error_response(def_name, "I could not determine which recipe you want instructions for.")
            result = rag_cooking_instructions(title)
            if not result or not result.get("recipe"):
                self._logger.info("RAG instructions miss for '%s'; falling back to base LLM", title)
                result = fallback_cooking_instructions(title)
            self._logger.info("Instruction result payload: %s", result)
            structured = self._build_instructions(result, title)
            if structured is None:
                return self._error_response(def_name, "I couldn't format the instructions response.")
            return structured

        if def_name == "rag_required_ingredients":
            title = self._normalize_title(arguments.get("title") if arguments else None, latest_user.get("content", ""))
            if not title:
                return self._error_response(def_name, "I could not determine which recipe you need ingredients for.")
            result = rag_required_ingredients(title)
            ingredients = result.get("ingredients") if isinstance(result, dict) else []
            if not ingredients:
                self._logger.info("RAG ingredients miss for '%s'; falling back to base LLM", title)
                result = fallback_required_ingredients(title)
            self._logger.info("Ingredients result payload: %s", result)
            structured = self._build_ingredients(result, title)
            if structured is None:
                return self._error_response(def_name, "I couldn't format the ingredients response.")
            return structured

        return self._error_response("unknown", "I'm not sure which tool fits your request. Try rephrasing your question.")

    def _classify(self, history: List[ChatMessage]) -> Dict[str, Any]:
        payload = json.dumps(history, ensure_ascii=False)
        user_prompt = ROUTER_USER_PROMPT.format(history=payload)
        return self._llm.complete_json(
            ROUTER_SYSTEM_PROMPT,
            user_prompt,
            temperature=0.0,
            model=self._model_override,
        )

    def _normalize_ingredients(self, value: Any, fallback_text: str) -> List[str]:
        items: List[str] = []
        if isinstance(value, list):
            items = [str(v).strip() for v in value if str(v).strip()]
        elif isinstance(value, str):
            items = self._split_ingredients(value)

        if not items and fallback_text:
            items = self._split_ingredients(fallback_text)
        return [i for i in items if i]

    def _normalize_title(self, value: Any, fallback_text: str) -> str:
        if isinstance(value, str):
            candidate = value.strip().strip("\"'")
            if candidate:
                return candidate
        return self._guess_title(fallback_text)

    def _split_ingredients(self, text: str) -> List[str]:
        if "," in text:
            parts = [segment.strip() for segment in re.split(r",|\n", text) if segment.strip()]
            if parts:
                return parts
        normalized = re.sub(r"[.;:!?]+", " ", text.lower())
        normalized = re.sub(r"\s+", " ", normalized).strip()
        stop = {"i", "have", "a", "an", "the", "and", "with", "some", "of", "to", "what", "can", "cook", "ingredients", "need"}
        tokens = re.split(r"\s+and\s+|\s+", normalized)
        return [tok for tok in (t.strip() for t in tokens) if tok and tok not in stop]

    def _guess_title(self, text: str) -> str:
        cleaned = text.strip()
        cleaned = re.sub(r"[?!.]+$", "", cleaned).strip()
        patterns = [
            r"how (?:do|can|should|to) i (?:cook|make|prepare)\s+(.+)",
            r"tell me how to (?:cook|make|prepare)\s+(.+)",
            r"what ingredients do i need for\s+(.+)",
            r"ingredients for\s+(.+)",
            r"cook\s+(.+)",
        ]
        for pattern in patterns:
            match = re.search(pattern, cleaned, flags=re.IGNORECASE)
            if match:
                candidate = match.group(1).strip()
                candidate = re.sub(r"^(?:to|the)\s+", "", candidate, flags=re.IGNORECASE)
                return candidate.strip("\"'")
        return cleaned

    def _build_recommendations(self, payload: Any) -> Optional[Dict[str, Any]]:
        if not isinstance(payload, dict):
            return None
        suggestions = payload.get("suggestions")
        if not isinstance(suggestions, list):
            suggestions = []

        normalized: List[Dict[str, Any]] = []
        for item in suggestions:
            if not isinstance(item, dict):
                continue
            title = str(item.get("title", "")).strip()
            why = str(item.get("why", "")).strip()
            missing_src = item.get("missing")
            if isinstance(missing_src, list):
                missing = [str(m).strip() for m in missing_src if str(m).strip()]
            else:
                missing = []
            match_score_val = item.get("matchScore")
            match_score = self._to_float(match_score_val)
            normalized.append({
                "title": title,
                "matchScore": match_score,
                "missing": missing,
                "why": why,
            })

        return {"suggestions": normalized}

    def _build_instructions(self, payload: Any, fallback_title: str) -> Optional[Dict[str, Any]]:
        if not isinstance(payload, dict):
            return None
        title = str(payload.get("title") or fallback_title or "").strip()
        recipe_text = str(payload.get("recipe") or "").strip()

        steps_src = payload.get("steps")
        steps = [str(step).strip() for step in steps_src if isinstance(step, str) and step.strip()] if isinstance(steps_src, list) else []

        notes_src = payload.get("notes")
        notes = [str(note).strip() for note in notes_src if isinstance(note, str) and note.strip()] if isinstance(notes_src, list) else []

        return {
            "title": title,
            "recipe": recipe_text,
            "steps": steps,
            "notes": notes,
        }

    def _build_ingredients(self, payload: Any, fallback_title: str) -> Optional[Dict[str, Any]]:
        if not isinstance(payload, dict):
            return None
        title = str(payload.get("title") or fallback_title or "").strip()
        items_src = payload.get("ingredients")
        items: List[Dict[str, str]] = []
        if isinstance(items_src, list):
            for item in items_src:
                if isinstance(item, dict):
                    name = str(item.get("name", "")).strip()
                    quantity = str(item.get("quantity", "")).strip()
                    unit = str(item.get("unit", "")).strip()
                    items.append({"name": name, "quantity": quantity, "unit": unit})
                elif isinstance(item, str):
                    items.append({"name": item.strip(), "quantity": "", "unit": ""})

        return {"title": title, "ingredients": items}

    def _to_float(self, value: Any) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0

    def _error_response(self, def_name: str, message: str) -> Dict[str, Any]:
        self._logger.warning("Router error for %s: %s", def_name, message)
        if def_name == "recommend_recipes":
            suggestions = []
            if message:
                suggestions.append({"title": "", "matchScore": 0.0, "missing": [], "why": message})
            return {"suggestions": suggestions}
        if def_name == "rag_required_ingredients":
            items = []
            if message:
                items.append({"name": message, "quantity": "", "unit": ""})
            return {"title": "", "ingredients": items}
        # Default to instructions schema so the client receives structured JSON
        return {"title": "", "recipe": "", "steps": [], "notes": [message] if message else []}


_router = ChatRouter()


def chat_response(history: Iterable[ChatMessage]) -> Dict[str, Any]:
    return _router.route(history)

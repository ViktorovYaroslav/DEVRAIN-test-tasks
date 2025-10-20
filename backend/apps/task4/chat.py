from __future__ import annotations

import json
import os
import re
from typing import Any, Dict, Iterable, List, Optional

from ..llm_client import LLMClient
from ..task3.task import (
    recommend_recipes,
    rag_cooking_instructions,
    rag_required_ingredients,
)
from .prompts import ROUTER_SYSTEM_PROMPT, ROUTER_USER_PROMPT


ChatMessage = Dict[str, str]


class ChatRouter:
    """Route chat requests to Task 3 RAG functions based on LLM intent classification."""

    def __init__(self, model: Optional[str] = None) -> None:
        router_model = model or os.getenv("LLM_ROUTER_MODEL")
        self._model_override = router_model
        self._llm = LLMClient(model=router_model) if router_model else LLMClient()

    def route(self, history: Iterable[ChatMessage]) -> str:
        messages = [m for m in history if isinstance(m, dict)]
        if not messages:
            return "I need at least one user message to help."

        latest_user = next((m for m in reversed(messages) if m.get("role") == "user" and m.get("content")), None)
        if not latest_user:
            return "Please provide a user message for me to process."

        decision = self._classify(messages)
        def_name = (decision.get("def_name") if isinstance(decision, dict) else str(decision)).strip()
        arguments = decision.get("arguments", {}) if isinstance(decision, dict) else {}

        if not def_name or def_name.lower() == "none":
            return "I'm not sure which tool fits your request. Try rephrasing your question."

        if def_name == "recommend_recipes":
            ingredients = self._normalize_ingredients(arguments.get("ingredients"), latest_user.get("content", ""))
            if not ingredients:
                return "I could not detect which ingredients you have. Please list them."
            result = recommend_recipes(ingredients)
            return self._format_response(def_name, result)

        if def_name == "rag_cooking_instructions":
            title = self._normalize_title(arguments.get("title"), latest_user.get("content", ""))
            if not title:
                return "I could not determine which recipe you want instructions for."
            result = rag_cooking_instructions(title)
            return self._format_response(def_name, result)

        if def_name == "rag_required_ingredients":
            title = self._normalize_title(arguments.get("title"), latest_user.get("content", ""))
            if not title:
                return "I could not determine which recipe you need ingredients for."
            result = rag_required_ingredients(title)
            return self._format_response(def_name, result)

        return "I'm not sure which tool fits your request. Try rephrasing your question."

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

    def _format_response(self, def_name: str, payload: Dict[str, Any]) -> str:
        if def_name == "recommend_recipes":
            suggestions = payload.get("suggestions") if isinstance(payload, dict) else None
            if not suggestions:
                return "I couldn't find matching recipes for those ingredients."
            lines = []
            for item in suggestions:
                if not isinstance(item, dict):
                    continue
                title = item.get("title", "Unknown recipe")
                why = item.get("why")
                missing = item.get("missing") or []
                missing_part = f" (missing: {', '.join(missing)})" if missing else ""
                detail = f"{title}{missing_part}"
                if why:
                    detail += f" — {why}"
                lines.append(f"- {detail}")
            if not lines:
                return "I couldn't interpret the recommendation results."
            return "Here are some ideas:\n" + "\n".join(lines)

        if def_name == "rag_cooking_instructions":
            title = payload.get("title", "the recipe") if isinstance(payload, dict) else "the recipe"
            steps = payload.get("steps") if isinstance(payload, dict) else None
            if steps:
                numbered = "\n".join(f"{idx + 1}. {step}" for idx, step in enumerate(steps) if isinstance(step, str))
                return f"Instructions for {title}:\n{numbered}"
            recipe_text = payload.get("recipe") if isinstance(payload, dict) else None
            return recipe_text or f"I couldn't locate instructions for {title}."

        if def_name == "rag_required_ingredients":
            title = payload.get("title", "the recipe") if isinstance(payload, dict) else "the recipe"
            ingredients = payload.get("ingredients") if isinstance(payload, dict) else None
            if ingredients:
                lines = []
                for item in ingredients:
                    if not isinstance(item, dict):
                        continue
                    name = item.get("name", "ingredient")
                    qty = item.get("quantity", "")
                    unit = item.get("unit", "")
                    qty_unit = " ".join(part for part in [qty, unit] if part).strip()
                    if qty_unit:
                        lines.append(f"- {qty_unit} {name}".strip())
                    else:
                        lines.append(f"- {name}")
                if lines:
                    return f"Ingredients for {title}:\n" + "\n".join(lines)
            return f"I couldn't find the ingredient list for {title}."

        return json.dumps(payload, ensure_ascii=False)


_router = ChatRouter()


def chat_response(history: Iterable[ChatMessage]) -> str:
    return _router.route(history)

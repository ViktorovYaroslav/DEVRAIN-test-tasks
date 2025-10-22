from __future__ import annotations

import json
import logging
import re
from typing import Any, Dict, Iterable, List, Optional

from ..llm_client import LLMClient
from ..task3.retriever import QdrantRetriever
from .prompts import FULL_DEMO_SYSTEM_PROMPT, FULL_DEMO_USER_TEMPLATE


FullDemoImage = Dict[str, str]
FullDemoMessage = Dict[str, Any]


class FullDemoChatEngine:
    def __init__(self) -> None:
        self._llm = LLMClient()
        self._retriever = QdrantRetriever()
        self._logger = logging.getLogger(__name__)

    def respond(self, history: Iterable[FullDemoMessage]) -> Dict[str, Any]:
        messages = [self._normalize_message(m) for m in history if isinstance(m, dict)]
        if not messages:
            return self._markdown_fallback("I need at least one user message to help.")

        latest_user = next((m for m in reversed(messages) if m["role"] == "user" and (m["content"] or m["images"])), None)
        if not latest_user:
            return self._markdown_fallback("Please provide a user message for me to process.")

        combined_user_text = " \n".join(m["content"] for m in messages if m["role"] == "user")
        detected_ingredients = self._extract_ingredients(combined_user_text)
        title_candidate = self._guess_title(combined_user_text)

        recommendation_candidates = self._retrieve_recommendations(detected_ingredients)
        recipe_candidate = self._retrieve_recipe(title_candidate, recommendation_candidates)

        context_payload = self._build_context_payload(
            detected_ingredients,
            title_candidate,
            recommendation_candidates,
            recipe_candidate,
        )

        content_blocks = self._build_content_blocks(messages, latest_user, context_payload)

        try:
            response = self._llm.complete_json_from_blocks(
                FULL_DEMO_SYSTEM_PROMPT,
                content_blocks,
                temperature=0.2,
                max_tokens=2048,
            )
        except Exception as exc:
            self._logger.exception("Full demo chat LLM call failed")
            return self._markdown_fallback(f"I ran into an error preparing the answer: {exc}")

        return self._sanitize_response(response)

    def _normalize_message(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        role = str(raw.get("role", "")).strip().lower()
        if role not in {"user", "assistant", "system"}:
            role = "user"
        content = str(raw.get("content") or "").strip()
        images: List[FullDemoImage] = []
        raw_images = raw.get("images")
        if isinstance(raw_images, list):
            for item in raw_images:
                if not isinstance(item, dict):
                    continue
                data = item.get("data") or item.get("base64")
                media_type = item.get("media_type") or item.get("mediaType")
                if not data or not media_type:
                    continue
                images.append({"data": str(data), "media_type": str(media_type)})
        return {"role": role, "content": content, "images": images}

    def _extract_ingredients(self, text: str, max_items: int = 8) -> List[str]:
        tokens = []
        lower = text.lower()
        if "," in lower:
            tokens.extend(segment.strip() for segment in re.split(r",|\n", lower) if segment.strip())
        normalized = re.sub(r"[.;:!?]+", " ", lower)
        normalized = re.sub(r"\s+", " ", normalized)
        for chunk in re.split(r"\sand\s|\s", normalized):
            token = chunk.strip()
            if token:
                tokens.append(token)
        stop_words = {"i", "have", "the", "a", "an", "and", "some", "need", "cook", "for", "of", "with", "recipe", "ingredients", "make", "how", "can"}
        unique: List[str] = []
        for token in tokens:
            clean = token.strip().strip("'\"")
            if not clean or clean in stop_words:
                continue
            if clean not in unique:
                unique.append(clean)
            if len(unique) >= max_items:
                break
        return unique

    def _guess_title(self, text: str) -> str:
        cleaned = text.strip()
        cleaned = re.sub(r"[?!.]+$", "", cleaned).strip()
        patterns = [
            r"how (?:do|can|should|to) i (?:cook|make|prepare)\s+(.+)",
            r"tell me how to (?:cook|make|prepare)\s+(.+)",
            r"what ingredients do i need for\s+(.+)",
            r"ingredients for\s+(.+)",
            r"recipe for\s+(.+)",
            r"cook\s+(.+)",
        ]
        for pattern in patterns:
            match = re.search(pattern, cleaned, flags=re.IGNORECASE)
            if match:
                candidate = match.group(1).strip()
                candidate = re.sub(r"^(?:to|the)\s+", "", candidate, flags=re.IGNORECASE)
                return candidate.strip("'\"")
        if len(cleaned.split()) <= 6:
            return cleaned
        return ""

    def _retrieve_recommendations(self, ingredients: List[str]) -> List[Dict[str, Any]]:
        if not ingredients:
            return []
        try:
            results = self._retriever.search_by_ingredients(ingredients, top_k=5)
        except Exception as exc:
            self._logger.warning("search_by_ingredients failed: %s", exc)
            return []
        truncated: List[Dict[str, Any]] = []
        for item in results:
            truncated.append({
                "title": item.get("title"),
                "score": float(item.get("score", 0.0) or 0.0),
                "ingredients": item.get("ingredients", [])[:10],
                "recipe": self._truncate_text(item.get("recipe", ""), 1200),
            })
        return truncated

    def _retrieve_recipe(self, title: str, recommendations: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        candidate_title = title
        if not candidate_title and recommendations:
            candidate_title = recommendations[0].get("title") or ""
        if not candidate_title:
            return None
        try:
            doc = self._retriever.get_by_title(candidate_title)
        except Exception as exc:
            self._logger.warning("get_by_title failed: %s", exc)
            doc = None
        if not doc and recommendations:
            fallback_title = recommendations[0].get("title")
            if fallback_title and fallback_title != candidate_title:
                try:
                    doc = self._retriever.get_by_title(str(fallback_title))
                except Exception as exc:
                    self._logger.warning("fallback get_by_title failed: %s", exc)
                    doc = None
        if not doc:
            return None
        return {
            "title": doc.get("title"),
            "ingredients": doc.get("ingredients", []),
            "recipe": self._truncate_text(doc.get("recipe", ""), 2000),
            "ner": doc.get("ner", []),
        }

    def _build_context_payload(
        self,
        ingredients: List[str],
        title_candidate: str,
        recommendations: List[Dict[str, Any]],
        recipe_doc: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "detected": {
                "ingredients": ingredients,
                "title_candidate": title_candidate,
                "recipe_title": recipe_doc.get("title") if recipe_doc else "",
            },
            "recommendation_candidates": recommendations,
        }
        if recipe_doc:
            payload["recipe_candidate"] = recipe_doc
        return payload

    def _build_content_blocks(
        self,
        messages: List[Dict[str, Any]],
        latest_user: Dict[str, Any],
        context_payload: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        blocks: List[Dict[str, Any]] = []
        for image in latest_user["images"]:
            blocks.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": image["media_type"],
                    "data": image["data"],
                },
            })
        history_tail = messages[-6:]
        history_repr = [
            {
                "role": msg["role"],
                "content": self._truncate_text(msg["content"], 800),
            }
            for msg in history_tail
        ]
        latest_user_text = self._truncate_text(latest_user["content"], 1200)
        context_json = json.dumps(context_payload, ensure_ascii=False)
        history_json = json.dumps(history_repr, ensure_ascii=False)
        user_text = FULL_DEMO_USER_TEMPLATE.format(
            history=history_json,
            latest_user=latest_user_text,
            context=context_json,
        )
        blocks.append({"type": "text", "text": user_text})
        return blocks

    def _truncate_text(self, text: str, max_len: int) -> str:
        if len(text) <= max_len:
            return text
        return text[: max_len - 3] + "..."

    def _markdown_fallback(self, message: str) -> Dict[str, Any]:
        return {"response_type": "markdown", "data": message}

    def _sanitize_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(response, dict):
            return self._markdown_fallback("I could not understand the response format.")
        response_type = str(response.get("response_type") or "").strip().lower()
        data = response.get("data")
        if response_type not in {"recommendations", "recipe", "markdown"}:
            return self._markdown_fallback("I could not determine the correct answer type.")
        if response_type == "markdown":
            if not isinstance(data, str):
                data = str(data)
            return {"response_type": "markdown", "data": data or "I do not have enough information."}
        if not isinstance(data, dict):
            return self._markdown_fallback("Structured response missing data object.")
        if response_type == "recommendations":
            items = data.get("items")
            normalized: List[Dict[str, Any]] = []
            if isinstance(items, list):
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    normalized.append({
                        "title": str(item.get("title", "")),
                        "why": str(item.get("why", "")),
                        "matchScore": float(item.get("matchScore", 0.0) or 0.0),
                        "missing": [str(m) for m in item.get("missing", []) if str(m)],
                    })
            return {"response_type": "recommendations", "data": {"items": normalized}}
        # recipe response
        ingredients = []
        raw_ingr = data.get("ingredients") if isinstance(data, dict) else []
        if isinstance(raw_ingr, list):
            for entry in raw_ingr:
                if isinstance(entry, dict):
                    ingredients.append({
                        "name": str(entry.get("name", "")),
                        "quantity": str(entry.get("quantity", "")),
                        "unit": str(entry.get("unit", "")),
                    })
        return {
            "response_type": "recipe",
            "data": {
                "title": str(data.get("title", "")),
                "summary": str(data.get("summary", "")),
                "ingredients": ingredients,
                "steps": [str(step) for step in data.get("steps", []) if str(step)],
                "notes": [str(note) for note in data.get("notes", []) if str(note)],
            },
        }


_full_demo_engine = FullDemoChatEngine()


def full_demo_response(history: Iterable[FullDemoMessage]) -> Dict[str, Any]:
    return _full_demo_engine.respond(history)

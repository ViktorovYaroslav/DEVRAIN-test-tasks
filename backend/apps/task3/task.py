from __future__ import annotations

import json
import time
import logging
from typing import Any, Dict, List

from ..llm_client import LLMClient
from .retriever import QdrantRetriever
from .prompts import (
    RAG_RECOMMEND_SYSTEM,
    RAG_RECOMMEND_USER,
    RAG_INSTR_SYSTEM,
    RAG_INSTR_USER,
    RAG_INGR_SYSTEM,
    RAG_INGR_USER,
)


_llm = LLMClient()
_retriever = QdrantRetriever()
_logger = logging.getLogger(__name__)


def recommend_recipes(ingredients: List[str], top_k: int = 5) -> Dict[str, Any]:
    t0 = time.time()
    results = _retriever.search_by_ingredients(ingredients, top_k=top_k)
    t1 = time.time()
    ctx = [
        {"title": r.get("title"), "ingredients": r.get("ingredients", []), "ner": r.get("ner", [])}
        for r in results
    ]
    user = RAG_RECOMMEND_USER.format(ingredients=", ".join(ingredients), context=json.dumps(ctx, ensure_ascii=False))
    t2 = time.time()
    out = _llm.complete_json(RAG_RECOMMEND_SYSTEM, user)
    t3 = time.time()
    _logger.info(
        "recommend_recipes: retrieve=%.1fms prompt=%.1fms llm=%.1fms",
        (t1 - t0) * 1000,
        (t2 - t1) * 1000,
        (t3 - t2) * 1000,
    )
    return out


def rag_cooking_instructions(title: str) -> Dict[str, Any]:
    t0 = time.time()
    rec = _retriever.get_by_title(title)
    recipe_text = rec.get("recipe", "") if rec else ""
    user = RAG_INSTR_USER.format(title=title, recipe=recipe_text)
    t1 = time.time()
    out = _llm.complete_json(RAG_INSTR_SYSTEM, user)
    t2 = time.time()
    _logger.info(
        "rag_cooking_instructions: retrieve=%.1fms llm=%.1fms",
        (t1 - t0) * 1000,
        (t2 - t1) * 1000,
    )
    return out


def rag_required_ingredients(title: str) -> Dict[str, Any]:
    # Deterministic: return ingredients directly from Qdrant payload to avoid LLM hallucinations
    t0 = time.time()
    rec = _retriever.get_by_title(title)
    t1 = time.time()
    ingredients_list = rec.get("ingredients", []) if rec else []
    out = {
        "title": (rec.get("title") if rec else title),
        "ingredients": [{"name": str(item), "quantity": "", "unit": ""} for item in ingredients_list],
    }
    t2 = time.time()
    _logger.info(
        "rag_required_ingredients(deterministic): retrieve=%.1fms format=%.1fms count=%d",
        (t1 - t0) * 1000,
        (t2 - t1) * 1000,
        len(ingredients_list),
    )
    return out

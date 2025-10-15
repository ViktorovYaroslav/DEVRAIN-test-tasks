from __future__ import annotations

import json
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


def recommend_recipes(ingredients: List[str], top_k: int = 5) -> Dict[str, Any]:
    results = _retriever.search_by_ingredients(ingredients, top_k=top_k)
    ctx = [
        {"title": r.get("title"), "ingredients": r.get("ingredients", []), "ner": r.get("ner", [])}
        for r in results
    ]
    user = RAG_RECOMMEND_USER.format(ingredients=", ".join(ingredients), context=json.dumps(ctx, ensure_ascii=False))
    return _llm.complete_json(RAG_RECOMMEND_SYSTEM, user)


def rag_cooking_instructions(title: str) -> Dict[str, Any]:
    rec = _retriever.get_by_title(title)
    recipe_text = rec.get("recipe", "") if rec else ""
    user = RAG_INSTR_USER.format(title=title, recipe=recipe_text)
    return _llm.complete_json(RAG_INSTR_SYSTEM, user)


def rag_required_ingredients(title: str) -> Dict[str, Any]:
    rec = _retriever.get_by_title(title)
    ingredients = rec.get("ingredients", []) if rec else []
    user = RAG_INGR_USER.format(title=title, ingredients=json.dumps(ingredients, ensure_ascii=False))
    return _llm.complete_json(RAG_INGR_SYSTEM, user)

from __future__ import annotations

import os
import time
import logging
import threading
import re
from typing import Any, Dict, List, Optional
from difflib import SequenceMatcher

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from qdrant_client.http.exceptions import UnexpectedResponse


class QdrantRetriever:
    """Simple Qdrant-based retriever using MiniLM embeddings.

    Expects QDRANT_URL (and optionally QDRANT_API_KEY) in environment.
    """

    def __init__(self, collection: Optional[str] = None, model_name: str = "sentence-transformers/all-MiniLM-L6-v2") -> None:
        url = os.getenv("QDRANT_URL")
        api_key = os.getenv("QDRANT_API_KEY")
        if not url:
            raise RuntimeError("QDRANT_URL is not set")
        self.client = QdrantClient(url=url, api_key=api_key)
        # Allow overriding collection via env
        self.collection = collection or os.getenv("QDRANT_COLLECTION", "recipes")
        self._model_name = model_name
        self._embedder: Optional[SentenceTransformer] = None
        self._lock = threading.Lock()
        self._logger = logging.getLogger(__name__)
        self._exact_filter_supported = True

    def _encode(self, text: str) -> List[float]:
        t0 = time.time()
        if self._embedder is None:
            with self._lock:
                if self._embedder is None:
                    # Lazy-load the model on first use
                    self._logger.info("Loading embedding model %s ...", self._model_name)
                    m0 = time.time()
                    self._embedder = SentenceTransformer(self._model_name)
                    self._logger.info("Embedding model loaded in %.3fs", time.time() - m0)
        e0 = time.time()
        vec = self._embedder.encode(text, normalize_embeddings=True)
        enc_ms = (time.time() - e0) * 1000
        self._logger.debug("Encoded text len=%d in %.1fms", len(text), enc_ms)
        return vec.astype("float32").tolist()

    def warmup(self) -> None:
        """Warm up the embedder to avoid cold-start on first request."""
        try:
            _ = self._encode("warmup")
        except Exception as exc:
            self._logger.warning("Retriever warmup failed: %s", exc)

    def search_by_ingredients(self, ingredients: List[str], top_k: int = 5) -> List[Dict[str, Any]]:
        query = ", ".join(ingredients)
        t0 = time.time()
        vector = self._encode(query)
        t1 = time.time()
        res = self.client.search(collection_name=self.collection, query_vector=vector, limit=top_k)
        t2 = time.time()
        self._logger.debug(
            "search_by_ingredients: encode=%.1fms qdrant=%.1fms results=%d",
            (t1 - t0) * 1000,
            (t2 - t1) * 1000,
            len(res) if res else 0,
        )
        out: List[Dict[str, Any]] = []
        for r in res:
            out.append({
                "id": r.id,
                "score": float(r.score),
                "title": r.payload.get("title"),
                "ingredients": r.payload.get("ingredients", []),
                "ner": r.payload.get("ner", []),
                "recipe": r.payload.get("recipe", ""),
            })
        return out

    def get_by_title(self, title: str, top_k: int = 5) -> Optional[Dict[str, Any]]:
        # Embed title and search top-1; robust to minor variations
        t0 = time.time()
        vector = self._encode(title)
        t1 = time.time()
        # First, try exact title match via payload filter to avoid picking a different variant
        res = []
        if self._exact_filter_supported:
            exact_filter = Filter(must=[FieldCondition(key="title", match=MatchValue(value=title))])
            try:
                res = self.client.search(
                    collection_name=self.collection,
                    query_vector=vector,
                    limit=top_k,
                    query_filter=exact_filter,
                )
            except UnexpectedResponse as exc:
                self._exact_filter_supported = False
                self._logger.warning(
                    "Exact title filter unavailable; falling back to semantic search. status=%s body=%s",
                    getattr(exc, "status_code", "?"),
                    getattr(exc, "body", str(exc)),
                )
                res = []
        # Fallback: unfiltered semantic search if nothing matched exactly
        if not res:
            res = self.client.search(collection_name=self.collection, query_vector=vector, limit=top_k)
        t2 = time.time()
        self._logger.debug(
            "get_by_title: encode=%.1fms qdrant=%.1fms",
            (t1 - t0) * 1000,
            (t2 - t1) * 1000,
        )
        if not res:
            return None
        best = self._pick_best_match(title, res)
        return {
            "id": best.id,
            "score": float(best.score),
            "title": best.payload.get("title"),
            "ingredients": best.payload.get("ingredients", []),
            "ner": best.payload.get("ner", []),
            "recipe": best.payload.get("recipe", ""),
        }

    def _pick_best_match(self, query: str, hits: List[Any]) -> Any:
        norm_query = self._normalize_title(query)
        best = hits[0]
        best_sim = -1.0
        for hit in hits:
            candidate_title = hit.payload.get("title") or ""
            sim = self._title_similarity(norm_query, self._normalize_title(candidate_title))
            if sim > best_sim:
                best = hit
                best_sim = sim
        self._logger.debug("get_by_title best match sim=%.3f title=%s", best_sim, best.payload.get("title"))
        return best

    @staticmethod
    def _normalize_title(text: str) -> str:
        lowered = text.lower()
        collapsed = re.sub(r"[^a-z0-9]+", " ", lowered)
        return re.sub(r"\s+", " ", collapsed).strip()

    @staticmethod
    def _title_similarity(query_norm: str, candidate_norm: str) -> float:
        if not query_norm or not candidate_norm:
            return 0.0
        return SequenceMatcher(a=query_norm, b=candidate_norm).ratio()

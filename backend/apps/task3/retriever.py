from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
import threading

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient


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

    def _encode(self, text: str) -> List[float]:
        if self._embedder is None:
            with self._lock:
                if self._embedder is None:
                    # Lazy-load the model on first use
                    self._embedder = SentenceTransformer(self._model_name)
        vec = self._embedder.encode(text, normalize_embeddings=True)
        return vec.astype("float32").tolist()

    def search_by_ingredients(self, ingredients: List[str], top_k: int = 5) -> List[Dict[str, Any]]:
        query = ", ".join(ingredients)
        vector = self._encode(query)
        res = self.client.search(collection_name=self.collection, query_vector=vector, limit=top_k)
        out: List[Dict[str, Any]] = []
        for r in res:
            out.append({
                "score": float(r.score),
                "title": r.payload.get("title"),
                "ingredients": r.payload.get("ingredients", []),
                "ner": r.payload.get("ner", []),
                "recipe": r.payload.get("recipe", ""),
            })
        return out

    def get_by_title(self, title: str, top_k: int = 1) -> Optional[Dict[str, Any]]:
        # Embed title and search top-1; robust to minor variations
        vector = self._encode(title)
        res = self.client.search(collection_name=self.collection, query_vector=vector, limit=top_k)
        if not res:
            return None
        r = res[0]
        return {
            "score": float(r.score),
            "title": r.payload.get("title"),
            "ingredients": r.payload.get("ingredients", []),
            "ner": r.payload.get("ner", []),
            "recipe": r.payload.get("recipe", ""),
        }

import os
import json
import argparse
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import numpy as np
import pandas as pd
from tqdm import trange
from sentence_transformers import SentenceTransformer

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct


def read_table_stream(path: Path, chunksize: int = 0) -> Tuple[Iterable[pd.DataFrame], bool]:
    """
    Returns an iterator of DataFrames and a boolean indicating whether it's a single-pass stream.
    If chunksize > 0 and CSV, yields chunks; for Excel, loads full into memory.
    """
    if path.suffix.lower() in (".xlsx", ".xls"):
        # Excel cannot be streamed easily; load whole file
        df = pd.read_excel(path)
        return [df], False
    if chunksize and chunksize > 0:
        return (pd.read_csv(path, chunksize=chunksize, encoding_errors="ignore")), True
    return [pd.read_csv(path, encoding_errors="ignore")], False


def safe_list(x) -> List[str]:
    if isinstance(x, list):
        return [str(i) for i in x]
    if isinstance(x, str):
        s = x.strip()
        if not s:
            return []
        try:
            obj = json.loads(s)
            if isinstance(obj, list):
                return [str(i) for i in obj]
        except Exception:
            pass
        if "," in s:
            return [i.strip() for i in s.split(",") if i.strip()]
        return [s]
    return []


def text_for_embedding(row: Dict[str, Any]) -> str:
    title = str(row.get("title", "")).strip()
    ner = safe_list(row.get("NER", []))
    ing = safe_list(row.get("ingredients", []))
    parts = [title]
    if ner:
        parts.append(", ".join(ner))
    if ing:
        parts.append(", ".join(ing))
    return " \n ".join(parts).strip()


def embed_stream(model: SentenceTransformer, texts: List[str]) -> np.ndarray:
    embs = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    return embs.astype(np.float32)


def ensure_collection(client: QdrantClient, collection: str, dim: int, recreate: bool = False) -> None:
    existing = [c.name for c in client.get_collections().collections]
    if recreate and collection in existing:
        client.delete_collection(collection)
        existing.remove(collection)
    if collection not in existing:
        client.create_collection(collection_name=collection, vectors_config=VectorParams(size=dim, distance=Distance.COSINE))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to recipes.csv or .xlsx")
    parser.add_argument("--collection", default="recipes", help="Qdrant collection name")
    parser.add_argument("--model", default="sentence-transformers/all-MiniLM-L6-v2")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--upload-batch", type=int, default=1000, help="Max points per upsert request")
    parser.add_argument("--read-batch", type=int, default=10000, help="Rows per CSV chunk to read/process")
    parser.add_argument("--recreate", action="store_true", help="Recreate collection before upload")
    args = parser.parse_args()

    qdrant_url = os.environ.get("QDRANT_URL")
    qdrant_api_key = os.environ.get("QDRANT_API_KEY")
    if not qdrant_url:
        raise RuntimeError("QDRANT_URL env is required")

    data_path = Path(args.input)
    model = SentenceTransformer(args.model)
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)

    next_id = 1
    dim: Optional[int] = None
    total_rows = 0

    stream, is_stream = read_table_stream(data_path, chunksize=args.read_batch)
    print(f"Reading: {data_path.name} | Stream: {is_stream} | Read batch: {args.read_batch} | Upload batch: {args.upload_batch}")

    for df in stream:
        if args.limit and args.limit > 0 and total_rows >= args.limit:
            break
        if args.limit and args.limit > 0:
            # Trim the chunk to not exceed the limit
            remaining = args.limit - total_rows
            df = df.head(max(0, remaining))
        if df is None or df.empty:
            continue

        # Build texts and payloads for this chunk
        texts: List[str] = []
        payloads: List[Dict[str, Any]] = []
        for _, row in df.iterrows():
            rowd = dict(row)
            texts.append(text_for_embedding(rowd))
            payloads.append(
                {
                    "title": str(rowd.get("title", "")).strip(),
                    "ingredients": safe_list(rowd.get("ingredients", [])),
                    "ner": safe_list(rowd.get("NER", [])),
                    "recipe": str(rowd.get("recipe", "")).strip(),
                }
            )

        total_rows += len(texts)
        # Encode in one go per chunk (SentenceTransformers will internally batch)
        embs = embed_stream(model, texts)
        if dim is None:
            dim = int(embs.shape[1])
            ensure_collection(client, args.collection, dim, recreate=args.recreate)

        # Upsert in sub-batches to Qdrant
        ub = max(1, args.upload_batch)
        for start in trange(0, len(embs), ub, desc=f"Upsert rows {next_id}.."):
            end = min(start + ub, len(embs))
            p_chunk = payloads[start:end]
            e_chunk = embs[start:end]
            ids = list(range(next_id, next_id + len(e_chunk)))
            points = [
                PointStruct(id=pid, vector=vec.tolist(), payload=pl)
                for pid, vec, pl in zip(ids, e_chunk, p_chunk)
            ]
            client.upsert(collection_name=args.collection, points=points)
            next_id += len(points)

        print(f"Processed {total_rows} rows so far...")

    print(f"Done. Total rows processed: {total_rows}")


if __name__ == "__main__":
    main()

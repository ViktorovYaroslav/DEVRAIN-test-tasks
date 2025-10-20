import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict, Union
import re

from apps.task2.task import cooking_instructions, required_ingredients
from apps.task3.task import recommend_recipes, rag_cooking_instructions, rag_required_ingredients
from apps.task3.retriever import QdrantRetriever
from apps.task4.chat import ChatRouter


class TitleRequest(BaseModel):
    title: str = Field(..., description="Recipe title, e.g., 'Four Cheese Pizza'")


class IngredientsRequest(BaseModel):
    ingredients: Union[List[str], str] = Field(..., description="List of ingredient names or a comma-separated string")


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    history: List[ChatMessage] = Field(..., description="Conversation history including previous assistant replies")


app = FastAPI(title="Recipe Assistant API", version="0.1.0")

# Basic permissive CORS for first version; tighten for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.on_event("startup")
def _warmup() -> None:
    # Warm up embedding model to reduce cold-start latency
    try:
        QdrantRetriever().warmup()
    except Exception:
        # If warmup fails, we don't want to block startup; detailed logs are in retriever
        pass


_chat_router = ChatRouter()


@app.post("/task2/instructions")
def post_instructions(body: TitleRequest) -> Any:
    return cooking_instructions(body.title)


@app.post("/task2/ingredients")
def post_required_ingredients(body: TitleRequest) -> Any:
    return required_ingredients(body.title)

@app.post("/task3/recommend")
def post_task3_recommend(body: IngredientsRequest) -> Any:
    def _to_list(val: Union[List[str], str]) -> List[str]:
        if isinstance(val, list):
            return [s.strip() for s in val if isinstance(s, str) and s.strip()]
        # string: prefer comma-split; else split by words and remove common stopwords
        text = val.strip()
        if "," in text:
            return [s.strip() for s in text.split(",") if s.strip()]
        text = re.sub(r"[\.;:!?]+", " ", text).lower()
        text = re.sub(r"\s+", " ", text).strip()
        stop = {"i", "have", "a", "an", "the", "and", "with", "some", "of", "to", "what", "can", "cook"}
        parts = re.split(r"\s+and\s+|\s+", text)
        return [w for w in (p.strip() for p in parts) if w and w not in stop]

    ing_list = _to_list(body.ingredients)
    return recommend_recipes(ing_list)

@app.post("/task3/instructions")
def post_task3_instructions(body: TitleRequest) -> Any:
    return rag_cooking_instructions(body.title)

@app.post("/task3/ingredients")
def post_task3_ingredients(body: TitleRequest) -> Any:
    return rag_required_ingredients(body.title)


@app.post("/chat")
def post_chat(body: ChatRequest) -> Dict[str, Any]:
    try:
        response_payload = _chat_router.route(msg.model_dump() for msg in body.history)
    except Exception as exc:
        logging.exception("/chat handler failed")
        raise HTTPException(status_code=500, detail=str(exc))
    return {"response": response_payload}



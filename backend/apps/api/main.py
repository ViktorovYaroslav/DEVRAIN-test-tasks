from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

from apps.task2.task import cooking_instructions, required_ingredients, baseline_recommend_recipes


class TitleRequest(BaseModel):
    title: str = Field(..., description="Recipe title, e.g., 'Four Cheese Pizza'")


class IngredientsRequest(BaseModel):
    ingredients: List[str] = Field(..., description="List of ingredient names")


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


@app.post("/task2/instructions")
def post_instructions(body: TitleRequest) -> Any:
    return cooking_instructions(body.title)


@app.post("/task2/ingredients")
def post_required_ingredients(body: TitleRequest) -> Any:
    return required_ingredients(body.title)


@app.post("/recommendations/baseline")
def post_baseline_recommendations(body: IngredientsRequest) -> Any:
    return baseline_recommend_recipes(body.ingredients)

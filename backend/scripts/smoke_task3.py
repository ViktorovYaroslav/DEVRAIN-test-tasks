import os
import json
import sys
from pathlib import Path

# Ensure 'backend' (this script's parent) is on sys.path so 'apps' can be imported
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
	sys.path.insert(0, str(BACKEND_DIR))

from apps.task3.task import (
	recommend_recipes,
	rag_cooking_instructions,
	rag_required_ingredients,
)


TITLE = os.environ.get("TITLE", "Chicken Rice Bowl")
INGREDIENTS = os.environ.get("INGREDIENTS")
if INGREDIENTS:
	ing_list = [s.strip() for s in INGREDIENTS.split(",") if s.strip()]
else:
	ing_list = ["chicken", "rice", "broccoli"]

print("-> recommend_recipes")
rec = recommend_recipes(ing_list)
print(json.dumps(rec, ensure_ascii=False, indent=2))

print("\n-> rag_cooking_instructions")
ci = rag_cooking_instructions(TITLE)
print(json.dumps(ci, ensure_ascii=False, indent=2))

print("\n-> rag_required_ingredients")
ri = rag_required_ingredients(TITLE)
print(json.dumps(ri, ensure_ascii=False, indent=2))

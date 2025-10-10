import os
import json
import sys
from pathlib import Path

# Ensure 'backend' (this script's parent) is on sys.path so 'apps' can be imported
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
	sys.path.insert(0, str(BACKEND_DIR))

from apps.task2.task import cooking_instructions, required_ingredients, baseline_recommend_recipes

TITLE = os.environ.get("TITLE", "Marinated Flank Steak Recipe")
INGREDIENTS = os.environ.get("INGREDIENTS")

print("-> cooking_instructions")
ci = cooking_instructions(TITLE)
print(json.dumps(ci, ensure_ascii=False, indent=2))

print("\n-> required_ingredients")
ri = required_ingredients(TITLE)
print(json.dumps(ri, ensure_ascii=False, indent=2))

if INGREDIENTS:
	items = [s.strip() for s in INGREDIENTS.split(",") if s.strip()]
	print("\n-> baseline_recommend_recipes")
	rec = baseline_recommend_recipes(items)
	print(json.dumps(rec, ensure_ascii=False, indent=2))

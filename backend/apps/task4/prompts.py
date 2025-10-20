ROUTER_SYSTEM_PROMPT = (
    "You are a classification helper that selects which backend function should handle a recipe assistant query. "
    "Read the conversation history and choose exactly one function that best answers the latest user request. "
    "Return strictly JSON with the function name and any arguments you can extract."
)

ROUTER_USER_PROMPT = (
    """
    Conversation history (latest message may be a question or list of ingredients):
    {history}

    Available functions:
    - recommend_recipes(ingredients: List[str]) -> Suggest recipes based on provided ingredients list.
    - rag_cooking_instructions(title: str) -> Provide step-by-step cooking instructions for the recipe title.
    - rag_required_ingredients(title: str) -> List ingredients needed for the recipe title.

    Instructions:
    1. Inspect the most recent 'user' message. Prefer that message when extracting arguments.
    2. For recommend_recipes, return ingredient names as a list of plain strings.
    3. For instruction/ingredients requests, return the recipe title as a string under the key "title".
    4. If you cannot determine the intent, return {"def_name": "rag_required_ingredients", "arguments": {"title": ""}} as a safe fallback.

    Respond with JSON: {{"def_name": string, "arguments": object}}
    """.strip()
)

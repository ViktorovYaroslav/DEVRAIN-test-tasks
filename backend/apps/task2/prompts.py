COOK_INSTR_SYSTEM = (
    "You are a culinary assistant. Please respond only with valid JSON without any explanation."
    "If you're not sure, return the JSON according to the schema anyway, filling empty fields with empty strings or lists."
)

COOK_INSTR_USER = (
    """
    Generate step-by-step instructions for the recipe titled: "{title}".
    Return JSON with the schema: {{"title": string, "recipe": string, "steps": [string], "notes": [string]}}
    """.strip()
)

INGR_SYSTEM = (
    "You are a culinary assistant. Please respond only with valid JSON without any explanation."
)

INGR_USER = (
    """
    List of ingredients for the recipe titled: "{title}".
    Return JSON with the schema: {{"title": string, "ingredients": [{{"name": string, "quantity": string, "unit": string}}]}}
    If there are no exact quantities, leave quantity and unit as empty strings.
    """.strip()
)


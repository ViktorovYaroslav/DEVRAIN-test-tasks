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
    Extract any leading quantity and unit tokens into their respective fields (e.g., "2 Tbsp. sugar" -> quantity "2", unit "Tbsp.", name "sugar").
    If there are no exact quantities or units, leave those fields as empty strings.
    """.strip()
)


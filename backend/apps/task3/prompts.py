RAG_RECOMMEND_SYSTEM = (
    "You are a helpful culinary assistant. Use ONLY the provided context of recipes to answer."
    " Respond with valid JSON only."
)

RAG_RECOMMEND_USER = (
    """
    User ingredients: [{ingredients}].
    From the CONTEXT recipes (title, ingredients, ner), suggest best matching recipes.
    Only use facts present in CONTEXT; do not invent ingredients or titles.
    Return JSON: {{"suggestions": [{{"title": string, "matchScore": number, "missing": [string], "why": string}}]}}
    CONTEXT:
    {context}
    """.strip()
)

RAG_INSTR_SYSTEM = (
    "You are a culinary assistant. Use the provided recipe text to return structured instructions."
    " Respond with valid JSON only."
)

RAG_INSTR_USER = (
    """
    Title: "{title}"
    Recipe text:
    {recipe}
    Return JSON: {{"title": string, "recipe": string, "steps": [string], "notes": [string]}}
    Use ONLY the provided recipe text; do not add steps not present in the text.
    """.strip()
)

RAG_INGR_SYSTEM = (
    "You are a culinary assistant. Use the provided ingredients list to return structured ingredients JSON."
    " Respond with valid JSON only."
)

RAG_INGR_USER = (
    """
    Title: "{title}"
    Ingredients list:
    {ingredients}
    Return JSON: {{"title": string, "ingredients": [{{"name": string, "quantity": string, "unit": string}}]}}
    For each input line, separate any leading amount and unit into the "quantity" and "unit" fields.
    Units may include abbreviations such as qt., tsp., Tbsp., c., oz., lb., g, ml, etc.
    Example mapping:
    - Input: "3 Tbsp. salt" -> {{"name": "salt", "quantity": "3", "unit": "Tbsp."}}
    - Input: "1 1/2 qt. cubed rind" -> {{"name": "cubed rind", "quantity": "1 1/2", "unit": "qt."}}
    - Input: "cloves" -> {{"name": "cloves", "quantity": "", "unit": ""}}
    Preserve the ingredient wording after removing the quantity/unit prefix in the "name" field.
    Do not invent ingredients that are not listed. Return valid JSON only.
    """.strip()
)

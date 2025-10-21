export const SUMMARY = `
## Task 3 - Retrieval Augmented Generation for Cooking

### Embedding & Vector Store
- Selected **sentence-transformers/all-MiniLM-L6-v2** for its strong semantic quality with lightweight footprint; the model is preloaded at startup to avoid cold starts.
- Recipes are embedded (title + ingredients + NER cues) and indexed in a **Qdrant** collection using cosine similarity for fast semantic lookups.

### Retrieval Workflow
- \`recommend_recipes\` encodes user ingredients, retrieves the Top-N vector matches, and forwards a structured context (title, ingredients, ner) to the LLM so it grounds each suggestion.
- \`rag_cooking_instructions\` and \`rag_required_ingredients\` resolve the best-matching recipe (exact filter with semantic fallback), then inject the retrieved recipe text or ingredient list directly into the prompt before querying the LLM.
- Prompts require JSON-only answers and explicitly demonstrate how to split quantities and units (for example, "3 Tbsp. salt" -> quantity "3", unit "Tbsp.", name "salt") so the output needs no post-processing.

### Deliverables & Impact
- Delivered Python functions: **recommend_recipes**, **rag_cooking_instructions**, **rag_required_ingredients** (now purely LLM-formatted).
- API endpoints and the Task 4 chat route reuse these functions with fallbacks to Task 2 only when retrieval yields no data.
- Example: "What ingredients used for Watermelon Rind Pickles?" now returns structured JSON with separate \`quantity\`, \`unit\`, and \`name\` fields, while "How to cook pizza?" produces grounded step-by-step instructions aligned with the retrieved recipe.
`;

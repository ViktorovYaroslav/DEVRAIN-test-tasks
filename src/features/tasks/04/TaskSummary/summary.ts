export const SUMMARY = `
## Task 4 - FastAPI Service & Dockerization

### FastAPI Application
- Implemented in \`backend/apps/api/main.py\`, wiring Task 3 functions and the chat router into a single FastAPI app with permissive CORS and a startup warm-up hook.
- Exposes \`/chat\` POST endpoint that accepts a TanStack-style history array, inspects the latest user turn, and dispatches to \`recommend_recipes\`, \`rag_cooking_instructions\`, or \`rag_required_ingredients\`.
- Responses stick to the Task 3 JSON schemas (suggestions, instructions, or ingredient lists) so the frontend can render structured data without parsing text.

### Intent Routing & Fallbacks
- \`ChatRouter\` leverages an LLM classifier to pick the right tool, normalizes arguments, and falls back to Task 2 LLM outputs if retrieval returns nothing.
- Shared helper logic cleans ingredient/title hints, logs routing decisions, and keeps the API resilient to malformed histories.

### Dockerization & Ops
- \`backend/Dockerfile\` installs Python 3.11 slim base, app dependencies, sentence-transformer weights, and starts Uvicorn; build scripts pre-download embeddings to avoid cold starts.
- \`requirements.txt\` captures FastAPI, Uvicorn, Qdrant client, sentence-transformers, and Anthropic SDK versions used by the service.
- README documents \`npm run backend:docker:build\` / \`npm run backend:docker:run\` commands along with sample \`curl\` for \`/chat\`.

### Deliverables
- FastAPI entrypoint, Dockerfile, requirements, and supporting modules (\`llm_client\`, Task 2/3/4 packages) checked in and exercised via Task 4 UI tab.
- Users can run the container locally and hit \`http://localhost:8000/chat\` with conversation history to receive grounded recipe answers.

`;

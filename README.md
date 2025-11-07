
<div align="center">

# DevRain Recipe Assistant

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" />
<img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Uvicorn-FFB400?style=for-the-badge&logo=uvicorn&logoColor=000000" />
<img src="https://img.shields.io/badge/Qdrant-FF4F00?style=for-the-badge&logo=qdrant&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Railway-0B0D26?style=for-the-badge&logo=railway&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />

</div>

---

Interactive recipe assistant that exposes tasks 02/03/04 plus the full demo. The frontend is built with React + Vite and deployed to Vercel, while the FastAPI backend ships as a Docker image on Railway.

## Highlights

- Built and containerised the Python backend with FastAPI, SentenceTransformers, and QdrantRetriever.
- Set up a GitHub Actions workflow that builds the Docker image, publishes it to GHCR, and triggers an automated redeploy on Railway.
- Configured Railway: model warm-up on startup, private registry access, public domain, and CORS.
- Updated the frontend to use environment-specific API URLs and to speak to the new backend endpoints.
- Provisioned production hosting: frontend on Vercel (`main` branch) and backend on Railway behind a public domain.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TanStack Query, utility-first CSS modules, Vercel hosting.
- **Backend:** FastAPI, Uvicorn, SentenceTransformers, Pydantic, Qdrant client, Docker.
- **CI/CD & Infra:** GitHub Actions, GitHub Container Registry, Railway, Vercel, npm.

## Production URLs

- **Frontend:** https://devrain-recipe-assistant.vercel.app/
- **Backend API:** https://devrain-test-tasks-production.up.railway.app

## API Endpoints

Base URLs:

- Production: `https://devrain-test-tasks-production.up.railway.app`
- Local: `http://localhost:8000`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Health check |
| POST | `/task2/instructions` | Fetch step-by-step instructions (Task 02) |
| POST | `/task2/ingredients` | Fetch required ingredients (Task 02) |
| POST | `/task3/recommend` | Recommend recipes by ingredients (Task 03) |
| POST | `/task3/instructions` | RAG-powered instructions (Task 03) |
| POST | `/task3/ingredients` | RAG-powered ingredients (Task 03) |
| POST | `/chat` | Task 04 chat router |
| POST | `/full-demo` | Full demo (chat + structured data + images) |

## Environment Variables

The frontend needs:

```bash
VITE_RECIPE_ASSISTANT_URL=<backend-base-url>

VITE_UNSPLASH_ACCESS_KEY=<unsplash-access-key>
```

- Prod: `https://devrain-test-tasks-production.up.railway.app`
- Local: `http://localhost:8000`

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn apps.api.main:app --host 0.0.0.0 --port 8000
```

Or via npm scripts (Dockerised backend):

```bash
npm run backend:docker:build
npm run backend:docker:run
```

### Frontend

```bash
npm install
npm run dev
```

Create a `.env.local` or `.env` in the repository root and set `VITE_RECIPE_ASSISTANT_URL` & `VITE_UNSPLASH_ACCESS_KEY`.

Handy combined script:

```bash
npm run dev:full   # spins up backend in Docker and starts Vite dev server
```

## CI/CD

- `.github/workflows/deploy-backend.yml` builds the Docker image, pushes it to GHCR, and invokes `railway redeploy`.
- Vercel deploys the frontend from the `main` branch.

## Notes

- Update the model or dependencies by editing `backend/requirements.txt` and rebuilding the image.
- Qdrant Retriever expects a preloaded index; see `backend/scripts` and smoke tests for verification.

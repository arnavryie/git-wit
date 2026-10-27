# ⚡ GitWit AI Backend

FastAPI microservice handling vector search embeddings, developer dossier scoring, and Gemini AI inference.

## Quickstart

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health` - System health check
- `POST /api/vector/match-repos` - Cosine similarity repository matcher
- `POST /api/dossier/evaluate` - Multi-dimensional AI developer profile evaluation

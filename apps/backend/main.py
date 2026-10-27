"""
GitWit AI Backend Service
FastAPI entrypoint with CORS, health check, and route registrations.
Author: Sanskar Sontakke (@sanskar-code)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers.vector_search import router as vector_router

app = FastAPI(
    title=settings.app_name,
    description="High-performance vector search & Gemini AI inference service for GitWit",
    version="1.0.0"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register sub-routers
app.include_router(vector_router)

@app.get("/health", tags=["System"])
async def health_check():
    """Service health verification endpoint"""
    return {
        "status": "healthy",
        "service": "gitwit-ai-backend",
        "version": "1.0.0",
        "environment": settings.environment
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "message": "⚔️ GitWit AI Vector Engine is active.",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)

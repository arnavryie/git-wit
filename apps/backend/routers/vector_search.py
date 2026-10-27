"""
Vector Search Router
Author: Sanskar Sontakke (@sanskar-code)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.vector_service import vector_service

router = APIRouter(prefix="/api/vector", tags=["Vector Search"])

class SkillQuery(BaseModel):
    developer_handle: str
    primary_languages: List[str]
    bio: Optional[str] = None
    target_topics: List[str] = []
    limit: Optional[int] = 10

class ScoredRepoResponse(BaseModel):
    name: str
    owner: str
    description: Optional[str] = None
    stars: int
    language: str
    similarity_score: float
    match_confidence: str

@router.post("/match-repos", response_model=List[Dict[str, Any]])
async def match_developer_repositories(query: SkillQuery):
    """
    Match candidate repositories semantically based on developer skill vector
    """
    if not query.developer_handle:
        raise HTTPException(status_code=400, detail="developer_handle is required")

    mock_query_vec = [0.05 * (i % 10) for i in range(768)]
    
    mock_candidate_repos = [
        {
            "name": "triton-inference-server",
            "owner": "triton-inference-server",
            "description": "Triton Inference Server provides an optimized cloud and edge inferencing solution.",
            "stars": 14200,
            "language": "C++",
            "embedding": [0.04 * (i % 10) for i in range(768)]
        },
        {
            "name": "vllm",
            "owner": "vllm-project",
            "description": "A high-throughput and memory-efficient LLM serving engine.",
            "stars": 32800,
            "language": "Python",
            "embedding": [0.05 * (i % 10) for i in range(768)]
        },
        {
            "name": "nextjs-fastapi-starter",
            "owner": "shadcn",
            "description": "High performance full-stack template uniting Next.js and FastAPI.",
            "stars": 8900,
            "language": "TypeScript",
            "embedding": [0.048 * (i % 10) for i in range(768)]
        }
    ]

    results = vector_service.rank_repositories(mock_query_vec, mock_candidate_repos, limit=query.limit or 10)
    return results

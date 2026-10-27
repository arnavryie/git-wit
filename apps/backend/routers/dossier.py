"""
Developer Dossier Router
Author: Sanskar Sontakke (@sanskar-code)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.dossier_service import dossier_service

router = APIRouter(prefix="/api/dossier", tags=["Developer Dossier"])

class DossierRequest(BaseModel):
    handle: str
    repos_count: Optional[int] = 10
    followers: Optional[int] = 5
    languages: Optional[List[str]] = ["TypeScript", "Python"]

@router.post("/evaluate", response_model=Dict[str, Any])
async def evaluate_developer(req: DossierRequest):
    """Generate comprehensive AI Dossier evaluation metrics for a GitHub developer"""
    if not req.handle:
        raise HTTPException(status_code=400, detail="Developer handle is required")
    
    return dossier_service.score_developer_profile(
        handle=req.handle,
        repos_count=req.repos_count or 10,
        followers=req.followers or 5,
        languages=req.languages or ["TypeScript"]
    )

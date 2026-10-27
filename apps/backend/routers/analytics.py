"""
GitWit System & Cache Analytics Router
Author: Sanskar Sontakke (@sanskar-code)
"""

from fastapi import APIRouter
from typing import Dict, Any
from services.cache_manager import cache_manager
from config import settings

router = APIRouter(prefix="/api/analytics", tags=["System Analytics"])

@router.get("/cache-stats", response_model=Dict[str, Any])
async def get_cache_statistics():
    """Retrieve LRU memory cache status and memory consumption"""
    return {
        "status": "online",
        "service": settings.app_name,
        "cache_metrics": cache_manager.get_stats()
    }

@router.post("/cache-flush")
async def flush_system_cache():
    """Purge stale cache keys"""
    cache_manager.clear()
    return {"message": "System cache purged successfully", "status": "ok"}

"""
GitWit Social Feed Router
Author: Sanskar Sontakke (@sanskar-code)
"""

from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from services.feed_synthesizer import feed_synthesizer
from scripts.seed_atlas import SEED_REPOSITORIES

router = APIRouter(prefix="/api/feed", tags=["Social Feed"])

SAMPLE_POSTS = [
    {
        "_id": "post_001",
        "author_login": "arnavryie",
        "author_avatar": "https://avatars.githubusercontent.com/u/10834241?v=4",
        "title": "Dual-Brain Architecture: Pairing Gemini with Local Qwen 14B",
        "content": "Running local Qwen 14B on RTX 4060 for raw code drafting while Gemini 1.5 Flash handles cloud embeddings and repo summarization saves thousands in inference costs.",
        "tags": ["ai-ml", "systems", "dual-brain"],
        "target_repo": "arnavryie/git-wit",
        "likes_count": 42,
        "comments_count": 8,
        "is_pinned": True
    },
    {
        "_id": "post_002",
        "author_login": "karpathy",
        "author_avatar": "https://avatars.githubusercontent.com/u/241955?v=4",
        "title": "Why LLM Reasoning Loops require structured schema outputs",
        "content": "Pydantic JSON schema constraints are mandatory when building resilient agents. Unstructured string outputs create infinite parsing retry cascades.",
        "tags": ["ai-ml", "transformers"],
        "target_repo": "karpathy/nanoGPT",
        "likes_count": 89,
        "comments_count": 19,
        "is_pinned": False
    }
]

@router.get("/stream", response_model=List[Dict[str, Any]])
async def get_social_feed_stream(topic: Optional[str] = Query(None, description="Filter by ecosystem topic")):
    """Get interleaved developer feed with trending repositories and discussions"""
    return feed_synthesizer.synthesize_community_feed(
        repositories=SEED_REPOSITORIES,
        developer_posts=SAMPLE_POSTS,
        filter_topic=topic
    )

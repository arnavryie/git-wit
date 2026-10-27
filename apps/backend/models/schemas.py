"""
GitWit MongoDB Atlas Data Schemas & Pydantic ODM Models
Author: Sanskar Sontakke (@sanskar-code)
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class MongoBaseModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

class UserProfileDocument(MongoBaseModel):
    """MongoDB User Profile Document Schema"""
    github_id: int
    login: str
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: str
    bio: Optional[str] = None
    followers: int = 0
    following: int = 0
    public_repos: int = 0
    top_languages: List[str] = Field(default_factory=list)
    badges: List[str] = Field(default_factory=list)
    archetype: str = "Full-Stack Builder"
    velocity_score: int = 50
    superpower: Optional[str] = None
    skill_embedding: List[float] = Field(default_factory=list)
    verified: bool = False
    is_active: bool = True

class RepositoryDocument(MongoBaseModel):
    """MongoDB Repository Document with 768-D Vector Embeddings"""
    repo_id: int
    name: str
    full_name: str
    owner: str
    owner_avatar: str
    description: Optional[str] = None
    html_url: str
    language: Optional[str] = "TypeScript"
    stars_count: int = 0
    forks_count: int = 0
    open_issues_count: int = 0
    topics: List[str] = Field(default_factory=list)
    embedding: List[float] = Field(default_factory=list)
    velocity_tier: str = "Steady"
    ai_summary: Optional[Dict[str, Any]] = None
    pushed_at: Optional[datetime] = None

class CommunityPostDocument(MongoBaseModel):
    """Developer Social Feed Post Schema"""
    author_login: str
    author_avatar: str
    title: str
    content: str
    target_repo: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    likes_count: int = 0
    comments_count: int = 0
    is_pinned: bool = False

class SocialInteractionDocument(MongoBaseModel):
    """Social Graph Interaction Schema (Likes, Bookmarks, Follows)"""
    user_login: str
    target_type: str  # 'post', 'repo', 'developer'
    target_id: str
    interaction_type: str  # 'like', 'star', 'bookmark', 'follow'
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class VectorSearchFilter(BaseModel):
    """Atlas Vector Search Query Filter Parameters"""
    min_stars: Optional[int] = 0
    required_language: Optional[str] = None
    target_ecosystem: Optional[str] = None
    limit: int = 15

class DossierCacheDocument(MongoBaseModel):
    """Cached AI Dossier Document to eliminate redundant LLM calls"""
    handle: str
    model_version: str = "gemini-1.5-flash"
    executive_overview: str
    key_highlights: List[str]
    best_suited_for: str
    score_breakdown: Dict[str, int]
    expires_at: datetime

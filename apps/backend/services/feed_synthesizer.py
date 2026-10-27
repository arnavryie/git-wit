"""
GitWit Developer Social Feed Synthesis Engine
Multi-source feed aggregator combining GitHub trending velocity with developer discussions.
Author: Sanskar Sontakke (@sanskar-code)
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

class FeedSynthesizerService:
    def __init__(self):
        self.default_topics = ["ai-ml", "frontend", "systems", "devops", "security"]

    def synthesize_community_feed(
        self,
        repositories: List[Dict[str, Any]],
        developer_posts: List[Dict[str, Any]],
        filter_topic: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Interleaves curated repo spotlights with active community discussions.
        Applies decay scoring to highlight emerging discussions.
        """
        combined_items = []

        # 1. Process Repository Spotlight Cards
        for repo in repositories:
            if filter_topic and filter_topic not in repo.get("topics", []):
                continue

            score = repo.get("stars_count", 0) * 0.4 + repo.get("forks_count", 0) * 1.2
            combined_items.append({
                "feed_type": "repository_spotlight",
                "id": f"repo_{repo.get('repo_id', 0)}",
                "title": repo.get("name", "Unknown Repository"),
                "subtitle": f"{repo.get('owner', '')} / {repo.get('name', '')}",
                "description": repo.get("description", ""),
                "metrics": {
                    "stars": repo.get("stars_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "open_issues": repo.get("open_issues_count", 0),
                    "velocity_tier": repo.get("velocity_tier", "Steady")
                },
                "language": repo.get("language", "TypeScript"),
                "topics": repo.get("topics", []),
                "relevance_rank": score,
                "timestamp": repo.get("pushed_at") or datetime.utcnow().isoformat()
            })

        # 2. Process Developer Discussion Cards
        for post in developer_posts:
            if filter_topic and filter_topic not in post.get("tags", []):
                continue

            engagement_score = post.get("likes_count", 0) * 3.5 + post.get("comments_count", 0) * 5.0
            combined_items.append({
                "feed_type": "developer_discussion",
                "id": f"post_{post.get('_id', '')}",
                "title": post.get("title", ""),
                "subtitle": f"@{post.get('author_login', '')}",
                "description": post.get("content", ""),
                "author": {
                    "login": post.get("author_login", ""),
                    "avatar_url": post.get("author_avatar", "")
                },
                "metrics": {
                    "likes": post.get("likes_count", 0),
                    "comments": post.get("comments_count", 0),
                    "pinned": post.get("is_pinned", False)
                },
                "target_repo": post.get("target_repo"),
                "topics": post.get("tags", []),
                "relevance_rank": engagement_score + 100,  # Prioritize community interaction
                "timestamp": post.get("created_at") or datetime.utcnow().isoformat()
            })

        # Sort descending by relevance rank
        combined_items.sort(key=lambda item: item["relevance_rank"], reverse=True)
        return combined_items

feed_synthesizer = FeedSynthesizerService()

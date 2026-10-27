"""
GitWit Async GitHub API Ingestion Client
Author: Sanskar Sontakke (@sanskar-code)
"""

import httpx
from typing import Optional, Dict, Any, List
from config import settings

class AsyncGitHubClient:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.timeout = 10.0
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "GitWit-Social-Backend/1.0"
        }
        if settings.github_pat:
            self.headers["Authorization"] = f"token {settings.github_pat}"

    async def get_user_profile(self, username: str) -> Optional[Dict[str, Any]]:
        """Fetch raw GitHub profile metadata with timeout protection"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(f"{self.base_url}/users/{username}", headers=self.headers)
                if response.status_code == 200:
                    return response.json()
                return None
            except httpx.RequestError:
                return None

    async def get_user_repositories(self, username: str, limit: int = 30) -> List[Dict[str, Any]]:
        """Fetch developer's public repositories sorted by recent updates"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                params = {"sort": "updated", "per_page": str(min(limit, 100)), "type": "public"}
                response = await client.get(
                    f"{self.base_url}/users/{username}/repos",
                    headers=self.headers,
                    params=params
                )
                if response.status_code == 200:
                    return response.json()
                return []
            except httpx.RequestError:
                return []

    async def search_trending_repositories(self, language: Optional[str] = None, min_stars: int = 500) -> List[Dict[str, Any]]:
        """Search repositories using GitHub Search API with language and star filters"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                q = f"stars:>{min_stars}"
                if language:
                    q += f" language:{language}"
                params = {"q": q, "sort": "stars", "order": "desc", "per_page": "25"}
                response = await client.get(
                    f"{self.base_url}/search/repositories",
                    headers=self.headers,
                    params=params
                )
                if response.status_code == 200:
                    return response.json().get("items", [])
                return []
            except httpx.RequestError:
                return []

    async def get_repository_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Fetch byte count per programming language for a given repository"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/languages",
                    headers=self.headers
                )
                if response.status_code == 200:
                    return response.json()
                return {}
            except httpx.RequestError:
                return {}

    async def get_commit_activity(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        """Fetch weekly commit activity for the last 12 months"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/repos/{owner}/{repo}/stats/commit_activity",
                    headers=self.headers
                )
                if response.status_code == 200:
                    return response.json()
                return []
            except httpx.RequestError:
                return []

github_client = AsyncGitHubClient()

"""
GitWit Vector Search Service
Embeddings via Gemini text-embedding-004 and Cosine Similarity scoring.
Author: Sanskar Sontakke (@sanskar-code)
"""

import numpy as np
from typing import List, Dict, Any

class VectorSearchService:
    def __init__(self):
        self.embedding_dimension = 768

    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """Calculate cosine similarity between two high-dimensional vectors"""
        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    def rank_repositories(
        self, 
        query_embedding: List[float], 
        repos: List[Dict[str, Any]], 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Rank repositories by cosine similarity against developer skill vector"""
        scored_repos = []
        for repo in repos:
            repo_vec = repo.get("embedding", [])
            similarity = self.cosine_similarity(query_embedding, repo_vec) if repo_vec else 0.5
            scored_repos.append({
                **repo,
                "similarity_score": round(similarity, 4),
                "match_confidence": f"{round(similarity * 100, 1)}%"
            })
        
        # Sort descending by similarity score
        scored_repos.sort(key=lambda r: r["similarity_score"], reverse=True)
        return scored_repos[:limit]

vector_service = VectorSearchService()

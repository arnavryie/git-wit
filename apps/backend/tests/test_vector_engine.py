"""
GitWit Vector Engine & Dossier Scoring Unit Test Suite
Author: Sanskar Sontakke (@sanskar-code)
"""

import sys
import os
import unittest
import numpy as np

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.vector_service import VectorSearchService
from services.dossier_service import DossierScoringService

class TestVectorSearchService(unittest.TestCase):
    def setUp(self):
        self.vector_service = VectorSearchService()
        self.dossier_service = DossierScoringService()

    def test_cosine_similarity_identity(self):
        """Vectors should have 1.0 similarity with themselves"""
        vec = [1.0, 2.0, 3.0, 4.0]
        similarity = self.vector_service.cosine_similarity(vec, vec)
        self.assertAlmostEqual(similarity, 1.0, places=4)

    def test_cosine_similarity_orthogonal(self):
        """Orthogonal vectors should have 0.0 similarity"""
        vec_a = [1.0, 0.0, 0.0]
        vec_b = [0.0, 1.0, 0.0]
        similarity = self.vector_service.cosine_similarity(vec_a, vec_b)
        self.assertAlmostEqual(similarity, 0.0, places=4)

    def test_dossier_archetype_assignment(self):
        """Engine assigns Systems archetype when Rust or C++ is present"""
        profile = self.dossier_service.score_developer_profile(
            handle="testdev",
            repos_count=45,
            followers=120,
            languages=["Python", "Rust", "C++"]
        )
        self.assertEqual(profile["archetype"], "Systems & AI Infrastructure Architect")
        self.assertTrue(profile["is_verified"])
        self.assertIn("Dual-Brain Synthesis", profile["badges"])

    def test_repository_ranking_order(self):
        """High-matching vectors should appear first in ranked results"""
        query = [1.0, 0.0, 0.0]
        repos = [
            {"name": "repo-poor-match", "embedding": [0.1, 0.9, 0.0]},
            {"name": "repo-exact-match", "embedding": [1.0, 0.0, 0.0]},
            {"name": "repo-mid-match", "embedding": [0.7, 0.3, 0.0]}
        ]
        ranked = self.vector_service.rank_repositories(query, repos, limit=3)
        self.assertEqual(ranked[0]["name"], "repo-exact-match")
        self.assertEqual(ranked[1]["name"], "repo-mid-match")
        self.assertEqual(ranked[2]["name"], "repo-poor-match")

if __name__ == "__main__":
    unittest.main()

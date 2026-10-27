"""
Developer Dossier AI Scoring Engine
Generates multi-attribute skill assessments and high-velocity badges.
Author: Sanskar Sontakke (@sanskar-code)
"""

from typing import Dict, Any, List

class DossierScoringService:
    def __init__(self):
        self.superpowers = [
            "Shipping resilient, end-to-end open-source tooling",
            "High-concurrency systems & distributed state management",
            "AI-driven interface architecture & latency optimization",
            "Deep protocol engineering & robust microservices"
        ]

    def score_developer_profile(self, handle: str, repos_count: int, followers: int, languages: List[str]) -> Dict[str, Any]:
        """Synthesize developer stats into structured Gemini-ready dossier metrics"""
        # Calculate velocity score (0 - 100)
        activity_weight = min(repos_count * 1.5, 40)
        reach_weight = min(followers * 2.0, 30)
        diversity_weight = min(len(languages) * 7.5, 30)
        velocity_score = int(activity_weight + reach_weight + diversity_weight)

        archetype = "High-Velocity Full-Stack Engineer"
        if "Python" in languages and ("C++" in languages or "Rust" in languages):
            archetype = "Systems & AI Infrastructure Architect"
        elif "TypeScript" in languages and len(languages) <= 2:
            archetype = "Modern Frontend & Interface Specialist"

        return {
            "handle": handle,
            "velocity_score": velocity_score,
            "archetype": archetype,
            "is_verified": velocity_score > 40,
            "badges": ["Dual-Brain Synthesis", "Core Maintainer", "High-Impact Builder"] if velocity_score > 50 else ["Dual-Brain Synthesis"],
            "superpower": self.superpowers[hash(handle) % len(self.superpowers)],
            "recommended_focus": f"Architecting scalable primitives across {', '.join(languages[:3]) or 'TypeScript'}"
        }

dossier_service = DossierScoringService()

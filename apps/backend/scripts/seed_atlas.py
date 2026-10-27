"""
GitWit MongoDB Atlas Vector Index & Repository Seeder
Pre-populates sample repositories and developer vectors for local testing.
Author: Sanskar Sontakke (@sanskar-code)
"""

import sys
import os
import asyncio
from typing import List, Dict, Any

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

SEED_REPOSITORIES = [
    {
        "repo_id": 101,
        "name": "triton-inference-server",
        "full_name": "triton-inference-server/server",
        "owner": "triton-inference-server",
        "owner_avatar": "https://avatars.githubusercontent.com/u/61821013?v=4",
        "description": "Triton Inference Server provides an optimized cloud and edge inferencing solution.",
        "html_url": "https://github.com/triton-inference-server/server",
        "language": "C++",
        "stars_count": 14200,
        "forks_count": 2800,
        "open_issues_count": 310,
        "topics": ["deep-learning", "inference", "tensorrt", "triton", "ai-infrastructure"],
        "velocity_tier": "Breakout",
        "embedding": [0.035 * (i % 12) for i in range(768)]
    },
    {
        "repo_id": 102,
        "name": "vllm",
        "full_name": "vllm-project/vllm",
        "owner": "vllm-project",
        "owner_avatar": "https://avatars.githubusercontent.com/u/137798634?v=4",
        "description": "A high-throughput and memory-efficient LLM serving engine with PagedAttention.",
        "html_url": "https://github.com/vllm-project/vllm",
        "language": "Python",
        "stars_count": 32800,
        "forks_count": 4900,
        "open_issues_count": 890,
        "topics": ["llm", "paged-attention", "transformer", "serving", "pytorch"],
        "velocity_tier": "Breakout",
        "embedding": [0.048 * (i % 12) for i in range(768)]
    },
    {
        "repo_id": 103,
        "name": "nextjs-fastapi-starter",
        "full_name": "shadcn/nextjs-fastapi-starter",
        "owner": "shadcn",
        "owner_avatar": "https://avatars.githubusercontent.com/u/124599?v=4",
        "description": "Clean, opinionated full-stack template uniting Next.js 15, FastAPI, and Tailwind.",
        "html_url": "https://github.com/shadcn/nextjs-fastapi-starter",
        "language": "TypeScript",
        "stars_count": 8900,
        "forks_count": 1200,
        "open_issues_count": 28,
        "topics": ["nextjs", "fastapi", "shadcn-ui", "fullstack", "react"],
        "velocity_tier": "High-Growth",
        "embedding": [0.042 * (i % 12) for i in range(768)]
    },
    {
        "repo_id": 104,
        "name": "rust-gpu",
        "full_name": "EmbarkStudios/rust-gpu",
        "owner": "EmbarkStudios",
        "owner_avatar": "https://avatars.githubusercontent.com/u/44615802?v=4",
        "description": "Making Rust a first-class language and ecosystem for building GPU shaders.",
        "html_url": "https://github.com/EmbarkStudios/rust-gpu",
        "language": "Rust",
        "stars_count": 19400,
        "forks_count": 870,
        "open_issues_count": 140,
        "topics": ["rust", "spirv", "gpu", "shaders", "vulkan"],
        "velocity_tier": "Steady",
        "embedding": [0.029 * (i % 12) for i in range(768)]
    },
    {
        "repo_id": 105,
        "name": "qwen2.5-coder",
        "full_name": "QwenLM/Qwen2.5-Coder",
        "owner": "QwenLM",
        "owner_avatar": "https://avatars.githubusercontent.com/u/141892845?v=4",
        "description": "Qwen2.5-Coder is the code version of the Qwen large language model series.",
        "html_url": "https://github.com/QwenLM/Qwen2.5-Coder",
        "language": "Python",
        "stars_count": 18200,
        "forks_count": 1400,
        "open_issues_count": 115,
        "topics": ["code-llm", "transformers", "reasoning", "dual-brain"],
        "velocity_tier": "Breakout",
        "embedding": [0.052 * (i % 12) for i in range(768)]
    }
]

async def seed_collections():
    print("⚔️ GitWit Database Seeder Initializing...")
    from db.atlas import atlas_manager
    await atlas_manager.connect_db()

    if atlas_manager.db is None:
        print("⚠️ Running in offline standalone mode. Writing mock seed verification.")
        print(f"Verified {len(SEED_REPOSITORIES)} repository embedding vectors ready for Cosine Similarity.")
        return

    collection = atlas_manager.db.repositories
    for repo in SEED_REPOSITORIES:
        await collection.update_one(
            {"repo_id": repo["repo_id"]},
            {"$set": repo},
            upsert=True
        )
    print(f"✅ Successfully synchronized {len(SEED_REPOSITORIES)} repositories to MongoDB Atlas.")

if __name__ == "__main__":
    asyncio.run(seed_collections())

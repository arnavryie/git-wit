"""
MongoDB Atlas Async Motor Client & Vector Search Aggregation Pipeline
Author: Sanskar Sontakke (@sanskar-code)
"""

import logging
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings

logger = logging.getLogger("gitwit.db")

class AtlasDatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    @classmethod
    async def connect_db(cls):
        """Initialize high-concurrency connection pool to MongoDB Atlas"""
        if not settings.mongodb_uri:
            logger.warning("MONGODB_URI not provided. Running in memory-mock mode.")
            return

        try:
            cls.client = AsyncIOMotorClient(
                settings.mongodb_uri,
                maxPoolSize=50,
                minPoolSize=10,
                serverSelectionTimeoutMS=5000
            )
            cls.db = cls.client.get_default_database("gitwit")
            logger.info("Successfully connected to MongoDB Atlas cluster.")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB Atlas: {str(e)}")
            cls.client = None
            cls.db = None

    @classmethod
    async def close_db(cls):
        """Gracefully disconnect connection pool"""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB Atlas connection pool closed.")

    @classmethod
    async def vector_search_repositories(
        cls,
        query_vector: List[float],
        index_name: str = "vector_index",
        path: str = "embedding",
        num_candidates: int = 150,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Executes MongoDB Atlas $vectorSearch aggregation pipeline with cosine metric
        """
        if cls.db is None:
            # Fallback mock for offline/local environments
            return []

        pipeline = [
            {
                "$vectorSearch": {
                    "index": index_name,
                    "path": path,
                    "queryVector": query_vector,
                    "numCandidates": num_candidates,
                    "limit": limit
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "full_name": 1,
                    "owner": 1,
                    "description": 1,
                    "language": 1,
                    "stars_count": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        try:
            cursor = cls.db.repositories.aggregate(pipeline)
            return await cursor.to_list(length=limit)
        except Exception as err:
            logger.error(f"Atlas Vector Search execution error: {str(err)}")
            return []

atlas_manager = AtlasDatabaseManager()

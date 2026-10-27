"""
GitWit FastAPI Backend Configuration
Author: Sanskar Sontakke (@sanskar-code)
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "GitWit AI Backend"
    environment: str = os.getenv("ENVIRONMENT", "development")
    port: int = int(os.getenv("PORT", 8000))
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    mongodb_uri: str = os.getenv("MONGODB_URI", "")
    github_pat: str = os.getenv("GITHUB_PAT", "")
    cors_origins: list = [
        "http://localhost:3000",
        "http://localhost:8085",
        "https://git-wit.vercel.app",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

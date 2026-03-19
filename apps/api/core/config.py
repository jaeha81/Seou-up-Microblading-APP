from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/seou_up_db"

    # Security
    JWT_SECRET_KEY: str = "change-me-to-a-very-long-random-string"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # AI Simulation adapter: "mock" | "mediapipe"
    SIMULATION_ADAPTER: str = "mock"

    # Queue
    REDIS_URL: str = "redis://localhost:6379/0"

    # OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    KAKAO_CLIENT_ID: str = ""
    KAKAO_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    KAKAO_REDIRECT_URI_KAKAO: str = "http://localhost:8000/api/auth/kakao/callback"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Storage
    UPLOAD_DIR: str = "storage/uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # App
    APP_ENV: str = "development"
    DEBUG: bool = True


settings = Settings()

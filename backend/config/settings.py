from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Khansama of Bhopal API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    FRONTEND_URL: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "postgresql://khansama:khansama123@db:5432/khansama_db"

    # JWT
    SECRET_KEY: str = "khansama-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin
    ADMIN_EMAIL: str = "admin@khansama.com"
    ADMIN_PASSWORD: str = "admin123"

    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: list = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

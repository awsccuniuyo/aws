from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path


class Settings(BaseSettings):
    DATABASE_URL: str
    RESEND_API_KEY: str
    FROM_EMAIL: str = "noreply@awsccuniuyo.com"
    FRONTEND_URL: str = "http://localhost:3000"
    SECRET_KEY: str = "change-this-in-production"
    ENVIRONMENT: str = "development"
    ADMIN_PIN: str = "awscc2025"   # override in production via env var
    
    # File upload settings
    UPLOAD_DIR: str = "uploads/images"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png", "gif", "webp"}

    class Config:
        env_file = ".env"
        extra = "ignore"
    
    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        path.mkdir(parents=True, exist_ok=True)
        return path


settings = Settings()

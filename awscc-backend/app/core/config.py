from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    RESEND_API_KEY: str
    FROM_EMAIL: str = "noreply@awsccuniuyo.com"
    FRONTEND_URL: str = "http://localhost:3000"
    SECRET_KEY: str = "change-this-in-production"
    ENVIRONMENT: str = "development"
    ADMIN_PIN: str = "awscc2025"   # override in production via env var

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

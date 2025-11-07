"""
Application configuration
"""
import os
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Dashboard Analytics API"
    
    # Database - Variables individuelles
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = "dashboard_db"
    POSTGRES_HOST: Optional[str] = "localhost"
    POSTGRES_PORT: Optional[str] = "5432"
    
    # Database URL - Peut être fournie directement ou construite automatiquement
    DATABASE_URL: Optional[str] = None
    
    @model_validator(mode='after')
    def build_database_url(self):
        """Construit la DATABASE_URL à partir des variables individuelles si non fournie"""
        # Si DATABASE_URL est déjà fournie, l'utiliser telle quelle
        if self.DATABASE_URL:
            return self
        
        # Sinon, construire à partir des variables individuelles
        if not self.POSTGRES_USER or not self.POSTGRES_PASSWORD:
            raise ValueError(
                "Configuration de base de données manquante. "
                "Veuillez définir soit DATABASE_URL, soit POSTGRES_USER et POSTGRES_PASSWORD dans votre fichier .env"
            )
        
        self.DATABASE_URL = (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
        
        return self
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()


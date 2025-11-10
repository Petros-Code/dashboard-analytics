"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Vérifier que DATABASE_URL est définie
if not settings.DATABASE_URL:
    raise ValueError(
        "DATABASE_URL n'est pas configurée. "
        "Veuillez définir soit DATABASE_URL, soit POSTGRES_USER et POSTGRES_PASSWORD dans votre fichier .env"
    )

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    echo=False  # Mettre à True pour voir les requêtes SQL en développement
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    Dependency function for FastAPI to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


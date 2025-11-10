"""
User repository - Data access layer for User model
"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models import User
from app.core.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    Repository for User model operations
    Extends BaseRepository with User-specific methods
    """
    
    def __init__(self, db: Session):
        super().__init__(User, db)
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def email_exists(self, email: str) -> bool:
        """Check if an email already exists"""
        return self.db.query(User).filter(User.email == email).first() is not None


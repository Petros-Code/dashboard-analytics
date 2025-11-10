"""
User service - Business logic for User operations
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.repositories.user_repository import UserRepository
from app.dto.user_dto import UserCreate, UserUpdate
from app.models import User
from app.core.exceptions import NotFoundError, ConflictError, ValidationError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    """
    Service for User business logic
    Handles password hashing, validation, and business rules
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = UserRepository(db)
    
    @staticmethod
    def _hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def _verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if email already exists
        if self.repository.email_exists(user_data.email):
            raise ConflictError(f"User with email {user_data.email} already exists")
        
        # Hash password
        hashed_password = self._hash_password(user_data.password)
        
        # Create user
        return self.repository.create(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_password
        )
    
    def get_user_by_id(self, user_id: int) -> User:
        """Get a user by ID"""
        user = self.repository.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", str(user_id))
        return user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        return self.repository.get_by_email(email)
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination"""
        return self.repository.get_all(skip=skip, limit=limit)
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        """Update a user"""
        # Check if user exists
        user = self.get_user_by_id(user_id)
        
        # Check email uniqueness if email is being updated
        if user_data.email and user_data.email != user.email:
            if self.repository.email_exists(user_data.email):
                raise ConflictError(f"User with email {user_data.email} already exists")
        
        # Prepare update data
        update_data = user_data.model_dump(exclude_unset=True)
        
        # Hash password if provided
        if "password" in update_data:
            update_data["hashed_password"] = self._hash_password(update_data.pop("password"))
        
        return self.repository.update(user_id, **update_data)
    
    def delete_user(self, user_id: int) -> bool:
        """Delete a user"""
        return self.repository.delete(user_id)
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        if not self._verify_password(password, user.hashed_password):
            return None
        
        return user


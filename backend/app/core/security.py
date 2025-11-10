"""
Security utilities for JWT token management
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models import User
from app.repositories.user_repository import UserRepository
from app.core.exceptions import UnauthorizedError


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Dictionary containing the data to encode in the token (typically user_id and email)
        expires_delta: Optional timedelta for token expiration. If None, uses default from settings.
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Encode the token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string to verify
    
    Returns:
        Decoded token payload as dictionary, or None if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def get_current_user(token: str, db: Session) -> User:
    """
    Get the current user from a JWT token
    
    Args:
        token: JWT token string
        db: Database session
    
    Returns:
        User object if token is valid and user exists
    
    Raises:
        UnauthorizedError: If token is invalid, expired, or user not found
    """
    # Verify the token
    payload = verify_token(token)
    
    if payload is None:
        raise UnauthorizedError("Invalid or expired token")
    
    # Extract user identifier from token (typically stored as 'sub')
    user_id: Optional[int] = payload.get("sub")
    
    if user_id is None:
        raise UnauthorizedError("Token payload missing user identifier")
    
    # Get user from database
    user_repository = UserRepository(db)
    user = user_repository.get_by_id(user_id)
    
    if user is None:
        raise UnauthorizedError("User not found")
    
    return user


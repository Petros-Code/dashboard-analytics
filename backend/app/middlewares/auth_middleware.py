"""
Authentication middleware - FastAPI dependencies for JWT authentication
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User
from app.core.exceptions import UnauthorizedError, ForbiddenError

security = HTTPBearer()


def get_current_user_required(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user (required)
    
    Raises 401 if token is missing, invalid, or user is not active
    """
    try:
        token = credentials.credentials
        user = get_current_user(token, db)
        
        # Vérifier que le compte est actif
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )
        
        return user
    except UnauthorizedError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User | None:
    """
    Dependency to get the current authenticated user (optional)
    
    Returns None if no token is provided or token is invalid
    """
    try:
        token = credentials.credentials
        user = get_current_user(token, db)
        return user if user.is_active else None
    except Exception:
        return None


def is_admin(user: User) -> bool:
    """
    Check if a user has admin role
    
    Args:
        user: User object
    
    Returns:
        True if user has admin role, False otherwise
    """
    if not user.user_roles:
        return False
    
    return any(role.role.name.lower() == "admin" for role in user.user_roles)


def get_current_admin_user(
    current_user: User = Depends(get_current_user_required)
) -> User:
    """
    Dependency to get the current authenticated admin user
    
    Raises 403 if user is not admin
    """
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


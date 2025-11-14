"""
Authentication controller - Handles HTTP requests and responses for authentication operations
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.auth_service import AuthService
from app.dto.auth_dto import LoginRequest, RegisterRequest, LoginResponse
from app.dto.user_dto import UserResponse
from app.core.exceptions import BaseAppException, UnauthorizedError
from app.models import User


class AuthController:
    """
    Controller for authentication endpoints
    Handles HTTP requests, validates input, and formats responses
    """
    
    @staticmethod
    def login(login_data: LoginRequest, db: Session) -> LoginResponse:
        """
        Handle user login request
        
        Args:
            login_data: Login credentials (email, password)
            db: Database session
        
        Returns:
            LoginResponse with access token and user information
        
        Raises:
            HTTPException: 401 if credentials are invalid
        """
        try:
            service = AuthService(db)
            return service.login(login_data.email, login_data.password)
        except UnauthorizedError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=e.message
            )
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def register(register_data: RegisterRequest, db: Session) -> LoginResponse:
        """
        Handle user registration request
        
        Args:
            register_data: Registration data (name, email, password)
            db: Database session
        
        Returns:
            LoginResponse with access token and user information
        
        Raises:
            HTTPException: 409 if email already exists, 400 for validation errors
        """
        try:
            service = AuthService(db)
            return service.register(register_data)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_current_user(current_user: User) -> UserResponse:
        """
        Get the current authenticated user
        
        Args:
            current_user: The authenticated user from the JWT token
        
        Returns:
            UserResponse with user information
        """
        try:
            return UserResponse.model_validate(current_user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )


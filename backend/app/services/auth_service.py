"""
Authentication service - Business logic for authentication operations
"""
from sqlalchemy.orm import Session
from app.services.user_service import UserService
from app.dto.auth_dto import RegisterRequest, LoginResponse
from app.dto.user_dto import UserResponse, UserCreate
from app.core.security import create_access_token
from app.core.exceptions import UnauthorizedError


class AuthService:
    """
    Service for authentication business logic
    Handles login, registration, and token generation
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.user_service = UserService(db)
    
    def login(self, email: str, password: str) -> LoginResponse:
        """
        Authenticate a user and generate a JWT token
        
        Args:
            email: User email
            password: User password (plain text)
        
        Returns:
            LoginResponse with access token and user information
        
        Raises:
            UnauthorizedError: If credentials are invalid
        """
        # Authenticate user using UserService
        user = self.user_service.authenticate_user(email, password)
        
        if user is None:
            raise UnauthorizedError("Invalid email or password")
        
        # Vérifier que le compte est actif
        if not user.is_active:
            raise UnauthorizedError("Account is inactive. Please contact an administrator.")
        
        # Create JWT token
        token_data = {
            "sub": user.id,  # Subject (user ID)
            "email": user.email
        }
        access_token = create_access_token(data=token_data)
        
        # Return login response
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    
    def register(self, user_data: RegisterRequest) -> LoginResponse:
        """
        Register a new user and generate a JWT token
        
        Args:
            user_data: Registration data (name, email, password)
        
        Returns:
            LoginResponse with access token and user information
        
        Raises:
            ConflictError: If email already exists (raised by UserService)
        """
        # Create user using UserService (handles password hashing and validation)
        # Convert RegisterRequest to UserCreate (they have the same fields)
        user_create = UserCreate(
            name=user_data.name,
            email=user_data.email,
            password=user_data.password
        )
        user = self.user_service.create_user(user_create)
        
        # Create JWT token for immediate login
        token_data = {
            "sub": user.id,
            "email": user.email
        }
        access_token = create_access_token(data=token_data)
        
        # Return login response
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )


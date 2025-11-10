"""
Authentication routes - HTTP endpoints for authentication operations
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.auth_controller import AuthController
from app.dto.auth_dto import LoginRequest, RegisterRequest, LoginResponse

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

controller = AuthController()


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="User login",
    description="Authenticate a user and receive a JWT access token"
)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login endpoint
    
    - **email**: User email address
    - **password**: User password
    
    Returns a JWT access token and user information
    """
    return controller.login(login_data, db)


@router.post(
    "/register",
    response_model=LoginResponse,
    status_code=status.HTTP_201_CREATED,
    summary="User registration",
    description="Register a new user and receive a JWT access token"
)
async def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Registration endpoint
    
    - **name**: User full name
    - **email**: User email address (must be unique)
    - **password**: User password
    
    Creates a new user and returns a JWT access token for immediate login
    """
    return controller.register(register_data, db)


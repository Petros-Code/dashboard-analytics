"""
User routes - HTTP endpoints for User operations
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.user_controller import UserController
from app.dto.user_dto import UserCreate, UserUpdate, UserResponse, UserListResponse

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

controller = UserController()


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user"
)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Create a new user"""
    return controller.create_user(user_data, db)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get a user by ID"
)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get a user by ID"""
    return controller.get_user(user_id, db)


@router.get(
    "/",
    response_model=UserListResponse,
    summary="Get all users"
)
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all users with pagination"""
    return controller.get_all_users(skip, limit, db)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update a user"
)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    """Update a user"""
    return controller.update_user(user_id, user_data, db)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user"
)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Delete a user"""
    return controller.delete_user(user_id, db)


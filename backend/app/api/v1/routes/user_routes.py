"""
User routes - HTTP endpoints for User operations
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.user_controller import UserController
from app.dto.user_dto import UserCreate, UserUpdate, UserResponse, UserListResponse, DeleteResponse
from app.middlewares.auth_middleware import get_current_admin_user, get_current_user_required
from app.models import User

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

controller = UserController()


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Get the profile of the currently authenticated user"
)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
):
    """
    Get current user profile
    
    Returns the profile information of the authenticated user.
    Requires a valid JWT token in the Authorization header.
    """
    return controller.get_current_user(current_user)


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user (Admin only)",
    description="Create a new user. Requires admin authentication. Does not generate JWT token."
)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new user (Admin only)
    
    This endpoint is protected and requires admin authentication.
    Unlike /auth/register, this does not generate a JWT token.
    """
    return controller.create_user(user_data, db)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get a user by ID (Admin only)",
    description="Get a user by ID. Requires admin authentication."
)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get a user by ID (Admin only)"""
    return controller.get_user(user_id, db)


@router.get(
    "/",
    response_model=UserListResponse,
    summary="Get all users (Admin only)",
    description="Get all users with pagination. Requires admin authentication."
)
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all users with pagination (Admin only)"""
    return controller.get_all_users(skip, limit, db)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update a user (Admin only)",
    description="Update a user. Requires admin authentication."
)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a user (Admin only)"""
    return controller.update_user(user_id, user_data, db)


@router.delete(
    "/{user_id}",
    response_model=DeleteResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete a user (Admin only)",
    description="Delete a user. Requires admin authentication."
)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a user (Admin only)"""
    return controller.delete_user(user_id, db)


@router.get(
    "/{user_id}/roles",
    status_code=status.HTTP_200_OK,
    summary="Get user roles (Admin only)",
    description="Get all roles assigned to a user. Requires admin authentication."
)
async def get_user_roles(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all roles assigned to a user (Admin only)
    
    - **user_id**: The user ID
    - Returns list of roles assigned to the user
    """
    return controller.get_user_roles(user_id, db)


@router.post(
    "/{user_id}/roles/{role_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Assign role to user (Admin only)",
    description="Assign a role to a user. Requires admin authentication."
)
async def assign_role_to_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Assign a role to a user (Admin only)
    
    - **user_id**: The user ID
    - **role_id**: The role ID to assign
    - Returns the updated user
    """
    return controller.assign_role_to_user(user_id, role_id, db)


@router.delete(
    "/{user_id}/roles/{role_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Remove role from user (Admin only)",
    description="Remove a role from a user. Requires admin authentication."
)
async def remove_role_from_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Remove a role from a user (Admin only)
    
    - **user_id**: The user ID
    - **role_id**: The role ID to remove
    - Returns the updated user
    """
    return controller.remove_role_from_user(user_id, role_id, db)


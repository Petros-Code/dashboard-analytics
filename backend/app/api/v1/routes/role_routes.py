"""
Role routes - HTTP endpoints for Role operations
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.role_controller import RoleController
from app.dto.role_dto import RoleCreate, RoleUpdate, RoleResponse, RoleListResponse
from app.middlewares.auth_middleware import get_current_admin_user
from app.models import User

router = APIRouter(
    prefix="/roles",
    tags=["roles"]
)

controller = RoleController()


@router.post(
    "/",
    response_model=RoleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new role (Admin only)",
    description="Create a new role. Requires admin authentication."
)
async def create_role(
    role_data: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new role (Admin only)
    
    - **name**: Role name (must be unique)
    - **description**: Optional role description
    - Returns the created role
    """
    return controller.create_role(role_data, db)


@router.get(
    "/",
    response_model=RoleListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all roles (Admin only)",
    description="Get all roles with pagination. Requires admin authentication."
)
async def get_all_roles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get all roles with pagination (Admin only)
    
    - **skip**: Number of roles to skip (default: 0)
    - **limit**: Maximum number of roles to return (default: 100)
    - Returns paginated list of roles
    """
    return controller.get_all_roles(skip, limit, db)


@router.get(
    "/{role_id}",
    response_model=RoleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a role by ID (Admin only)",
    description="Get a specific role by its ID. Requires admin authentication."
)
async def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get a role by ID (Admin only)
    
    - **role_id**: The role ID
    - Returns the role details
    """
    return controller.get_role(role_id, db)


@router.put(
    "/{role_id}",
    response_model=RoleResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a role (Admin only)",
    description="Update a role by ID. Requires admin authentication."
)
async def update_role(
    role_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update a role by ID (Admin only)
    
    - **role_id**: The role ID
    - **role_data**: Updated role information (name, description)
    - Returns the updated role
    """
    return controller.update_role(role_id, role_data, db)


@router.delete(
    "/{role_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a role (Admin only)",
    description="Delete a role by ID. Requires admin authentication. Cannot delete if role is assigned to users."
)
async def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a role by ID (Admin only)
    
    - **role_id**: The role ID
    - Returns success message
    - Cannot delete if role is assigned to any user
    """
    return controller.delete_role(role_id, db)


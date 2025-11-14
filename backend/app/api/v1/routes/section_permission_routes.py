"""
SectionPermission routes - HTTP endpoints for SectionPermission operations
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.section_permission_controller import SectionPermissionController
from app.dto.section_permission_dto import (
    SectionPermissionResponse,
    SectionPermissionListResponse,
    SetPermissionRequest
)
from app.middlewares.auth_middleware import get_current_admin_user
from app.models import User

router = APIRouter(
    prefix="/permissions",
    tags=["permissions"]
)

controller = SectionPermissionController()


@router.get(
    "/role/{role_id}",
    response_model=SectionPermissionListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all permissions for a role",
    description="Get all section permissions for a specific role. Admin only."
)
async def get_permissions_for_role(
    role_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all permissions for a role
    
    - **role_id**: The role ID
    - Returns list of all section permissions for the role
    """
    return controller.get_permissions_for_role(role_id, db)


@router.post(
    "/role/{role_id}/section/{section}",
    response_model=SectionPermissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Set permission for a role on a section",
    description="Create or update a permission for a role on a specific section. Admin only."
)
async def set_permission(
    role_id: int,
    section: str,
    permission_data: SetPermissionRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Set or update a permission for a role on a section
    
    - **role_id**: The role ID
    - **section**: The section name (e.g., "dashboard", "analytics")
    - **permission_data**: Permission settings (can_view, can_edit)
    - Returns the created or updated permission
    """
    return controller.set_permission(role_id, section, permission_data, db)


@router.get(
    "/{permission_id}",
    response_model=SectionPermissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a permission by ID",
    description="Get a specific permission by its ID. Admin only."
)
async def get_permission(
    permission_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get a permission by ID
    
    - **permission_id**: The permission ID
    - Returns the permission details
    """
    return controller.get_permission(permission_id, db)


@router.put(
    "/{permission_id}",
    response_model=SectionPermissionResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a permission",
    description="Update a permission by ID. Admin only."
)
async def update_permission(
    permission_id: int,
    permission_data: SetPermissionRequest,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a permission by ID
    
    - **permission_id**: The permission ID
    - **permission_data**: Updated permission settings (can_view, can_edit)
    - Returns the updated permission
    """
    return controller.update_permission(permission_id, permission_data, db)


@router.delete(
    "/{permission_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a permission",
    description="Delete a permission by ID. Admin only."
)
async def delete_permission(
    permission_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a permission by ID
    
    - **permission_id**: The permission ID
    - Returns success message
    """
    return controller.delete_permission(permission_id, db)


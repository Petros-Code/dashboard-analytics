"""
SectionPermission controller - Handles HTTP requests and responses for SectionPermission operations
"""
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.section_permission_service import SectionPermissionService
from app.dto.section_permission_dto import (
    SectionPermissionResponse,
    SectionPermissionListResponse,
    SetPermissionRequest
)
from app.core.exceptions import BaseAppException


class SectionPermissionController:
    """
    Controller for SectionPermission endpoints
    Handles HTTP requests, validates input, and formats responses
    """
    
    @staticmethod
    def get_permissions_for_role(role_id: int, db: Session) -> SectionPermissionListResponse:
        """
        Get all permissions for a specific role
        
        Args:
            role_id: The role ID
            db: Database session
        
        Returns:
            SectionPermissionListResponse with list of permissions
        """
        try:
            service = SectionPermissionService(db)
            permissions = service.get_all_permissions_for_role(role_id)
            
            return SectionPermissionListResponse(
                items=[SectionPermissionResponse.model_validate(perm) for perm in permissions],
                total=len(permissions),
                skip=0,
                limit=len(permissions)
            )
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def set_permission(
        role_id: int,
        section: str,
        permission_data: SetPermissionRequest,
        db: Session
    ) -> SectionPermissionResponse:
        """
        Set or update a permission for a role on a section
        
        Args:
            role_id: The role ID
            section: The section name
            permission_data: Permission data (can_view, can_edit)
            db: Database session
        
        Returns:
            SectionPermissionResponse with the created or updated permission
        """
        try:
            service = SectionPermissionService(db)
            permission = service.set_permission(
                role_id=role_id,
                section=section,
                can_view=permission_data.can_view,
                can_edit=permission_data.can_edit
            )
            return SectionPermissionResponse.model_validate(permission)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_permission(permission_id: int, db: Session) -> SectionPermissionResponse:
        """
        Get a specific permission by ID
        
        Args:
            permission_id: The permission ID
            db: Database session
        
        Returns:
            SectionPermissionResponse with the permission
        """
        try:
            service = SectionPermissionService(db)
            permission = service.repository.get_by_id(permission_id)
            
            if not permission:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Permission with ID {permission_id} not found"
                )
            
            return SectionPermissionResponse.model_validate(permission)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def update_permission(
        permission_id: int,
        permission_data: SetPermissionRequest,
        db: Session
    ) -> SectionPermissionResponse:
        """
        Update a permission by ID
        
        Args:
            permission_id: The permission ID
            permission_data: Permission data (can_view, can_edit)
            db: Database session
        
        Returns:
            SectionPermissionResponse with the updated permission
        """
        try:
            service = SectionPermissionService(db)
            permission = service.repository.get_by_id(permission_id)
            
            if not permission:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Permission with ID {permission_id} not found"
                )
            
            # Mettre à jour la permission
            updated = service.set_permission(
                role_id=permission.role_id,
                section=permission.section,
                can_view=permission_data.can_view,
                can_edit=permission_data.can_edit
            )
            
            return SectionPermissionResponse.model_validate(updated)
        except HTTPException:
            raise
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def delete_permission(permission_id: int, db: Session) -> dict:
        """
        Delete a permission by ID
        
        Args:
            permission_id: The permission ID
            db: Database session
        
        Returns:
            Dict with success message
        """
        try:
            service = SectionPermissionService(db)
            permission = service.repository.get_by_id(permission_id)
            
            if not permission:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Permission with ID {permission_id} not found"
                )
            
            deleted = service.delete_permission(permission.role_id, permission.section)
            
            if not deleted:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete permission"
                )
            
            return {"message": "Permission deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )


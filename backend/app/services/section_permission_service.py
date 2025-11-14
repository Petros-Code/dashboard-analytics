"""
SectionPermission service - Business logic for SectionPermission operations
"""
from typing import List, Optional, Literal
from sqlalchemy.orm import Session
from app.repositories.section_permission_repository import SectionPermissionRepository
from app.repositories.role_repository import RoleRepository
from app.models import SectionPermission
from app.core.exceptions import NotFoundError, ValidationError


class SectionPermissionService:
    """
    Service for SectionPermission business logic
    Handles permission checking, setting, and validation
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = SectionPermissionRepository(db)
        self.role_repository = RoleRepository(db)
    
    def check_permission(self, role_id: int, section: str, action: Literal["view", "edit"]) -> bool:
        """
        Check if a role has permission for a specific action on a section
        
        Args:
            role_id: The role ID
            section: The section name (e.g., "dashboard", "analytics")
            action: The action to check ("view" or "edit")
        
        Returns:
            True if the role has permission, False otherwise
        
        Raises:
            ValidationError: If action is not "view" or "edit"
        """
        if action not in ["view", "edit"]:
            raise ValidationError(f"Invalid action: {action}. Must be 'view' or 'edit'")
        
        permission = self.repository.get_by_role_and_section(role_id, section)
        
        if not permission:
            return False
        
        if action == "view":
            return permission.can_view
        else:  # action == "edit"
            return permission.can_edit
    
    def set_permission(self, role_id: int, section: str, can_view: bool, can_edit: bool) -> SectionPermission:
        """
        Set or update permissions for a role on a section
        
        Args:
            role_id: The role ID
            section: The section name
            can_view: Whether the role can view the section
            can_edit: Whether the role can edit the section
        
        Returns:
            The created or updated SectionPermission
        
        Raises:
            NotFoundError: If the role doesn't exist
        """
        # Vérifier que le rôle existe
        role = self.role_repository.get_by_id(role_id)
        if not role:
            raise NotFoundError("Role", str(role_id))
        
        # Vérifier si la permission existe déjà
        existing_permission = self.repository.get_by_role_and_section(role_id, section)
        
        if existing_permission:
            # Mettre à jour la permission existante
            return self.repository.update(
                existing_permission.id,
                can_view=can_view,
                can_edit=can_edit
            )
        else:
            # Créer une nouvelle permission
            return self.repository.create(
                role_id=role_id,
                section=section,
                can_view=can_view,
                can_edit=can_edit
            )
    
    def get_all_permissions_for_role(self, role_id: int) -> List[SectionPermission]:
        """
        Get all permissions for a specific role
        
        Args:
            role_id: The role ID
        
        Returns:
            List of SectionPermission objects for the role
        """
        return self.repository.get_permissions_by_role(role_id)
    
    def get_permission(self, role_id: int, section: str) -> Optional[SectionPermission]:
        """
        Get a specific permission by role and section
        
        Args:
            role_id: The role ID
            section: The section name
        
        Returns:
            SectionPermission if found, None otherwise
        """
        return self.repository.get_by_role_and_section(role_id, section)
    
    def delete_permission(self, role_id: int, section: str) -> bool:
        """
        Delete a permission for a role on a section
        
        Args:
            role_id: The role ID
            section: The section name
        
        Returns:
            True if deleted, False if not found
        """
        return self.repository.delete_by_role_and_section(role_id, section)
    
    def get_all_permissions(self, skip: int = 0, limit: int = 100) -> List[SectionPermission]:
        """
        Get all permissions with pagination
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
        
        Returns:
            List of SectionPermission objects
        """
        return self.repository.get_all(skip=skip, limit=limit)


"""
SectionPermission repository - Data access layer for SectionPermission model
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import SectionPermission
from app.core.base_repository import BaseRepository


class SectionPermissionRepository(BaseRepository[SectionPermission]):
    """
    Repository for SectionPermission model operations
    Extends BaseRepository with SectionPermission-specific methods
    """
    
    def __init__(self, db: Session):
        super().__init__(SectionPermission, db)
    
    def get_by_role_and_section(self, role_id: int, section: str) -> Optional[SectionPermission]:
        """
        Get a permission by role_id and section
        
        Args:
            role_id: The role ID
            section: The section name (e.g., "dashboard", "analytics")
        
        Returns:
            SectionPermission if found, None otherwise
        """
        return self.db.query(SectionPermission).filter(
            SectionPermission.role_id == role_id,
            SectionPermission.section == section
        ).first()
    
    def get_permissions_by_role(self, role_id: int) -> List[SectionPermission]:
        """
        Get all permissions for a specific role
        
        Args:
            role_id: The role ID
        
        Returns:
            List of SectionPermission objects for the role
        """
        return self.db.query(SectionPermission).filter(
            SectionPermission.role_id == role_id
        ).all()
    
    def get_permissions_by_section(self, section: str) -> List[SectionPermission]:
        """
        Get all permissions for a specific section across all roles
        
        Args:
            section: The section name
        
        Returns:
            List of SectionPermission objects for the section
        """
        return self.db.query(SectionPermission).filter(
            SectionPermission.section == section
        ).all()
    
    def delete_by_role_and_section(self, role_id: int, section: str) -> bool:
        """
        Delete a permission by role_id and section
        
        Args:
            role_id: The role ID
            section: The section name
        
        Returns:
            True if deleted, False if not found
        """
        permission = self.get_by_role_and_section(role_id, section)
        if permission:
            self.db.delete(permission)
            self.db.commit()
            return True
        return False


"""
Role service - Business logic for Role operations
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Role
from app.repositories.role_repository import RoleRepository
from app.core.exceptions import NotFoundError, ConflictError


class RoleService:
    """
    Service for Role business logic
    Handles validation and business rules for roles
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = RoleRepository(db)
    
    def create_role(self, name: str, description: Optional[str] = None) -> Role:
        """
        Create a new role
        
        Args:
            name: Role name (must be unique)
            description: Optional role description
            
        Returns:
            Created Role object
            
        Raises:
            ConflictError: If role name already exists
        """
        # Check if role name already exists
        if self.repository.name_exists(name):
            raise ConflictError(f"Role with name '{name}' already exists")
        
        # Create the role
        role = self.repository.create(
            name=name,
            description=description
        )
        
        self.db.commit()
        self.db.refresh(role)
        
        return role
    
    def get_role_by_id(self, role_id: int) -> Role:
        """Get a role by ID"""
        role = self.repository.get_by_id(role_id)
        if not role:
            raise NotFoundError("Role", str(role_id))
        return role
    
    def get_role_by_name(self, name: str) -> Optional[Role]:
        """Get a role by name"""
        return self.repository.get_by_name(name)
    
    def get_all_roles(self, skip: int = 0, limit: int = 100) -> List[Role]:
        """Get all roles with pagination"""
        return self.repository.get_all(skip=skip, limit=limit)
    
    def update_role(self, role_id: int, name: Optional[str] = None, description: Optional[str] = None) -> Role:
        """
        Update a role
        
        Args:
            role_id: Role ID to update
            name: New role name (optional)
            description: New role description (optional)
            
        Returns:
            Updated Role object
            
        Raises:
            NotFoundError: If role not found
            ConflictError: If new name already exists
        """
        role = self.get_role_by_id(role_id)
        
        # If name is being updated, check if it already exists
        if name and name != role.name:
            if self.repository.name_exists(name):
                raise ConflictError(f"Role with name '{name}' already exists")
            role.name = name
        
        if description is not None:
            role.description = description
        
        self.db.commit()
        self.db.refresh(role)
        
        return role
    
    def delete_role(self, role_id: int) -> bool:
        """
        Delete a role
        
        Args:
            role_id: Role ID to delete
            
        Returns:
            True if deleted successfully
            
        Raises:
            NotFoundError: If role not found
        """
        role = self.get_role_by_id(role_id)
        
        # Check if role is being used (has users assigned)
        if role.user_roles:
            raise ConflictError(
                f"Cannot delete role '{role.name}': it is assigned to {len(role.user_roles)} user(s)"
            )
        
        self.repository.delete(role_id)
        self.db.commit()
        
        return True


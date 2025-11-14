"""
Role controller - HTTP request/response handling for Role operations
"""
from typing import List
from sqlalchemy.orm import Session
from app.services.role_service import RoleService
from app.dto.role_dto import (
    RoleCreate,
    RoleUpdate,
    RoleResponse,
    RoleListResponse
)
from app.models import Role


class RoleController:
    """
    Controller for Role HTTP operations
    Handles request/response conversion and calls service layer
    """
    
    def create_role(self, role_data: RoleCreate, db: Session) -> RoleResponse:
        """Create a new role"""
        service = RoleService(db)
        role = service.create_role(
            name=role_data.name,
            description=role_data.description
        )
        return RoleResponse.model_validate(role)
    
    def get_role(self, role_id: int, db: Session) -> RoleResponse:
        """Get a role by ID"""
        service = RoleService(db)
        role = service.get_role_by_id(role_id)
        return RoleResponse.model_validate(role)
    
    def get_all_roles(self, skip: int, limit: int, db: Session) -> RoleListResponse:
        """Get all roles with pagination"""
        service = RoleService(db)
        roles = service.get_all_roles(skip=skip, limit=limit)
        
        # Get total count
        from app.models import Role
        total = db.query(Role).count()
        
        return RoleListResponse(
            items=[RoleResponse.model_validate(role) for role in roles],
            total=total,
            skip=skip,
            limit=limit
        )
    
    def update_role(self, role_id: int, role_data: RoleUpdate, db: Session) -> RoleResponse:
        """Update a role"""
        service = RoleService(db)
        role = service.update_role(
            role_id=role_id,
            name=role_data.name,
            description=role_data.description
        )
        return RoleResponse.model_validate(role)
    
    def delete_role(self, role_id: int, db: Session) -> dict:
        """Delete a role"""
        service = RoleService(db)
        service.delete_role(role_id)
        return {"message": "Role deleted successfully"}


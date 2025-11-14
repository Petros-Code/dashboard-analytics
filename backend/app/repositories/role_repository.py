"""
Role repository - Data access layer for Role model
"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models import Role
from app.core.base_repository import BaseRepository


class RoleRepository(BaseRepository[Role]):
    """
    Repository for Role model operations
    Extends BaseRepository with Role-specific methods
    """
    
    def __init__(self, db: Session):
        super().__init__(Role, db)
    
    def get_by_name(self, name: str) -> Optional[Role]:
        """Get a role by name"""
        return self.db.query(Role).filter(Role.name == name).first()
    
    def name_exists(self, name: str) -> bool:
        """Check if a role name already exists"""
        return self.db.query(Role).filter(Role.name == name).first() is not None


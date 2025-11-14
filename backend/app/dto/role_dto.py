"""
Role DTOs for request and response
"""
from pydantic import BaseModel
from typing import Optional, List


class RoleBase(BaseModel):
    """Base role schema"""
    name: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    """Schema for creating a role"""
    pass


class RoleUpdate(BaseModel):
    """Schema for updating a role"""
    name: Optional[str] = None
    description: Optional[str] = None


class RoleResponse(RoleBase):
    """Schema for role response"""
    id: int
    
    class Config:
        from_attributes = True


class RoleListResponse(BaseModel):
    """Schema for paginated role list response"""
    items: List[RoleResponse]
    total: int
    skip: int
    limit: int


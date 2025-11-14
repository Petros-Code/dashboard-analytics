"""
SectionPermission DTOs for request and response
"""
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class SectionPermissionBase(BaseModel):
    """Base schema for section permission"""
    section: str
    can_view: bool
    can_edit: bool


class SectionPermissionCreate(SectionPermissionBase):
    """Schema for creating a section permission"""
    pass


class SectionPermissionUpdate(BaseModel):
    """Schema for updating a section permission"""
    can_view: Optional[bool] = None
    can_edit: Optional[bool] = None


class SectionPermissionResponse(SectionPermissionBase):
    """Schema for section permission response"""
    id: int
    role_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class SectionPermissionListResponse(BaseModel):
    """Schema for paginated section permission list response"""
    items: List[SectionPermissionResponse]
    total: int
    skip: int
    limit: int


class SetPermissionRequest(BaseModel):
    """Schema for setting a permission"""
    can_view: bool
    can_edit: bool


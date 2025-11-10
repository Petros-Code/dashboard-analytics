"""
User DTOs for request and response
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    """Base user schema"""
    name: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str


class UserUpdate(BaseModel):
    """Schema for updating a user"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema for paginated user list response"""
    items: List[UserResponse]
    total: int
    skip: int
    limit: int


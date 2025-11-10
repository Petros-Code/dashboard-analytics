"""
Authentication DTOs for request and response
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.dto.user_dto import UserResponse


class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Schema for registration request"""
    name: str
    email: EmailStr
    password: str


class TokenData(BaseModel):
    """Schema for token data (decoded from JWT)"""
    sub: Optional[int] = None  # user_id
    email: Optional[str] = None


class LoginResponse(BaseModel):
    """Schema for login response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    
    class Config:
        from_attributes = True


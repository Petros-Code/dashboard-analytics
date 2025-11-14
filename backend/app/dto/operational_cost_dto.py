"""
OperationalCost DTOs for request and response
"""
from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional
from decimal import Decimal


class OperationalCostBase(BaseModel):
    """Base schema for operational cost"""
    month: date
    amount: Decimal
    category: str
    description: Optional[str] = None


class OperationalCostCreate(OperationalCostBase):
    """Schema for creating an operational cost"""
    pass


class OperationalCostUpdate(BaseModel):
    """Schema for updating an operational cost"""
    month: Optional[date] = None
    amount: Optional[Decimal] = None
    category: Optional[str] = None
    description: Optional[str] = None


class OperationalCostResponse(OperationalCostBase):
    """Schema for operational cost response"""
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OperationalCostListResponse(BaseModel):
    """Schema for paginated operational cost list response"""
    items: List[OperationalCostResponse]
    total: int
    skip: int
    limit: int


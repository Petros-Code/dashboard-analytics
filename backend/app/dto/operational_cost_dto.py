"""
OperationalCost DTOs for request and response
"""
from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import List, Optional, Literal
from decimal import Decimal
from app.core.constants import OperationalCostCategory


class OperationalCostBase(BaseModel):
    """Base schema for operational cost"""
    month: date
    amount: Decimal
    category: Literal[
        OperationalCostCategory.CONDITIONNEMENT.value,
        OperationalCostCategory.LAVAGE.value,
        OperationalCostCategory.DEBOULOCHAGE.value,
        OperationalCostCategory.DIVERS.value,
        OperationalCostCategory.AUTRES.value,
        OperationalCostCategory.ABONNEMENT.value
    ]
    description: Optional[str] = None
    
    @field_validator('category')
    @classmethod
    def validate_category(cls, v: str) -> str:
        """Validate that category is one of the allowed values"""
        allowed = OperationalCostCategory.get_all_values()
        if v not in allowed:
            raise ValueError(f"Category must be one of: {', '.join(allowed)}")
        return v


class OperationalCostCreate(OperationalCostBase):
    """Schema for creating an operational cost"""
    pass


class OperationalCostUpdate(BaseModel):
    """Schema for updating an operational cost"""
    month: Optional[date] = None
    amount: Optional[Decimal] = None
    category: Optional[Literal[
        OperationalCostCategory.CONDITIONNEMENT.value,
        OperationalCostCategory.LAVAGE.value,
        OperationalCostCategory.DEBOULOCHAGE.value,
        OperationalCostCategory.DIVERS.value,
        OperationalCostCategory.AUTRES.value,
        OperationalCostCategory.ABONNEMENT.value
    ]] = None
    description: Optional[str] = None
    
    @field_validator('category')
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        """Validate that category is one of the allowed values"""
        if v is None:
            return v
        allowed = OperationalCostCategory.get_all_values()
        if v not in allowed:
            raise ValueError(f"Category must be one of: {', '.join(allowed)}")
        return v


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


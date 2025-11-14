"""
OperationalCost controller - Handles HTTP requests and responses for OperationalCost operations
"""
from typing import List
from datetime import date
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.operational_cost_service import OperationalCostService
from app.dto.operational_cost_dto import (
    OperationalCostCreate,
    OperationalCostUpdate,
    OperationalCostResponse,
    OperationalCostListResponse
)
from app.core.exceptions import BaseAppException
from app.models import User


class OperationalCostController:
    """
    Controller for OperationalCost endpoints
    Handles HTTP requests, validates input, and formats responses
    """
    
    @staticmethod
    def create_cost(
        cost_data: OperationalCostCreate,
        current_user: User,
        db: Session
    ) -> OperationalCostResponse:
        """
        Create a new operational cost
        
        Args:
            cost_data: Cost creation data
            current_user: The authenticated user creating the cost
            db: Database session
        
        Returns:
            OperationalCostResponse with the created cost
        """
        try:
            service = OperationalCostService(db)
            cost = service.create_cost(cost_data, current_user.id)
            return OperationalCostResponse.model_validate(cost)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_cost(cost_id: int, db: Session) -> OperationalCostResponse:
        """
        Get a cost by ID
        
        Args:
            cost_id: The cost ID
            db: Database session
        
        Returns:
            OperationalCostResponse with the cost
        """
        try:
            service = OperationalCostService(db)
            cost = service.get_cost_by_id(cost_id)
            return OperationalCostResponse.model_validate(cost)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_all_costs(
        skip: int = 0,
        limit: int = 100,
        db: Session = None
    ) -> OperationalCostListResponse:
        """
        Get all costs with pagination
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            db: Database session
        
        Returns:
            OperationalCostListResponse with list of costs
        """
        try:
            service = OperationalCostService(db)
            costs = service.get_all_costs(skip=skip, limit=limit)
            return OperationalCostListResponse(
                items=[OperationalCostResponse.model_validate(cost) for cost in costs],
                total=len(costs),
                skip=skip,
                limit=limit
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def update_cost(
        cost_id: int,
        cost_data: OperationalCostUpdate,
        db: Session
    ) -> OperationalCostResponse:
        """
        Update a cost
        
        Args:
            cost_id: The cost ID
            cost_data: Updated cost data
            db: Database session
        
        Returns:
            OperationalCostResponse with the updated cost
        """
        try:
            service = OperationalCostService(db)
            cost = service.update_cost(cost_id, cost_data)
            return OperationalCostResponse.model_validate(cost)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def delete_cost(cost_id: int, db: Session) -> dict:
        """
        Delete a cost
        
        Args:
            cost_id: The cost ID
            db: Database session
        
        Returns:
            Dict with success message
        """
        try:
            service = OperationalCostService(db)
            service.delete_cost(cost_id)
            return {"message": "Operational cost deleted successfully"}
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_costs_by_month(month: date, db: Session) -> OperationalCostListResponse:
        """
        Get all costs for a specific month
        
        Args:
            month: The month (date)
            db: Database session
        
        Returns:
            OperationalCostListResponse with list of costs
        """
        try:
            service = OperationalCostService(db)
            costs = service.get_costs_by_month(month)
            return OperationalCostListResponse(
                items=[OperationalCostResponse.model_validate(cost) for cost in costs],
                total=len(costs),
                skip=0,
                limit=len(costs)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_costs_by_category(category: str, db: Session) -> OperationalCostListResponse:
        """
        Get all costs for a specific category
        
        Args:
            category: The category name
            db: Database session
        
        Returns:
            OperationalCostListResponse with list of costs
        """
        try:
            service = OperationalCostService(db)
            costs = service.get_costs_by_category(category)
            return OperationalCostListResponse(
                items=[OperationalCostResponse.model_validate(cost) for cost in costs],
                total=len(costs),
                skip=0,
                limit=len(costs)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )


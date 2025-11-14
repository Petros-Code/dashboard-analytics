"""
OperationalCost service - Business logic for OperationalCost operations
"""
from typing import List
from datetime import date
from sqlalchemy.orm import Session
from decimal import Decimal
from app.repositories.operational_cost_repository import OperationalCostRepository
from app.repositories.user_repository import UserRepository
from app.dto.operational_cost_dto import OperationalCostCreate, OperationalCostUpdate
from app.models import OperationalCost
from app.core.exceptions import NotFoundError, ValidationError
from app.core.constants import OperationalCostCategory


class OperationalCostService:
    """
    Service for OperationalCost business logic
    Handles CRUD operations and business rules
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = OperationalCostRepository(db)
        self.user_repository = UserRepository(db)
    
    def create_cost(self, cost_data: OperationalCostCreate, created_by: int) -> OperationalCost:
        """
        Create a new operational cost
        
        Args:
            cost_data: Cost creation data
            created_by: ID of the user creating the cost
        
        Returns:
            Created OperationalCost
        
        Raises:
            NotFoundError: If user doesn't exist
            ValidationError: If data is invalid
        """
        # Vérifier que l'utilisateur existe
        user = self.user_repository.get_by_id(created_by)
        if not user:
            raise NotFoundError("User", str(created_by))
        
        # Validation: montant doit être positif
        if cost_data.amount <= 0:
            raise ValidationError("Amount must be greater than 0")
        
        # Validation: catégorie doit être valide
        if cost_data.category not in OperationalCostCategory.get_all_values():
            raise ValidationError(
                f"Invalid category. Must be one of: {', '.join(OperationalCostCategory.get_all_values())}"
            )
        
        # Créer le coût
        return self.repository.create(
            month=cost_data.month,
            amount=cost_data.amount,
            category=cost_data.category,
            description=cost_data.description,
            created_by=created_by
        )
    
    def get_cost_by_id(self, cost_id: int) -> OperationalCost:
        """
        Get a cost by ID
        
        Args:
            cost_id: The cost ID
        
        Returns:
            OperationalCost object
        
        Raises:
            NotFoundError: If cost doesn't exist
        """
        cost = self.repository.get_by_id(cost_id)
        if not cost:
            raise NotFoundError("OperationalCost", str(cost_id))
        return cost
    
    def get_all_costs(self, skip: int = 0, limit: int = 100) -> List[OperationalCost]:
        """
        Get all costs with pagination
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
        
        Returns:
            List of OperationalCost objects
        """
        return self.repository.get_all(skip=skip, limit=limit)
    
    def update_cost(self, cost_id: int, cost_data: OperationalCostUpdate) -> OperationalCost:
        """
        Update a cost
        
        Args:
            cost_id: The cost ID
            cost_data: Updated cost data
        
        Returns:
            Updated OperationalCost
        
        Raises:
            NotFoundError: If cost doesn't exist
            ValidationError: If data is invalid
        """
        cost = self.get_cost_by_id(cost_id)
        
        # Validation: montant doit être positif si fourni
        if cost_data.amount is not None and cost_data.amount <= 0:
            raise ValidationError("Amount must be greater than 0")
        
        # Validation: catégorie doit être valide si fournie
        if cost_data.category is not None and cost_data.category not in OperationalCostCategory.get_all_values():
            raise ValidationError(
                f"Invalid category. Must be one of: {', '.join(OperationalCostCategory.get_all_values())}"
            )
        
        # Préparer les données de mise à jour
        update_data = cost_data.model_dump(exclude_unset=True)
        
        return self.repository.update(cost_id, **update_data)
    
    def delete_cost(self, cost_id: int) -> bool:
        """
        Delete a cost
        
        Args:
            cost_id: The cost ID
        
        Returns:
            True if deleted
        
        Raises:
            NotFoundError: If cost doesn't exist
        """
        cost = self.get_cost_by_id(cost_id)
        return self.repository.delete(cost_id)
    
    def get_costs_by_month(self, month: date) -> List[OperationalCost]:
        """
        Get all costs for a specific month
        
        Args:
            month: The month (date object)
        
        Returns:
            List of OperationalCost objects
        """
        return self.repository.get_by_month(month)
    
    def get_costs_by_category(self, category: str) -> List[OperationalCost]:
        """
        Get all costs for a specific category
        
        Args:
            category: The category name
        
        Returns:
            List of OperationalCost objects
        """
        return self.repository.get_by_category(category)
    
    def get_costs_by_month_range(self, start_date: date, end_date: date) -> List[OperationalCost]:
        """
        Get all costs within a date range
        
        Args:
            start_date: Start date (inclusive)
            end_date: End date (inclusive)
        
        Returns:
            List of OperationalCost objects
        """
        if start_date > end_date:
            raise ValidationError("Start date must be before or equal to end date")
        
        return self.repository.get_by_month_range(start_date, end_date)


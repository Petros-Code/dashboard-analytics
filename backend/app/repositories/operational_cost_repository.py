"""
OperationalCost repository - Data access layer for OperationalCost model
"""
from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Session
from app.models import OperationalCost
from app.core.base_repository import BaseRepository


class OperationalCostRepository(BaseRepository[OperationalCost]):
    """
    Repository for OperationalCost model operations
    Extends BaseRepository with OperationalCost-specific methods
    """
    
    def __init__(self, db: Session):
        super().__init__(OperationalCost, db)
    
    def get_by_month(self, month: date) -> List[OperationalCost]:
        """
        Get all costs for a specific month
        
        Args:
            month: The month (date object, typically first day of month)
        
        Returns:
            List of OperationalCost objects for the month
        """
        return self.db.query(OperationalCost).filter(
            OperationalCost.month == month
        ).all()
    
    def get_by_category(self, category: str) -> List[OperationalCost]:
        """
        Get all costs for a specific category
        
        Args:
            category: The category name
        
        Returns:
            List of OperationalCost objects for the category
        """
        return self.db.query(OperationalCost).filter(
            OperationalCost.category == category
        ).all()
    
    def get_by_month_range(self, start_date: date, end_date: date) -> List[OperationalCost]:
        """
        Get all costs within a date range
        
        Args:
            start_date: Start date (inclusive)
            end_date: End date (inclusive)
        
        Returns:
            List of OperationalCost objects in the range
        """
        return self.db.query(OperationalCost).filter(
            OperationalCost.month >= start_date,
            OperationalCost.month <= end_date
        ).order_by(OperationalCost.month.desc()).all()
    
    def get_by_creator(self, user_id: int) -> List[OperationalCost]:
        """
        Get all costs created by a specific user
        
        Args:
            user_id: The user ID
        
        Returns:
            List of OperationalCost objects created by the user
        """
        return self.db.query(OperationalCost).filter(
            OperationalCost.created_by == user_id
        ).order_by(OperationalCost.month.desc()).all()


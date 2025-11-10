"""
Base service class
"""
from typing import Generic, TypeVar
from sqlalchemy.orm import Session

ServiceType = TypeVar("ServiceType")


class BaseService(Generic[ServiceType]):
    """
    Base service class
    All services should inherit from this class
    """
    
    def __init__(self, db: Session):
        self.db = db


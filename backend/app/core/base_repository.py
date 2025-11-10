"""
Base repository class with common CRUD operations
"""
from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import Base
from app.core.exceptions import NotFoundError, ConflictError

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Base repository with common CRUD operations
    All repositories should inherit from this class
    """
    
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db
    
    def get_by_id(self, id: int) -> Optional[ModelType]:
        """Get a record by its ID"""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all records with pagination"""
        return self.db.query(self.model).offset(skip).limit(limit).all()
    
    def create(self, **kwargs) -> ModelType:
        """Create a new record"""
        try:
            db_obj = self.model(**kwargs)
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except IntegrityError as e:
            self.db.rollback()
            raise ConflictError(f"Conflict creating {self.model.__name__}: {str(e)}")
    
    def update(self, id: int, **kwargs) -> ModelType:
        """Update a record by ID"""
        db_obj = self.get_by_id(id)
        if not db_obj:
            raise NotFoundError(self.model.__name__, str(id))
        
        try:
            for key, value in kwargs.items():
                setattr(db_obj, key, value)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
        except IntegrityError as e:
            self.db.rollback()
            raise ConflictError(f"Conflict updating {self.model.__name__}: {str(e)}")
    
    def delete(self, id: int) -> bool:
        """Delete a record by ID"""
        db_obj = self.get_by_id(id)
        if not db_obj:
            raise NotFoundError(self.model.__name__, str(id))
        
        self.db.delete(db_obj)
        self.db.commit()
        return True
    
    def exists(self, id: int) -> bool:
        """Check if a record exists by ID"""
        return self.db.query(self.model).filter(self.model.id == id).first() is not None


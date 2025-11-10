"""
User controller - Handles HTTP requests and responses for User operations
"""
from typing import List
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.user_service import UserService
from app.dto.user_dto import UserCreate, UserUpdate, UserResponse, UserListResponse
from app.core.exceptions import BaseAppException


class UserController:
    """
    Controller for User endpoints
    Handles HTTP requests, validates input, and formats responses
    """
    
    @staticmethod
    def create_user(user_data: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
        """Create a new user"""
        try:
            service = UserService(db)
            user = service.create_user(user_data)
            return UserResponse.model_validate(user)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_user(user_id: int, db: Session = Depends(get_db)) -> UserResponse:
        """Get a user by ID"""
        try:
            service = UserService(db)
            user = service.get_user_by_id(user_id)
            return UserResponse.model_validate(user)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def get_all_users(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
    ) -> UserListResponse:
        """Get all users with pagination"""
        try:
            service = UserService(db)
            users = service.get_all_users(skip=skip, limit=limit)
            return UserListResponse(
                items=[UserResponse.model_validate(user) for user in users],
                total=len(users),
                skip=skip,
                limit=limit
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def update_user(
        user_id: int,
        user_data: UserUpdate,
        db: Session = Depends(get_db)
    ) -> UserResponse:
        """Update a user"""
        try:
            service = UserService(db)
            user = service.update_user(user_id, user_data)
            return UserResponse.model_validate(user)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    
    @staticmethod
    def delete_user(user_id: int, db: Session = Depends(get_db)) -> dict:
        """Delete a user"""
        try:
            service = UserService(db)
            service.delete_user(user_id)
            return {"message": "User has been deleted"}
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )


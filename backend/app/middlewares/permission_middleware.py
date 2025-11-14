"""
Permission middleware - FastAPI dependencies for section permission checking
"""
from typing import Literal
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.middlewares.auth_middleware import get_current_user_required
from app.models import User
from app.services.section_permission_service import SectionPermissionService
from app.core.exceptions import ForbiddenError


def check_section_permission(
    section: str,
    action: Literal["view", "edit"] = "view",
    current_user: User = Depends(get_current_user_required),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to check if the current user has permission for a section
    
    Args:
        section: The section name (e.g., "dashboard", "analytics")
        action: The action to check ("view" or "edit"), default is "view"
        current_user: The authenticated user (from get_current_user_required)
        db: Database session
    
    Returns:
        The authenticated user if permission is granted
    
    Raises:
        HTTPException 403: If user doesn't have the required permission
    """
    service = SectionPermissionService(db)
    
    # Vérifier les permissions pour tous les rôles de l'utilisateur
    if not current_user.user_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: No permission to {action} section '{section}'. User has no roles."
        )
    
    # Vérifier si au moins un rôle de l'utilisateur a la permission
    has_permission = False
    for user_role in current_user.user_roles:
        role_id = user_role.role_id
        if service.check_permission(role_id, section, action):
            has_permission = True
            break
    
    if not has_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: No permission to {action} section '{section}'"
        )
    
    return current_user


def require_section_view(section: str):
    """
    Factory function to create a dependency that requires view permission for a section
    
    Usage:
        @router.get("/dashboard")
        async def get_dashboard(
            user: User = Depends(require_section_view("dashboard"))
        ):
            ...
    """
    def _check_view(
        current_user: User = Depends(get_current_user_required),
        db: Session = Depends(get_db)
    ) -> User:
        return check_section_permission(section, "view", current_user, db)
    
    return _check_view


def require_section_edit(section: str):
    """
    Factory function to create a dependency that requires edit permission for a section
    
    Usage:
        @router.post("/dashboard")
        async def update_dashboard(
            user: User = Depends(require_section_edit("dashboard"))
        ):
            ...
    """
    def _check_edit(
        current_user: User = Depends(get_current_user_required),
        db: Session = Depends(get_db)
    ) -> User:
        return check_section_permission(section, "edit", current_user, db)
    
    return _check_edit


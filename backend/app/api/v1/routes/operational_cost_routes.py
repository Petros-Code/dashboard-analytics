"""
OperationalCost routes - HTTP endpoints for OperationalCost operations
"""
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.controllers.operational_cost_controller import OperationalCostController
from app.dto.operational_cost_dto import (
    OperationalCostCreate,
    OperationalCostUpdate,
    OperationalCostResponse,
    OperationalCostListResponse
)
from app.middlewares.auth_middleware import get_current_admin_user
from app.models import User
from app.core.constants import OperationalCostCategory

router = APIRouter(
    prefix="/costs",
    tags=["operational-costs"]
)

controller = OperationalCostController()


@router.get(
    "/categories",
    status_code=status.HTTP_200_OK,
    summary="Get available cost categories",
    description="Get list of all available operational cost categories with their display names."
)
async def get_categories():
    """
    Get all available cost categories
    
    Returns a dictionary with category values as keys and their French display names as values.
    """
    return {
        "categories": OperationalCostCategory.get_display_names(),
        "values": OperationalCostCategory.get_all_values()
    }


@router.post(
    "/",
    response_model=OperationalCostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new operational cost",
    description="Create a new operational cost. Admin only."
)
async def create_cost(
    cost_data: OperationalCostCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Create a new operational cost
    
    - **month**: Month of the cost (YYYY-MM-DD, typically first day of month)
    - **amount**: Cost amount (must be > 0)
    - **category**: Cost category (e.g., "conditionnement", "lavage", "deboulochage", "divers", "autres", "abonnement")
    - **description**: Optional description
    
    Returns the created cost with creator information.
    """
    return controller.create_cost(cost_data, current_user, db)


@router.get(
    "/",
    response_model=OperationalCostListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all operational costs",
    description="Get all operational costs with pagination. Admin only."
)
async def get_all_costs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all operational costs with pagination
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records (default: 100, max: 1000)
    
    Returns paginated list of costs.
    """
    return controller.get_all_costs(skip, limit, db)


@router.get(
    "/{cost_id}",
    response_model=OperationalCostResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a cost by ID",
    description="Get a specific operational cost by its ID. Admin only."
)
async def get_cost(
    cost_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get a cost by ID
    
    - **cost_id**: The cost ID
    
    Returns the cost details.
    """
    return controller.get_cost(cost_id, db)


@router.put(
    "/{cost_id}",
    response_model=OperationalCostResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a cost",
    description="Update an operational cost by ID. Admin only."
)
async def update_cost(
    cost_id: int,
    cost_data: OperationalCostUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a cost by ID
    
    - **cost_id**: The cost ID
    - **cost_data**: Updated cost data (all fields optional)
    
    Returns the updated cost.
    """
    return controller.update_cost(cost_id, cost_data, db)


@router.delete(
    "/{cost_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a cost",
    description="Delete an operational cost by ID. Admin only."
)
async def delete_cost(
    cost_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a cost by ID
    
    - **cost_id**: The cost ID
    
    Returns success message.
    """
    return controller.delete_cost(cost_id, db)


@router.get(
    "/month/{month}",
    response_model=OperationalCostListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get costs by month",
    description="Get all operational costs for a specific month. Admin only."
)
async def get_costs_by_month(
    month: date,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all costs for a specific month
    
    - **month**: The month (YYYY-MM-DD, typically first day of month)
    
    Returns list of costs for the month.
    """
    return controller.get_costs_by_month(month, db)


@router.get(
    "/category/{category}",
    response_model=OperationalCostListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get costs by category",
    description="Get all operational costs for a specific category. Admin only."
)
async def get_costs_by_category(
    category: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all costs for a specific category
    
    - **category**: The category name (e.g., "conditionnement", "lavage", "deboulochage", "divers", "autres", "abonnement")
    
    Returns list of costs for the category.
    """
    return controller.get_costs_by_category(category, db)


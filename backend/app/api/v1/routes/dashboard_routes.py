"""
Dashboard routes - HTTP endpoints for dashboard KPIs and statistics
"""
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import Optional
from app.core.database import get_db
from app.models import Order
from app.middlewares.auth_middleware import get_current_user_required
from app.models import User

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)


@router.get(
    "/orders/count",
    status_code=status.HTTP_200_OK,
    summary="Get orders count",
    description="Get the count of orders within a date range"
)
async def get_orders_count(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Get the count of orders within a date range.
    If no dates are provided, returns count of all orders.
    """
    query = db.query(func.count(Order.id))
    
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Order.order_date >= start_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_date format. Use YYYY-MM-DD")
    
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            # Include the entire end date
            end_dt = end_dt.replace(hour=23, minute=59, second=59)
            query = query.filter(Order.order_date <= end_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_date format. Use YYYY-MM-DD")
    
    count = query.scalar() or 0
    
    return {
        "count": count,
        "start_date": start_date,
        "end_date": end_date
    }


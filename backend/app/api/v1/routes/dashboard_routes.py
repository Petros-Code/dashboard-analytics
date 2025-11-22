"""
Dashboard routes - HTTP endpoints for dashboard KPIs and statistics
"""
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import Optional
from app.core.database import get_db
from app.models import Order, OrderItem, Product, Customer, User, Marketplace, Country
from app.middlewares.auth_middleware import get_current_user_required

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)


def parse_date_range(start_date: Optional[str], end_date: Optional[str]):
    """Parse and validate date range"""
    start_dt = None
    end_dt = None
    
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_date format. Use YYYY-MM-DD")
    
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            end_dt = end_dt.replace(hour=23, minute=59, second=59)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_date format. Use YYYY-MM-DD")
    
    return start_dt, end_dt


@router.get(
    "/orders/count",
    status_code=status.HTTP_200_OK,
    summary="Get orders count",
    description="Get the count of orders within a date range"
)
async def get_orders_count(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Get the count of orders within a date range.
    If no dates are provided, returns count of all orders.
    """
    query = db.query(func.count(Order.id)).filter(Order.status == 'completed')
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    count = query.scalar() or 0
    
    return {
        "count": count,
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/marketplaces",
    status_code=status.HTTP_200_OK,
    summary="Get all marketplaces",
    description="Get list of all marketplaces"
)
async def get_marketplaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get all marketplaces"""
    marketplaces = db.query(Marketplace).order_by(Marketplace.name).all()
    return {
        "marketplaces": [
            {"id": m.id, "name": m.name, "commission_rate": float(m.commission_rate) if m.commission_rate else None}
            for m in marketplaces
        ]
    }


@router.get(
    "/countries",
    status_code=status.HTTP_200_OK,
    summary="Get all countries",
    description="Get list of all countries"
)
async def get_countries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get all countries"""
    countries = db.query(Country).order_by(Country.name).all()
    return {
        "countries": [
            {"id": c.id, "code": c.code, "name": c.name}
            for c in countries
        ]
    }


@router.get(
    "/sales/chart",
    status_code=status.HTTP_200_OK,
    summary="Get sales chart data",
    description="Get sales count grouped by day for the selected period"
)
async def get_sales_chart(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get sales count grouped by day"""
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    query = db.query(
        func.date(Order.order_date).label('date'),
        func.count(Order.id).label('count')
    ).filter(Order.status == 'completed')
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    results = query.group_by(func.date(Order.order_date)).order_by(func.date(Order.order_date)).all()
    
    return {
        "data": [{"date": str(r.date), "value": r.count} for r in results],
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/revenue/chart",
    status_code=status.HTTP_200_OK,
    summary="Get revenue chart data",
    description="Get revenue (CA) grouped by day for the selected period"
)
async def get_revenue_chart(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get revenue grouped by day"""
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    query = db.query(
        func.date(Order.order_date).label('date'),
        func.sum(Order.total_ttc).label('revenue')
    ).filter(Order.status == 'completed')
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    results = query.group_by(func.date(Order.order_date)).order_by(func.date(Order.order_date)).all()
    
    return {
        "data": [{"date": str(r.date), "value": float(r.revenue or 0)} for r in results],
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/net-margin/chart",
    status_code=status.HTTP_200_OK,
    summary="Get net margin chart data",
    description="Get net margin grouped by day for the selected period"
)
async def get_net_margin_chart(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get net margin grouped by day"""
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    query = db.query(
        func.date(Order.order_date).label('date'),
        func.sum(OrderItem.calculated_net_margin).label('net_margin')
    ).join(OrderItem, Order.id == OrderItem.order_id).filter(Order.status == 'completed')
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    results = query.group_by(func.date(Order.order_date)).order_by(func.date(Order.order_date)).all()
    
    return {
        "data": [{"date": str(r.date), "value": float(r.net_margin or 0)} for r in results],
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/stock-value/chart",
    status_code=status.HTTP_200_OK,
    summary="Get stock value chart data",
    description="Get stock value over time for the selected period"
)
async def get_stock_value_chart(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get stock value grouped by day (products not sold)"""
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    # Pour chaque jour, calculer la valeur du stock (produits non vendus)
    # On utilise la date de création des produits comme référence
    query = db.query(
        func.date(Product.created_at).label('date'),
        func.sum(Product.selling_price_ttc).label('stock_value')
    ).filter(
        Product.status.in_(['published', 'draft']),
        Product.is_online == True
    )
    
    if start_dt:
        query = query.filter(Product.created_at >= start_dt)
    if end_dt:
        query = query.filter(Product.created_at <= end_dt)
    
    results = query.group_by(func.date(Product.created_at)).order_by(func.date(Product.created_at)).all()
    
    return {
        "data": [{"date": str(r.date), "value": float(r.stock_value or 0)} for r in results],
        "start_date": start_date,
        "end_date": end_date
    }


@router.get(
    "/new-customers/chart",
    status_code=status.HTTP_200_OK,
    summary="Get new customers chart data",
    description="Get new customers count grouped by day for the selected period"
)
async def get_new_customers_chart(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get new customers count grouped by day"""
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    # Pour les nouveaux clients, on filtre par les commandes associées
    query = db.query(
        func.date(Customer.first_order_date).label('date'),
        func.count(Customer.id).label('count')
    ).join(Order, Customer.id == Order.customer_id).filter(
        Customer.first_order_date.isnot(None),
        Order.status == 'completed'
    )
    
    if start_dt:
        query = query.filter(Customer.first_order_date >= start_dt)
    if end_dt:
        query = query.filter(Customer.first_order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    results = query.group_by(func.date(Customer.first_order_date)).order_by(func.date(Customer.first_order_date)).all()
    
    return {
        "data": [{"date": str(r.date), "value": r.count} for r in results],
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/deliveries/count",
    status_code=status.HTTP_200_OK,
    summary="Get deliveries count",
    description="Get the count of delivered orders within a date range"
)
async def get_deliveries_count(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Get the count of delivered orders (completed orders without returns).
    If no dates are provided, returns count of all delivered orders.
    """
    query = db.query(func.count(Order.id)).filter(
        Order.status == 'completed',
        Order.has_returns == False
    )
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    count = query.scalar() or 0
    
    return {
        "count": count,
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/revenue/total",
    status_code=status.HTTP_200_OK,
    summary="Get total revenue",
    description="Get the total revenue (CA) within a date range"
)
async def get_revenue_total(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get total revenue (CA) for completed orders"""
    query = db.query(func.sum(Order.total_ttc)).filter(Order.status == 'completed')
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    total = query.scalar() or 0
    
    return {
        "total": float(total),
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/net-margin/total",
    status_code=status.HTTP_200_OK,
    summary="Get total net margin",
    description="Get the total net margin within a date range"
)
async def get_net_margin_total(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    marketplace_id: Optional[int] = Query(None, description="Marketplace ID filter"),
    country_id: Optional[int] = Query(None, description="Country ID filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get total net margin for completed orders"""
    query = db.query(func.sum(OrderItem.calculated_net_margin)).join(
        Order, OrderItem.order_id == Order.id
    ).filter(Order.status == 'completed')
    
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    if start_dt:
        query = query.filter(Order.order_date >= start_dt)
    if end_dt:
        query = query.filter(Order.order_date <= end_dt)
    if marketplace_id:
        query = query.filter(Order.marketplace_id == marketplace_id)
    if country_id:
        query = query.filter(Order.country_id == country_id)
    
    total = query.scalar() or 0
    
    return {
        "total": float(total),
        "start_date": start_date,
        "end_date": end_date,
        "marketplace_id": marketplace_id,
        "country_id": country_id
    }


@router.get(
    "/stock-value/total",
    status_code=status.HTTP_200_OK,
    summary="Get total stock value",
    description="Get the total stock value (products not sold)"
)
async def get_stock_value_total(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """Get total stock value (products not sold, published and online)"""
    # Pour la valeur du stock, on prend tous les produits publiés et en ligne
    # qui n'ont pas été vendus (pas dans les order_items)
    query = db.query(func.sum(Product.selling_price_ttc)).filter(
        Product.status.in_(['published', 'draft']),
        Product.is_online == True
    )
    
    start_dt, end_dt = parse_date_range(start_date, end_date)
    
    # Si une période est spécifiée, on filtre par date de création
    if start_dt:
        query = query.filter(Product.created_at >= start_dt)
    if end_dt:
        query = query.filter(Product.created_at <= end_dt)
    
    total = query.scalar() or 0
    
    return {
        "total": float(total),
        "start_date": start_date,
        "end_date": end_date
    }


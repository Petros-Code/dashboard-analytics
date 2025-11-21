"""
API v1 router - Aggregates all v1 routes
"""
from fastapi import APIRouter
from app.api.v1.routes import user_routes, auth_routes, section_permission_routes, operational_cost_routes, role_routes, dashboard_routes

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth_routes.router)
api_router.include_router(user_routes.router)
api_router.include_router(role_routes.router)
api_router.include_router(section_permission_routes.router)
api_router.include_router(operational_cost_routes.router)
api_router.include_router(dashboard_routes.router)
"""
API v1 router - Aggregates all v1 routes
"""
from fastapi import APIRouter
from app.api.v1.routes import user_routes, auth_routes

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth_routes.router)
api_router.include_router(user_routes.router)


"""
API v1 router - Aggregates all v1 routes
"""
from fastapi import APIRouter
from app.api.v1.routes import user_routes

api_router = APIRouter()

# Include all route modules
api_router.include_router(user_routes.router)


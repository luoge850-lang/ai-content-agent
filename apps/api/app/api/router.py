"""Aggregate all v1 routers."""

from fastapi import APIRouter

from app.api.v1 import analytics, auth, contents, generate, knowledge, projects

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(contents.router)
api_router.include_router(generate.router)
api_router.include_router(analytics.router)
api_router.include_router(knowledge.router)

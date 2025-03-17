# api/init.py

from fastapi import APIRouter

from .ai_views import router as ai_router

router = APIRouter(prefix="/api")
router.include_router(ai_router)

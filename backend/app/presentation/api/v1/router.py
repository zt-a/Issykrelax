from __future__ import annotations

from fastapi import APIRouter

from app.presentation.api.v1.admin import router as admin_router
from app.presentation.api.v1.auth import router as auth_router
from app.presentation.api.v1.bookings import router as bookings_router
from app.presentation.api.v1.favorites import router as favorites_router
from app.presentation.api.v1.feedback import router as feedback_router
from app.presentation.api.v1.owner import router as owner_router
from app.presentation.api.v1.properties import router as properties_router
from app.presentation.api.v1.reviews import router as reviews_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(properties_router)
router.include_router(bookings_router)
router.include_router(owner_router)
router.include_router(admin_router)
router.include_router(favorites_router)
router.include_router(reviews_router)
router.include_router(feedback_router)

"""
Seou-up Microblading — FastAPI Entry Point
=========================================
An information and visualization support platform only.
Not a licensed medical or procedure provider.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.config import settings
from routers import (
    auth,
    simulations,
    eyebrow_styles,
    guides,
    providers,
    feedback,
    admin,
)

app = FastAPI(
    title="Seou-up Microblading API",
    version="1.0.0",
    description=(
        "Seou-up Microblading is an information and visualization support platform only. "
        "Not a licensed medical or procedure provider."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# In development, allow all localhost origins (any port) via regex
_dev_origin_regex = r"http://(localhost|127\.0\.0\.1)(:\d+)?"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS if settings.APP_ENV == "production" else [],
    allow_origin_regex=_dev_origin_regex if settings.APP_ENV != "production" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static Files ───────────────────────────────────────────────────────────────
import os

os.makedirs("storage/uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="storage/uploads"), name="uploads")

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["Simulations"])
app.include_router(
    eyebrow_styles.router, prefix="/api/eyebrow-styles", tags=["Eyebrow Styles"]
)
app.include_router(guides.router, prefix="/api/guides", tags=["Guides"])
app.include_router(providers.router, prefix="/api/providers", tags=["Providers"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health() -> dict:
    return {"status": "ok", "version": "1.0.0"}


@app.get("/", tags=["Root"])
async def root() -> dict:
    return {
        "message": "Seou-up Microblading API",
        "docs": "/docs",
        "health": "/health",
        "disclaimer": (
            "This platform is for visualization and information support only. "
            "Not a licensed medical or procedure provider."
        ),
    }

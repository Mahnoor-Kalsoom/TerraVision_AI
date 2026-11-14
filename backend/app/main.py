"""FloodVision AI — FastAPI application entry point."""
import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.dependencies.rate_limit import limiter
from app.api.routes import analyze, health, model_info
from app.core.config import get_settings
from app.core.exceptions import (
    FloodVisionError,
    flood_vision_error_handler,
    unhandled_error_handler,
)
from app.services.model_service import model_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan ─────────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Load the model on startup; unload on shutdown."""
    settings = get_settings()
    logger.info("Starting %s …", settings.app_name)
    model_service.load()
    yield
    model_service.unload()
    logger.info("%s shut down.", settings.app_name)


# ── Application factory ───────────────────────────────────────────────────────


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description=(
            "AI-powered flood detection platform using a U-Net segmentation model "
            "trained on the S1GFloods dataset."
        ),
        version=settings.model_version,
        lifespan=lifespan,
        # Never expose stack traces in error responses
        debug=False,
    )

    # ── Rate limiter state ────────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # ── CORS — explicit origin allowlist from environment ─────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        max_age=600,
    )

    # ── Exception handlers ────────────────────────────────────────────────────
    app.add_exception_handler(FloodVisionError, flood_vision_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_error_handler)  # type: ignore[arg-type]

    # ── Routers ───────────────────────────────────────────────────────────────
    PREFIX = "/api/v1"
    app.include_router(health.router, prefix=PREFIX)
    app.include_router(model_info.router, prefix=PREFIX)
    app.include_router(analyze.router, prefix=PREFIX)

    return app


app = create_app()

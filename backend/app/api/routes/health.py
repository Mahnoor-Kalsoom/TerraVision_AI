"""Health check endpoint."""
from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas.analysis import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["system"])
async def health_check() -> HealthResponse:
    """Returns service liveness — does not expose internal paths or model details."""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(tz=timezone.utc).isoformat(),
    )

"""Model information endpoint."""
from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.analysis import ModelInfoResponse
from app.services.model_service import model_service

router = APIRouter()


@router.get("/model-info", response_model=ModelInfoResponse, tags=["model"])
async def get_model_info() -> ModelInfoResponse:
    """Returns model metadata. Does not expose filesystem paths."""
    settings = get_settings()
    return ModelInfoResponse(
        model_version=model_service.model_version,
        input_shape=str(model_service.input_shape) if model_service.is_loaded else "(1, 256, 256, 6)",
        output_shape=str(model_service.output_shape) if model_service.is_loaded else "(1, 256, 256, 1)",
        threshold=settings.prediction_threshold,
        is_loaded=model_service.is_loaded,
    )

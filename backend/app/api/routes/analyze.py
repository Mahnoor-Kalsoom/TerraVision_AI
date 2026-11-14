"""Analyze endpoint — accepts image pair, runs U-Net inference, returns results."""
import logging

from fastapi import APIRouter, Request, UploadFile, File
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.dependencies.rate_limit import analyze_rate_limit, limiter
from app.core.security import validated_pil_image
from app.schemas.analysis import AnalysisResponse
from app.services.analysis_service import AnalysisService

logger = logging.getLogger(__name__)
router = APIRouter()

_analysis_service = AnalysisService()


@router.post("/analyze", response_model=AnalysisResponse, tags=["analysis"])
@limiter.limit(analyze_rate_limit)
async def analyze(
    request: Request,
    pre_flood_image: UploadFile = File(..., description="Pre-flood RGB satellite image"),
    post_flood_image: UploadFile = File(..., description="Post-flood RGB satellite image"),
) -> AnalysisResponse:
    """
    Accept a pair of satellite images, run the U-Net segmentation model,
    and return a binary flood mask with statistics.

    - Images are validated for content (not just extension/MIME).
    - Filenames from the client are never used for filesystem paths.
    - Temporary image data is held in memory only and not persisted.
    """
    # Security validation (magic bytes + PIL decode + size limit)
    pre_pil = await validated_pil_image(pre_flood_image)
    post_pil = await validated_pil_image(post_flood_image)

    # Run the full inference pipeline
    result = _analysis_service.run(pre_pil, post_pil)

    return result

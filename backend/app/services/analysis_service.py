"""AnalysisService — orchestrates the full flood detection inference pipeline."""
import base64
import io
import logging
import time
import uuid

import numpy as np
from PIL import Image

from app.core.config import get_settings
from app.schemas.analysis import AnalysisResponse
from app.services.image_service import ImageService
from app.services.model_service import model_service

logger = logging.getLogger(__name__)


def _numpy_mask_to_base64_png(mask_2d: np.ndarray) -> str:
    """Convert a 2D binary mask (values 0 or 1) to a base64-encoded PNG string."""
    png_array = (mask_2d * 255).astype(np.uint8)
    img = Image.fromarray(png_array, mode="L")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")


class AnalysisService:
    """Orchestrates image validation → preprocessing → inference → result encoding."""

    def __init__(self) -> None:
        self._image_service = ImageService()
        self._settings = get_settings()

    def run(self, pre_image: Image.Image, post_image: Image.Image) -> AnalysisResponse:
        """
        Execute the full flood analysis pipeline.

        Args:
            pre_image:  PIL Image of the pre-flood scene.
            post_image: PIL Image of the post-flood scene.

        Returns:
            AnalysisResponse with mask, statistics, and metadata.
        """
        analysis_id = str(uuid.uuid4())
        threshold = self._settings.prediction_threshold
        size = self._settings.input_size

        t_start = time.perf_counter()

        # Step 1-6: Preprocess and build model input (1, 256, 256, 6)
        model_input = self._image_service.arrays_to_model_input(pre_image, post_image)

        # Step 7: Confirm input shape
        assert model_input.shape == (1, size, size, 6), (
            f"Unexpected model input shape: {model_input.shape}"
        )

        # Step 8: Run inference
        raw_output = model_service.predict(model_input)  # (256, 256, 1)

        # Step 9: Confirm output shape
        assert raw_output.shape == (size, size, 1), (
            f"Unexpected model output shape: {raw_output.shape}"
        )

        # Step 10: Apply threshold → binary mask
        binary_mask = (raw_output[:, :, 0] >= threshold).astype(np.uint8)  # (256, 256)

        processing_time_ms = (time.perf_counter() - t_start) * 1000

        # Step 11: Encode mask as base64 PNG
        mask_b64 = _numpy_mask_to_base64_png(binary_mask)

        # Step 12: Compute pixel statistics
        total_pixels = size * size
        flood_pixels = int(binary_mask.sum())
        flood_percentage = round((flood_pixels / total_pixels) * 100, 2)

        logger.info(
            "Analysis %s complete — flood pixels: %d / %d (%.2f%%) in %.1fms",
            analysis_id,
            flood_pixels,
            total_pixels,
            flood_percentage,
            processing_time_ms,
        )

        return AnalysisResponse(
            analysis_id=analysis_id,
            mask_b64=mask_b64,
            width=size,
            height=size,
            flood_pixels=flood_pixels,
            total_pixels=total_pixels,
            flood_percentage=flood_percentage,
            threshold=threshold,
            processing_time_ms=round(processing_time_ms, 1),
            model_version=model_service.model_version,
        )

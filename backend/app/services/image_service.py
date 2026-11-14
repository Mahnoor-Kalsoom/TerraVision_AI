"""ImageService — secure preprocessing of uploaded satellite images for U-Net inference."""
import logging

import numpy as np
from PIL import Image

from app.core.config import get_settings
from app.core.exceptions import InvalidImageError

logger = logging.getLogger(__name__)


class ImageService:
    """Handles all image preprocessing logic for the inference pipeline."""

    def __init__(self) -> None:
        self._settings = get_settings()
        self._size = self._settings.input_size  # 256

    # ── Public API ───────────────────────────────────────────────────────────────

    def preprocess(self, pil_image: Image.Image) -> np.ndarray:
        """
        Convert a PIL Image to a normalised float32 numpy array of shape (256, 256, 3).

        Steps:
          1. Convert to RGB (drops alpha, handles grayscale/palette modes)
          2. Resize to 256 × 256 using LANCZOS filter
          3. Normalise pixels to [0.0, 1.0] as float32
        """
        try:
            img_rgb = pil_image.convert("RGB")
        except Exception as exc:
            raise InvalidImageError("Image could not be converted to RGB.") from exc

        img_resized = img_rgb.resize(
            (self._size, self._size), resample=Image.Resampling.LANCZOS
        )
        arr = np.array(img_resized, dtype=np.float32) / 255.0  # (256, 256, 3)

        if arr.shape != (self._size, self._size, 3):
            raise InvalidImageError(
                f"Unexpected array shape after preprocessing: {arr.shape}"
            )

        return arr

    def build_model_input(
        self, pre_array: np.ndarray, post_array: np.ndarray
    ) -> np.ndarray:
        """
        Concatenate pre-flood and post-flood arrays along the channel axis.

        Args:
            pre_array:  (256, 256, 3) float32
            post_array: (256, 256, 3) float32

        Returns:
            (1, 256, 256, 6) float32 — batch-ready model input
        """
        combined = np.concatenate([pre_array, post_array], axis=-1)  # (256, 256, 6)
        batched = np.expand_dims(combined, axis=0)  # (1, 256, 256, 6)

        logger.debug("Model input shape: %s  dtype: %s", batched.shape, batched.dtype)
        return batched

    def arrays_to_model_input(
        self, pre_image: Image.Image, post_image: Image.Image
    ) -> np.ndarray:
        """Full pipeline: preprocess both images and build the model input tensor."""
        pre_arr = self.preprocess(pre_image)
        post_arr = self.preprocess(post_image)
        return self.build_model_input(pre_arr, post_arr)

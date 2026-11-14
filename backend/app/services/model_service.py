"""ModelService — loads the U-Net model once at startup and wraps thread-safe inference."""
import logging
import threading
import time
from pathlib import Path

import numpy as np

from app.core.config import get_settings
from app.core.exceptions import InferenceError, ModelNotLoadedError

logger = logging.getLogger(__name__)


class ModelService:
    """Singleton service managing U-Net model lifecycle and inference."""

    def __init__(self) -> None:
        self._model = None
        self._lock = threading.Lock()
        self._version = get_settings().model_version

    # ── Lifecycle ────────────────────────────────────────────────────────────────

    def load(self) -> None:
        """Load the Keras model from disk. Called once during application startup."""
        import tensorflow as tf  # lazy import keeps startup clean if TF is slow

        settings = get_settings()
        model_path = Path(settings.model_path)

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at '{model_path}'. "
                "Ensure 'backend/models/flood_unet_final.keras' exists."
            )

        logger.info("Loading U-Net model from %s ...", model_path)
        t0 = time.perf_counter()

        # TF 2.20+ bundles Keras 3; prefer keras.saving.load_model for .keras format.
        # Falls back to tf.keras for older environments.
        try:
            import keras  # type: ignore[import]
            self._model = keras.saving.load_model(str(model_path), compile=False)
            logger.info("Loaded via keras.saving.load_model (Keras 3)")
        except Exception as e:
            logger.warning("keras.saving.load_model failed (%s), falling back to tf.keras", e)
            self._model = tf.keras.models.load_model(str(model_path), compile=False)

        elapsed = time.perf_counter() - t0
        logger.info("Model loaded in %.2fs -- input shape: %s", elapsed, self._model.input_shape)

    def unload(self) -> None:
        """Release model resources on shutdown."""
        with self._lock:
            self._model = None
        logger.info("Model unloaded.")

    # ── Inference ────────────────────────────────────────────────────────────────

    def predict(self, input_array: np.ndarray) -> np.ndarray:
        """
        Run inference on a preprocessed input array.

        Args:
            input_array: Shape (1, 256, 256, 6), float32, values in [0, 1].

        Returns:
            Raw probability map -- shape (256, 256, 1), float32.
        """
        if self._model is None:
            raise ModelNotLoadedError()

        expected_shape = (1, 256, 256, 6)
        if input_array.shape != expected_shape:
            raise ValueError(
                f"Expected input shape {expected_shape}, got {input_array.shape}."
            )

        try:
            with self._lock:
                raw = self._model(input_array, training=False)
            # Convert from Tensor -> ndarray and squeeze batch dim
            result: np.ndarray = np.array(raw[0])  # shape (256, 256, 1)
            return result
        except Exception as exc:
            logger.error("Inference failed: %s", exc, exc_info=True)
            raise InferenceError() from exc

    # ── Properties ───────────────────────────────────────────────────────────────

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    @property
    def model_version(self) -> str:
        return self._version

    @property
    def input_shape(self) -> tuple:
        if self._model is None:
            return ()
        return tuple(self._model.input_shape)

    @property
    def output_shape(self) -> tuple:
        if self._model is None:
            return ()
        return tuple(self._model.output_shape)


# Module-level singleton -- shared across request handlers
model_service = ModelService()

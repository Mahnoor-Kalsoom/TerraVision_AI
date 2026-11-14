"""Custom exception hierarchy for FloodVision AI."""
from fastapi import Request, status
from fastapi.responses import JSONResponse


class FloodVisionError(Exception):
    """Base application exception."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ModelNotLoadedError(FloodVisionError):
    """Raised when the model is not available."""

    def __init__(self) -> None:
        super().__init__(
            "Model is not available. Please try again later.", status_code=503
        )


class InvalidImageError(FloodVisionError):
    """Raised for malformed, unsupported, or suspicious images."""

    def __init__(self, detail: str = "Invalid image file.") -> None:
        super().__init__(detail, status_code=400)


class ImageTooLargeError(FloodVisionError):
    """Raised when an uploaded image exceeds the size limit."""

    def __init__(self, max_bytes: int) -> None:
        max_mb = max_bytes / (1024 * 1024)
        super().__init__(
            f"Image exceeds maximum allowed size of {max_mb:.0f} MB.",
            status_code=413,
        )


class InferenceError(FloodVisionError):
    """Raised when the model inference fails."""

    def __init__(self) -> None:
        super().__init__(
            "An error occurred during analysis. Please try again.", status_code=500
        )


# ────────────────────────── FastAPI exception handlers ──────────────────────────


async def flood_vision_error_handler(
    _request: Request, exc: FloodVisionError
) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message},
    )


async def unhandled_error_handler(
    _request: Request, _exc: Exception
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "An unexpected error occurred."},
    )

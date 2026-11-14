"""Pydantic schemas for analysis request/response."""
from pydantic import BaseModel, Field


class AnalysisResponse(BaseModel):
    """Structured response from the /analyze endpoint."""

    analysis_id: str = Field(..., description="Unique identifier for this analysis run.")
    mask_b64: str = Field(..., description="Base64-encoded PNG of the binary flood mask.")
    width: int = Field(..., description="Output mask width in pixels.")
    height: int = Field(..., description="Output mask height in pixels.")
    flood_pixels: int = Field(..., ge=0, description="Number of pixels classified as flooded.")
    total_pixels: int = Field(..., gt=0, description="Total pixel count of the mask.")
    flood_percentage: float = Field(
        ..., ge=0.0, le=100.0, description="Percentage of pixels classified as flooded."
    )
    threshold: float = Field(..., description="Binary classification threshold applied.")
    processing_time_ms: float = Field(..., description="End-to-end processing time in milliseconds.")
    model_version: str = Field(..., description="Version string of the loaded model.")


class HealthResponse(BaseModel):
    status: str
    timestamp: str


class ModelInfoResponse(BaseModel):
    model_version: str
    input_shape: str
    output_shape: str
    threshold: float
    is_loaded: bool

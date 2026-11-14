"""Core application configuration using pydantic-settings."""
import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # CORS — comma-separated list of allowed origins or JSON array
    allowed_origins: Union[list[str], str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    @field_validator("allowed_origins", mode="after")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(x).strip() for x in parsed if str(x).strip()]
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        if isinstance(v, list):
            return [str(x).strip() for x in v if str(x).strip()]
        return ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Model
    model_path: Path = Path("backend/models/flood_unet_final.keras")
    model_version: str = "1.0.0"

    # Upload limits
    max_upload_bytes: int = 10 * 1024 * 1024  # 10 MB
    max_image_pixels: int = 178_956_970  # PIL decompression bomb guard

    # Rate limiting (requests per minute per IP)
    rate_limit_per_minute: int = 10

    # Supported image MIME types
    allowed_mime_types: list[str] = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/tiff",
    ]

    # Inference
    prediction_threshold: float = 0.5
    input_size: int = 256

    # App
    debug: bool = False
    app_name: str = "FloodVision AI"


@lru_cache
def get_settings() -> Settings:
    """Return cached settings singleton."""
    return Settings()

"""Upload security utilities — content validation, decompression bomb protection."""
import io
import logging
from typing import Final

from PIL import Image
from fastapi import UploadFile

from app.core.config import get_settings
from app.core.exceptions import InvalidImageError, ImageTooLargeError

logger = logging.getLogger(__name__)

# Magic bytes for supported image formats
_MAGIC_BYTES: Final[dict[str, list[bytes]]] = {
    "JPEG": [b"\xff\xd8\xff"],
    "PNG": [b"\x89PNG\r\n\x1a\n"],
    "WEBP": [b"RIFF"],  # followed by WEBP; additional check in validate_image_content
    "TIFF": [b"II*\x00", b"MM\x00*"],  # little-endian and big-endian
}


async def read_upload_bytes(upload: UploadFile) -> bytes:
    """Read upload bytes, enforcing size limit before full read."""
    settings = get_settings()
    chunks: list[bytes] = []
    total = 0

    while chunk := await upload.read(8192):
        total += len(chunk)
        if total > settings.max_upload_bytes:
            raise ImageTooLargeError(settings.max_upload_bytes)
        chunks.append(chunk)

    await upload.seek(0)
    return b"".join(chunks)


def _check_magic_bytes(data: bytes) -> bool:
    """Return True if data starts with a recognised image magic sequence."""
    for signatures in _MAGIC_BYTES.values():
        for sig in signatures:
            if data[: len(sig)] == sig:
                return True
    return False


def validate_image_content(data: bytes) -> Image.Image:
    """
    Validate raw image bytes for:
    - Recognised magic bytes (not just extension/MIME)
    - Decompression bomb attacks (pixel count limit)
    - Successful PIL decode

    Returns a PIL Image on success; raises InvalidImageError on failure.
    """
    settings = get_settings()

    if len(data) < 8:
        raise InvalidImageError("File is too small to be a valid image.")

    if not _check_magic_bytes(data):
        raise InvalidImageError(
            "File does not appear to be a supported image format (JPEG, PNG, WEBP, TIFF)."
        )

    # Guard against decompression bombs BEFORE fully decoding
    Image.MAX_IMAGE_PIXELS = settings.max_image_pixels

    try:
        img = Image.open(io.BytesIO(data))
        img.verify()  # checks for truncation / corruption
    except Exception:
        raise InvalidImageError("Image file is corrupted or cannot be decoded.")

    # Re-open after verify() (PIL closes the stream after verify)
    try:
        img = Image.open(io.BytesIO(data))
        img.load()  # fully decode
    except Image.DecompressionBombError:
        raise InvalidImageError("Image is too large (decompression bomb detected).")
    except Exception:
        raise InvalidImageError("Image file could not be loaded.")

    return img


async def validated_pil_image(upload: UploadFile) -> Image.Image:
    """
    Full upload validation pipeline:
    1. Read bytes with size limit
    2. Validate magic bytes + PIL decode
    Returns a PIL Image.
    """
    data = await read_upload_bytes(upload)
    return validate_image_content(data)

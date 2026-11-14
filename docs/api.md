# API Reference — FloodVision AI

## Base URL

```
http://localhost:8000
```

---

## Endpoints

### GET /api/v1/health

Returns the current health status of the API and model loading state.

**Response 200**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

### GET /api/v1/model-info

Returns metadata about the loaded segmentation model.

**Response 200**
```json
{
  "model_version": "1.0.0",
  "input_shape": [null, 256, 256, 6],
  "output_shape": [null, 256, 256, 1],
  "threshold": 0.5
}
```

---

### POST /api/v1/analyze

Runs flood segmentation inference on a pre-flood / post-flood satellite image pair.

**Request** — `Content-Type: multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `pre_flood_image` | `File` | ✅ | Pre-flood satellite image |
| `post_flood_image` | `File` | ✅ | Post-flood satellite image |

**Accepted formats**: JPEG, PNG, WEBP, TIFF  
**Max size per file**: 10 MB (configurable)  
**Rate limit**: 10 requests / minute per IP

**Response 200**
```json
{
  "analysis_id": "3f7a1c2d-8e4b-4f9d-a0b1-c2d3e4f5a6b7",
  "mask_b64": "<base64-encoded PNG string>",
  "width": 256,
  "height": 256,
  "flood_pixels": 12483,
  "total_pixels": 65536,
  "flood_percentage": 19.05,
  "threshold": 0.5,
  "processing_time_ms": 1245.3,
  "model_version": "1.0.0"
}
```

**Error Responses**

| Status | Condition |
|---|---|
| `400` | Invalid file type, file too large, or invalid image content |
| `422` | Missing required form fields |
| `429` | Rate limit exceeded |
| `503` | Model not loaded |
| `500` | Unexpected server error |

**Error body format**:
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

---

## Mask Decoding

The `mask_b64` field is a standard base64-encoded PNG image:
- **Dimensions**: 256 × 256 pixels
- **Mode**: Grayscale (L)
- **White pixels (255)**: Flooded region (probability ≥ threshold)
- **Black pixels (0)**: Non-flooded region

**JavaScript decode example**:
```js
const img = new Image();
img.src = `data:image/png;base64,${result.mask_b64}`;
```

**Python decode example**:
```python
import base64
from PIL import Image
from io import BytesIO

mask_bytes = base64.b64decode(result["mask_b64"])
mask_image = Image.open(BytesIO(mask_bytes))
```

# Architecture — FloodVision AI

## System Overview

```
Browser (Next.js)
    │  multipart/form-data (pre + post images)
    ▼
FastAPI Backend
    │
    ├── Security validation (magic bytes, size, decompression bomb)
    │
    ├── ImageService
    │   ├── Convert both images to RGB
    │   ├── Resize to 256×256
    │   ├── Normalize to [0, 1]
    │   └── Concatenate channels → (1, 256, 256, 6)
    │
    ├── ModelService (singleton, loaded at startup)
    │   └── U-Net inference → (1, 256, 256, 1) sigmoid output
    │
    └── AnalysisService
        ├── Apply threshold → binary mask
        ├── Compute statistics (flood pixels, percentage)
        ├── Encode mask as base64 PNG
        └── Return AnalysisResponse JSON
```

## Model Pipeline

| Step | Detail |
|---|---|
| **Input** | 2 × RGB images → concatenated to 6-channel tensor `(1, 256, 256, 6)` |
| **Normalization** | Pixel values scaled to `[0.0, 1.0]` |
| **Inference** | U-Net forward pass, sigmoid output `(1, 256, 256, 1)` |
| **Thresholding** | Probabilities ≥ 0.5 → 1 (flooded), < 0.5 → 0 |
| **Output** | 256×256 grayscale PNG, base64-encoded |

## Frontend Architecture

The frontend follows a **feature-first** structure under `src/features/`:

```
flood-analysis/
├── types/        # TypeScript interfaces (AnalysisResult, etc.)
├── schemas/      # Zod validation schemas
├── services/     # API client (fetch wrapper)
├── hooks/        # useFloodAnalysis — state machine
└── components/   # UI: AnalysisForm, ResultsDashboard, overlays
```

The `useFloodAnalysis` hook acts as a state machine:

```
idle → loading → success
                ↘ error
```

Object URLs for image previews are revoked on unmount and reset to prevent memory leaks.

## Security Layers

1. **Client-side**: Zod schema validates file type and size before submission
2. **Server-side magic bytes**: PIL verifies actual file content, not just extension
3. **Decompression bomb guard**: PIL pixel count limit prevents memory exhaustion
4. **Rate limiting**: 10 req/min per IP via slowapi
5. **CORS**: Configurable allowed origins

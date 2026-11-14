# FloodVision AI

> **Research & Educational Tool** — AI-powered satellite flood detection using a pre-trained U-Net segmentation model.

![FloodVision AI](https://img.shields.io/badge/FloodVision%20AI-v1.0-00d4be?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.19-FF6F00?style=flat-square&logo=tensorflow)

---

## Overview

FloodVision AI is a full-stack web application that uses a pre-trained U-Net deep learning model to detect flooded regions in satellite imagery. Upload a **pre-flood** and **post-flood** satellite image pair and get back a pixel-level binary segmentation mask showing flooded areas.

> ⚠️ **Disclaimer**: This tool is for research and educational purposes only. It must not be used as the sole basis for emergency response, evacuation, or infrastructure decisions.

---

## Architecture

```
TerraVision_AI/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/       # /health, /model-info, /analyze
│   │   │   └── dependencies/ # Rate limiting
│   │   ├── core/             # Config, exceptions, security
│   │   ├── schemas/          # Pydantic request/response models
│   │   └── services/         # ModelService, ImageService, AnalysisService
│   ├── models/               # Pre-trained model binary
│   └── requirements.txt
│
├── frontend/                 # Next.js 16 App Router frontend
│   └── src/
│       ├── app/              # Root layout, landing page, /analyze route
│       ├── components/       # Shared UI (Navbar, Footer, landing sections)
│       ├── features/
│       │   └── flood-analysis/
│       │       ├── components/  # AnalysisForm, ResultsDashboard, overlays
│       │       ├── hooks/       # useFloodAnalysis
│       │       ├── schemas/     # Zod upload validation
│       │       ├── services/    # API client
│       │       └── types/       # TypeScript interfaces
│       └── lib/              # utils.ts, constants.ts
│
└── docs/                     # API and architecture documentation
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **AI Model** | TensorFlow/Keras U-Net, trained on S1GFloods dataset |
| **Backend** | FastAPI + Python 3.11, pydantic-settings, slowapi |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Validation** | Zod (client), Pydantic v2 (server) |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- The model file at `backend/models/flood_unet_final.keras`

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy ..\.env.example .env
# Edit .env as needed

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The UI will be available at `http://localhost:3000`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/model-info` | Model metadata and input shape |
| `POST` | `/api/v1/analyze` | Run flood segmentation inference |

### POST `/api/v1/analyze`

**Request** — `multipart/form-data`:
- `pre_flood_image` — Pre-flood satellite image (JPEG/PNG/WEBP/TIFF, ≤ 10 MB)
- `post_flood_image` — Post-flood satellite image (JPEG/PNG/WEBP/TIFF, ≤ 10 MB)

**Response** — `application/json`:
```json
{
  "analysis_id": "uuid",
  "mask_b64": "<base64-encoded PNG>",
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

**Rate limit**: 10 requests / minute per IP.

---

## Model Details

| Property | Value |
|---|---|
| Architecture | U-Net (encoder-decoder with skip connections) |
| Input | Two 256×256 RGB images (pre + post flood), 6 channels |
| Output | 256×256 binary segmentation mask |
| Training Dataset | S1GFloods (Sentinel-1 SAR + Sentinel-2 optical) |
| Binary Threshold | 0.5 (configurable via `FLOOD_THRESHOLD` env var) |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MODEL_PATH` | `backend/models/flood_unet_final.keras` | Path to model file |
| `FLOOD_THRESHOLD` | `0.5` | Binary classification threshold |
| `MAX_UPLOAD_SIZE_MB` | `10` | Max upload size in MB |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
| `RATE_LIMIT` | `10/minute` | API rate limit |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend URL for frontend |

---

## Security

- **Magic byte verification** — MIME type validated against actual file bytes
- **Decompression bomb protection** — PIL image pixel limit enforced
- **File size enforcement** — Configurable max upload size
- **Rate limiting** — Per-IP request throttling via slowapi
- **CORS** — Configurable allowed origins

---

## License

For research and educational use only. See [LICENSE](LICENSE).

# TerraVision AI

> **NASA Earth Observation & Disaster Intelligence Tool** — Satellite flood detection using dual-temporal Sentinel-1 SAR and deep U-Net segmentation.

![TerraVision AI](https://img.shields.io/badge/TerraVision%20AI-v1.0-00d4be?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-FF6F00?style=flat-square&logo=tensorflow)

---

## Overview

TerraVision AI is a geospatial deep learning platform designed to map surface water inundation from satellite observations. By comparing multi-temporal **pre-event** and **post-event** Sentinel-1 Synthetic Aperture Radar (SAR) tiles, the system fuses 6-band optical/SAR tensors into an encoder-decoder U-Net architecture to produce calibrated pixel-level flood extent masks and impact metrics in under two seconds.

> ⚠️ **Notice**: Developed for research, competition evaluation, and educational flood assessment. Operational deployments should corroborate automated segmentation outputs with ground-truth hydrological sensors and emergency response teams.

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
│   ├── models/               # U-Net model binary (flood_unet_final.keras)
│   └── requirements.txt
│
├── frontend/                 # Next.js 16 App Router frontend
│   └── src/
│       ├── app/              # Root layout, landing page, /analyze route
│       ├── components/       # UI (Navbar, Footer, LandingHero, Methodology)
│       ├── features/
│       │   └── flood-analysis/
│       │       ├── components/  # AnalysisForm, ResultsDashboard, overlays
│       │       ├── hooks/       # useFloodAnalysis
│       │       ├── schemas/     # Zod validation
│       │       ├── services/    # API client
│       │       └── types/       # TypeScript interfaces
│       └── lib/              # utils.ts, constants.ts
│
├── samples/                  # Real Sentinel-1 satellite flood evaluation pairs
└── docs/                     # API and architecture specifications
```

---

## Model Benchmark & Empirical Metrics

Evaluated on the **S1GFloods** benchmark test split:

| Evaluation Metric | Measured Score | Description |
|---|---|---|
| **Flood IoU (Jaccard Index)** | `0.9249` | Spatial overlap on flooded surface water |
| **Detection Precision** | `0.9582` | Low false positive rate across complex terrain |
| **Recall Sensitivity** | `0.9637` | Captures 96.3%+ of actual inundated water bodies |
| **Input Shape** | `(1, 256, 256, 6)` | Multi-temporal 6-band tensor (Pre + Post RGB) |
| **Output Shape** | `(1, 256, 256, 1)` | Calibrated binary probability mask |
| **Sigmoid Threshold** | `0.5000` | Optimal F1-score classification cutoff |

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 20+
- Pre-trained U-Net binary at `backend/models/flood_unet_final.keras`

### 1. Backend Service

```bash
cd backend

# Activate virtual environment
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

- API Server: `http://localhost:8000`  
- Interactive OpenAPI Docs: `http://localhost:8000/docs`  
- Health Probe: `http://localhost:8000/api/v1/health`

### 2. Frontend Application

```bash
cd frontend

# Install packages
npm install

# Start Next.js development server
npm run dev
```

- Web Interface: `http://localhost:3000`
- Analysis Tool: `http://localhost:3000/analyze`

---

## API Reference

### `POST /api/v1/analyze`

**Request** (`multipart/form-data`):
- `pre_flood_image` — Pre-flood satellite tile (JPEG/PNG/WEBP/TIFF, $\le$ 10 MB)
- `post_flood_image` — Post-flood satellite tile (JPEG/PNG/WEBP/TIFF, $\le$ 10 MB)

**Response** (`application/json`):
```json
{
  "analysis_id": "22a26b91-7ee8-4248-91fd-d028b7a901b6",
  "mask_b64": "iVBORw0KGgoAAAANSUhEUgAAAQAAAA...",
  "width": 256,
  "height": 256,
  "flood_pixels": 4493,
  "total_pixels": 65536,
  "flood_percentage": 6.86,
  "threshold": 0.5,
  "processing_time_ms": 2113.1,
  "model_version": "1.0.0"
}
```

---

## Security & Reliability Controls

- **Magic-Byte MIME Verification**: Enforces binary image headers to prevent arbitrary file execution.
- **Decompression Bomb Guard**: Enforces strict pixel dimension ceilings to prevent memory exhaustion attacks.
- **Dynamic Thread Lock**: Wraps neural inference in a synchronized lock for safe multi-request handling.
- **Per-IP Rate Throttling**: SlowAPI limiter protects the inference pipeline against automated scraping.

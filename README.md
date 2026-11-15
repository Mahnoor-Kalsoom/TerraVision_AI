<div align="center">

# 🛰️ TerraVision AI

### Dual-Temporal Satellite Flood Inundation Intelligence
**A NASA Earth Observation & Environmental Risk Assessment Platform**

[![NASA Earth Observation](https://img.shields.io/badge/NASA-Earth%20Observation-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.nasa.gov/)
[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Turbopack-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Async%20Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow / Keras 3](https://img.shields.io/badge/TensorFlow-Keras%203-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://keras.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-the-minds-behind-terravision-ai">The Team</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-empirical-benchmarks">Benchmarks</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-specification">API Docs</a> •
  <a href="#-deployment-guide-vercel--docker">Deployment</a>
</p>

---

</div>

## 🌐 Overview

**TerraVision AI** is an advanced Earth Observation deep learning platform engineered to delineate and quantify surface water inundation from satellite radar passes. 

By analyzing multi-temporal Sentinel-1 C-band Synthetic Aperture Radar (SAR) and optical imagery acquired before and after major meteorological disasters, the platform ingests spatially registered 6-channel optical/SAR tensors `(1, 256, 256, 6)`. These are passed through a symmetric encoder-decoder **U-Net** deep convolutional network that generates calibrated pixel-level binary inundation masks and spatial coverage analytics in under two seconds.

Smooth open floodwater acts as a specular reflector that scatters radar microwave pulses away from the Sentinel-1 sensor, appearing as distinctive dark patches. TerraVision AI isolates these specular hydrological variations from permanent topography, vegetation, and speckle noise, providing emergency managers and geospatial analysts with actionable flood extent data.

---

## 👥 The Minds Behind TerraVision AI

TerraVision AI is the collaborative achievement of an interdisciplinary engineering and research partnership:

<div align="center">

| <img src="https://github.com/identicons/i-am-gk.png" width="100" height="100" style="border-radius:50%" /><br>**Ghani Abdul Rehman Khan** | <img src="https://github.com/identicons/Mahnoor-Kalsoom.png" width="100" height="100" style="border-radius:50%" /><br>**Mahnoor Kalsoom** |
|:---:|:---:|
| **Lead Software Engineer & Deep Learning Systems Architect** | **Computer Vision & Remote Sensing AI Research Engineer** |
| *Systems & Infrastructure Lead* | *Model Research & Training Lead* |

</div>

### Detailed Engineering Contributions

#### 🔹 Ghani Abdul Rehman Khan
*Lead Software Engineer & Deep Learning Systems Architect*
- **Full-Stack Application Architecture**: Engineered the modern Next.js 16 (React 19, TypeScript) client application with custom NASA-inspired design tokens, Turbopack bundling, and responsive mobile-first views.
- **Asynchronous ML Inference Serving**: Architected high-throughput FastAPI endpoints in Python with synchronized thread-safe execution locks to manage non-blocking model evaluation.
- **6-Channel Tensor Fusion Pipeline**: Built the client and server data processing pipelines that perform LANCZOS high-order spatial normalization and channel-wise stacking `(1, 256, 256, 6)`.
- **System Hardening & Security**: Implemented binary magic-byte MIME validation, PIL decompression bomb countermeasures, per-IP rate limiting via SlowAPI, and dynamic CORS security policies.

#### 🔹 Mahnoor Kalsoom
*Computer Vision & Remote Sensing AI Research Engineer*
- **Convolutional Neural Network Design**: Formulated and trained the symmetric encoder-decoder U-Net architecture with multi-scale skip connections to preserve high-frequency geographic boundaries.
- **Sentinel-1 SAR Telemetry Research**: Curated and preprocessed multi-temporal Earth Observation datasets from the **S1GFloods** benchmark, pairing pre-event baselines with post-event flood captures.
- **Loss Function & Hyperparameter Convergence**: Formulated a hybrid loss function combining Dice Loss and Weighted Binary Cross-Entropy (BCE) to tackle extreme class imbalances in sparse flood zones.
- **Empirical Validation**: Conducted comprehensive model evaluation, achieving **0.9249 IoU**, **0.9582 Precision**, and **0.9637 Recall** across diverse global flood topographies.

---

## ⚡ Key Features

- **Multi-Temporal Satellite Telemetry Fusion**: Stacks 3-band Pre-Flood and 3-band Post-Flood satellite rasters into a unified 6-band spatial tensor `(1, 256, 256, 6)`.
- **Skip-Connection U-Net Backbone**: Encoder layers capture deep contextual geographic features while symmetric decoder skip connections preserve narrow river bends and fine coastline edges.
- **Sub-Second Inference Serving**: Generates full 256×256 binary segmentation masks in $< 2000\text{ ms}$ on standard CPUs.
- **Interactive Composite Alpha Overlays**: Browser-based HTML5 canvas overlay dynamically blends post-flood optical/SAR imagery with the segmented flood mask with real-time adjustable opacity.
- **1-Click Sentinel-1 Benchmark Datasets**: Includes pre-loaded, validated real Sentinel-1 test scenes representing river overflows (~6.9% flood), regional overland flooding (~24.7% flood), and extreme inundation (~86.2% flood).
- **Hardened Production Gateway**: Protected by magic-byte file inspection, memory decompression bomb bounds, and per-IP rate limiting.

---

## 📊 Empirical Benchmarks

The model was trained and rigorously evaluated on the **S1GFloods** benchmark dataset (Sentinel-1 SAR dual-polarization and optical fusion):

| Metric | Measured Score | Evaluation Significance |
|---|---|---|
| **Flood IoU (Jaccard Index)** | `0.9249` | High intersection-over-union across complex inundated land cover |
| **Positive Detection Precision** | `0.9582` | Suppresses false alarms from shadows, moist soil, and dark asphalt |
| **True Positive Recall (Sensitivity)** | `0.9637` | Successfully captures 96.3%+ of all actual inundated water bodies |
| **Input Tensor Shape** | `(1, 256, 256, 6)` | Batch size $\times$ Height $\times$ Width $\times$ Multi-temporal channels |
| **Output Mask Shape** | `(1, 256, 256, 1)` | Calibrated single-channel binary flood probability mask |
| **Sigmoid Decision Threshold** | `0.5000` | Statistically calibrated threshold balancing precision and recall |

---

## 📁 System Architecture

```text
TerraVision_AI/
├── backend/                       # High-performance FastAPI ML inference server
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/            # Endpoints: /health, /model-info, /analyze
│   │   │   └── dependencies/      # Rate limiting and request throttling
│   │   ├── core/                  # Application configuration, exceptions, security
│   │   ├── schemas/               # Strict Pydantic v2 request/response models
│   │   └── services/              # ModelService, ImageService, AnalysisService
│   ├── models/                    # Model training artifacts and configuration
│   │   ├── TerraVision_AI.ipynb   # Complete training, evaluation & loss notebook
│   │   ├── flood_unet_final.keras # Pre-trained U-Net weights binary
│   │   ├── config.json            # Model layer configuration
│   │   └── metadata.json          # Keras 3 runtime metadata
│   ├── requirements.txt           # Python backend dependencies
│   └── tests/                     # Automated test suites
│
├── frontend/                      # Modern Next.js 16 Web Application
│   ├── public/
│   │   └── samples/               # Validated Sentinel-1 satellite test pairs
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Interactive landing page & demo
│   │   │   ├── analyze/           # Live satellite flood analysis tool
│   │   │   ├── team/              # Dedicated engineering team showcase
│   │   │   ├── layout.tsx         # Dark NASA EO root layout
│   │   │   └── globals.css        # Tailwind v4 theme design tokens
│   │   ├── components/            # Reusable UI & layout modules (Navbar, Footer)
│   │   ├── features/flood-analysis/
│   │   │   ├── components/        # AnalysisForm, ResultsDashboard, Overlays
│   │   │   ├── hooks/             # useFloodAnalysis state controller
│   │   │   ├── schemas/           # Client-side Zod validation
│   │   │   └── services/          # Typed API client
│   │   └── lib/                   # Utility helpers and constants
│   ├── package.json               # Node.js dependencies
│   ├── postcss.config.mjs         # Tailwind v4 PostCSS pipeline
│   └── tsconfig.json              # Strict TypeScript configuration
│
├── samples/                       # Offline evaluation imagery (Pair 1, 2, 3)
├── docs/                          # Architecture specifications & API references
├── .env.example                   # Environment configuration template
└── .gitignore                     # Git tracking and binary exclusion rules
```

---

## 🚀 Quick Start

### Prerequisites
- **Python**: 3.10 or 3.11
- **Node.js**: 20.x or higher (with npm)
- **Model Binary**: `backend/models/flood_unet_final.keras`

---

### 1. Backend Setup (FastAPI & TensorFlow)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux / macOS:
# source .venv/bin/activate

# Install required Python dependencies
pip install -r requirements.txt

# Configure environment variables
copy ..\.env.example .env     # Windows
# cp ../.env.example .env      # Linux/Mac

# Launch the FastAPI inference server
uvicorn app.main:app --reload --port 8000
```

- **Live Server**: `http://localhost:8000`
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **Redoc Documentation**: `http://localhost:8000/redoc`
- **Health Check Probe**: `http://localhost:8000/api/v1/health`

---

### 2. Frontend Setup (Next.js 16 & Turbopack)

In a separate terminal:

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Launch Next.js development server
npm run dev
```

- **Web Portal**: `http://localhost:3000`
- **Flood Analysis Engine**: `http://localhost:3000/analyze`
- **Engineering Team**: `http://localhost:3000/team`

---

## 📡 API Specification

### `POST /api/v1/analyze`
Submits a paired multi-temporal satellite scene for neural flood segmentation.

#### Request (`multipart/form-data`)
| Parameter | Type | Format | Restrictions |
|---|---|---|---|
| `pre_flood_image` | File | Binary | JPEG, PNG, WEBP, TIFF ($\le 10\text{ MB}$) |
| `post_flood_image` | File | Binary | JPEG, PNG, WEBP, TIFF ($\le 10\text{ MB}$) |

#### Response (`application/json`)
```json
{
  "analysis_id": "3859cebb-800d-4024-8957-9e72bb1ddcec",
  "mask_b64": "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhm...",
  "width": 256,
  "height": 256,
  "flood_pixels": 4493,
  "total_pixels": 65536,
  "flood_percentage": 6.86,
  "threshold": 0.5,
  "processing_time_ms": 1845.2,
  "model_version": "1.0.0"
}
```

---

## ☁️ Deployment Guide (Vercel & Docker)

### Frontend Deployment on Vercel

The frontend is built using Next.js 16 and is pre-configured for direct Vercel deployment with zero folder restructuring:

1. **Push your repository** to GitHub:
   ```bash
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"** $\rightarrow$ **"Import Git Repository"**.
3. Select `Mahnoor-Kalsoom/TerraVision_AI`.
4. In the **"Configure Project"** screen:
   - Find the **Root Directory** setting.
   - Click **Edit** and set it to: `frontend`
   - Framework Preset will automatically detect **Next.js**.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://your-terravision-backend.onrender.com` or Railway/Koyeb).
6. Click **Deploy**. Vercel will build and host the frontend on a custom `*.vercel.app` domain.

---

### Backend Deployment (Docker / Cloud VM)

The backend can be packaged into a standard container for deployment on Render, Railway, Fly.io, or AWS ECS:

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/models ./models

ENV MODEL_PATH=models/flood_unet_final.keras
ENV ALLOWED_ORIGINS=https://your-project.vercel.app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔒 Security & Data Integrity

- **Magic Byte Verification**: Verifies raw binary headers of uploaded images to prevent file extension spoofing.
- **Decompression Bomb Defense**: Enforces strict pixel dimension ceilings to prevent memory exhaustion attacks.
- **Thread-Safe Model Execution**: Wraps neural inference within thread synchronization locks to ensure concurrency safety.
- **Rate Throttling**: Protected by SlowAPI rate limiters (default: 10 requests/minute per client IP).

---

## 📜 Ethical Use & Academic Disclaimer

TerraVision AI was developed for environmental remote sensing research, hackathon competition evaluation, and academic disaster assessment. Automated neural network predictions are subject to edge conditions such as steep topography, cloud shadow, and radar speckle noise. **Do not use this system as the sole operational decision maker during live disaster evacuations without corroboration from ground hydrological sensors and civil defense authorities.**

---

<div align="center">
  <sub>Developed for the NASA Earth Observation Challenge · © 2026 TerraVision AI Team</sub>
</div>

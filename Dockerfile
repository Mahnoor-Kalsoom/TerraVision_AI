FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and models
COPY backend/ ./backend/
COPY samples/ ./samples/

WORKDIR /app/backend

ENV PYTHONPATH=/app/backend
ENV PORT=7860
ENV MODEL_PATH=/app/backend/models/flood_unet_final.keras
ENV ALLOWED_ORIGINS=*

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]

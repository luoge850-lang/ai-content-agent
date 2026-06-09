FROM python:3.12-slim AS base

WORKDIR /app

# ── System dependencies ──────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ── Python dependencies ─────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── App code ────────────────────────────────────────────
COPY . .

# ── Non-root user (security best practice) ──────────────
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

EXPOSE 8000

# ── Production: gunicorn + uvicorn workers ──────────────
# Uses multiple uvicorn workers managed by gunicorn for
# better concurrency and process lifecycle management.
# Number of workers: 2-4 per CPU core; adjust via WEB_CONCURRENCY.
CMD ["sh", "-c", "gunicorn app.main:app \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --workers ${WEB_CONCURRENCY:-4} \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 10000 \
    --max-requests-jitter 1000 \
    --access-logfile - \
    --error-logfile - \
    --log-level info"]

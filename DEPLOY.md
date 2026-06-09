# AI Content Agent — Deployment Guide

How to run locally (dev mode) and with Docker (full production stack).

> **Note:** This project runs on localhost. No domain or cloud account required for GitHub portfolio review.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Internet                              │
│                       │                                  │
│                  ┌────▼────┐                             │
│                  │  Nginx  │  :80 (→ :443 HTTPS planned) │
│                  └────┬────┘                             │
│                       │                                  │
│  ┌────────────────────┼──────────────────────────────┐   │
│  │            Docker Network (backend)                │   │
│  │                    │                               │   │
│  │    ┌───────────────▼────────────────┐              │   │
│  │    │  FastAPI (gunicorn+uvicorn)    │              │   │
│  │    │  4 workers, port 8000          │              │   │
│  │    └───────────────────────────────┬┘              │   │
│  │                                    │                │   │
│  │    ┌───────────────────────────────▼┐               │   │
│  │    │  Celery Worker                 │               │   │
│  │    │  Queues: email, ai, file,      │               │   │
│  │    │  default                       │               │   │
│  │    └───────────────┬────────────────┘               │   │
│  │                    │                                │   │
│  │    ┌───────────────▼──────────┐                     │   │
│  │    │  Celery Beat (scheduler) │                     │   │
│  │    └──────────────────────────┘                     │   │
│  │                                                     │   │
│  │    ┌──────────────┐   ┌──────────────┐              │   │
│  │    │ PostgreSQL 16│   │   Redis 7    │              │   │
│  │    │ :5432 (int)  │   │  :6379 (int) │              │   │
│  │    └──────────────┘   └──────────────┘              │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## Local Development (No Docker)

This is the fastest way to run the project for development and portfolio review.

### Prerequisites

- Node.js 20+
- Python 3.12+
- (Optional) DeepSeek API key from https://platform.deepseek.com/

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd AI-Content-Agent
```

### Step 2: Backend

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS / Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file (no real secrets needed for dev)
cp .env.example .env
# Optional: add AI_API_KEY=sk-... for real AI generation

# Seed the database (creates demo user + platforms)
python -m app.seed

# Start the backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend is now running at:
- API: `http://localhost:8000`
- API Docs (Swagger): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Step 3: Frontend

```bash
# In a new terminal, from the project root
cd apps/web
npm install

# Optional: set backend URL (defaults to localhost:8000)
# Create apps/web/.env.local with:
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Start the frontend
npm run dev
```

Frontend is now running at:
- App: `http://localhost:3000`
- Case Study: `http://localhost:3000/case-study`

### Step 4: Login

Click **"Continue with Demo Account"** on the login page, or use:
- Email: `LouisHarrington@demo.ai`
- Password: `123456`

---

## Docker Development (Full Stack)

Run all 6 services with one command. Requires Docker Engine 24+ and Docker Compose v2.

### Step 1: Configure

```bash
cp .env.example .env
# Edit .env — at minimum:
#   JWT_SECRET=<random-64-char-string>
#   POSTGRES_PASSWORD=<secure-password>
#   REDIS_PASSWORD=<secure-password>
#   (Optional) AI_API_KEY=sk-... for real AI generation
```

### Step 2: Start

```bash
# Build images and start all services
docker compose up -d --build

# Watch logs
docker compose logs -f          # all services
docker compose logs -f api      # FastAPI only
docker compose logs -f worker   # Celery worker only
```

### Step 3: Migrate & Seed

```bash
# Apply database migrations
docker compose exec api alembic upgrade head

# Seed platforms + demo user
docker compose exec api python -m app.seed
```

### Step 4: Verify

```bash
# Health check
curl http://localhost/health
# → {"status":"ok","service":"AI Content Agent API"}

# API docs
open http://localhost/docs
```

---

## Services (Docker Compose)

| Service | Port (Host) | Port (Internal) | Description |
|---------|------------|-----------------|-------------|
| **nginx** | 80 | 80 | Reverse proxy, security headers, rate limiting |
| **api** | — | 8000 | FastAPI with gunicorn + 4 uvicorn workers |
| **worker** | — | — | Celery worker (email, AI, file queues) |
| **beat** | — | — | Celery Beat scheduler (periodic tasks) |
| **db** | — | 5432 | PostgreSQL 16, data persisted to `postgres_data` volume |
| **redis** | — | 6379 | Redis 7 with AOF persistence, `redis_data` volume |

> PostgreSQL and Redis are NOT exposed to the host — only accessible within the Docker network.

---

## Common Commands

```bash
# Restart a specific service
docker compose restart api
docker compose restart worker

# View logs with timestamps
docker compose logs -f --tail=100 api

# Run a management command
docker compose exec api python -m app.seed
docker compose exec api alembic upgrade head
docker compose exec api alembic downgrade -1

# Enter a shell in the container
docker compose exec api bash

# Connect to PostgreSQL directly (debugging)
docker compose exec db psql -U aiagent -d ai_content_agent

# Connect to Redis CLI
docker compose exec redis redis-cli -a <redis-password>

# Stop everything
docker compose down

# Stop and remove volumes (DESTROYS DATA!)
docker compose down -v
```

---

## Celery

### Queues

| Queue | Purpose | Concurrency |
|-------|---------|-------------|
| `email_queue` | Verification emails, password resets | 2 |
| `ai_queue` | AI content generation (DeepSeek calls) | 4 |
| `file_queue` | File processing (reserved) | 2 |
| `default_queue` | Everything else | 2 |

### Celery-optional architecture

In dev mode (without Docker), the app uses `asyncio.create_task` instead of Celery. The code checks at runtime:

```python
if hasattr(task, "delay"):
    task.delay(...)        # Celery mode
else:
    asyncio.create_task(...) # Dev fallback
```

This means the app works without Redis/Celery in development, and automatically uses the task queue when Docker is running.

---

## Database

### Development (SQLite)

Default — zero configuration. Set via:
```bash
DATABASE_URL=sqlite+aiosqlite:///./ai_content_agent.db
```

### Production (PostgreSQL)

Used in Docker Compose. Connection pooling configured automatically:
```python
pool_size=10        # base connections
max_overflow=20     # up to 30 total under load
pool_timeout=30     # seconds to wait for a connection
pool_recycle=3600   # recycle connections hourly
```

### Migrations (Alembic)

```bash
# Generate a new migration after model changes
docker compose exec api alembic revision --autogenerate -m "description"

# Apply all pending migrations
docker compose exec api alembic upgrade head

# Rollback one migration
docker compose exec api alembic downgrade -1

# Show current revision
docker compose exec api alembic current
```

---

## Email Verification

Email verification code is fully implemented but requires SMTP credentials to activate.

### Flow

1. User registers → `is_email_verified=false`
2. Backend generates random token, stores **SHA-256 hash** in `email_verification_tokens`
3. Celery sends verification link with plaintext token to user's email
4. User clicks link → backend hashes token, looks up hash, verifies
5. If valid → `is_email_verified=true`, token marked as used

### SMTP Configuration

In `.env`:
```bash
SMTP_HOST=smtp.resend.com       # or smtp.sendgrid.net, smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxx         # API key from your email provider
SMTP_FROM=noreply@yourdomain.com
```

Without SMTP configured, email sending is skipped (safe for dev).

---

## Rate Limiting

Configured in `.env`, enforced via Redis in Docker mode:

| Endpoint | Limit | Key |
|----------|-------|-----|
| Register | 5/hour per IP | `register:ip:{ip}` |
| Login | 5/min per IP + 3/min per email | `login:ip:{ip}` + `login:email:{email}` |
| Resend verification | 1/min + 5/day per email | `resend:min:{email}` + `resend:day:{email}` |
| AI generation | 50/day per user | `ai:user:{user_id}` |

Nginx also applies IP-based rate limiting on auth endpoints.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | `sqlite+aiosqlite:///./ai_content_agent.db` | Database connection string |
| `JWT_SECRET` | **Yes** | — | Random 64-char string for JWT signing |
| `AI_API_KEY` | No | — | DeepSeek API key (mock mode if empty) |
| `AI_BASE_URL` | No | `https://api.deepseek.com/v1` | AI provider base URL |
| `AI_MODEL` | No | `deepseek-chat` | Model name |
| `REDIS_URL` | No | `redis://localhost:6379/0` | Redis connection string |
| `SMTP_HOST` | No | — | SMTP server for email verification |
| `FRONTEND_BASE_URL` | No | `http://localhost:3000` | Frontend URL for email links |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000/api/v1` | Backend URL for frontend |
| `CORS_ORIGINS` | No | `["http://localhost:3000"]` | Allowed CORS origins |

See `.env.example` for the complete list with all rate limiting, database pool, and security options.

---

## Deployment TODO (Future)

This project currently runs on localhost. When you're ready to deploy:

### Frontend → Vercel (free tier)
```bash
# 1. Push to GitHub
# 2. Import repo in Vercel
# 3. Set root directory: apps/web
# 4. Set environment variable:
#    NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
```

### Backend → Railway / Render / Fly.io
```bash
# 1. Deploy apps/api as a Python service
# 2. Set all environment variables from .env.example
# 3. Set build command: pip install -r requirements.txt
# 4. Set start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
# 5. Run: python -m app.seed (after first deploy)
```

### Database → Supabase / Neon (free tier)
```bash
# 1. Create a PostgreSQL project
# 2. Copy the connection string
# 3. Set DATABASE_URL in backend environment
# 4. Run migrations: alembic upgrade head
```

### When you have a domain
- Set `FRONTEND_BASE_URL` to your production frontend URL
- Restrict `CORS_ORIGINS` to your production domain(s)
- Set `DEBUG=false`
- Set up HTTPS via your hosting provider or Let's Encrypt

---

## Security Checklist

- [x] All secrets via environment variables (no hardcoded credentials)
- [x] `.env` in `.gitignore` (never commit real credentials)
- [x] Passwords hashed with bcrypt
- [x] Email verification tokens stored as SHA-256 hash (not plaintext)
- [x] JWT Bearer token auth on protected endpoints
- [x] CORS restricted to configured origins
- [x] Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- [x] PostgreSQL and Redis not exposed to the internet (Docker mode)
- [x] Redis password-protected with AOF persistence
- [x] Input validated server-side (Pydantic schemas)
- [x] SQLAlchemy ORM for parameterized queries (SQL injection prevention)
- [x] Ownership checks on all user resources
- [x] AI daily limit per user
- [x] Rate limiting on auth, AI, and email endpoints
- [x] Container runs as non-root user
- [ ] HTTPS — requires a domain (future)

---

> **This project runs on localhost. No domain or cloud account is needed for portfolio review.**

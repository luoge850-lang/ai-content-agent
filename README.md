
<p align="center">
  <img src="docs/screenshots/logo.png" alt="AI Content Agent" width="120" />
</p>

<h1 align="center">AI Content Agent</h1>

<p align="center">
  <strong>Full-Stack AI SaaS Platform for Chinese Social Media Content Generation</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-teal?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.12-blue?logo=python" alt="Python 3.12" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/DeepSeek-AI-4f46e5" alt="DeepSeek AI" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

<p align="center">
  <sub>One product description in → platform-optimized copy for 小红书, 抖音, 公众号, and 微博 out.</sub>
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
  - [Local Development](#local-development)
  - [Docker (Full Stack)](#docker-full-stack)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [AI Generation Pipeline](#-ai-generation-pipeline)
- [Design System](#-design-system)
- [Security](#-security)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📋 Overview

**AI Content Agent** is a full-stack web application that leverages AI to generate platform-optimized social media marketing content for the Chinese market. Given a product description and target audience, it produces tailored copy and image generation prompts for four major Chinese platforms, each with its own formatting conventions, tone, and style rules.

### The Problem

Content teams creating material for multiple Chinese social platforms face recurring challenges:

| Challenge | Impact |
|-----------|--------|
| **Platform fragmentation** | Each platform demands different formatting, tone, and structure |
| **Tone consistency** | Maintaining brand voice while adapting to platform norms is difficult |
| **Creative throughput** | Producing high-quality, platform-specific copy at scale requires significant time |
| **Knowledge management** | Brand guidelines, product details, and audience insights are scattered across tools |

### The Solution

AI Content Agent solves this through a **structured prompt-engineering pipeline**:

1. **Input** — Product description + target audience (from project or ad-hoc)
2. **Context** — Brand/product/audience/style knowledge entries injected as RAG context
3. **Generation** — 4 platforms × 3 tones = 12 engineered prompt combinations
4. **Output** — Platform-native copy, image generation prompts, and structured metadata
5. **Manage** — Full content lifecycle: Draft → Review → Published

---

## 🖥️ Live Demo

> **Note:** This is a portfolio project that runs locally. A live deployment is planned.

| Access | URL | Description |
|--------|-----|-------------|
| 🏠 **Frontend** | `http://localhost:3000` | Next.js application |
| ⚙️ **Backend API** | `http://localhost:8000` | FastAPI server |
| 📚 **Swagger Docs** | `http://localhost:8000/docs` | Interactive API documentation |
| 📖 **Case Study** | `http://localhost:3000/case-study` | Technical deep-dive page |

**Demo Account** (available after seeding):

| Field | Value |
|-------|-------|
| Email | `LouisHarrington@demo.ai` |
| Password | `123456` |

Or click the **"Continue with Demo Account"** button on the login page.

---

## ✨ Features

### Core

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Platform AI Generation** | 4 Chinese social platforms × 3 tone options = 12 engineered prompt combinations |
| 🧠 **Knowledge Base RAG** | Brand, product, audience, and style entries injected into AI system prompts for on-brand output |
| ⚡ **Async Generation** | Non-blocking AI calls with frontend polling — immediate placeholder return, background processing |
| 📝 **Content Management** | Full CRUD with status workflow (Draft → Review → Published), search, platform/status filtering |
| 📊 **Analytics Dashboard** | Per-platform metrics, content ranking, aggregation with animated charts |
| 📁 **Project Management** | Campaign organization with product descriptions and target audience linking |
| 🔐 **JWT Authentication** | Registration, login, profile management with bcrypt password hashing and Bearer token auth |
| 🎨 **Editorial Design System** | Strict B&W palette, editorial typography, Framer Motion animations, 10 responsive pages |
| 🐳 **Docker-Ready** | 6-service Compose stack: Nginx, FastAPI, Celery Worker, Celery Beat, PostgreSQL 16, Redis 7 |

### Platform Support

| Platform | Content Type | Format |
|----------|-------------|--------|
| 🔴 **小红书** (Xiaohongshu) | 种草 product recommendation | 1st person, emoji-rich, 3-5 hashtags, lifestyle framing |
| 🎵 **抖音** (Douyin) | Video script / caption | Hook-first <25 chars, selling points → CTA, colloquial |
| 📰 **公众号** (WeChat OA) | Long-form article | Editorial headline, story intro, 2-3 analysis sections, summary CTA |
| 🔥 **微博** (Weibo) | Hot-take thread | Trending headline <20 chars, punchy lines, engagement ask |

### Tone Options

| Tone | Style | Best For |
|------|-------|----------|
| 💼 **专业** Professional | Authoritative, data-aware, industry terminology | B2B, tech, finance |
| 😄 **幽默** Humorous | Witty, self-deprecating, internet slang | Consumer brands, lifestyle |
| 💝 **煽情** Emotional | Story-driven, empathetic, sensory language | Luxury, wellness, personal care |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.2 (App Router) | Framework, routing, SSR |
| [React](https://react.dev/) | 18.3 | Component architecture |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type safety |
| [TailwindCSS](https://tailwindcss.com/) | 3.4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 11.18 | Page transitions, scroll reveals, staggered animations |
| [GSAP](https://gsap.com/) | 3.15 | High-performance parallax and scroll animations |
| [Lucide React](https://lucide.dev/) | 0.468 | Monochrome icon system |
| [Sonner](https://sonner.emilkowal.ski/) | 2.0 | Toast notifications |
| [Spline](https://spline.design/) | 1.12 | 3D interactive elements |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115 | REST API framework |
| [SQLAlchemy](https://www.sqlalchemy.org/) | 2.0 (async) | ORM with async support |
| [Pydantic](https://docs.pydantic.dev/) | 2.10 | Request/response validation |
| [python-jose](https://python-jose.readthedocs.io/) | 3.3 | JWT creation and verification |
| [bcrypt](https://pypi.org/project/bcrypt/) | 4.0 | Password hashing |
| [Alembic](https://alembic.sqlalchemy.org/) | 1.14 | Database migrations |
| [Celery](https://docs.celeryq.dev/) | 5.4 | Async task queue |
| [Gunicorn](https://gunicorn.org/) | 23.0 | Production WSGI server |
| [Uvicorn](https://www.uvicorn.org/) | 0.34 | ASGI server |

### AI / ML

| Technology | Purpose |
|-----------|---------|
| [DeepSeek](https://platform.deepseek.com/) | LLM for Chinese content generation |
| [OpenAI SDK](https://github.com/openai/openai-python) | Standardized API interface (provider-agnostic) |
| Custom prompt templates | 12 platform-tone combinations with structured output instructions |
| Multi-strategy parser | JSON extraction with 4-layer fallback |

### DevOps & Infrastructure

| Technology | Purpose |
|-----------|---------|
| [Docker](https://www.docker.com/) + Compose | 6-service containerized stack |
| [Nginx](https://nginx.org/) | Reverse proxy, security headers, rate limiting |
| [PostgreSQL](https://www.postgresql.org/) 16 | Production database |
| [Redis](https://redis.io/) 7 | Cache, rate limiting, Celery broker |
| SQLite (aiosqlite) | Zero-config development database |

---

## 🏗️ Architecture

```
                              ┌──────────────────────────┐
                              │      Internet / Browser   │
                              └────────────┬─────────────┘
                                           │
                              ┌────────────▼─────────────┐
                              │   Nginx :80 (Reverse      │
                              │   Proxy + Security        │
                              │   Headers + Rate Limiting) │
                              └────────────┬─────────────┘
                                           │
           ┌───────────────────────────────┼───────────────────────────────┐
           │                  Docker Network (backend)                      │
           │                               │                                │
           │  ┌────────────────────────────▼─────────────────────────────┐  │
           │  │            FastAPI + Gunicorn + Uvicorn                  │  │
           │  │              4 workers, internal :8000                   │  │
           │  │                                                          │  │
           │  │  ┌──────────┐ ┌──────────────┐ ┌──────────────────┐     │  │
           │  │  │ JWT Auth │ │ Prompt       │ │ Knowledge Base   │     │  │
           │  │  │ (bcrypt) │ │ Builder (RAG)│ │ Context Inject   │     │  │
           │  │  └──────────┘ └──────┬───────┘ └──────────────────┘     │  │
           │  └──────────────────────┼──────────────────────────────────┘  │
           │                         │                                     │
           │  ┌──────────────────────▼──────────────────────────────────┐  │
           │  │              Celery Worker + Celery Beat                 │  │
           │  │  Queues: email_queue | ai_queue | file_queue | default   │  │
           │  └──────────────────────┬──────────────────────────────────┘  │
           │                         │                                     │
           │  ┌──────────────────────┼──────────────────────────────────┐  │
           │  │          ┌───────────▼──────────┐                       │  │
           │  │          │   DeepSeek API       │                       │  │
           │  │          │ (OpenAI-compatible)  │                       │  │
           │  │          └──────────────────────┘                       │  │
           │  └─────────────────────────────────────────────────────────┘  │
           │                                                                │
           │  ┌──────────────────┐          ┌──────────────────┐           │
           │  │  PostgreSQL 16   │          │    Redis 7       │           │
           │  │  (internal :5432)│          │  (internal :6379)│           │
           │  │  AOF + WAL       │          │  AOF persistence │           │
           │  └──────────────────┘          └──────────────────┘           │
           └───────────────────────────────────────────────────────────────┘
```

### AI Generation Flow

```
Client                    Backend                       DeepSeek API
  │                         │                               │
  │  POST /generate/        │                               │
  │────────────────────────►│                               │
  │                         │  Validate project + credits   │
  │                         │  Fetch knowledge context      │
  │                         │  Build prompt (platform+tone) │
  │                         │  Create placeholder           │
  │  200 { status:"proc" } │  (generation_status: process)  │
  │◄────────────────────────│                               │
  │                         │  Enqueue Celery task ────────►│
  │                         │                               │
  │  GET /contents/:id      │                               │
  │  (poll every 1.5s)      │                               │
  │────────────────────────►│                               │
  │  200 { status:"proc" } │                               │
  │◄────────────────────────│                               │
  │                         │        ◄──── API Response ────│
  │                         │        Parse JSON response    │
  │                         │        Update content record  │
  │  GET /contents/:id      │                               │
  │────────────────────────►│                               │
  │  200 { status:"done" } │                               │
  │◄────────────────────────│                               │
```

---

## 📁 Project Structure

```
AI-Content-Agent/
├── apps/
│   ├── web/                              # Next.js 14 Frontend
│   │   ├── app/                          # App Router pages
│   │   │   ├── page.tsx                  # Landing (portfolio showcase)
│   │   │   ├── login/page.tsx            # Auth + demo login
│   │   │   ├── dashboard/page.tsx        # Campaign command center
│   │   │   ├── generate/page.tsx         # AI Generation Studio
│   │   │   ├── contents/                 # Content library
│   │   │   │   ├── page.tsx              # List with search/filter
│   │   │   │   └── [id]/page.tsx         # Detail with inline editing
│   │   │   ├── projects/page.tsx         # Project management
│   │   │   ├── knowledge/page.tsx        # Knowledge base (RAG entries)
│   │   │   ├── analytics/page.tsx        # Analytics dashboard
│   │   │   ├── settings/page.tsx         # Account settings
│   │   │   ├── case-study/page.tsx       # Technical deep-dive
│   │   │   ├── layout.tsx                # Root layout + AppShell
│   │   │   └── globals.css               # Design tokens + base styles
│   │   ├── components/
│   │   │   ├── landing/                  # Landing page interactive components
│   │   │   │   ├── landing-experience.tsx
│   │   │   │   ├── flowing-menu.tsx      # GSAP hover marquee
│   │   │   │   ├── rolodex-gallery.tsx   # 3D scroll-driven carousel
│   │   │   │   ├── product-marquee.tsx   # Infinite horizontal scroll
│   │   │   │   ├── hover-trail-zone.tsx  # Mouse-follow tag trail
│   │   │   │   ├── interactive-command-title.tsx  # 3D tilt title
│   │   │   │   └── workflow-atmosphere.tsx        # Animated background
│   │   │   ├── dashboard/                # AppShell + section headers
│   │   │   ├── generate/                 # GenerationStudio
│   │   │   ├── contents/                 # ContentLibrary
│   │   │   ├── shared/                   # Reusable components
│   │   │   │   ├── editorial-logo.tsx
│   │   │   │   ├── custom-cursor.tsx
│   │   │   │   ├── click-spark-provider.tsx
│   │   │   │   ├── mouse-face-3d.tsx
│   │   │   │   ├── section-reveal.tsx
│   │   │   │   ├── animated-bars.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── error-boundary.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   └── motion-presets.ts
│   │   │   └── ui/                       # Atomic UI components
│   │   │       ├── button.tsx
│   │   │       └── click-spark.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                    # API client with JWT interceptor
│   │   │   ├── auth-context.tsx          # React Context AuthProvider
│   │   │   ├── mock-data.ts             # Demo data generators
│   │   │   ├── shortcuts.ts             # Keyboard shortcuts
│   │   │   └── utils.ts                 # Utility functions
│   │   ├── tailwind.config.ts
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                              # FastAPI Backend
│       ├── app/
│       │   ├── main.py                   # FastAPI app entry + security middleware
│       │   ├── config.py                 # pydantic-settings configuration
│       │   ├── database.py               # SQLAlchemy async engine + session
│       │   ├── redis.py                  # Redis connection pool + health check
│       │   ├── seed.py                   # Database seeder (platforms + demo user)
│       │   ├── models/                   # SQLAlchemy 2.0 ORM models
│       │   │   ├── user.py
│       │   │   ├── project.py
│       │   │   ├── platform.py
│       │   │   ├── content.py
│       │   │   ├── knowledge.py
│       │   │   ├── generation_log.py
│       │   │   └── email_token.py
│       │   ├── schemas/                  # Pydantic v2 request/response schemas
│       │   │   ├── auth.py
│       │   │   ├── project.py
│       │   │   ├── content.py
│       │   │   ├── generate.py
│       │   │   ├── knowledge.py
│       │   │   └── analytics.py
│       │   ├── api/                      # Route handlers
│       │   │   ├── router.py             # Aggregated v1 router
│       │   │   └── v1/
│       │   │       ├── auth.py           # POST register/login, GET/PATCH me
│       │   │       ├── projects.py       # Full CRUD with ownership checks
│       │   │       ├── contents.py       # List/get/update/delete with filtering
│       │   │       ├── generate.py       # Single + batch AI generation
│       │   │       ├── knowledge.py      # CRUD for knowledge base entries
│       │   │       └── analytics.py      # Aggregated metrics endpoint
│       │   ├── services/                 # Business logic layer
│       │   │   ├── auth.py               # JWT + bcrypt + user CRUD
│       │   │   ├── ai.py                 # DeepSeek integration + prompt builder
│       │   │   └── email_service.py      # SMTP email sender
│       │   ├── tasks/                    # Celery async tasks
│       │   │   ├── celary_app.py         # Celery app config + 4 queues
│       │   │   ├── ai_tasks.py           # AI generation task
│       │   │   └── email_tasks.py        # Email sending task
│       │   └── middleware/               # FastAPI middleware
│       │       ├── auth.py               # JWT dependency injection
│       │       └── rate_limit.py         # Redis-based rate limiter
│       ├── alembic/                      # Database migrations
│       │   ├── env.py
│       │   └── versions/
│       ├── Dockerfile
│       └── requirements.txt
│
├── nginx/
│   └── nginx.conf                        # Reverse proxy with security headers
├── docs/
│   └── case-study.md                     # Technical deep-dive document
├── docker-compose.yml                    # 6-service production stack
├── .env.example                          # Environment variable template
├── .gitignore
├── DEPLOY.md                             # Deployment guide
├── package.json                          # Monorepo root (npm workspaces)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **Python** ≥ 3.12
- (Optional) **Docker** + Docker Compose v2 for full-stack deployment
- (Optional) [DeepSeek API key](https://platform.deepseek.com/) for real AI generation

> **The app works without an API key** — it falls back to realistic mock responses when no key is configured.

### Local Development

```bash
# ── 1. Clone the repository ─────────────────────────────
git clone https://github.com/<your-username>/AI-Content-Agent.git
cd AI-Content-Agent

# ── 2. Backend setup ────────────────────────────────────
cd apps/api

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS / Linux)
source venv/bin/activate

pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Edit .env if you have a DeepSeek API key

# Seed the database (creates demo user + platforms)
python -m app.seed

# Start backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# ── 3. Frontend setup (new terminal) ────────────────────
cd ../../apps/web
npm install

# Create frontend env (optional — defaults to localhost:8000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

npm run dev

# ── 4. Open the application ─────────────────────────────
# Frontend:    http://localhost:3000
# API Docs:    http://localhost:8000/docs
# Case Study:  http://localhost:3000/case-study
```

### Docker (Full Stack)

```bash
# ── 1. Configure ────────────────────────────────────────
cp .env.example .env
# Generate secure values for JWT_SECRET, POSTGRES_PASSWORD, REDIS_PASSWORD

# ── 2. Start all 6 services ─────────────────────────────
docker compose up -d --build

# ── 3. Migrate + Seed ───────────────────────────────────
docker compose exec api alembic upgrade head
docker compose exec api python -m app.seed

# ── 4. Verify ───────────────────────────────────────────
curl http://localhost/health
# → {"status":"ok","service":"AI Content Agent API","version":"0.2.0"}

# ── 5. Monitor ──────────────────────────────────────────
docker compose logs -f api      # FastAPI logs
docker compose logs -f worker   # Celery worker logs

# ── 6. Stop ─────────────────────────────────────────────
docker compose down
```

### Services (Docker Compose)

| Service | Host Port | Internal Port | Description |
|---------|-----------|---------------|-------------|
| **nginx** | `80` | `80` | Reverse proxy, security headers, rate limiting |
| **api** | — | `8000` | FastAPI + Gunicorn (4 Uvicorn workers) |
| **worker** | — | — | Celery worker (email, AI, file, default queues) |
| **beat** | — | — | Celery Beat periodic scheduler |
| **db** | — | `5432` | PostgreSQL 16 (data persisted to volume) |
| **redis** | — | `6379` | Redis 7 with AOF persistence |

---

## 🔧 Environment Variables

Copy [`.env.example`](.env.example) to `.env` and configure:

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DATABASE_URL` | ✗ | `sqlite+aiosqlite:///./ai_content_agent.db` | SQLite (dev) or PostgreSQL URL |
| `JWT_SECRET` | ✓ | — | Random 64-char string for JWT signing |
| `AI_API_KEY` | ✗ | — | DeepSeek API key (mock mode if empty) |
| `AI_BASE_URL` | ✗ | `https://api.deepseek.com/v1` | AI provider base URL |
| `AI_MODEL` | ✗ | `deepseek-chat` | Model name |
| `AI_DAILY_LIMIT` | ✗ | `50` | Daily AI calls per user |
| `REDIS_URL` | ✗ | `redis://localhost:6379/0` | Redis connection string |
| `REDIS_PASSWORD` | ✗ | — | Redis password |
| `SMTP_HOST` | ✗ | — | SMTP server for email verification |
| `SMTP_PORT` | ✗ | `587` | SMTP port |
| `SMTP_USER` | ✗ | — | SMTP username |
| `SMTP_PASSWORD` | ✗ | — | SMTP password |
| `SMTP_FROM` | ✗ | `noreply@aicontentagent.local` | From address |
| `FRONTEND_BASE_URL` | ✗ | `http://localhost:3000` | Frontend URL for email links |
| `NEXT_PUBLIC_API_URL` | ✗ | `http://localhost:8000/api/v1` | Backend URL (frontend) |
| `CORS_ORIGINS` | ✗ | `["http://localhost:3000"]` | Allowed CORS origins |
| `POSTGRES_USER` | ✗ | `aiagent` | PostgreSQL user |
| `POSTGRES_PASSWORD` | ✗ | — | PostgreSQL password |
| `POSTGRES_DB` | ✗ | `ai_content_agent` | PostgreSQL database name |

See [`.env.example`](.env.example) for rate limiting, database pool, and all other options.

---

## 📡 API Reference

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

All endpoints except `register` and `login` require a JWT Bearer token:

```
Authorization: Bearer <token>
```

### Endpoints (15 total)

#### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/auth/register` | ✗ | Register new account → 201 + JWT |
| `POST` | `/auth/login` | ✗ | Login → 200 + JWT |
| `GET` | `/auth/me` | ✓ | Get current user profile |
| `PATCH` | `/auth/me` | ✓ | Update display_name / team_name |

#### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/projects/` | ✓ | List user's projects |
| `POST` | `/projects/` | ✓ | Create project |
| `GET` | `/projects/{id}` | ✓ | Get project details |
| `PATCH` | `/projects/{id}` | ✓ | Update project (owner only) |
| `DELETE` | `/projects/{id}` | ✓ | Delete project + cascade contents |

#### Contents

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/contents/` | ✓ | List contents (filter: `project_id`, `platform_slug`, `status`) |
| `GET` | `/contents/{id}` | ✓ | Get content detail |
| `PATCH` | `/contents/{id}` | ✓ | Edit title/body/status (owner only) |
| `DELETE` | `/contents/{id}` | ✓ | Delete content |

#### AI Generation

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/generate/` | ✓ | Generate content (single platform, 1 credit) |
| `POST` | `/generate/batch` | ✓ | Batch generate (multiple platforms, N credits) |

#### Knowledge Base

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/knowledge/` | ✓ | List entries (filter: `category`) |
| `POST` | `/knowledge/` | ✓ | Create entry |
| `PATCH` | `/knowledge/{id}` | ✓ | Update entry |
| `DELETE` | `/knowledge/{id}` | ✓ | Delete entry |

#### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/analytics/summary` | ✓ | Aggregated stats + per-platform metrics |

### Error Responses

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `204` | Deleted (no body) |
| `400` | Validation error |
| `401` | Missing/invalid JWT |
| `402` | Insufficient credits |
| `404` | Resource not found |
| `422` | Invalid request body |
| `429` | Rate limited (includes `Retry-After` header) |

---

## 🗄️ Database Schema

```
users
├─ id                  UUID PK
├─ email               VARCHAR(255) UNIQUE INDEX (lowercase-normalized)
├─ password_hash       VARCHAR(128) (bcrypt)
├─ display_name        VARCHAR(128)
├─ team_name           VARCHAR(255)
├─ plan                VARCHAR(20) [free|pro|enterprise]
├─ credits_remaining   INTEGER
├─ is_email_verified   BOOLEAN
├─ email_verified_at   DATETIME
├─ is_active           BOOLEAN
├─ is_admin            BOOLEAN
├─ last_login_at       DATETIME INDEX
├─ created_at          DATETIME
├─ updated_at          DATETIME
└── relationships ──→ projects, knowledge_entries, email_tokens

projects
├─ id                  UUID PK
├─ user_id             FK → users (CASCADE DELETE, INDEX)
├─ name                VARCHAR
├─ product_description TEXT
├─ target_audience     VARCHAR
├─ status              VARCHAR [draft|active|archived]
├─ created_at          DATETIME
├─ updated_at          DATETIME
└── relationships ──→ contents (cascade)

platforms (seed data)
├─ id                  UUID PK
├─ slug                VARCHAR UNIQUE [xiaohongshu|douyin|gongzhonghao|weibo]
├─ display_name        VARCHAR
├─ description         TEXT
└── relationships ──→ contents

contents
├─ id                  UUID PK
├─ display_id          VARCHAR UNIQUE INDEX (CNT-{seq})
├─ project_id          FK → projects (CASCADE)
├─ platform_id         FK → platforms
├─ title               VARCHAR
├─ body                TEXT
├─ image_prompt        TEXT
├─ tone                VARCHAR [专业|幽默|煽情]
├─ status              VARCHAR [draft|review|published]
├─ generation_status   VARCHAR [pending|processing|completed|failed]
├─ views               INTEGER
├─ likes               INTEGER
├─ conversion          INTEGER
├─ published_at        DATETIME
├─ created_at          DATETIME
├─ updated_at          DATETIME
└── relationships ──→ generation_logs (cascade)

generation_logs
├─ id                  UUID PK
├─ content_id          FK → contents (CASCADE)
├─ model               VARCHAR
├─ provider            VARCHAR
├─ prompt_tokens       INTEGER
├─ completion_tokens   INTEGER
├─ duration_ms         INTEGER
├─ cost_usd            FLOAT
└─ created_at          DATETIME

knowledge_entries
├─ id                  UUID PK
├─ user_id             FK → users (CASCADE)
├─ title               VARCHAR
├─ content             TEXT
├─ category            VARCHAR [product|brand|audience|style]
├─ created_at          DATETIME
└─ updated_at          DATETIME

email_verification_tokens
├─ id                  UUID PK
├─ user_id             FK → users (CASCADE, INDEX)
├─ token_hash          VARCHAR(128) UNIQUE INDEX (SHA-256)
├─ purpose             VARCHAR [email_verification|password_reset]
├─ expires_at          DATETIME INDEX
├─ used                BOOLEAN
├─ used_at             DATETIME
└─ created_at          DATETIME INDEX
```

**Design Principles:**
- UUID primary keys throughout (no sequential ID enumeration)
- Cascading deletes where appropriate
- Composite indexes on frequently queried columns
- Email addresses normalized to lowercase
- Verification tokens stored as SHA-256 hash (plaintext never persisted)
- Ownership-based access enforced at the application layer

---

## 🧠 AI Generation Pipeline

### Prompt Architecture

```
System Prompt =
    Role: "Senior Chinese social-media content strategist"
  + Platform Rules (formatting, structure, length, emoji/hashtag conventions)
  + Tone Rules (language style, register, rhetorical devices)
  + Knowledge Context (user's brand/product/audience/style entries)
  + Output Format: strict JSON schema instruction

User Message =
    Product: {product_description}
    Target Audience: {target_audience}
```

### Platform-Specific Rules

| Platform | Title Style | Body Structure | Image Prompt Aspect |
|----------|------------|----------------|---------------------|
| 小红书 | Emoji + keywords | 1st person 种草, short paragraphs, 3-5 hashtags | 3:4 lifestyle flat lay |
| 抖音 | Hook < 25 chars | Hook → selling points → CTA, colloquial | 9:16 video thumbnail |
| 公众号 | Editorial < 30 chars | Story intro + 2-3 sections + summary CTA | 16:9 editorial hero |
| 微博 | Trending < 20 chars | Punchy thread, engagement ask, repost prompt | 3:4 social infographic |

### Response Parsing (4-layer strategy)

| Layer | Strategy | Handles |
|-------|----------|---------|
| 1 | Direct `JSON.parse()` | Clean, valid JSON |
| 2 | Strip markdown fences | ` ```json ``` ` wrapped responses |
| 3 | Regex JSON extraction | Malformed responses with embedded JSON |
| 4 | Full text as body | Completely unparseable responses |

### Async Generation Flow

1. Client sends `POST /generate/`
2. Backend validates project ownership + credit balance
3. Fetches all user knowledge entries → formats as context string
4. Deducts credits, creates placeholder content (`generation_status: "processing"`)
5. Returns `200` immediately with placeholder
6. Celery worker (or `asyncio.create_task` in dev) calls DeepSeek API
7. Response parsed → content record updated with results
8. Frontend polls `GET /contents/:id` every 1.5s until `generation_status` is `"completed"` or `"failed"`
9. On any API error: graceful fallback to mock templates

---

## 🎨 Design System

### Philosophy

An **editorial black-and-white** design system inspired by print magazines and minimal typography. No color — just weight, space, and motion.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#fcfcfc` | Page background (warm white) |
| Foreground | `#111` | Primary text (near-black) |
| Muted BG | `hsl(0,0%,94%)` | Secondary backgrounds |
| Muted Text | `hsl(0,0%,36%)` | Secondary text |
| Card Border | `gray-300` | Card borders |
| Dark Panel | `#0a0a0a` / `#111` | Contrast sections, code blocks |
| Dashboard BG | `#f6f6f3` | Dashboard background (warm gray) |

### Typography

| Level | Size | Weight | Spacing |
|-------|------|--------|---------|
| Hero | `clamp(5rem, 20vw, 18rem)` | 400 | `line-height: 0.75`, `letter-spacing: -0.04em` |
| H1 | `text-5xl` → `text-7xl` | 500 | `tracking-tight` |
| H2 | `text-3xl` → `text-6xl` | 500 | `tracking-tight` |
| H3 | `text-2xl` | 500 | `tracking-tight` |
| Body | `text-sm` → `text-[15px]` | 400 | `line-height ≥ 1.6` |
| Mono Labels | `10px` | 600 | `letter-spacing: 0.2em`, uppercase |
| Tags / Pills | `text-[11px]` | 500 | uppercase, `tracking-wider` |

**Font:** Inter (Chinese + Latin unified)

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-soft` | `0 24px 70px rgba(17,17,17,0.08)` | Default card shadow |
| `shadow-editorial` | `8px 8px 0 rgba(17,17,17,0.18)` | Hover state |

### Motion Language

- **Page transitions:** fade-up + scale, 0.65s, `cubic-bezier(0.16, 1, 0.3, 1)`
- **Stagger children:** 0.08s delay per child
- **Hover lift:** `translateY(-1.5px)` + shadow increase
- **Horizontal bars:** animated width for metrics and rankings
- `prefers-reduced-motion` respected globally

---

## 🔒 Security

| Layer | Implementation |
|-------|---------------|
| **Password Storage** | bcrypt hashing (12 rounds) |
| **Token Auth** | JWT with configurable expiration (default 7 days) |
| **Resource Ownership** | Every query joins on `user_id` — users cannot access others' data |
| **Input Validation** | Pydantic v2 schemas (email format, string lengths, enum values) |
| **SQL Injection** | SQLAlchemy ORM parameterized queries |
| **CORS** | Restricted to configured origins (wildcard in debug only) |
| **Rate Limiting** | Redis-based on auth endpoints (IP + email) and AI generation (per-user) |
| **Email Verification** | Tokens stored as SHA-256 hash; plaintext never persisted |
| **Security Headers** | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy` |
| **Docker** | Non-root container user; PostgreSQL + Redis not exposed to host |
| **Secrets** | All credentials via environment variables; `.env` gitignored |

---

## 🚢 Deployment

### Frontend → Vercel (Free Tier)

```bash
# 1. Push to GitHub
# 2. Import repo in Vercel
# 3. Root Directory: apps/web
# 4. Environment Variable:
#    NEXT_PUBLIC_API_URL=https://your-api.example.com/api/v1
```

### Backend → Railway / Render / Fly.io

```bash
# 1. Deploy apps/api as a Python service
# 2. Set all environment variables from .env.example
# 3. Build: pip install -r requirements.txt
# 4. Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
# 5. Post-deploy: python -m app.seed && alembic upgrade head
```

### Database → Supabase / Neon (Free Tier)

```bash
# 1. Create PostgreSQL project
# 2. Copy connection string → DATABASE_URL
# 3. Run: alembic upgrade head
```

> See [DEPLOY.md](DEPLOY.md) for the complete deployment guide.

---

## 🗺️ Roadmap

### Phase A — Production Readiness ✅ 80%

- [x] Docker Compose with PostgreSQL, Redis, Celery, Nginx
- [x] Celery task queue configuration (4 queues)
- [x] Redis-based rate limiting
- [x] Email verification (code complete, needs SMTP credentials)
- [x] Security headers, password hashing, input validation
- [ ] Live demo deployment
- [ ] HTTPS with Let's Encrypt
- [ ] Celery activation (currently `asyncio.create_task` in dev)

### Phase B — Feature Depth

- [ ] DALL-E / Stable Diffusion image generation from prompts
- [ ] Content version history with A/B comparison
- [ ] PDF / Markdown / CSV content export
- [ ] Content calendar with drag-and-drop scheduling
- [ ] Time-series analytics charts (Recharts)

### Phase C — Scale & Monetize

- [ ] Stripe subscription billing integration
- [ ] Team collaboration with role-based access control (RBAC)
- [ ] Direct social platform publishing APIs
- [ ] AI brand voice fine-tuning
- [ ] Mobile companion app (React Native)

---

## 📝 Portfolio Notes

This project is built as a **portfolio piece** — an honest demonstration of full-stack AI application engineering. Here's what that means:

- 🖥️ **Runs locally** — no production domain required. Clone → `npm run dev` → works.
- 📊 **Demo analytics** — metrics are locally stored, not from real social platform APIs
- 💰 **Pricing cards** — SaaS product thinking demonstrated, not functional
- 🖼️ **Image prompts** — generated as text for downstream tools; actual image generation not included
- 📱 **Platform publishing** — direct posting to platforms not integrated
- 💳 **Payments** — design concept only (no Stripe integration)
- ✉️ **Email** — code implemented, requires SMTP credentials to activate
- ⚡ **Async** — uses `asyncio.create_task` in dev; Celery + Redis is Docker-configured

These limitations are intentional and documented — a good portfolio demonstrates both what you built and that you understand scope vs. production requirements.

---

## 🤝 Contributing

This is a personal portfolio project and is not actively maintained as an open-source project. However:

- Feel free to fork and use as a learning resource or base for your own projects
- Bug reports and suggestions are welcome via GitHub Issues
- Attribution appreciated but not required

---

## 📄 License

This project is open-source under the [MIT License](LICENSE). Feel free to use it as a reference, learning resource, or starting point for your own projects.

---

## 👤 Author

> Replace with your information before uploading to GitHub.

<table>
  <tr>
    <td><strong>Name</strong></td>
    <td>[Your Name]</td>
  </tr>
  <tr>
    <td><strong>GitHub</strong></td>
    <td><a href="https://github.com/your-username">@your-username</a></td>
  </tr>
  <tr>
    <td><strong>Email</strong></td>
    <td><a href="mailto:your-email@example.com">your-email@example.com</a></td>
  </tr>
  <tr>
    <td><strong>Portfolio</strong></td>
    <td><a href="https://your-portfolio.com">your-portfolio.com</a></td>
  </tr>
  <tr>
    <td><strong>LinkedIn</strong></td>
    <td><a href="https://linkedin.com/in/your-profile">linkedin.com/in/your-profile</a></td>
  </tr>
</table>

---

<p align="center">
  <sub>Built with ♥ using Next.js 14, FastAPI, DeepSeek, SQLAlchemy, and Docker.</sub>
</p>

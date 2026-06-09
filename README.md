<p align="center">
  <img src="docs/screenshots/logo.png" alt="AI Content Agent" width="120" />
</p>

<h1 align="center">AI Content Agent</h1>

<p align="center">
  <strong>Full-Stack AI SaaS Portfolio Project for Chinese Social Media Content Generation</strong>
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
- [Live Demo](#️-live-demo)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
  - [Local Development](#local-development)
  - [Docker Backend Infrastructure Stack](#docker-backend-infrastructure-stack)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#️-database-schema)
- [AI Generation Pipeline](#-ai-generation-pipeline)
- [Design System](#-design-system)
- [Security](#-security)
- [Deployment](#-deployment)
- [Roadmap](#️-roadmap)
- [Portfolio Notes](#-portfolio-notes)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📋 Overview

**AI Content Agent** is a full-stack AI SaaS portfolio project for generating platform-optimized Chinese social media marketing content.

Given a product description and target audience, it produces tailored copy and image generation prompts for four major Chinese platforms:

- 小红书 Xiaohongshu
- 抖音 Douyin
- 公众号 WeChat Official Account
- 微博 Weibo

Each platform has its own formatting conventions, tone, structure, hook style, CTA pattern, and visual prompt requirements.

This project was built to demonstrate:

- AI application productization
- Prompt engineering
- Lightweight knowledge-context injection
- Full-stack SaaS architecture
- JWT authentication
- Database modeling
- Content management workflows
- Frontend design systems
- Docker-ready backend infrastructure

---

### The Problem

Content teams and creators working across Chinese social platforms often face recurring challenges:

| Challenge | Impact |
|---|---|
| **Platform fragmentation** | Each platform requires different formatting, tone, and structure |
| **Tone consistency** | Maintaining brand voice while adapting to platform norms is difficult |
| **Creative throughput** | Producing high-quality, platform-specific content at scale is time-consuming |
| **Knowledge management** | Brand guidelines, product details, audience insights, and style references are often scattered |
| **Workflow management** | Generated content still needs to be saved, edited, reviewed, copied, and tracked |

---

### The Solution

AI Content Agent solves this through a structured AI content workflow:

1. **Input** — Product description + target audience
2. **Context** — Brand / product / audience / style knowledge entries injected into the system prompt as structured context
3. **Generation** — 4 platforms × 3 tones = 12 engineered prompt combinations
4. **Output** — Platform-native copy, image generation prompts, and structured metadata
5. **Manage** — Content lifecycle: Draft → Review → Published
6. **Analyze** — Demo analytics for content count, platform performance, and stored metrics

> This project uses **Knowledge Base Context Injection**, inspired by RAG-style workflows.  
> It does not currently implement embedding-based vector retrieval, chunking, or top-k semantic search.

---

## 🖥️ Live Demo

> **Note:** This is a portfolio project that currently runs locally. A public live deployment is planned.

| Access | URL | Description |
|---|---|---|
| 🏠 **Frontend** | `http://localhost:3000` | Next.js application |
| ⚙️ **Backend API** | `http://localhost:8000` | FastAPI server |
| 📚 **Swagger Docs** | `http://localhost:8000/docs` | Interactive API documentation |
| 📖 **Case Study** | `http://localhost:3000/case-study` | Technical deep-dive page |
| 🌐 **Live Demo** | Coming soon | Planned public deployment |

---

### Demo Account

Available after running the seed script:

| Field | Value |
|---|---|
| Email | `LouisHarrington@demo.ai` |
| Password | `123456` |

You can also click the **“Continue with Demo Account”** button on the login page.

---

## ✨ Features

### Core Features

| Feature | Description |
|---|---|
| 🤖 **Multi-Platform AI Generation** | 4 Chinese social platforms × 3 tone options = 12 engineered prompt combinations |
| 🧠 **Knowledge Base Context Injection** | Brand, product, audience, and style entries are injected into AI system prompts for more on-brand output |
| ⚡ **Async Generation Flow** | Non-blocking AI generation with placeholder content and frontend polling |
| 📝 **Content Management** | Full CRUD with Draft / Review / Published status workflow, search, filtering, and detail editing |
| 📊 **Demo Analytics Dashboard** | Per-platform metrics, content ranking, and aggregated stored metrics |
| 📁 **Project Management** | Organize campaigns with product descriptions and target audience data |
| 🔐 **JWT Authentication** | Registration, login, profile management, bcrypt password hashing, and Bearer token auth |
| 🎨 **Editorial B&W Design System** | Strict black-and-white visual system, custom typography, cards, motion, skeleton states, and responsive layout |
| 🐳 **Docker-Ready Backend Infrastructure** | Nginx, FastAPI, Celery Worker, Celery Beat, PostgreSQL 16, and Redis 7 |

---

### Platform Support

| Platform | Content Type | Format |
|---|---|---|
| 🔴 **小红书** Xiaohongshu | Product recommendation / 种草 | First-person, emoji-rich, short paragraphs, 3–5 hashtags, lifestyle framing |
| 🎵 **抖音** Douyin | Short video script / caption | Hook-first, selling points → CTA, colloquial tone |
| 📰 **公众号** WeChat OA | Long-form article | Editorial headline, story intro, structured analysis, summary CTA |
| 🔥 **微博** Weibo | Hot-take thread | Trending headline, punchy lines, engagement question, repost prompt |

---

### Tone Options

| Tone | Style | Best For |
|---|---|---|
| 💼 **专业** Professional | Authoritative, precise, data-aware, industry terminology | B2B, tech, finance, education |
| 😄 **幽默** Humorous | Witty, self-deprecating, internet slang, casual jokes | Consumer brands, lifestyle, entertainment |
| 💝 **煽情** Emotional | Story-driven, empathetic, warm, sensory language | Beauty, wellness, luxury, personal care |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---:|---|
| [Next.js](https://nextjs.org/) | 14.2 | App Router, routing, frontend framework |
| [React](https://react.dev/) | 18.3 | Component architecture |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type safety |
| [TailwindCSS](https://tailwindcss.com/) | 3.4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 11.18 | Page transitions, scroll reveals, staggered animations |
| [GSAP](https://gsap.com/) | 3.15 | High-performance marquee and motion effects |
| [Lucide React](https://lucide.dev/) | 0.468 | Monochrome icon system |
| [Sonner](https://sonner.emilkowal.ski/) | 2.0 | Toast notifications |
| [Spline](https://spline.design/) | 1.12 | 3D interactive elements |

---

### Backend

| Technology | Version | Purpose |
|---|---:|---|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115 | REST API framework |
| [SQLAlchemy](https://www.sqlalchemy.org/) | 2.0 async | ORM with async support |
| [Pydantic](https://docs.pydantic.dev/) | 2.10 | Request / response validation |
| [python-jose](https://python-jose.readthedocs.io/) | 3.3 | JWT creation and verification |
| [bcrypt](https://pypi.org/project/bcrypt/) | 4.0 | Password hashing |
| [Alembic](https://alembic.sqlalchemy.org/) | 1.14 | Database migrations |
| [Celery](https://docs.celeryq.dev/) | 5.4 | Async task queue configuration |
| [Gunicorn](https://gunicorn.org/) | 23.0 | Production process manager |
| [Uvicorn](https://www.uvicorn.org/) | 0.34 | ASGI server |

---

### AI / LLM

| Technology | Purpose |
|---|---|
| [DeepSeek](https://platform.deepseek.com/) | LLM provider optimized for Chinese content generation |
| [OpenAI SDK](https://github.com/openai/openai-python) | OpenAI-compatible API interface |
| Custom prompt templates | 12 platform-tone combinations with structured output instructions |
| Multi-strategy parser | JSON parsing, markdown fence stripping, regex extraction, fallback body |

---

### DevOps & Infrastructure

| Technology | Purpose |
|---|---|
| [Docker](https://www.docker.com/) + Compose | Backend infrastructure containerization |
| [Nginx](https://nginx.org/) | Reverse proxy, security headers, API rate limiting |
| [PostgreSQL](https://www.postgresql.org/) 16 | Production-ready relational database |
| [Redis](https://redis.io/) 7 | Cache, rate limiting, Celery broker |
| SQLite + aiosqlite | Zero-config local development database |

---

## 🏗️ Architecture

```text
                              ┌──────────────────────────┐
                              │      Browser / Client     │
                              └────────────┬─────────────┘
                                           │
                                           │ Local frontend:
                                           │ http://localhost:3000
                                           │
                              ┌────────────▼─────────────┐
                              │       Next.js Frontend    │
                              │  App Router + TypeScript  │
                              └────────────┬─────────────┘
                                           │
                                           │ JWT + API requests
                                           │
                              ┌────────────▼─────────────┐
                              │       FastAPI Backend     │
                              │      /api/v1 endpoints    │
                              └────────────┬─────────────┘
                                           │
        ┌──────────────────────────────────┼──────────────────────────────────┐
        │                                  │                                  │
        ▼                                  ▼                                  ▼
┌──────────────────┐            ┌────────────────────┐             ┌──────────────────┐
│ SQLAlchemy ORM   │            │ Prompt Builder     │             │ Auth / Security  │
│ Async Sessions   │            │ Platform + Tone    │             │ JWT + bcrypt     │
└────────┬─────────┘            └─────────┬──────────┘             └──────────────────┘
         │                                │
         ▼                                ▼
┌──────────────────┐            ┌────────────────────┐
│ SQLite /         │            │ Knowledge Context  │
│ PostgreSQL       │            │ Injection          │
└──────────────────┘            └─────────┬──────────┘
                                          │
                                          ▼
                                ┌────────────────────┐
                                │ DeepSeek API       │
                                │ OpenAI-compatible  │
                                └─────────┬──────────┘
                                          │
                                          ▼
                                ┌────────────────────┐
                                │ Response Parser    │
                                │ JSON + fallback    │
                                └─────────┬──────────┘
                                          │
                                          ▼
                                ┌────────────────────┐
                                │ Content Library    │
                                │ Draft / Review /   │
                                │ Published          │
                                └────────────────────┘
```

---

### Docker Backend Infrastructure

```text
┌──────────────────────────────────────────────────────────────┐
│                Docker Backend Infrastructure                 │
│                                                              │
│  ┌──────────────┐       ┌──────────────────────────────┐     │
│  │ Nginx :80    │──────▶│ FastAPI + Gunicorn + Uvicorn │     │
│  │ Reverse Proxy│       │ Internal :8000               │     │
│  └──────────────┘       └──────────────┬───────────────┘     │
│                                        │                     │
│                                        ▼                     │
│                          ┌──────────────────────────────┐    │
│                          │ Celery Worker + Celery Beat  │    │
│                          │ Queues: email / ai / file    │    │
│                          └──────────────┬───────────────┘    │
│                                         │                    │
│         ┌───────────────────────────────┼──────────────────┐ │
│         ▼                               ▼                  ▼ │
│  ┌──────────────┐              ┌──────────────┐    ┌──────────────┐
│  │ PostgreSQL 16│              │ Redis 7      │    │ DeepSeek API │
│  │ Internal DB  │              │ Broker/Cache │    │ External LLM │
│  └──────────────┘              └──────────────┘    └──────────────┘
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

> The current Docker Compose stack runs the **backend infrastructure** only:  
> Nginx, FastAPI, Celery Worker, Celery Beat, PostgreSQL, and Redis.  
> The Next.js frontend is run separately with `npm run dev` during local development, or can be deployed independently to Vercel.

---

### AI Generation Flow

```text
Client                    Backend                       DeepSeek API
  │                         │                               │
  │  POST /generate/        │                               │
  │────────────────────────►│                               │
  │                         │  Validate project + credits   │
  │                         │  Fetch knowledge context      │
  │                         │  Build prompt                 │
  │                         │  Create placeholder content   │
  │                         │  generation_status=processing │
  │  200 { status: proc }   │                               │
  │◄────────────────────────│                               │
  │                         │                               │
  │  GET /contents/:id      │                               │
  │  Poll every 1.5s        │                               │
  │────────────────────────►│                               │
  │  200 { status: proc }   │                               │
  │◄────────────────────────│                               │
  │                         │  Call LLM                     │
  │                         │──────────────────────────────►│
  │                         │                               │
  │                         │  Response                     │
  │                         │◄──────────────────────────────│
  │                         │  Parse JSON                   │
  │                         │  Update content record        │
  │                         │  generation_status=completed  │
  │                         │                               │
  │  GET /contents/:id      │                               │
  │────────────────────────►│                               │
  │  200 { status: done }   │                               │
  │◄────────────────────────│                               │
```

---

## 📁 Project Structure

```text
ai-content-agent/
├── apps/
│   ├── web/                              # Next.js 14 frontend
│   │   ├── app/
│   │   │   ├── page.tsx                  # Landing page
│   │   │   ├── login/page.tsx            # Login, register, demo login
│   │   │   ├── dashboard/page.tsx        # Dashboard
│   │   │   ├── generate/page.tsx         # AI generation studio
│   │   │   ├── contents/                 # Content library
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── knowledge/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── case-study/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   ├── dashboard/
│   │   │   ├── generate/
│   │   │   ├── contents/
│   │   │   ├── shared/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth-context.tsx
│   │   │   ├── mock-data.ts
│   │   │   ├── shortcuts.ts
│   │   │   └── utils.ts
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                              # FastAPI backend
│       ├── app/
│       │   ├── main.py
│       │   ├── config.py
│       │   ├── database.py
│       │   ├── redis.py
│       │   ├── seed.py
│       │   ├── models/
│       │   │   ├── user.py
│       │   │   ├── project.py
│       │   │   ├── platform.py
│       │   │   ├── content.py
│       │   │   ├── knowledge.py
│       │   │   ├── generation_log.py
│       │   │   └── email_token.py
│       │   ├── schemas/
│       │   ├── api/
│       │   │   ├── router.py
│       │   │   └── v1/
│       │   │       ├── auth.py
│       │   │       ├── projects.py
│       │   │       ├── contents.py
│       │   │       ├── generate.py
│       │   │       ├── knowledge.py
│       │   │       └── analytics.py
│       │   ├── services/
│       │   │   ├── auth.py
│       │   │   ├── ai.py
│       │   │   └── email_service.py
│       │   ├── tasks/
│       │   │   ├── celery_app.py
│       │   │   ├── ai_tasks.py
│       │   │   └── email_tasks.py
│       │   └── middleware/
│       │       ├── auth.py
│       │       └── rate_limit.py
│       ├── alembic/
│       │   ├── env.py
│       │   └── versions/
│       ├── Dockerfile
│       └── requirements.txt
│
├── nginx/
│   └── nginx.conf
├── docs/
│   ├── case-study.md
│   └── screenshots/
├── docker-compose.yml
├── .env.example
├── .env.docker.example
├── .gitignore
├── DEPLOY.md
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **Python** ≥ 3.12
- **Docker + Docker Compose v2** optional, for backend infrastructure
- **DeepSeek API key** optional, for real AI generation

> The app works without an API key.  
> If `AI_API_KEY` is empty, the backend falls back to realistic mock responses.

---

### Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/luoge850-lang/ai-content-agent.git
cd ai-content-agent
```

---

#### 2. Backend setup

```bash
cd apps/api
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

```bash
# Windows PowerShell
venv\Scripts\activate

# macOS / Linux
# source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` from the root example file:

```bash
# Windows PowerShell
copy ..\..\.env.example .env

# macOS / Linux
# cp ../../.env.example .env
```

Optional: edit `.env` and add your DeepSeek API key:

```env
AI_API_KEY=your-api-key-here
```

Seed the database:

```bash
python -m app.seed
```

Start the backend:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will run at:

```text
http://localhost:8000
```

Swagger docs:

```text
http://localhost:8000/docs
```

---

#### 3. Frontend setup

Open a new terminal from the repository root:

```bash
cd apps/web
npm install
```

Optional frontend environment file:

```bash
# Windows PowerShell
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 > .env.local

# macOS / Linux
# echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

---

#### 4. Open the app

| Page | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Login | `http://localhost:3000/login` |
| Dashboard | `http://localhost:3000/dashboard` |
| Case Study | `http://localhost:3000/case-study` |
| Backend API | `http://localhost:8000` |
| Swagger Docs | `http://localhost:8000/docs` |

---

### Docker Backend Infrastructure Stack

> This Docker Compose setup runs the backend infrastructure stack:
>
> - Nginx
> - FastAPI API
> - Celery Worker
> - Celery Beat
> - PostgreSQL 16
> - Redis 7
>
> The Next.js frontend is run separately with `npm run dev`, or deployed independently to Vercel.

---

#### 1. Configure Docker environment

```bash
cp .env.docker.example .env
```

If `.env.docker.example` is not available yet, copy `.env.example` and manually switch `DATABASE_URL` to PostgreSQL.

Make sure these values are set in `.env`:

```env
JWT_SECRET=change-this-to-a-random-64-char-string
POSTGRES_PASSWORD=change-this-postgres-password
REDIS_PASSWORD=change-this-redis-password
DATABASE_URL=postgresql+asyncpg://aiagent:change-this-postgres-password@db:5432/ai_content_agent
REDIS_URL=redis://:change-this-redis-password@redis:6379/0
CELERY_BROKER_URL=redis://:change-this-redis-password@redis:6379/1
CELERY_RESULT_BACKEND=redis://:change-this-redis-password@redis:6379/2
```

---

#### 2. Start backend infrastructure services

```bash
docker compose up -d --build
```

---

#### 3. Run migrations and seed data

```bash
docker compose exec api alembic upgrade head
docker compose exec api python -m app.seed
```

---

#### 4. Verify backend health

```bash
curl http://localhost/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "AI Content Agent API",
  "version": "0.2.0"
}
```

---

#### 5. Monitor logs

```bash
docker compose logs -f api
docker compose logs -f worker
```

---

#### 6. Stop services

```bash
docker compose down
```

---

### Docker Services

| Service | Host Port | Internal Port | Description |
|---|---:|---:|---|
| **nginx** | `80` | `80` | Reverse proxy, security headers, API rate limiting |
| **api** | — | `8000` | FastAPI + Gunicorn + Uvicorn workers |
| **worker** | — | — | Celery worker for AI, email, file, and default queues |
| **beat** | — | — | Celery Beat periodic scheduler |
| **db** | — | `5432` | PostgreSQL 16, persisted to Docker volume |
| **redis** | — | `6379` | Redis 7 with AOF persistence |

---

## 🔧 Environment Variables

There are two recommended environment modes:

| File | Use Case | Database |
|---|---|---|
| `.env.example` | Local development | SQLite by default |
| `.env.docker.example` | Docker backend infrastructure | PostgreSQL + Redis |

---

### Local development

From `apps/api`:

```bash
# Windows PowerShell
copy ..\..\.env.example .env

# macOS / Linux
cp ../../.env.example .env
```

---

### Docker backend infrastructure

From repository root:

```bash
cp .env.docker.example .env
```

---

### Key variables

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `DATABASE_URL` | ✗ | `sqlite+aiosqlite:///./ai_content_agent.db` | SQLite for local dev or PostgreSQL for Docker / production |
| `JWT_SECRET` | ✓ | — | Random secret for JWT signing |
| `AI_API_KEY` | ✗ | — | DeepSeek API key. Mock mode if empty |
| `AI_BASE_URL` | ✗ | `https://api.deepseek.com/v1` | AI provider base URL |
| `AI_MODEL` | ✗ | `deepseek-chat` | Model name |
| `AI_DAILY_LIMIT` | ✗ | `50` | Daily AI calls per user |
| `REDIS_URL` | ✗ | `redis://localhost:6379/0` | Redis connection string |
| `CELERY_BROKER_URL` | ✗ | — | Celery broker URL |
| `CELERY_RESULT_BACKEND` | ✗ | — | Celery result backend |
| `SMTP_HOST` | ✗ | — | SMTP server for email verification |
| `SMTP_PORT` | ✗ | `587` | SMTP port |
| `SMTP_USER` | ✗ | — | SMTP username |
| `SMTP_PASSWORD` | ✗ | — | SMTP password |
| `SMTP_FROM` | ✗ | `noreply@aicontentagent.local` | From address |
| `FRONTEND_BASE_URL` | ✗ | `http://localhost:3000` | Frontend URL for email links |
| `NEXT_PUBLIC_API_URL` | ✗ | `http://localhost:8000/api/v1` | Frontend API base URL |
| `CORS_ORIGINS` | ✗ | `["http://localhost:3000"]` | Allowed CORS origins |
| `POSTGRES_USER` | Docker | `aiagent` | PostgreSQL user |
| `POSTGRES_PASSWORD` | Docker | — | PostgreSQL password |
| `POSTGRES_DB` | Docker | `ai_content_agent` | PostgreSQL database name |
| `REDIS_PASSWORD` | Docker | — | Redis password |

---

## 📡 API Reference

### Base URL

```text
http://localhost:8000/api/v1
```

---

### Authentication

All endpoints except `register` and `login` require a JWT Bearer token:

```http
Authorization: Bearer <token>
```

---

### Endpoints

#### Auth

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/auth/register` | ✗ | Register new account |
| `POST` | `/auth/login` | ✗ | Login and receive JWT |
| `GET` | `/auth/me` | ✓ | Get current user profile |
| `PATCH` | `/auth/me` | ✓ | Update display name / team name |

---

#### Projects

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/projects/` | ✓ | List user projects |
| `POST` | `/projects/` | ✓ | Create project |
| `GET` | `/projects/{id}` | ✓ | Get project details |
| `PATCH` | `/projects/{id}` | ✓ | Update project |
| `DELETE` | `/projects/{id}` | ✓ | Delete project and cascade contents |

---

#### Contents

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/contents/` | ✓ | List contents with filters |
| `GET` | `/contents/{id}` | ✓ | Get content detail |
| `PATCH` | `/contents/{id}` | ✓ | Edit title, body, status |
| `DELETE` | `/contents/{id}` | ✓ | Delete content |

Supported filters:

```text
project_id
platform_slug
status
```

---

#### AI Generation

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/generate/` | ✓ | Generate single-platform content |
| `POST` | `/generate/batch` | ✓ | Generate multi-platform content |

---

#### Knowledge Base

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/knowledge/` | ✓ | List knowledge entries |
| `POST` | `/knowledge/` | ✓ | Create entry |
| `PATCH` | `/knowledge/{id}` | ✓ | Update entry |
| `DELETE` | `/knowledge/{id}` | ✓ | Delete entry |

---

#### Analytics

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/analytics/summary` | ✓ | Aggregated demo analytics |

---

### Error Responses

| Code | Meaning |
|---:|---|
| `200` | Success |
| `201` | Created |
| `204` | Deleted, no response body |
| `400` | Bad request |
| `401` | Missing or invalid JWT |
| `402` | Insufficient credits |
| `404` | Resource not found |
| `422` | Invalid request body |
| `429` | Rate limited |

---

## 🗄️ Database Schema

```text
users
├─ id                  UUID PK
├─ email               VARCHAR UNIQUE INDEX
├─ password_hash       VARCHAR bcrypt
├─ display_name        VARCHAR
├─ team_name           VARCHAR
├─ plan                free | pro | enterprise
├─ credits_remaining   INTEGER
├─ is_email_verified   BOOLEAN
├─ email_verified_at   DATETIME
├─ is_active           BOOLEAN
├─ is_admin            BOOLEAN
├─ last_login_at       DATETIME
├─ created_at          DATETIME
├─ updated_at          DATETIME
└─ relationships       projects, knowledge_entries, email_tokens

projects
├─ id                  UUID PK
├─ user_id             FK → users.id
├─ name                VARCHAR
├─ product_description TEXT
├─ target_audience     VARCHAR
├─ status              draft | active | archived
├─ created_at          DATETIME
├─ updated_at          DATETIME
└─ relationships       contents

platforms
├─ id                  UUID PK
├─ slug                xiaohongshu | douyin | gongzhonghao | weibo
├─ display_name        VARCHAR
├─ description         TEXT
└─ relationships       contents

contents
├─ id                  UUID PK
├─ display_id          CNT-{seq}
├─ project_id          FK → projects.id
├─ platform_id         FK → platforms.id
├─ title               VARCHAR
├─ body                TEXT
├─ image_prompt        TEXT
├─ tone                专业 | 幽默 | 煽情
├─ status              draft | review | published
├─ generation_status   pending | processing | completed | failed
├─ views               INTEGER
├─ likes               INTEGER
├─ conversion          INTEGER
├─ published_at        DATETIME
├─ created_at          DATETIME
├─ updated_at          DATETIME
└─ relationships       generation_logs

generation_logs
├─ id                  UUID PK
├─ content_id          FK → contents.id
├─ model               VARCHAR
├─ provider            VARCHAR
├─ prompt_tokens       INTEGER
├─ completion_tokens   INTEGER
├─ duration_ms         INTEGER
├─ cost_usd            FLOAT
└─ created_at          DATETIME

knowledge_entries
├─ id                  UUID PK
├─ user_id             FK → users.id
├─ title               VARCHAR
├─ content             TEXT
├─ category            product | brand | audience | style
├─ created_at          DATETIME
└─ updated_at          DATETIME

email_verification_tokens
├─ id                  UUID PK
├─ user_id             FK → users.id
├─ token_hash          SHA-256 hash
├─ purpose             email_verification | password_reset
├─ expires_at          DATETIME
├─ used                BOOLEAN
├─ used_at             DATETIME
└─ created_at          DATETIME
```

---

### Design Principles

- UUID primary keys to avoid sequential ID enumeration
- Cascading deletes where appropriate
- Email addresses normalized to lowercase
- Passwords stored with bcrypt hashes
- Verification tokens stored as SHA-256 hashes
- Ownership checks enforced through user-project-content relationships
- SQLAlchemy ORM used for parameterized queries

---

## 🧠 AI Generation Pipeline

### Prompt Architecture

```text
System Prompt =
    Role:
      Senior Chinese social-media content strategist

  + Platform Rules:
      Xiaohongshu / Douyin / WeChat OA / Weibo

  + Tone Rules:
      Professional / Humorous / Emotional

  + Knowledge Context:
      User's brand, product, audience, and style entries

  + Output Format:
      Strict JSON with title, body, image_prompt

User Message =
    Product description
  + Target audience
```

---

### Platform-Specific Rules

| Platform | Title Style | Body Structure | Image Prompt Aspect |
|---|---|---|---|
| 小红书 | Emoji + keywords | First-person product recommendation, short paragraphs, 3–5 hashtags | 3:4 lifestyle flat lay |
| 抖音 | Hook under 25 Chinese characters | Hook → selling points → CTA, colloquial style | 9:16 video thumbnail |
| 公众号 | Editorial / listicle / how-to | Story intro + 2–3 sections + summary CTA | 16:9 editorial hero image |
| 微博 | Trending / hot-topic style | Punchy short lines, interactive question, repost prompt | 3:4 social infographic |

---

### Response Parsing

| Layer | Strategy | Handles |
|---:|---|---|
| 1 | Direct JSON parse | Clean JSON |
| 2 | Markdown fence stripping | ```json fenced responses |
| 3 | Regex JSON extraction | JSON embedded inside extra text |
| 4 | Full text fallback | Unparseable responses |

---

### Async Generation Flow

> In local MVP mode, generation can run through `asyncio.create_task`.  
> In the Docker backend infrastructure stack, Celery + Redis is configured for production-grade background processing.

1. Client sends `POST /generate/`
2. Backend validates project ownership and credit balance
3. Backend fetches user knowledge entries and formats them as structured prompt context
4. Backend deducts credits and creates placeholder content with `generation_status = "processing"`
5. Backend returns `200` immediately
6. Background task calls DeepSeek API through the OpenAI-compatible SDK
7. AI response is parsed into `title`, `body`, and `image_prompt`
8. Content record is updated
9. Frontend polls `GET /contents/:id` every 1.5 seconds
10. UI updates when `generation_status` becomes `"completed"` or `"failed"`
11. If AI API fails, the backend gracefully falls back to mock templates

---

## 🎨 Design System

### Philosophy

The frontend uses an **Editorial Black & White** design system inspired by print magazines, studio portfolios, and minimal SaaS interfaces.

The style avoids generic AI-product gradients and instead emphasizes:

- Typography
- Whitespace
- Contrast
- Motion
- Grid layout
- Editorial hierarchy

---

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#fcfcfc` | Warm white page background |
| Foreground | `#111` | Near-black primary text |
| Muted BG | `hsl(0,0%,94%)` | Secondary backgrounds |
| Muted Text | `hsl(0,0%,36%)` | Secondary text |
| Card Border | `gray-300` | Card borders |
| Dark Panel | `#0a0a0a` / `#111` | Contrast sections and code blocks |
| Dashboard BG | `#f6f6f3` | Warm gray dashboard background |

---

### Typography

| Level | Size | Weight | Spacing |
|---|---|---:|---|
| Hero | `clamp(5rem, 20vw, 18rem)` | 400 | `line-height: 0.75`, `letter-spacing: -0.04em` |
| H1 | `text-5xl` → `text-7xl` | 500 | `tracking-tight` |
| H2 | `text-3xl` → `text-6xl` | 500 | `tracking-tight` |
| H3 | `text-2xl` | 500 | `tracking-tight` |
| Body | `text-sm` → `text-[15px]` | 400 | `line-height >= 1.6` |
| Mono Labels | `10px` | 600 | uppercase, `letter-spacing: 0.2em` |
| Tags / Pills | `text-[11px]` | 500 | uppercase, `tracking-wider` |

---

### Motion

- Page transitions with Framer Motion
- Staggered reveal animations
- Editorial card hover states
- Skeleton loading states
- Dashboard animated bars
- `prefers-reduced-motion` support

---

## 🔒 Security

| Layer | Implementation |
|---|---|
| Password Storage | bcrypt hashing |
| Authentication | JWT Bearer tokens |
| Resource Ownership | User-scoped project and content queries |
| Input Validation | Pydantic v2 schemas |
| SQL Injection Prevention | SQLAlchemy ORM parameterized queries |
| CORS | Restricted to configured origins |
| Rate Limiting | Redis-based middleware for auth and AI endpoints |
| Email Verification | SHA-256 token hashes, plaintext tokens never persisted |
| Security Headers | Configured through Nginx |
| Docker | PostgreSQL and Redis not exposed to host |
| Secrets | All credentials loaded from environment variables |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# 1. Push repository to GitHub
# 2. Import repo in Vercel
# 3. Set root directory to apps/web
# 4. Set environment variable:
NEXT_PUBLIC_API_URL=https://your-api.example.com/api/v1
```

---

### Backend → Railway / Render / Fly.io / VPS

```bash
# 1. Deploy apps/api as a Python service
# 2. Set environment variables from .env.example
# 3. Install dependencies:
pip install -r requirements.txt

# 4. Start server:
uvicorn app.main:app --host 0.0.0.0 --port $PORT

# 5. Post-deploy:
python -m app.seed
alembic upgrade head
```

---

### Database → Supabase / Neon / Railway PostgreSQL

```bash
# 1. Create PostgreSQL project
# 2. Copy connection string into DATABASE_URL
# 3. Run migrations:
alembic upgrade head
```

See [DEPLOY.md](DEPLOY.md) for more details.

---

## 🗺️ Roadmap

### Phase A — Production Readiness

- [x] Docker Compose with PostgreSQL, Redis, Celery, Nginx
- [x] Celery task queue configuration with multiple queues prepared
- [x] Redis-based rate limiting
- [x] Email verification code implemented
- [x] Password hashing, JWT auth, ownership checks
- [x] Security headers through Nginx
- [ ] Public live demo deployment
- [ ] HTTPS with domain
- [ ] Switch local AI generation fully from `asyncio.create_task` to Celery worker execution
- [ ] Add automated tests for auth, generation, and ownership checks

---

### Phase B — Feature Depth

- [ ] Content version history
- [ ] Markdown / TXT / CSV export
- [ ] Manual analytics input
- [ ] Content calendar view
- [ ] Image generation integration
- [ ] Content quality checklist per platform
- [ ] Product-link-to-structured-brief extraction

---

### Phase C — Scale & Monetization

- [ ] Team collaboration and role-based access control
- [ ] Subscription billing concept
- [ ] Direct social platform publishing APIs
- [ ] Real social analytics integration
- [ ] Brand voice memory with embedding-based retrieval
- [ ] White-label version for agencies
- [ ] International platform support

---

## 📝 Portfolio Notes

This project is built as a **portfolio piece** — an honest demonstration of full-stack AI application engineering.

What is implemented:

- Full-stack frontend and backend structure
- AI generation workflow
- Prompt engineering for multiple platforms
- Knowledge Base Context Injection
- JWT authentication
- Project and content management
- Demo analytics dashboard
- Docker-ready backend infrastructure
- Case study page
- Deployment documentation

What is intentionally not included yet:

- Real production domain
- Real social platform publishing
- Real social platform analytics
- Payment integration
- Actual image generation
- Fully production-grade Celery-only execution in local dev
- Enterprise-grade monitoring

These limitations are documented intentionally. A strong portfolio project should show not only what was built, but also awareness of scope, production tradeoffs, and future engineering work.

---

## 🤝 Contributing

This is a personal portfolio project and is not actively maintained as a general-purpose open-source product.

However:

- You may fork it as a learning reference
- Suggestions are welcome through GitHub Issues
- Attribution is appreciated

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

If the `LICENSE` file is not present yet, please add it before relying on the MIT badge in this README.

---

## 👤 Author

<table>
  <tr>
    <td><strong>Name</strong></td>
    <td>Louis Harrington</td>
  </tr>
  <tr>
    <td><strong>GitHub</strong></td>
    <td><a href="https://github.com/luoge850-lang">@luoge850-lang</a></td>
  </tr>
  <tr>
    <td><strong>Email</strong></td>
    <td>Available upon request</td>
  </tr>
  <tr>
    <td><strong>Resume</strong></td>
    <td>TODO: Add resume link</td>
  </tr>
  <tr>
    <td><strong>Portfolio</strong></td>
    <td>Coming soon</td>
  </tr>
</table>

---

<p align="center">
  <sub>Built with ♥ using Next.js 14, FastAPI, DeepSeek, SQLAlchemy, and Docker.</sub>
</p>

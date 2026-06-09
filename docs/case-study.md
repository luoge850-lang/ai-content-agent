# AI Content Agent — Technical Case Study

> A full-stack AI SaaS portfolio project. Independently designed, built, and documented.

---

## 1. Project Overview

**AI Content Agent** is a full-stack web application that uses AI to generate platform-optimized Chinese social media marketing content. Given a product description and target audience, it produces tailored copy and image generation prompts for four major Chinese platforms: 小红书, 抖音, 公众号, and 微博.

**Timeline:** Built as an independent portfolio project
**Status:** Local development — not commercially deployed
**Tech:** Next.js 14 + FastAPI + DeepSeek + SQLAlchemy + Docker

---

## 2. Problem

Content teams and marketers creating content for multiple Chinese social platforms face several challenges:

1. **Platform fragmentation** — Each platform has different formatting, tone, and structural requirements
2. **Tone consistency** — Maintaining brand voice while adapting to platform norms is difficult
3. **Creative throughput** — Producing high-quality, platform-specific copy at scale requires significant time
4. **Knowledge management** — Brand guidelines, product details, and audience insights are scattered

---

## 3. Solution

AI Content Agent addresses these challenges through a structured AI generation pipeline:

- **Platform-aware prompt engineering** — 12 distinct prompt templates (4 platforms × 3 tones)
- **Knowledge base RAG** — Brand, product, audience, and style entries injected as system prompt context
- **Asynchronous generation** — Non-blocking AI calls with frontend polling for real-time status updates
- **Content lifecycle management** — Draft → Review → Published workflow with inline editing

---

## 4. My Role

As the sole developer on this project, I was responsible for:

- **Full-stack architecture design** — Monorepo structure, API design, database schema, component hierarchy
- **Frontend development** — 12-page Next.js application with editorial design system and Framer Motion animations
- **Backend development** — 15+ FastAPI endpoints with JWT auth, async database operations, and input validation
- **AI integration** — Prompt engineering for 12 platform-tone combinations, multi-strategy response parsing
- **DevOps configuration** — Docker Compose with 6 services (Nginx, FastAPI, Celery, PostgreSQL, Redis)
- **Security implementation** — bcrypt password hashing, JWT tokens, ownership-based access control, rate limiting
- **Design system** — Editorial black-and-white aesthetic with custom design tokens and motion language
- **Technical documentation** — README, DEPLOY.md, case study, environment variable templates

---

## 5. Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | Framework, routing, SSR |
| React 18 + TypeScript | Component architecture, type safety |
| TailwindCSS 3 | Utility-first styling |
| Framer Motion 11 | Page transitions, scroll reveals, staggered animations |
| GSAP 3 | High-performance parallax and scroll animations |
| lucide-react | Icon system |
| sonner | Toast notifications |
| React Context API | Auth state management |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI (Python 3.12) | REST API framework |
| SQLAlchemy 2.0 (async) | ORM with async support |
| Pydantic v2 | Request/response validation |
| python-jose | JWT token creation and verification |
| bcrypt | Password hashing |
| Alembic | Database migrations |
| Celery + Redis | Async task queue (Docker-configured) |
| Gunicorn + Uvicorn | Production WSGI/ASGI server |

### AI
| Technology | Purpose |
|-----------|---------|
| DeepSeek API | LLM for content generation |
| OpenAI-compatible SDK | Standardized API interface |
| Custom prompt templates | 12 platform-tone combinations |
| Multi-strategy parser | JSON extraction with fallback |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Docker + Docker Compose | Containerized 6-service stack |
| Nginx | Reverse proxy, security headers, rate limiting |
| PostgreSQL 16 | Production database |
| Redis 7 | Cache, rate limiting, Celery broker |

---

## 6. Core Features

1. **Demo Login** — One-click access with pre-seeded demo account; no registration required
2. **JWT Authentication** — Full register/login/logout flow with bcrypt hashing and Bearer tokens
3. **Multi-Platform AI Generation** — 4 Chinese social platforms with 3 tone options each (12 combinations)
4. **Knowledge Base RAG** — User-managed brand/product/audience entries injected into AI system prompts
5. **Content Management** — Full CRUD with status workflow (draft → review → published), search, and filtering
6. **Content Detail View** — Editorial split-layout with inline editing, copy-to-clipboard, metadata display
7. **Analytics Dashboard** — Platform metrics, content ranking, aggregation cards with animated charts
8. **Project Management** — Campaign organization with product descriptions and target audience linking
9. **Editorial Design System** — B&W palette, mono labels, editorial typography, Framer Motion animations
10. **Docker-Ready** — 6-service production infrastructure with Nginx, Celery, PostgreSQL, Redis

---

## 7. AI Generation Pipeline

### Prompt Architecture

```
System Prompt =
    Role Definition: "Senior Chinese social-media content strategist"
  + Platform Rules: formatting, structure, length, emoji, hashtag conventions
  + Tone Rules: language style, register, rhetorical devices
  + Knowledge Context: user's brand/product/audience/style entries
  + Output Format: strict JSON schema instruction

User Message =
    Product: {product_description}
    Target Audience: {target_audience}
```

### Platform-Specific Rules

| Platform | Content Type | Key Characteristics |
|----------|-------------|-------------------|
| 小红书 | 种草 (recommendation) post | 1st person, emoji-rich, short paragraphs, 3-5 hashtags, lifestyle framing |
| 抖音 | Video script / caption | Hook-first (< 25 chars), selling points, CTA, colloquial language |
| 公众号 | Long-form article | Editorial headline (< 30 chars), story intro, 2-3 sections, summary CTA |
| 微博 | Hot-take thread | Trending headline (< 20 chars), punchy lines, engagement ask, repost prompt |

### Tone Adaptation

| Tone | Writing Style | Use Case |
|------|--------------|----------|
| 专业 (Professional) | Authoritative, data-aware, industry terminology | B2B, tech products, financial services |
| 幽默 (Humorous) | Witty, self-deprecating, internet slang | Consumer brands, entertainment, lifestyle |
| 煽情 (Emotional) | Story-driven, empathetic, sensory language | Luxury, wellness, personal care |

### Response Parsing Strategy

The AI response goes through multiple parsing layers to handle model inconsistency:

1. **Direct JSON.parse()** — Clean, valid JSON responses
2. **Markdown fence stripping** — Responses wrapped in ` ```json ``` `
3. **Regex extraction** — First JSON object found in malformed responses
4. **Text fallback** — Entire response used as body when no JSON found

### Async Generation Flow

```
Client                     Backend                     DeepSeek API
  │                          │                            │
  │  POST /generate/         │                            │
  │────────────────────────►│                            │
  │                          │                            │
  │                          │  Create placeholder        │
  │                          │  (status: "processing")    │
  │                          │                            │
  │  200 { content_id }     │                            │
  │◄────────────────────────│                            │
  │                          │                            │
  │                          │  Background task ─────────►│
  │                          │  (asyncio or Celery)       │
  │                          │                            │
  │  GET /contents/:id       │                            │
  │────────────────────────►│                            │
  │                          │                            │
  │  200 { status: "proc" } │                            │
  │◄────────────────────────│                            │
  │                          │                            │
  │  (poll every 1.5s...)   │◄─────── API Response ──────│
  │                          │                            │
  │  GET /contents/:id       │                            │
  │────────────────────────►│                            │
  │                          │                            │
  │  200 { status: "done" } │                            │
  │◄────────────────────────│                            │
```

---

## 8. Database Design

7 tables designed with referential integrity and ownership-based access:

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `users` | Account management, auth, credits | Parent of projects, knowledge_entries, email_tokens |
| `projects` | Campaign organization | FK → users, parent of contents |
| `platforms` | Platform definitions (seed data) | Referenced by contents |
| `contents` | Generated content storage | FK → projects, FK → platforms, parent of generation_logs |
| `knowledge_entries` | Brand/product/audience context | FK → users |
| `generation_logs` | AI call metadata and cost tracking | FK → contents |
| `email_verification_tokens` | Email verification (SHA-256 hashed) | FK → users |

**Design principles:**
- UUID primary keys throughout (no sequential ID enumeration)
- Cascading deletes where appropriate (project → contents → logs)
- Composite indexes on frequently queried columns
- Email addresses normalized to lowercase
- Verification tokens stored as SHA-256 hash (plaintext never persisted)

---

## 9. Security and Ownership

### Authentication
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration (default 7 days)
- Token sent as Bearer header on every authenticated request
- Email addresses normalized to lowercase to prevent duplicate accounts

### Authorization
- Every protected endpoint verifies JWT signature
- User ID extracted from token and matched against resource ownership
- Users cannot access, modify, or delete other users' projects, contents, or knowledge entries

### API Security
- CORS restricted to configured frontend origin
- Rate limiting on auth endpoints (login, register) and AI generation
- Input validation via Pydantic schemas (email format, string lengths, enum values)
- SQL injection prevention via SQLAlchemy ORM parameterized queries
- 429 responses with Retry-After headers when rate limited

### Infrastructure Security
- All secrets via environment variables (no hardcoded credentials)
- PostgreSQL and Redis not exposed to host in Docker Compose
- Nginx security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- Container runs as non-root user in production Dockerfile

---

## 10. Design System

### Philosophy
An editorial, black-and-white design system inspired by print magazines and minimal typography. No color — just weight, space, and motion.

### Principles
1. **Strict B&W palette** — Black, white, and grays only; no accent colors
2. **Editorial typography** — Inter font family, mono labels for metadata
3. **Generous whitespace** — Breathing room between sections and cards
4. **Subtle elevation** — Border-based cards with soft shadows, no harsh drop shadows
5. **Meaningful motion** — Stagger reveals, horizontal bars, parallax; animation serves hierarchy
6. **Mono labels** — `[ 01 ]` style labels for section numbering
7. **Sharp corners** — No border-radius except on small interactive elements (buttons, tags)
8. **Dark accent sections** — `bg-[#111]` panels for contrast against white cards

### Motion Language
- **Fade up + scale** — Primary page transitions (0.65s, custom easing)
- **Stagger children** — Lists and grids animate in sequence (0.06s delay per child)
- **Horizontal bars** — Animated width bars for metrics and rankings
- **Hover lift** — Cards translate -1.5px on hover with shadow increase

---

## 11. Challenges and Solutions

### Challenge 1: AI Response Variability
**Problem:** DeepSeek responses sometimes wrapped JSON in markdown fences, included explanatory text, or produced malformed JSON.

**Solution:** Multi-strategy parser with 4 fallback layers. Direct parse → strip fences → regex extraction → text fallback. This ensures content is always saved, even when the AI misbehaves.

### Challenge 2: Async Generation UX
**Problem:** AI generation takes 5-30 seconds. Blocking the HTTP request would cause timeouts.

**Solution:** Two-phase pattern — create placeholder immediately (status: "processing"), return 200, process in background task, let frontend poll every 1.5s. Works with both Celery (production) and asyncio.create_task (dev fallback).

### Challenge 3: Knowledge Base Integration
**Problem:** How to inject user-specific brand knowledge into generation without fine-tuning.

**Solution:** Lightweight RAG — fetch all user's knowledge entries before generation, format as structured context, append to system prompt. Simple but effective for demonstrating the concept.

### Challenge 4: Celery-Optional Architecture
**Problem:** Celery requires Redis and adds operational complexity for local dev.

**Solution:** Dual-mode architecture. Code checks `hasattr(task, "delay")` at runtime — uses Celery when available, falls back to `asyncio.create_task` in dev. Same code path, different execution modes.

### Challenge 5: TypeScript-Backend Type Sync
**Problem:** Frontend TypeScript types must stay in sync with backend Pydantic schemas.

**Solution:** Frontend API client (`lib/api.ts`) defines TypeScript interfaces mirroring Pydantic models. Not auto-generated, but manually maintained as documentation of the contract.

### Challenge 6: Honest Portfolio Positioning
**Problem:** How to present a SaaS-like project honestly as a portfolio piece without misleading claims.

**Solution:** Explicit disclaimers throughout — landing page footer, login page, analytics page, settings page, README portfolio notes, case study limitations section. Every "demo" or "concept" feature is labeled.

---

## 12. Current Limitations

These limitations are intentional scope boundaries for a portfolio project:

1. **Local-only deployment** — No public URL; runs on localhost. Deployment to Vercel/Railway is straightforward but not yet completed.
2. **Mock AI fallback** — Without a DeepSeek API key, generation returns templates instead of real AI output.
3. **No real platform publishing** — Content is stored locally; direct posting to 小红书/抖音/etc. requires their respective APIs.
4. **Demo analytics** — Metrics are manually stored or simulated, not from real social platform data.
5. **No image generation** — `image_prompt` is generated as text for downstream tools; DALL-E/Stable Diffusion integration is not included.
6. **No payment processing** — Pricing cards are a SaaS concept mockup only.

---

## 13. Future Improvements

### Phase A — Production Readiness
- [ ] Public demo deployment (Vercel + Railway/Render)
- [ ] HTTPS with Let's Encrypt
- [ ] Celery activation for async tasks (code is ready, needs Redis)
- [ ] Email verification with SMTP (code is ready, needs credentials)

### Phase B — Feature Depth
- [ ] DALL-E / Stable Diffusion image generation from prompts
- [ ] Content version history
- [ ] PDF/Markdown/CSV export
- [ ] Content calendar
- [ ] Time-series analytics charts

### Phase C — Scale
- [ ] Stripe subscription billing
- [ ] Team collaboration (RBAC)
- [ ] Direct platform publishing APIs
- [ ] AI brand voice fine-tuning
- [ ] Mobile app (React Native)

---

## 14. What I Learned

### Technical Growth
1. **Full-stack architecture** — Designing a complete system from database schema to UI components
2. **AI prompt engineering** — Crafting reliable prompts that produce consistent, parseable output
3. **Async patterns** — Background task processing, frontend polling, graceful degradation
4. **Security fundamentals** — JWT, bcrypt, ownership-based access control, rate limiting
5. **DevOps basics** — Docker Compose, Nginx reverse proxy, connection pooling, health checks
6. **Design systems** — Building a consistent visual language with tokens, motion, and typography

### Product Thinking
- Understanding the difference between a portfolio demo and a production SaaS
- Being honest about scope and limitations
- Writing documentation for someone encountering the project for the first time
- Structuring a codebase that an interviewer can navigate in 15 minutes

---

> **Built with Next.js 14, FastAPI, DeepSeek, SQLAlchemy, Docker. Designed as a full-stack AI portfolio project.**

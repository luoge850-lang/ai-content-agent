"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  Braces,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Container,
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  Layers,
  Lightbulb,
  Lock,
  Mail,
  Palette,
  Server,
  Shield,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { fadeUp, stagger } from "@/components/shared/motion-presets";

const TOC = [
  "Project Overview",
  "Problem & Solution",
  "My Role",
  "Tech Stack",
  "Core Features",
  "AI Generation Pipeline",
  "Database Design",
  "Security & Ownership",
  "Design System",
  "Challenges & Solutions",
  "Current Limitations",
  "Future Improvements",
  "What I Learned",
];

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] text-[#111]">
      {/* ── Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#fcfcfc]/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 md:px-16">
          <Link href="/" className="mono-label text-gray-500 hover:text-black">
            ← Back to Home
          </Link>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              Try Live Demo
            </Link>
          </div>
        </div>
      </header>

      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="mx-auto max-w-4xl px-6 py-16 md:px-16 md:py-24"
      >
        {/* ── Title ──────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="mono-label text-gray-400">Technical Case Study</p>
          <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.08] tracking-tight">
            AI Content Agent
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
            A full-stack AI SaaS portfolio project that generates
            platform-specific Chinese social media marketing content using
            prompt engineering, knowledge base context injection, and async
            AI generation state management.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Next.js 14", "FastAPI", "DeepSeek", "SQLAlchemy", "Docker", "Framer Motion"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-300 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-600"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* ── Table of Contents ──────────────────────── */}
        <motion.nav variants={fadeUp} className="mt-16 border-y border-gray-200 py-8">
          <p className="mono-label mb-4 text-gray-500">Contents</p>
          <div className="grid gap-1 sm:grid-cols-2">
            {TOC.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}
                className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-black"
              >
                <span className="mono-label text-gray-400">{String(i + 1).padStart(2, "0")}.</span>
                {item}
              </a>
            ))}
          </div>
        </motion.nav>

        {/* ── 1. Project Overview ────────────────────── */}
        <Section id="project-overview" number="01" title="Project Overview">
          <p>
            AI Content Agent is a full-stack web application that automates the creation of
            platform-optimized social media content. Given a product description and target audience,
            the system generates tailored copy and image generation prompts for four major Chinese
            platforms: <strong>小红书 (Xiaohongshu)</strong>, <strong>抖音 (Douyin)</strong>,{" "}
            <strong>公众号 (WeChat Official Account)</strong>, and <strong>微博 (Weibo)</strong>.
          </p>
          <p>
            The project was built as a portfolio piece to demonstrate full-stack AI application
            engineering skills. Every component — from the AI prompt templates to the editorial B&W
            design system — was independently designed and implemented.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Live Demo", href: "/login", icon: ExternalLink },
              { label: "GitHub", href: "#", icon: GitBranch },
              { label: "README", href: "#", icon: FileText },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-black hover:text-white"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </Section>

        {/* ── 2. Problem & Solution ──────────────────── */}
        <Section id="problem--solution" number="02" title="Problem & Solution">
          <h3 className="text-xl font-medium tracking-tight">Problem</h3>
          <p>
            Content marketers and social media managers need to rewrite the same product information
            for multiple platforms — each with different content formats, tones, character limits,
            and audience expectations. Manually adapting copy for 小红书 (lifestyle种草), 抖音
            (short video scripts), 公众号 (long-form articles), and 微博 (hot-take threads) is
            repetitive and time-consuming.
          </p>
          <h3 className="mt-8 text-xl font-medium tracking-tight">Solution</h3>
          <p>
            The system combines product descriptions, target audience profiles, platform-specific
            formatting rules, and user-defined brand knowledge into structured prompts. These are
            sent to DeepSeek (via OpenAI-compatible SDK), which returns structured JSON with title,
            body, and image generation prompts. The generated content is saved as manageable assets
            with draft/review/published status workflow.
          </p>
        </Section>

        {/* ── 3. My Role ─────────────────────────────── */}
        <Section id="my-role" number="03" title="My Role">
          <p>
            This is an <strong>independent portfolio project</strong>. I personally designed and
            developed:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              "Frontend architecture with Next.js 14 App Router, React 18, TypeScript, and TailwindCSS",
              "Backend API with FastAPI, SQLAlchemy 2.0 async ORM, and Pydantic v2 validation",
              "AI generation pipeline with platform-specific prompt engineering and knowledge base RAG injection",
              "Database schema design for users, projects, platforms, contents, knowledge entries, and generation logs",
              "JWT authentication system with bcrypt password hashing, ownership-based access control, and rate limiting",
              "Editorial B&W design system with custom animation presets, responsive layout, and accessibility support",
              "Docker Compose production infrastructure with PostgreSQL, Redis, Celery, and Nginx",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* ── 4. Tech Stack ──────────────────────────── */}
        <Section id="tech-stack" number="04" title="Tech Stack">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                category: "Frontend",
                icon: Code2,
                items: ["Next.js 14 (App Router)", "React 18 + TypeScript", "TailwindCSS 3", "Framer Motion 11 + GSAP 3", "lucide-react icons", "sonner toast"],
              },
              {
                category: "Backend",
                icon: Server,
                items: ["FastAPI (Python 3.12)", "SQLAlchemy 2.0 Async", "Pydantic v2", "JWT + bcrypt auth", "Alembic migrations", "Uvicorn + Gunicorn"],
              },
              {
                category: "AI / ML",
                icon: Bot,
                items: ["DeepSeek (OpenAI SDK)", "Prompt Engineering", "Knowledge Base RAG", "JSON response parsing", "Mock fallback system"],
              },
              {
                category: "Database",
                icon: Database,
                items: ["SQLite (dev)", "PostgreSQL (prod-ready)", "asyncpg driver", "Connection pooling", "6-table schema"],
              },
              {
                category: "DevOps",
                icon: Container,
                items: ["Docker + Compose", "Nginx reverse proxy", "Celery + Redis", "Health checks", "Security headers"],
              },
              {
                category: "Design",
                icon: Palette,
                items: ["Editorial B&W system", "Custom design tokens", "Stagger animations", "Perspective transforms", "a11y + reduced-motion"],
              },
            ].map((group) => (
              <div
                key={group.category}
                className="border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <group.icon className="h-5 w-5 text-gray-400" />
                  <p className="mono-label text-gray-500">{group.category}</p>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-gray-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 5. Core Features ───────────────────────── */}
        <Section id="core-features" number="05" title="Core Features">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: User, label: "Demo Login", desc: "One-click demo account access — no registration required for portfolio reviewers." },
              { icon: Lock, label: "JWT Authentication", desc: "Register, login, profile update with bcrypt password hashing and Bearer token flow." },
              { icon: Folder, label: "Project Management", desc: "Create, edit, and delete content campaigns with product descriptions and target audiences." },
              { icon: Bot, label: "AI Content Generation", desc: "Multi-platform generation with 4 platforms × 3 tones = 12 prompt combinations." },
              { icon: Database, label: "Knowledge Base RAG", desc: "Brand/product/audience context entries injected into AI system prompts for on-brand output." },
              { icon: FileText, label: "Content Library", desc: "CRUD content management with status workflow, search, filter, and inline editing." },
              { icon: BarChart3, label: "Analytics Dashboard", desc: "Per-platform metrics, content ranking, and aggregation (demo data for portfolio)." },
              { icon: Palette, label: "Design System", desc: "Strict editorial B&W palette, custom animation presets, responsive all pages." },
              { icon: Container, label: "Docker Infrastructure", desc: "6-service Compose with PostgreSQL, Redis, Celery, Nginx, health checks." },
              { icon: Braces, label: "Async Generation", desc: "Background AI processing with frontend polling, graceful API error fallback." },
            ].map((feat) => (
              <div key={feat.label} className="border border-gray-200 bg-white p-5">
                <feat.icon className="h-5 w-5 text-gray-400" />
                <h4 className="mt-3 font-medium">{feat.label}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 6. AI Generation Pipeline ──────────────── */}
        <Section id="ai-generation-pipeline" number="06" title="AI Generation Pipeline">
          <p>The AI content generation follows a structured 8-step pipeline:</p>

          <div className="mt-8 space-y-4">
            {[
              { step: "1", title: "User Input", desc: "User selects project, platform (小红书/抖音/公众号/微博), tone (专业/幽默/煽情), and enters product description." },
              { step: "2", title: "Ownership Validation", desc: "Backend verifies the project belongs to the authenticated user and checks credit balance." },
              { step: "3", title: "Knowledge Context Loading", desc: "All knowledge base entries for the user are fetched and formatted as brand context." },
              { step: "4", title: "Prompt Assembly", desc: "Platform-specific formatting rules + tone rules + knowledge context are injected into the system prompt." },
              { step: "5", title: "API Call", desc: "Structured prompt is sent to DeepSeek API (OpenAI-compatible) with temperature=0.85 and max_tokens=2048." },
              { step: "6", title: "Response Parsing", desc: "JSON is extracted from the response — handles markdown fences, malformed JSON, and regex fallback extraction." },
              { step: "7", title: "Database Update", desc: "Content record is updated with title, body, image_prompt, model info, token count, and generation_status='completed'." },
              { step: "8", title: "Frontend Polling", desc: "Frontend polls GET /contents/:id every 1.5s until generation_status changes, then renders the result." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 border-l-2 border-gray-200 pl-5 hover:border-black transition-colors">
                <span className="mono-label mt-0.5 text-gray-400 flex-shrink-0">{s.step}</span>
                <div>
                  <h4 className="font-medium">{s.title}</h4>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ASCII flow diagram */}
          <div className="mt-8 overflow-x-auto border border-gray-200 bg-gray-50 p-6">
            <pre className="text-[11px] leading-relaxed text-gray-600 font-mono">
{`User Input → FastAPI → Prompt Builder → Knowledge Context
                                        ↓
                                  DeepSeek API
                                        ↓
                                  Response Parser
                                        ↓
                          ┌────────── Database ──────────┐
                          ↓                               ↓
                    Content Saved              Frontend Polling UI
                    (generation_status)        (1.5s interval)
                          ↓                               ↓
                    Celery Worker              Renders Completed
                    (production path)          Content`}
            </pre>
          </div>
        </Section>

        {/* ── 7. Database Design ─────────────────────── */}
        <Section id="database-design" number="07" title="Database Design">
          <p>The database schema has 6 tables designed around content generation workflow:</p>

          <div className="mt-6 space-y-4">
            {[
              { table: "users", purpose: "Authentication, profile, credits, email verification status, plan tier. Email is unique + indexed + lowercase-normalized." },
              { table: "projects", purpose: "Organizes content campaigns. Each project belongs to a user, stores product description and target audience. Cascading delete on contents." },
              { table: "platforms", purpose: "Reference table for supported platforms (slug, display_name, description). Seed data: 小红书, 抖音, 公众号, 微博." },
              { table: "contents", purpose: "Core entity — stores generated title, body, image_prompt, tone, status (draft/review/published), generation_status, and metrics." },
              { table: "knowledge_entries", purpose: "User's brand/product/audience knowledge entries. Categorized (product/brand/audience/style). Injected into AI prompts as context." },
              { table: "generation_logs", purpose: "Audit trail for each AI generation. Records model name, provider, token counts, duration, and cost per generation." },
            ].map((t) => (
              <div key={t.table} className="border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-400" />
                  <code className="text-sm font-medium">{t.table}</code>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.purpose}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border border-gray-200 bg-gray-50 p-6">
            <p className="mono-label text-gray-500 mb-3">Key Design Decisions</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• UUID primary keys — safe for distributed systems and API exposure</li>
              <li>• display_id (CNT-2048) — human-readable sequential ID separate from PK</li>
              <li>• generation_status separate from status — tracks AI pipeline independently from editorial workflow</li>
              <li>• platform as reference table — new platforms can be added without code changes</li>
              <li>• knowledge_entries as user-scoped — each user maintains their own brand memory</li>
              <li>• token_hash storage for email verification — plaintext tokens never persisted</li>
            </ul>
          </div>
        </Section>

        {/* ── 8. Security & Ownership ────────────────── */}
        <Section id="security--ownership" number="08" title="Security & Ownership">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Lock, label: "JWT Bearer Token", desc: "All protected endpoints require a valid JWT. Tokens expire after 7 days. Secret via environment variable." },
              { icon: Shield, label: "bcrypt Hashing", desc: "Passwords hashed with bcrypt (auto-tuned work factor). Never stored in plaintext." },
              { icon: Shield, label: "Ownership Checks", desc: "Users can only access their own projects, contents, and knowledge entries. Enforced via SQL JOIN on user_id." },
              { icon: Lock, label: "Rate Limiting", desc: "Redis-based: login 5/min per IP + 3/min per email, register 5/hour, AI generation configurable daily cap." },
              { icon: Shield, label: "Input Validation", desc: "Pydantic v2 validates all inputs — email format, password length, string lengths, enum values." },
              { icon: Lock, label: "SQL Injection Prevention", desc: "SQLAlchemy ORM with parameterized queries. No raw SQL string concatenation." },
              { icon: Shield, label: "Security Headers", desc: "X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, HSTS." },
              { icon: Lock, label: "Token Hash Storage", desc: "Email verification tokens stored as SHA-256 hash. Plaintext tokens never persisted to DB." },
            ].map((item) => (
              <div key={item.label} className="border border-gray-200 bg-white p-5">
                <item.icon className="h-5 w-5 text-gray-400" />
                <h4 className="mt-3 font-medium">{item.label}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 9. Design System ───────────────────────── */}
        <Section id="design-system" number="09" title="Design System">
          <p>
            The project follows a strict <strong>Editorial Black & White</strong> design language:
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Palette", desc: "Pure B&W: #fcfcfc bg, #111 fg, gray-300 borders. No chromatic colors, no gradients." },
              { label: "Typography", desc: "Inter font family, -0.03em tracking on headings, 1.08/1.6 line-height ratios, clamp() responsive sizing." },
              { label: "Animation", desc: "Framer Motion stagger + fadeUp presets, cubic-bezier(0.16, 1, 0.3, 1) easing, AnimatePresence transitions." },
              { label: "Spacing", desc: "Tailwind 4px grid scale exclusively. Section padding: py-20 to py-32." },
              { label: "Buttons", desc: "3 variants only: Primary CTA, Ghost, Icon. All use hover:-translate-y-0.5 lift." },
              { label: "Cards", desc: "border + bg-white + shadow-soft, hover:-translate-y-1 + shadow-editorial." },
              { label: "Accessibility", desc: "focus-visible outlines, aria-labels on icon buttons, prefers-reduced-motion support." },
              { label: "Dark Mode", desc: "Dark sections use bg-[#111] / #0a0a0a with white text. Light sections use bg-[#fcfcfc]." },
            ].map((item) => (
              <div key={item.label} className="border border-gray-200 bg-white p-5">
                <h4 className="font-medium text-sm">{item.label}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 10. Challenges & Solutions ─────────────── */}
        <Section id="challenges--solutions" number="10" title="Challenges & Solutions">
          {[
            {
              challenge: "Long-running AI generation blocks HTTP responses",
              solution: "Created placeholder content with generation_status='processing', returned immediately. Frontend polls every 1.5s until completion. Celery + Redis queued for production to survive server restarts.",
            },
            {
              challenge: "Different platforms require different content structures",
              solution: "Designed PLATFORM_RULES and TONE_RULES dictionaries with platform-specific formatting instructions injected into the system prompt. Each platform gets optimized output (emoji+hashtags for 小红书, hook+CTA for 抖音, markdown for 公众号, thread format for 微博).",
            },
            {
              challenge: "AI outputs aren't always on-brand",
              solution: "Built Knowledge Base feature — users add brand/product/audience entries. These are formatted and injected into the system prompt as lightweight RAG, giving the AI brand-specific context for more accurate generation.",
            },
            {
              challenge: "AI API responses are inconsistent (markdown fences, malformed JSON)",
              solution: "Implemented multi-strategy parser: direct JSON.parse → strip markdown fences → regex extraction of first JSON object → full text as body fallback. Added mock fallback templates when API is unavailable.",
            },
            {
              challenge: "Users shouldn't access other users' data",
              solution: "All database queries include ownership checks via SQL JOIN on user_id. Projects, contents, and knowledge entries are all scoped to the authenticated user. Authorization middleware extracts user from JWT on every request.",
            },
            {
              challenge: "Free AI API keys can be rate-limited or expire",
              solution: "Provider-agnostic configuration — switch between DeepSeek/OpenAI/any compatible API by changing AI_BASE_URL. All API errors (429, 401, network) are caught gracefully with mock fallback generation so the app never returns 500.",
            },
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                <div>
                  <h4 className="font-medium">Challenge: {item.challenge}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    <strong>Solution:</strong> {item.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Section>

        {/* ── 11. Current Limitations ────────────────── */}
        <Section id="current-limitations" number="11" title="Current Limitations">
          <p className="text-sm text-gray-600 mb-6">
            Being honest about limitations demonstrates engineering maturity. Here is what this portfolio project does not (yet) include:
          </p>
          <ul className="space-y-3">
            {[
              "Async generation currently uses asyncio.create_task (MVP pattern) — Celery + Redis task queue is Docker-configured but not activated in dev mode.",
              "Analytics dashboard displays locally stored demo metrics, not real-time social platform API data.",
              "Direct publishing to 小红书/抖音/公众号/微博 via their official APIs is not integrated.",
              "AI generates image_prompt text but does not call DALL-E/Stable Diffusion for actual image generation.",
              "Payment/subscription (Stripe) is a design concept — pricing cards demonstrate SaaS product thinking but are not functional.",
              "Email verification and password reset are implemented in code but require SMTP credentials to activate.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                <span className="mono-label mt-0.5 text-gray-400">{String(i + 1).padStart(2, "0")}.</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* ── 12. Future Improvements ────────────────── */}
        <Section id="future-improvements" number="12" title="Future Improvements">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { phase: "Phase A", items: ["Celery + Redis production task queue", "PostgreSQL migration from SQLite", "Email verification + password reset (SMTP)", "Redis-based rate limiting (configured)", "Nginx production deployment with HTTPS"] },
              { phase: "Phase B", items: ["DALL-E / Stable Diffusion image generation", "Content version history (A/B testing)", "PDF / Markdown / CSV export", "Content calendar with drag-and-drop", "Time-series analytics charts (Recharts)"] },
              { phase: "Phase C", items: ["Stripe subscription billing", "Team collaboration (RBAC)", "Direct platform publishing APIs", "AI brand voice fine-tuning", "Mobile app (React Native)"] },
            ].map((group) => (
              <div key={group.phase} className="border border-gray-200 bg-white p-5">
                <p className="mono-label text-gray-500">{group.phase}</p>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <ArrowRight className="h-3 w-3 flex-shrink-0 text-gray-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 13. What I Learned ──────────────────────── */}
        <Section id="what-i-learned" number="13" title="What I Learned">
          <div className="prose prose-gray max-w-none">
            <p>
              Building AI Content Agent end-to-end taught me how to productize an AI application
              beyond a Jupyter notebook or CLI script. Key learnings:
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Bot, label: "Prompt Engineering", desc: "Designing structured prompts that produce consistent, parseable JSON across different AI models requires careful constraint specification and multi-strategy response parsing." },
                { icon: Layers, label: "Full-Stack Architecture", desc: "Connecting a React frontend to an async Python backend with JWT auth, database models, and background task processing requires thoughtful state management and error handling at every layer." },
                { icon: Database, label: "Data Modeling", desc: "Designing relational schemas for multi-tenant SaaS — UUID PKs, ownership via FK relationships, audit logs, and separation of editorial status from generation status." },
                { icon: Lock, label: "Security Thinking", desc: "bcrypt hashing, JWT token flow, ownership enforcement on every query, rate limiting, input validation, and security headers — security is not a feature, it's a layer." },
                { icon: Palette, label: "Design Engineering", desc: "Building a consistent design system from scratch — typography scale, spacing grid, animation presets, accessibility — is as rigorous as backend engineering." },
                { icon: Container, label: "DevOps", desc: "Containerizing a multi-service application with Docker Compose, configuring health checks, connection pooling, and production WSGI servers turns a dev project into deployable infrastructure." },
              ].map((item) => (
                <div key={item.label} className="border border-gray-200 bg-white p-5">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <h4 className="mt-3 font-medium">{item.label}</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Bottom CTA ──────────────────────────────── */}
        <motion.div variants={fadeUp} className="mt-20 border border-gray-300 bg-[#111] p-10 text-center text-white">
          <h2 className="text-3xl font-medium tracking-tight">Explore the live demo.</h2>
          <p className="mt-3 text-sm text-gray-400">
            See the full AI content workflow in action — no registration needed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:shadow-editorial"
            >
              <Sparkles className="h-4 w-4" />
              Try Live Demo
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-gray-700 px-6 py-3.5 text-sm font-medium text-white transition hover:border-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-[#fcfcfc] px-6 py-8 text-center md:px-16">
        <p className="text-xs text-gray-400">
          AI Content Agent · Portfolio Project · Built by [Your Name] · 2026
        </p>
      </footer>
    </main>
  );
}

/* ── Section helper component ──────────────────────── */

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-20 scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="mono-label text-gray-400">{number}</span>
        <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-gray-700">
        {children}
      </div>
    </motion.section>
  );
}

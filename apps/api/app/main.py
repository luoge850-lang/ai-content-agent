"""FastAPI application entry point — production-ready with security headers."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.api.router import api_router
from app.config import settings
from app.database import engine, Base, wait_for_db


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security-related HTTP headers to every response."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=()"
        )
        # HSTS (only in production with HTTPS)
        if not settings.debug:
            response.headers[
                "Strict-Transport-Security"
            ] = "max-age=31536000; includeSubDomains"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle.

    In dev: auto-create tables (convenience).
    In prod: wait for DB, then rely on Alembic migrations.
    """
    if settings.debug:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    else:
        await wait_for_db(retries=10, interval=2.0)

    # Warm up Redis if configured
    try:
        from app.redis import get_redis

        await get_redis()
    except Exception:
        pass

    yield

    # Graceful shutdown
    await engine.dispose()
    try:
        from app.redis import close_redis

        await close_redis()
    except Exception:
        pass


app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# ── Middleware stack (order matters!) ────────────────────

# 1. Security headers
app.add_middleware(SecurityHeadersMiddleware)

# 2. CORS — must be restrictive in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if not settings.debug else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# 3. Trusted proxy headers (needed behind Nginx / load balancer)
#    In production, set TRUSTED_PROXIES to the Nginx container IP range.
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],  # Allow all hosts; Nginx handles host filtering
)


# ── Health check (no auth required) ──────────────────────

@app.get("/health")
async def health():
    """Kubernetes / Docker health probe."""
    redis_ok = False
    try:
        from app.redis import check_redis_health

        redis_ok = await check_redis_health()
    except Exception:
        pass

    return {
        "status": "ok",
        "service": settings.app_name,
        "version": "0.2.0",
        "redis": "connected" if redis_ok else "unavailable",
        "debug": settings.debug,
    }


# ── API routes ───────────────────────────────────────────

app.include_router(api_router)

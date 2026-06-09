"""Application configuration — reads from environment variables.

All secrets and endpoints are configured via environment variables.
No hardcoded credentials.  See .env.example for the full list.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────
    app_name: str = "AI Content Agent API"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000"]
    frontend_base_url: str = "http://localhost:3000"

    # ── Database ─────────────────────────────────────────
    # Dev:  sqlite+aiosqlite:///./ai_content_agent.db
    # Prod: postgresql+asyncpg://user:pass@host:5432/dbname
    database_url: str = "sqlite+aiosqlite:///./ai_content_agent.db"

    # PostgreSQL connection pool (only used when DATABASE_URL is postgresql)
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_pool_timeout: int = 30
    db_pool_recycle: int = 3600  # recycle connections every hour

    # ── Redis ────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    redis_password: str = ""

    # Celery broker & result backend (derived from REDIS_URL if not set)
    celery_broker_url: str = ""
    celery_result_backend: str = ""

    # ── JWT ──────────────────────────────────────────────
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days

    # ── AI ───────────────────────────────────────────────
    ai_api_key: str = ""
    ai_base_url: str = "https://api.deepseek.com/v1"
    ai_model: str = "deepseek-chat"
    # Daily AI call limit per user (0 = unlimited)
    ai_daily_limit: int = 50

    # ── Email / SMTP ─────────────────────────────────────
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@aicontentagent.local"
    smtp_use_tls: bool = True

    # ── Email verification ───────────────────────────────
    email_verification_token_expire_minutes: int = 60  # 1 hour

    # ── Rate limiting ────────────────────────────────────
    rate_limit_enabled: bool = True
    # Login: per-IP per minute
    rate_limit_login_ip: str = "5/minute"
    rate_limit_login_email: str = "3/minute"
    # Register: per-IP per hour
    rate_limit_register_ip: str = "5/hour"
    # Resend verification: per-email
    rate_limit_resend_email: str = "1/minute;5/day"
    # AI generation: per-user per day
    rate_limit_ai_user: str = "50/day"
    # Upload
    rate_limit_upload: str = "20/hour"

    # ── Security ─────────────────────────────────────────
    # Comma-separated list of trusted proxy IPs / CIDRs
    trusted_proxies: str = "127.0.0.1,::1"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

# ── Derived settings ─────────────────────────────────────
if not settings.celery_broker_url:
    settings.celery_broker_url = settings.redis_url
if not settings.celery_result_backend:
    settings.celery_result_backend = settings.redis_url

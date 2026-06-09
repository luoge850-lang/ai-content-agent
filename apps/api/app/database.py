"""SQLAlchemy async engine + session factory.

Supports both SQLite (dev) and PostgreSQL (prod) via DATABASE_URL.
PostgreSQL connection pooling is configured for production workloads.
"""

from __future__ import annotations

import asyncio
import logging

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

logger = logging.getLogger("database")

# ── Engine creation ──────────────────────────────────────
_connect_args: dict = {}

if settings.database_url.startswith("sqlite"):
    # SQLite needs check_same_thread=False for async
    _connect_args["check_same_thread"] = False

    engine = create_async_engine(
        settings.database_url,
        echo=settings.debug,
        connect_args=_connect_args,
    )
else:
    # PostgreSQL / asyncpg with connection pooling
    engine = create_async_engine(
        settings.database_url,
        echo=settings.debug,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_timeout=settings.db_pool_timeout,
        pool_recycle=settings.db_pool_recycle,
        pool_pre_ping=True,  # verify connections before use
    )

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


# ── FastAPI dependency ───────────────────────────────────

async def get_db() -> AsyncSession:
    """FastAPI dependency — yields an async database session.

    The session is committed on success, rolled back on exception.
    """
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ── Startup helper ───────────────────────────────────────

async def wait_for_db(retries: int = 10, interval: float = 2.0) -> bool:
    """Wait for the database to become available (useful in Docker).

    Returns True if connected, False after exhausting retries.
    """
    for i in range(retries):
        try:
            async with engine.connect() as conn:
                await conn.execute(asyncio.sleep(0))  # type: ignore[arg-type]
                # actually test: run a trivial query
                await conn.run_sync(lambda _: None)
            logger.info("Database connection established")
            return True
        except Exception as exc:
            logger.warning(
                "Database not ready (%d/%d): %s", i + 1, retries, exc
            )
            if i < retries - 1:
                await asyncio.sleep(interval)
    logger.error("Could not connect to database after %d retries", retries)
    return False

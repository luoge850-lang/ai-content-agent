"""Redis client — used by Celery, rate-limiter, and cache layers.

Connection is lazily created on first use.  Redis is optional at import
time (the app works without it in dev), but rate-limiting and Celery
require it in production.
"""

from __future__ import annotations

import logging
from typing import AsyncIterator
from contextlib import asynccontextmanager

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger("redis")

_pool: aioredis.ConnectionPool | None = None
_client: aioredis.Redis | None = None


def _build_redis_url() -> str:
    """Build a Redis URL that includes the password if configured."""
    url = settings.redis_url
    if settings.redis_password:
        # Insert password into the URL: redis://:password@host:port/db
        if "://" in url:
            scheme, rest = url.split("://", 1)
            url = f"{scheme}://:{settings.redis_password}@{rest}"
    return url


async def get_redis() -> aioredis.Redis:
    """Return a shared Redis client (creates the pool on first call)."""
    global _pool, _client
    if _client is None:
        redis_url = _build_redis_url()
        _pool = aioredis.ConnectionPool.from_url(
            redis_url,
            max_connections=20,
            decode_responses=True,
        )
        _client = aioredis.Redis(connection_pool=_pool)
        logger.info("Redis connection pool created")
    return _client


async def close_redis():
    """Gracefully close the Redis connection pool."""
    global _pool, _client
    if _client:
        await _client.close()
        _client = None
        _pool = None
        logger.info("Redis connection pool closed")


@asynccontextmanager
async def redis_ctx() -> AsyncIterator[aioredis.Redis]:
    """Context manager that returns a Redis client and closes it on exit.

    Useful for one-shot operations (health checks, scripts).
    """
    r = await get_redis()
    try:
        yield r
    finally:
        pass  # pool is shared — don't close here


async def check_redis_health() -> bool:
    """Return True if Redis is reachable."""
    try:
        r = await get_redis()
        await r.ping()
        return True
    except Exception:
        return False

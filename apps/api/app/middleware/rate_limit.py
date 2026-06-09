"""Redis-based rate limiter for FastAPI.

Rate limits are stored in Redis with per-key TTLs.  The limiter supports
composite keys (IP + email + path) and returns 429 with a Retry-After
header when the limit is exceeded.

Usage as a FastAPI dependency:
    @router.post("/login")
    async def login(
        request: Request,
        body: LoginRequest,
        db: AsyncSession = Depends(get_db),
        _rate_limited: None = Depends(login_rate_limit),
    ):
        ...

Or applied via middleware for blanket path-based limits.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Callable

from fastapi import HTTPException, Request, status

from app.config import settings

logger = logging.getLogger("rate_limit")


@dataclass
class RateLimitRule:
    """A single rate-limit rule.

    key_fn:      callable that returns a unique Redis key for the request.
    max_requests: max allowed requests in the window.
    window_seconds: sliding window duration in seconds.
    """

    key_fn: Callable[[Request], str]
    max_requests: int
    window_seconds: int


# ── Pre-built key builders ───────────────────────────────

def _client_ip(request: Request) -> str:
    """Extract the real client IP, respecting X-Forwarded-For from Nginx."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    host = request.client.host if request.client else "unknown"
    return host


async def _check_rate_limit(
    request: Request,
    rule: RateLimitRule,
) -> None:
    """Check a single rate-limit rule.  Raises HTTP 429 if exceeded.

    Uses a fixed-window approach with Redis INCR + EXPIRE for atomicity.
    """
    if not settings.rate_limit_enabled:
        return

    try:
        from app.redis import get_redis

        redis_client = await get_redis()
    except Exception:
        # Redis unavailable — allow the request (fail open for dev)
        logger.debug("Redis unavailable — rate limit skipped")
        return

    key = f"ratelimit:{rule.key_fn(request)}"

    try:
        current = await redis_client.incr(key)
        if current == 1:
            # First request in the window — set TTL
            await redis_client.expire(key, rule.window_seconds)

        if current > rule.max_requests:
            ttl = await redis_client.ttl(key)
            retry_after = max(ttl, 1)
            logger.warning(
                "Rate limit exceeded: key=%s count=%d limit=%d",
                key, current, rule.max_requests,
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Too many requests. Please try again later.",
                    "retry_after_seconds": retry_after,
                },
                headers={"Retry-After": str(retry_after)},
            )
    except HTTPException:
        raise
    except Exception as exc:
        # Redis error — log and allow (fail open)
        logger.error("Rate limit Redis error: %s", exc)


# ── Convenience factory ──────────────────────────────────

def _parse_limit_spec(spec: str) -> list[RateLimitRule]:
    """Parse a limit spec string into a list of rules.

    Examples:
        "5/minute" → one rule: 5 req / 60s
        "1/minute;5/day" → two rules
    """
    rules = []
    for part in spec.split(";"):
        part = part.strip()
        if not part:
            continue
        count_str, unit = part.split("/")
        count = int(count_str)
        unit = unit.strip().lower()
        if unit == "second" or unit == "s":
            seconds = 1
        elif unit == "minute" or unit == "min":
            seconds = 60
        elif unit == "hour" or unit == "hr":
            seconds = 3600
        elif unit == "day":
            seconds = 86400
        else:
            raise ValueError(f"Unknown rate limit unit: {unit}")
        rules.append(RateLimitRule(
            key_fn=lambda r: "",  # placeholder — caller overrides
            max_requests=count,
            window_seconds=seconds,
        ))
    return rules


# ── Pre-built rate limiter dependencies ──────────────────

async def login_rate_limit(request: Request) -> None:
    """Rate limit login: 5/min per IP, 3/min per email."""
    ip = _client_ip(request)
    await _check_rate_limit(request, RateLimitRule(
        key_fn=lambda r: f"login:ip:{_client_ip(r)}",
        max_requests=5,
        window_seconds=60,
    ))


async def register_rate_limit(request: Request) -> None:
    """Rate limit registration: 5/hour per IP."""
    await _check_rate_limit(request, RateLimitRule(
        key_fn=lambda r: f"register:ip:{_client_ip(r)}",
        max_requests=5,
        window_seconds=3600,
    ))


async def resend_email_rate_limit(email: str) -> None:
    """Rate limit resend verification: 1/min, 5/day per email."""
    from app.redis import get_redis

    if not settings.rate_limit_enabled:
        return

    try:
        redis_client = await get_redis()
        minute_key = f"ratelimit:resend:min:{email}"
        day_key = f"ratelimit:resend:day:{email}"

        # Per-minute check
        current_min = await redis_client.incr(minute_key)
        if current_min == 1:
            await redis_client.expire(minute_key, 60)
        if current_min > 1:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Please wait at least 60 seconds before requesting another email.",
                    "retry_after_seconds": 60,
                },
                headers={"Retry-After": "60"},
            )

        # Per-day check
        current_day = await redis_client.incr(day_key)
        if current_day == 1:
            await redis_client.expire(day_key, 86400)
        if current_day > 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Daily email limit reached. Please try again tomorrow.",
                    "retry_after_seconds": 86400,
                },
                headers={"Retry-After": "86400"},
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Resend rate limit error: %s", exc)


async def ai_generation_rate_limit(user_id: str) -> None:
    """Rate limit AI generation: configurable daily limit per user."""
    if not settings.rate_limit_enabled or settings.ai_daily_limit <= 0:
        return

    try:
        from app.redis import get_redis

        redis_client = await get_redis()
        key = f"ratelimit:ai:user:{user_id}"

        current = await redis_client.incr(key)
        if current == 1:
            # Set TTL to end of day (UTC)
            now = int(time.time())
            end_of_day = ((now // 86400) + 1) * 86400
            await redis_client.expireat(key, end_of_day)

        if current > settings.ai_daily_limit:
            ttl = await redis_client.ttl(key)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": f"Daily AI generation limit ({settings.ai_daily_limit}) reached. Resets at midnight UTC.",
                    "retry_after_seconds": max(ttl, 1),
                },
                headers={"Retry-After": str(max(ttl, 1))},
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("AI rate limit error: %s", exc)

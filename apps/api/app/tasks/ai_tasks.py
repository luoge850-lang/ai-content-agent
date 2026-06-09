"""Celery AI tasks — async generation, batch processing.

Replaces the old asyncio.create_task pattern with proper Celery tasks
that survive restarts, support retries, and can be monitored.

If Celery is not available (dev without Redis), falls back to direct
execution via the legacy asyncio.create_task pattern.
"""

from __future__ import annotations

import logging

from app.config import settings

logger = logging.getLogger("ai_tasks")

# Celery may not be available in dev
try:
    from app.tasks.celery_app import celery_app as _celery
    if _celery is None:
        raise ImportError("Celery not configured")
    CELERY_OK = True
except (ImportError, Exception):
    _celery = None
    CELERY_OK = False


def _run_generation_impl(
    content_id: str,
    platform_slug: str,
    tone: str,
    product_desc: str,
    audience: str,
    knowledge_ctx: str = "",
) -> dict:
    """Core AI generation logic — usable with or without Celery."""
    import asyncio
    from sqlalchemy import select
    from app.database import async_session
    from app.models.content import Content
    from app.services.ai import generate_ai

    async def _run():
        title, body_text, image_prompt, model, tokens_used, duration_ms = (
            await generate_ai(
                platform_slug, tone, product_desc, audience, knowledge_ctx,
            )
        )

        async with async_session() as db:
            result = await db.execute(
                select(Content).where(Content.id == content_id)
            )
            content = result.scalar_one_or_none()
            if content:
                content.title = title
                content.body = body_text
                content.image_prompt = image_prompt
                content.generation_status = "completed"
                await db.commit()
                logger.info(
                    "AI generation complete: %s model=%s tokens=%s",
                    content.display_id, model, tokens_used,
                )
                return {
                    "status": "completed",
                    "content_id": content_id,
                    "display_id": content.display_id,
                    "model": model,
                    "tokens_used": tokens_used,
                    "duration_ms": duration_ms,
                }
            else:
                logger.error("Content not found: %s", content_id)
                return {"status": "error", "reason": "content_not_found"}

    return asyncio.run(_run())


def _handle_generation_failure(content_id: str):
    """Mark a content as failed in the database."""
    import asyncio
    from sqlalchemy import select
    from app.database import async_session
    from app.models.content import Content

    async def _mark():
        async with async_session() as db:
            result = await db.execute(
                select(Content).where(Content.id == content_id)
            )
            content = result.scalar_one_or_none()
            if content:
                content.title = "Generation failed"
                content.generation_status = "failed"
                await db.commit()

    asyncio.run(_mark())


# ── Celery task wrapper ──────────────────────────────────

if CELERY_OK:
    from celery.utils.log import get_task_logger
    celery_logger = get_task_logger(__name__)

    @_celery.task(  # type: ignore[misc]
        bind=True,
        name="run_ai_generation",
        max_retries=2,
        default_retry_delay=30,
        acks_late=True,
        queue="ai_queue",
    )
    def run_ai_generation_task(
        self,
        content_id: str,
        platform_slug: str,
        tone: str,
        product_desc: str,
        audience: str,
        knowledge_ctx: str = "",
    ) -> dict:
        task_id = self.request.id
        celery_logger.info(
            "AI generation starting: content=%s platform=%s tone=%s (task=%s)",
            content_id, platform_slug, tone, task_id,
        )

        try:
            return _run_generation_impl(
                content_id, platform_slug, tone, product_desc,
                audience, knowledge_ctx,
            )
        except Exception as exc:
            celery_logger.error(
                "AI generation failed: content=%s attempt=%d/%d: %s",
                content_id, self.request.retries + 1, self.max_retries + 1, exc,
            )

            if self.request.retries >= self.max_retries:
                _handle_generation_failure(content_id)

            raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))

else:
    # ── Fallback: use asyncio.create_task (legacy pattern) ──

    import asyncio

    def run_ai_generation_task(
        content_id: str,
        platform_slug: str,
        tone: str,
        product_desc: str,
        audience: str,
        knowledge_ctx: str = "",
    ) -> dict | None:
        """Direct execution via asyncio.create_task (dev mode, no Celery).

        In dev mode, the API endpoint already handles this via the old
        asyncio.create_task pattern.  This fallback runs synchronously.
        """
        logger.info(
            "Celery not available — running AI generation synchronously: content=%s",
            content_id,
        )
        try:
            return _run_generation_impl(
                content_id, platform_slug, tone, product_desc,
                audience, knowledge_ctx,
            )
        except Exception as exc:
            logger.error("AI generation failed: content=%s: %s", content_id, exc)
            _handle_generation_failure(content_id)
            return {"status": "failed", "error": str(exc)}

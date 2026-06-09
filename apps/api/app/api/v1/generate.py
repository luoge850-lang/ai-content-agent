"""AI generation endpoint — uses Celery for background processing.

Supports single-platform and batch multi-platform generation.
AI generation is rate-limited per user (configurable daily limit).
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.middleware.auth import get_current_user
from app.middleware.rate_limit import ai_generation_rate_limit
from app.models.content import Content
from app.models.knowledge import KnowledgeEntry
from app.models.platform import Platform
from app.models.project import Project
from app.models.user import User
from app.schemas.generate import (
    BatchGenerateResponse,
    GenerateRequest,
    GenerateResponse,
)
from app.tasks.ai_tasks import run_ai_generation_task

logger = logging.getLogger("generate")
router = APIRouter(prefix="/generate", tags=["Generate"])


async def _build_knowledge_context(user_id: str) -> str:
    """Fetch all knowledge entries for a user and format as context string."""
    from app.database import async_session

    async with async_session() as db:
        result = await db.execute(
            select(KnowledgeEntry)
            .where(KnowledgeEntry.user_id == user_id)
            .order_by(KnowledgeEntry.category)
        )
        entries = result.scalars().all()
        if not entries:
            return ""
        lines = []
        for e in entries:
            lines.append(f"[{e.category}] {e.title}: {e.content}")
        return "\n".join(lines)


@router.post("/", response_model=GenerateResponse)
async def generate_content(
    body: GenerateRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate content via AI (Celery background task).

    Supports single platform or batch (platform_slugs array).
    Returns immediately with placeholder content — frontend polls
    GET /contents/:id until generation_status == "completed".
    """
    # ── AI rate limit ────────────────────────────────────
    await ai_generation_rate_limit(current_user.id)

    # ── Verify project ownership ─────────────────────────
    proj_result = await db.execute(
        select(Project).where(
            Project.id == body.project_id, Project.user_id == current_user.id
        )
    )
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(404, detail="Project not found")

    # ── Resolve platforms ────────────────────────────────
    slugs = body.platform_slugs if body.platform_slugs else [body.platform_slug]
    if len(slugs) > 4:
        slugs = slugs[:4]

    # ── Check credits ────────────────────────────────────
    needed = len(slugs)
    if current_user.credits_remaining < needed:
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Need {needed} credits, have {current_user.credits_remaining}.",
        )

    product_desc = body.product_description or project.product_description
    audience = body.target_audience or project.target_audience

    # ── Fetch knowledge context ──────────────────────────
    knowledge_ctx = await _build_knowledge_context(current_user.id)

    # ── Deduct credits ───────────────────────────────────
    current_user.credits_remaining -= needed

    # ── Get next display_id sequence ─────────────────────
    count_result = await db.execute(
        select(Content).order_by(Content.created_at.desc()).limit(1)
    )
    last_content = count_result.scalar_one_or_none()
    next_num_base = (
        int(last_content.display_id.split("-")[1]) + 1
        if (last_content and last_content.display_id.startswith("CNT-"))
        else 2048
    )

    # ── Create placeholders, enqueue Celery tasks ────────
    created = []
    for i, slug in enumerate(slugs):
        plat_result = await db.execute(
            select(Platform).where(Platform.slug == slug)
        )
        platform = plat_result.scalar_one_or_none()
        if not platform:
            continue

        content = Content(
            display_id=f"CNT-{next_num_base + i}",
            project_id=project.id,
            platform_id=platform.id,
            title="Generating...",
            body="",
            image_prompt="",
            tone=body.tone,
            status="draft",
            generation_status="processing",
        )
        db.add(content)
        created.append((content, slug))

    # Commit placeholders before enqueueing Celery tasks
    await db.commit()
    for c, _ in created:
        await db.refresh(c)

    # ── Enqueue Celery tasks (after commit!) ─────────────
    for content, slug in created:
        if hasattr(run_ai_generation_task, "delay"):
            run_ai_generation_task.delay(
                content_id=content.id,
                platform_slug=slug,
                tone=body.tone,
                product_desc=product_desc,
                audience=audience,
                knowledge_ctx=knowledge_ctx,
            )
        else:
            # Dev fallback: run via asyncio.create_task (legacy pattern)
            import asyncio
            asyncio.create_task(
                _run_generation_legacy(
                    content_id=content.id,
                    platform_slug=slug,
                    tone=body.tone,
                    product_desc=product_desc,
                    audience=audience,
                    knowledge_ctx=knowledge_ctx,
                )
            )
        logger.info(
            "AI generation enqueued: content=%s platform=%s",
            content.display_id, slug,
        )

    first = created[0][0]
    return GenerateResponse(
        content_id=first.id,
        display_id=first.display_id,
        title=first.title,
        body=first.body,
        image_prompt=first.image_prompt,
        platform_slug=created[0][1],
        tone=body.tone,
        model="pending",
        tokens_used=0,
        duration_ms=0,
        generation_status="processing",
    )


@router.post("/batch", response_model=BatchGenerateResponse)
async def batch_generate(
    body: GenerateRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Batch generate across multiple platforms. Returns placeholder results."""
    await ai_generation_rate_limit(current_user.id)

    proj_result = await db.execute(
        select(Project).where(
            Project.id == body.project_id, Project.user_id == current_user.id
        )
    )
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(404, detail="Project not found")

    slugs = body.platform_slugs if body.platform_slugs else [body.platform_slug]
    if len(slugs) > 4:
        slugs = slugs[:4]

    needed = len(slugs)
    if current_user.credits_remaining < needed:
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Need {needed} credits, have {current_user.credits_remaining}.",
        )

    product_desc = body.product_description or project.product_description
    audience = body.target_audience or project.target_audience
    knowledge_ctx = await _build_knowledge_context(current_user.id)
    current_user.credits_remaining -= needed

    count_result = await db.execute(
        select(Content).order_by(Content.created_at.desc()).limit(1)
    )
    last_content = count_result.scalar_one_or_none()
    next_num_base = (
        int(last_content.display_id.split("-")[1]) + 1
        if (last_content and last_content.display_id.startswith("CNT-"))
        else 2048
    )

    results = []
    for i, slug in enumerate(slugs):
        plat_result = await db.execute(
            select(Platform).where(Platform.slug == slug)
        )
        platform = plat_result.scalar_one_or_none()
        if not platform:
            continue

        content = Content(
            display_id=f"CNT-{next_num_base + i}",
            project_id=project.id,
            platform_id=platform.id,
            title="Generating...",
            body="",
            image_prompt="",
            tone=body.tone,
            status="draft",
            generation_status="processing",
        )
        db.add(content)
        await db.flush()
        await db.refresh(content)

        results.append(
            GenerateResponse(
                content_id=content.id,
                display_id=content.display_id,
                title=content.title,
                body=content.body,
                image_prompt=content.image_prompt,
                platform_slug=slug,
                tone=body.tone,
                model="pending",
                tokens_used=0,
                duration_ms=0,
                generation_status="processing",
            )
        )

    # Commit before enqueuing
    await db.commit()

    # Enqueue Celery tasks
    for result in results:
        if hasattr(run_ai_generation_task, "delay"):
            run_ai_generation_task.delay(
                content_id=result.content_id,
                platform_slug=result.platform_slug,
                tone=body.tone,
                product_desc=product_desc,
                audience=audience,
                knowledge_ctx=knowledge_ctx,
            )
        else:
            import asyncio
            asyncio.create_task(
                _run_generation_legacy(
                    content_id=result.content_id,
                    platform_slug=result.platform_slug,
                    tone=body.tone,
                    product_desc=product_desc,
                    audience=audience,
                    knowledge_ctx=knowledge_ctx,
                )
            )

    return BatchGenerateResponse(results=results, total_credits_used=needed)


# ── Legacy fallback (dev without Celery) ─────────────────

async def _run_generation_legacy(
    content_id: str,
    platform_slug: str,
    tone: str,
    product_desc: str,
    audience: str,
    knowledge_ctx: str = "",
):
    """Background task fallback when Celery is not available.

    Uses the old asyncio.create_task pattern.  This does NOT survive
    server restarts — Celery is the production path.
    """
    try:
        from app.services.ai import generate_ai
        from app.database import async_session
        from sqlalchemy import select
        from app.models.content import Content

        title, body_text, image_prompt, model, tokens_used, duration_ms = (
            await generate_ai(platform_slug, tone, product_desc, audience, knowledge_ctx)
        )

        async with async_session() as db:
            result = await db.execute(select(Content).where(Content.id == content_id))
            content = result.scalar_one_or_none()
            if content:
                content.title = title
                content.body = body_text
                content.image_prompt = image_prompt
                content.generation_status = "completed"
                await db.commit()
                logger.info(
                    "Generation complete %s: model=%s tokens=%s",
                    content.display_id, model, tokens_used,
                )
    except Exception as exc:
        logger.error("Generation failed %s: %s", content_id, exc)
        from app.database import async_session
        from sqlalchemy import select
        from app.models.content import Content

        async with async_session() as db:
            result = await db.execute(select(Content).where(Content.id == content_id))
            content = result.scalar_one_or_none()
            if content:
                content.title = "Generation failed"
                content.generation_status = "failed"
                await db.commit()

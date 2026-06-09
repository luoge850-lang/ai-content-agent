"""Knowledge Base API — brand/product/audience context for AI generation."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.knowledge import KnowledgeEntry
from app.models.user import User
from app.schemas.knowledge import (
    KnowledgeCreate,
    KnowledgeResponse,
    KnowledgeUpdate,
)

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])


@router.get("/", response_model=list[KnowledgeResponse])
async def list_entries(
    category: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List knowledge entries for current user, optionally filtered by category."""
    stmt = select(KnowledgeEntry).where(
        KnowledgeEntry.user_id == current_user.id
    )
    if category:
        stmt = stmt.where(KnowledgeEntry.category == category)
    stmt = stmt.order_by(KnowledgeEntry.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=KnowledgeResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    body: KnowledgeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new knowledge entry."""
    entry = KnowledgeEntry(
        user_id=current_user.id,
        title=body.title,
        content=body.content,
        category=body.category,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.patch("/{entry_id}", response_model=KnowledgeResponse)
async def update_entry(
    entry_id: str,
    body: KnowledgeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a knowledge entry."""
    result = await db.execute(
        select(KnowledgeEntry).where(
            KnowledgeEntry.id == entry_id,
            KnowledgeEntry.user_id == current_user.id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    if body.title is not None:
        entry.title = body.title
    if body.content is not None:
        entry.content = body.content
    if body.category is not None:
        entry.category = body.category

    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a knowledge entry."""
    result = await db.execute(
        select(KnowledgeEntry).where(
            KnowledgeEntry.id == entry_id,
            KnowledgeEntry.user_id == current_user.id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    await db.delete(entry)
    await db.commit()

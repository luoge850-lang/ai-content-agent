"""Content CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.content import Content
from app.models.platform import Platform
from app.models.project import Project
from app.models.user import User
from app.schemas.content import ContentCreate, ContentResponse, ContentUpdate

router = APIRouter(prefix="/contents", tags=["Contents"])


@router.get("/", response_model=list[ContentResponse])
async def list_contents(
    project_id: str | None = Query(default=None),
    platform_slug: str | None = Query(default=None),
    status: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List contents. Optionally filter by project, platform, or status."""
    stmt = (
        select(Content)
        .join(Project, Content.project_id == Project.id)
        .join(Platform, Content.platform_id == Platform.id)
        .where(Project.user_id == current_user.id)
        .options(joinedload(Content.platform))
        .order_by(Content.updated_at.desc())
    )
    if project_id:
        stmt = stmt.where(Content.project_id == project_id)
    if platform_slug:
        stmt = stmt.where(Platform.slug == platform_slug)
    if status:
        stmt = stmt.where(Content.status == status)

    result = await db.execute(stmt)
    contents = result.unique().scalars().all()
    return [_content_to_response(c) for c in contents]


@router.get("/{content_id}", response_model=ContentResponse)
async def get_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single content item."""
    content = await _get_user_content(content_id, current_user.id, db)
    if not content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")
    return _content_to_response(content)


@router.patch("/{content_id}", response_model=ContentResponse)
async def update_content(
    content_id: str,
    body: ContentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a content item (edit, publish, etc.)."""
    content = await _get_user_content(content_id, current_user.id, db)
    if not content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    for key, val in body.model_dump(exclude_unset=True).items():
        setattr(content, key, val)
    await db.flush()
    await db.refresh(content)
    return _content_to_response(content)


@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a content item."""
    content = await _get_user_content(content_id, current_user.id, db)
    if not content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")
    await db.delete(content)


async def _get_user_content(content_id: str, user_id: str, db: AsyncSession) -> Content | None:
    result = await db.execute(
        select(Content)
        .join(Project, Content.project_id == Project.id)
        .where(Content.id == content_id, Project.user_id == user_id)
        .options(joinedload(Content.platform))
    )
    return result.unique().scalar_one_or_none()


def _content_to_response(c: Content) -> ContentResponse:
    return ContentResponse(
        id=c.id,
        display_id=c.display_id,
        project_id=c.project_id,
        platform_slug=c.platform.slug,
        platform_display_name=c.platform.display_name,
        title=c.title,
        body=c.body,
        image_prompt=c.image_prompt,
        tone=c.tone,
        status=c.status,
        views=c.views,
        likes=c.likes,
        conversion=c.conversion,
        published_at=c.published_at,
        created_at=c.created_at,
        updated_at=c.updated_at,
    )

"""Analytics endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.content import Content
from app.models.platform import Platform
from app.models.project import Project
from app.models.user import User
from app.schemas.analytics import AnalyticsSummary, PlatformMetrics

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
async def get_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get analytics summary for the current user across all projects."""
    # Count projects
    proj_result = await db.execute(
        select(func.count(Project.id)).where(Project.user_id == current_user.id)
    )
    total_projects = proj_result.scalar() or 0

    # Content aggregate
    content_stmt = (
        select(
            func.count(Content.id),
            func.coalesce(func.sum(Content.views), 0),
            func.coalesce(func.sum(Content.likes), 0),
            func.coalesce(func.sum(Content.conversion), 0),
        )
        .join(Project, Content.project_id == Project.id)
        .where(Project.user_id == current_user.id)
    )
    content_result = await db.execute(content_stmt)
    total_contents, total_views, total_likes, total_conversion = content_result.one()

    # By platform
    plat_result = await db.execute(
        select(
            Platform.slug,
            Platform.display_name,
            func.count(Content.id),
            func.coalesce(func.sum(Content.views), 0),
            func.coalesce(func.sum(Content.likes), 0),
            func.coalesce(func.sum(Content.conversion), 0),
        )
        .join(Content, Content.platform_id == Platform.id, isouter=True)
        .join(Project, Content.project_id == Project.id, isouter=True)
        .where((Project.user_id == current_user.id) | (Project.user_id.is_(None)))
        .group_by(Platform.slug, Platform.display_name)
    )
    by_platform = [
        PlatformMetrics(
            platform_slug=slug,
            platform_display_name=display,
            total_contents=count,
            total_views=views,
            total_likes=likes,
            total_conversion=conv,
        )
        for slug, display, count, views, likes, conv in plat_result.all()
    ]

    # Credits used = total generated contents (each gen costs 1 credit)
    credits_used = total_contents or 0

    return AnalyticsSummary(
        total_projects=total_projects or 0,
        total_contents=total_contents or 0,
        total_views=total_views or 0,
        total_likes=total_likes or 0,
        total_conversion=total_conversion or 0,
        credits_used=max(credits_used, 0),
        by_platform=by_platform,
    )

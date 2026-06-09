"""Analytics schemas."""

from pydantic import BaseModel


class PlatformMetrics(BaseModel):
    platform_slug: str
    platform_display_name: str
    total_contents: int
    total_views: int
    total_likes: int
    total_conversion: int


class AnalyticsSummary(BaseModel):
    total_projects: int
    total_contents: int
    total_views: int
    total_likes: int
    total_conversion: int
    credits_used: int
    by_platform: list[PlatformMetrics]

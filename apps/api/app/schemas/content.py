"""Content schemas."""

from datetime import datetime
from pydantic import BaseModel, Field


class ContentCreate(BaseModel):
    project_id: str
    platform_slug: str = Field(default="xiaohongshu")
    title: str = Field(default="", max_length=500)
    tone: str = Field(default="专业", pattern=r"^(专业|幽默|煽情)$")
    body: str = Field(default="")
    image_prompt: str = Field(default="")


class ContentUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=500)
    body: str | None = None
    image_prompt: str | None = None
    status: str | None = Field(default=None, pattern=r"^(draft|review|published)$")
    tone: str | None = Field(default=None, pattern=r"^(专业|幽默|煽情)$")


class ContentResponse(BaseModel):
    id: str
    display_id: str
    project_id: str
    platform_slug: str
    platform_display_name: str
    title: str
    body: str
    image_prompt: str
    tone: str
    status: str
    generation_status: str = "completed"
    views: int
    likes: int
    conversion: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

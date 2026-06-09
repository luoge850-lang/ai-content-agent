"""Generate schemas — AI generation request/response."""

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    project_id: str
    platform_slug: str = Field(default="xiaohongshu")
    platform_slugs: list[str] = Field(default=[])  # batch: multiple platforms
    tone: str = Field(default="专业", pattern=r"^(专业|幽默|煽情)$")
    product_description: str = Field(default="", max_length=2000)
    target_audience: str = Field(default="", max_length=500)


class GenerateResponse(BaseModel):
    content_id: str
    display_id: str
    title: str
    body: str
    image_prompt: str
    platform_slug: str
    tone: str
    model: str
    tokens_used: int
    duration_ms: int
    generation_status: str = "processing"


class BatchGenerateResponse(BaseModel):
    results: list[GenerateResponse]
    total_credits_used: int

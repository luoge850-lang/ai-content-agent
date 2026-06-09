"""Knowledge Base schemas."""

from datetime import datetime
from pydantic import BaseModel, Field


class KnowledgeCreate(BaseModel):
    title: str = Field(max_length=255)
    content: str = Field(default="")
    category: str = Field(default="product", pattern=r"^(product|brand|audience|style)$")


class KnowledgeUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    content: str | None = None
    category: str | None = Field(default=None, pattern=r"^(product|brand|audience|style)$")


class KnowledgeResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    created_at: datetime
    updated_at: datetime | None

    model_config = {"from_attributes": True}

"""Project schemas."""

from datetime import datetime
from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    product_description: str = Field(default="", max_length=2000)
    target_audience: str = Field(default="", max_length=500)


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    product_description: str | None = Field(default=None, max_length=2000)
    target_audience: str | None = Field(default=None, max_length=500)
    status: str | None = Field(default=None, pattern=r"^(draft|active|archived)$")


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    product_description: str
    target_audience: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

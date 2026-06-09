"""Content model — generated content assets."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.sqlite import CHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Content(Base):
    __tablename__ = "contents"

    id: Mapped[str] = mapped_column(
        CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    # human-readable ID like CNT-2048
    display_id: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    project_id: Mapped[str] = mapped_column(
        CHAR(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform_id: Mapped[str] = mapped_column(
        CHAR(36), ForeignKey("platforms.id", ondelete="RESTRICT"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    body: Mapped[str] = mapped_column(Text, default="")
    image_prompt: Mapped[str] = mapped_column(Text, default="")
    tone: Mapped[str] = mapped_column(String(50), default="专业")  # 专业 | 幽默 | 煽情
    status: Mapped[str] = mapped_column(
        String(20), default="draft"
    )  # draft | review | published
    generation_status: Mapped[str] = mapped_column(
        String(20), default="completed"
    )  # pending | processing | completed | failed

    # metrics (updated by analytics pipeline)
    views: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    conversion: Mapped[int] = mapped_column(Integer, default=0)

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # relationships
    project: Mapped["Project"] = relationship("Project", back_populates="contents")
    platform: Mapped["Platform"] = relationship("Platform")
    generation_logs: Mapped[list["GenerationLog"]] = relationship(
        "GenerationLog", back_populates="content", cascade="all, delete-orphan"
    )

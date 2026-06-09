"""EmailVerificationToken model — one-time tokens for email verification.

Security properties:
- Only the SHA-256 hash of the token is stored (never the plaintext token).
- Tokens expire after a configurable window.
- Tokens are single-use (deleted after successful verification).
"""

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.sqlite import CHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config import settings
from app.database import Base


def generate_token() -> tuple[str, str]:
    """Generate a random token and its SHA-256 hash.

    Returns (plaintext_token, token_hash).
    The plaintext is sent to the user; only the hash is stored.
    """
    plain = secrets.token_urlsafe(48)  # 64 bytes of randomness → 86 char string
    token_hash = hashlib.sha256(plain.encode()).hexdigest()
    return plain, token_hash


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id: Mapped[str] = mapped_column(
        CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        CHAR(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # SHA-256 hash of the actual token — never store the raw token
    token_hash: Mapped[str] = mapped_column(
        String(128), nullable=False, unique=True, index=True
    )
    # Token purpose: "email_verification" | "password_reset"
    purpose: Mapped[str] = mapped_column(String(30), default="email_verification")

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    used: Mapped[bool] = mapped_column(Boolean, default=False)
    used_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # ── Relationships ────────────────────────────────────
    user: Mapped["User"] = relationship("User", back_populates="email_tokens")

    @classmethod
    def create_for_user(cls, user_id: str, purpose: str = "email_verification"):
        """Factory: create a new token for a user.

        Returns (plaintext_token, EmailVerificationToken_instance).
        """
        plain, token_hash = generate_token()
        instance = cls(
            user_id=user_id,
            token_hash=token_hash,
            purpose=purpose,
            expires_at=datetime.now(timezone.utc)
            + timedelta(minutes=settings.email_verification_token_expire_minutes),
        )
        return plain, instance

    def is_expired(self) -> bool:
        """Check if the token has passed its expiration time."""
        return datetime.now(timezone.utc) > self.expires_at

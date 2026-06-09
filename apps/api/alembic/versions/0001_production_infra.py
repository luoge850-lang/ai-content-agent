"""Production infrastructure migration

- Adds email verification fields to users table
- Creates email_verification_tokens table
- Adds indexes on commonly queried fields

Revision ID: 0001_prod_infra
Create Date: 2026-06-09
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0001_prod_infra"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Add columns to users ─────────────────────────────
    op.add_column(
        "users",
        sa.Column("is_email_verified", sa.Boolean(), nullable=False, server_default=sa.text("0")),
    )
    op.add_column(
        "users",
        sa.Column("email_verified_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
    )
    op.add_column(
        "users",
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.text("0")),
    )
    op.add_column(
        "users",
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
    )

    # Index on last_login_at for analytics queries
    op.create_index("ix_users_last_login_at", "users", ["last_login_at"])

    # ── Create email_verification_tokens table ────────────
    op.create_table(
        "email_verification_tokens",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("user_id", sa.String(36), nullable=False),
        sa.Column("token_hash", sa.String(128), nullable=False),
        sa.Column("purpose", sa.String(30), nullable=False, server_default="email_verification"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_email_tokens_user_id", "email_verification_tokens", ["user_id"])
    op.create_index("ix_email_tokens_token_hash", "email_verification_tokens", ["token_hash"], unique=True)
    op.create_index("ix_email_tokens_purpose", "email_verification_tokens", ["purpose"])
    op.create_index("ix_email_tokens_expires_at", "email_verification_tokens", ["expires_at"])
    op.create_index("ix_email_tokens_created_at", "email_verification_tokens", ["created_at"])


def downgrade() -> None:
    op.drop_table("email_verification_tokens")
    op.drop_index("ix_users_last_login_at", table_name="users")
    op.drop_column("users", "last_login_at")
    op.drop_column("users", "is_admin")
    op.drop_column("users", "is_active")
    op.drop_column("users", "email_verified_at")
    op.drop_column("users", "is_email_verified")

"""Auth endpoints — register, login, profile, email verification."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.middleware.auth import get_current_user
from app.middleware.rate_limit import (
    login_rate_limit,
    register_rate_limit,
    resend_email_rate_limit,
)
from app.models.email_token import EmailVerificationToken
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    ResendVerificationRequest,
    TokenResponse,
    UserResponse,
    UserUpdate,
    VerifyEmailResponse,
)
from app.services.auth import (
    create_access_token,
    create_user,
    get_user_by_email,
    verify_password,
)
from app.tasks.email_tasks import send_verification_email_task

logger = logging.getLogger("auth")
router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    body: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _rate_limited: None = Depends(register_rate_limit),
):
    """Register a new account.  Sends a verification email.

    The account is usable immediately, but some features may require
    email verification in the future.
    """
    email = body.email.lower().strip()

    existing = await get_user_by_email(db, email)
    if existing:
        # Don't reveal that the email exists (prevent enumeration)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email cannot be registered.",
        )

    # ── Create user ──────────────────────────────────────
    user = await create_user(
        db,
        email=email,
        password=body.password,
        display_name=body.display_name,
        team_name=body.team_name,
    )

    # ── Generate verification token ──────────────────────
    plain_token, token_record = EmailVerificationToken.create_for_user(
        user_id=user.id, purpose="email_verification"
    )
    db.add(token_record)
    await db.commit()
    await db.refresh(user)

    # ── Send verification email (after commit!) ──────────
    verification_url = (
        f"{settings.frontend_base_url}/verify-email?token={plain_token}"
    )
    # Use .delay() if Celery is available, otherwise call directly
    if hasattr(send_verification_email_task, "delay"):
        send_verification_email_task.delay(
            email=user.email,
            verification_url=verification_url,
            idempotency_key=f"verify:{user.id}:{token_record.id[:8]}",
        )
    else:
        send_verification_email_task(
            email=user.email,
            verification_url=verification_url,
            idempotency_key=f"verify:{user.id}:{token_record.id[:8]}",
        )

    token = create_access_token(user.id)
    logger.info("User registered: %s (id=%s)", user.email, user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    _rate_limited: None = Depends(login_rate_limit),
):
    """Login with email and password.  Updates last_login_at."""
    email = body.email.lower().strip()

    # Per-email rate limit (separate from IP-based login_rate_limit)
    try:
        from app.redis import get_redis

        r = await get_redis()
        email_key = f"ratelimit:login:email:{email}"
        current = await r.incr(email_key)
        if current == 1:
            await r.expire(email_key, 60)
        if current > 3:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Too many login attempts for this account. Please try again later.",
                    "retry_after_seconds": 60,
                },
                headers={"Retry-After": "60"},
            )
    except HTTPException:
        raise
    except Exception:
        pass  # Redis unavailable — skip email-based rate limit

    user = await get_user_by_email(db, email)
    if not user or not verify_password(body.password, user.password_hash):
        logger.warning("Failed login attempt for email: %s", email[:3] + "***")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Update last_login_at
    user.last_login_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    logger.info("User logged in: %s", user.email)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user."""
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update display name and/or team name for the current user."""
    if body.display_name is not None:
        current_user.display_name = body.display_name.strip()
    if body.team_name is not None:
        current_user.team_name = body.team_name.strip()
    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)


# ── Email verification ───────────────────────────────────

@router.post("/resend-verification", status_code=status.HTTP_200_OK)
async def resend_verification(
    body: ResendVerificationRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Resend the email verification link.

    Rate-limited: 1/minute, 5/day per email address.
    Returns a unified message regardless of whether the email exists.
    """
    email = body.email.lower().strip()

    # Rate limit check
    await resend_email_rate_limit(email)

    user = await get_user_by_email(db, email)
    if not user:
        # Don't reveal that the email doesn't exist
        logger.info("Resend verification requested for unknown email: %s", email[:3] + "***")
        return {"message": "If that email is registered, a verification link has been sent."}

    if user.is_email_verified:
        # Don't send if already verified — but don't reveal it
        logger.info("Resend verification requested for already-verified email: %s", user.email)
        return {"message": "If that email is registered, a verification link has been sent."}

    # Invalidate any existing unused tokens for this user + purpose
    existing = await db.execute(
        select(EmailVerificationToken)
        .where(
            EmailVerificationToken.user_id == user.id,
            EmailVerificationToken.purpose == "email_verification",
            EmailVerificationToken.used == False,  # noqa: E712
        )
    )
    for old_token in existing.scalars().all():
        old_token.used = True
        old_token.used_at = datetime.now(timezone.utc)

    # Create a new token
    plain_token, token_record = EmailVerificationToken.create_for_user(
        user_id=user.id, purpose="email_verification"
    )
    db.add(token_record)
    await db.commit()

    # Send email (after commit)
    verification_url = (
        f"{settings.frontend_base_url}/verify-email?token={plain_token}"
    )
    if hasattr(send_verification_email_task, "delay"):
        send_verification_email_task.delay(
            email=user.email,
            verification_url=verification_url,
            idempotency_key=f"resend:{user.id}:{token_record.id[:8]}",
        )
    else:
        send_verification_email_task(
            email=user.email,
            verification_url=verification_url,
            idempotency_key=f"resend:{user.id}:{token_record.id[:8]}",
        )

    logger.info("Verification email resent to %s", user.email)
    return {"message": "If that email is registered, a verification link has been sent."}


@router.get("/verify-email", response_model=VerifyEmailResponse)
async def verify_email(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Verify an email address using a one-time token.

    GET /api/v1/auth/verify-email?token=xxx
    """
    import hashlib

    token_hash = hashlib.sha256(token.encode()).hexdigest()

    # Look up the token
    result = await db.execute(
        select(EmailVerificationToken)
        .where(EmailVerificationToken.token_hash == token_hash)
    )
    token_record = result.scalar_one_or_none()

    if not token_record:
        logger.warning("Email verification attempt with unknown token")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link.",
        )

    if token_record.used:
        logger.warning("Email verification attempt with already-used token")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link has already been used.",
        )

    if token_record.is_expired():
        logger.warning("Email verification attempt with expired token")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link has expired. Please request a new one.",
        )

    # Mark the token as used
    token_record.used = True
    token_record.used_at = datetime.now(timezone.utc)

    # Verify the user
    user_result = await db.execute(
        select(User).where(User.id == token_record.user_id)
    )
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    user.is_email_verified = True
    user.email_verified_at = datetime.now(timezone.utc)
    await db.commit()

    logger.info("Email verified for user %s", user.email)
    return VerifyEmailResponse(
        message="Email verified successfully!",
        verified=True,
    )

"""Celery email tasks — send_verification_email, send_password_reset, etc.

All email sending goes through Celery so the HTTP request returns immediately.
If Celery is not available (dev without Redis), falls back to sync send.
"""

from __future__ import annotations

import logging

from app.config import settings

logger = logging.getLogger("email_tasks")

# Celery may not be available in dev
try:
    from app.tasks.celery_app import celery_app as _celery
    if _celery is None:
        raise ImportError("Celery not configured")
    CELERY_OK = True
except (ImportError, Exception):
    _celery = None
    CELERY_OK = False


def _send_verification_email_impl(
    email: str,
    verification_url: str,
    idempotency_key: str | None = None,
) -> dict:
    """Core implementation — can be called directly or via Celery."""
    from app.services.email_service import send_email

    if not settings.smtp_host:
        logger.info("SMTP not configured — skipping email to %s", email)
        return {"status": "skipped", "reason": "smtp_not_configured", "email": email}

    # Idempotency check
    if idempotency_key:
        try:
            import asyncio
            from app.redis import get_redis
            redis_client = asyncio.run(get_redis())
            cache_key = f"email:sent:{idempotency_key}"
            if redis_client.get(cache_key):
                logger.info("Email already sent: %s", idempotency_key)
                return {"status": "skipped", "reason": "already_sent", "email": email}
        except Exception:
            pass

    try:
        send_email(
            to_email=email,
            subject="Verify your email — AI Content Agent",
            html_body=_build_verification_email_html(verification_url),
        )

        if idempotency_key:
            try:
                import asyncio
                from app.redis import get_redis
                redis_client = asyncio.run(get_redis())
                redis_client.setex(f"email:sent:{idempotency_key}", 86400, "1")
            except Exception:
                pass

        logger.info("Verification email sent to %s", email)
        return {"status": "sent", "email": email}
    except Exception as exc:
        logger.error("Failed to send verification email to %s: %s", email, exc)
        raise


def _send_password_reset_impl(email: str, reset_url: str) -> dict:
    """Core implementation for password reset emails."""
    from app.services.email_service import send_email

    if not settings.smtp_host:
        logger.info("SMTP not configured — skipping email to %s", email)
        return {"status": "skipped", "reason": "smtp_not_configured", "email": email}

    send_email(
        to_email=email,
        subject="Reset your password — AI Content Agent",
        html_body=_build_password_reset_email_html(reset_url),
    )
    logger.info("Password reset email sent to %s", email)
    return {"status": "sent", "email": email}


# ── Celery task wrappers (only if Celery is available) ──

if CELERY_OK:
    from celery.utils.log import get_task_logger
    celery_logger = get_task_logger(__name__)

    @_celery.task(  # type: ignore[misc]
        bind=True,
        name="send_verification_email",
        max_retries=3,
        default_retry_delay=60,
        acks_late=True,
    )
    def send_verification_email_task(
        self,
        email: str,
        verification_url: str,
        idempotency_key: str | None = None,
    ) -> dict:
        task_id = self.request.id
        celery_logger.info(
            "Sending verification email to %s (task=%s, idem=%s)",
            email, task_id, idempotency_key,
        )
        try:
            return _send_verification_email_impl(email, verification_url, idempotency_key)
        except Exception as exc:
            celery_logger.error(
                "Failed to send verification email to %s (attempt %d/%d): %s",
                email, self.request.retries + 1, self.max_retries, exc,
            )
            retry_delay = 60 * (2 ** self.request.retries)
            raise self.retry(exc=exc, countdown=retry_delay)

    @_celery.task(  # type: ignore[misc]
        bind=True,
        name="send_password_reset_email",
        max_retries=3,
        default_retry_delay=60,
        acks_late=True,
    )
    def send_password_reset_email_task(
        self,
        email: str,
        reset_url: str,
    ) -> dict:
        task_id = self.request.id
        celery_logger.info("Sending password-reset email to %s (task=%s)", email, task_id)
        try:
            return _send_password_reset_impl(email, reset_url)
        except Exception as exc:
            celery_logger.error("Failed to send password-reset email to %s: %s", email, exc)
            retry_delay = 60 * (2 ** self.request.retries)
            raise self.retry(exc=exc, countdown=retry_delay)

else:
    # ── Fallback: call directly (dev mode, no Celery) ────

    def send_verification_email_task(email, verification_url, idempotency_key=None):
        """Direct call — Celery not available in dev."""
        logger.info("Celery not available — sending email directly to %s", email)
        try:
            return _send_verification_email_impl(email, verification_url, idempotency_key)
        except Exception as exc:
            logger.error("Direct email send failed: %s", exc)
            return {"status": "failed", "error": str(exc)}

    def send_password_reset_email_task(email, reset_url):
        """Direct call — Celery not available in dev."""
        logger.info("Celery not available — sending email directly to %s", email)
        try:
            return _send_password_reset_impl(email, reset_url)
        except Exception as exc:
            logger.error("Direct email send failed: %s", exc)
            return {"status": "failed", "error": str(exc)}


# ── Email HTML templates ─────────────────────────────────

def _build_verification_email_html(verification_url: str) -> str:
    return f"""\
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family: Inter, system-ui, sans-serif; background: #fcfcfc; padding: 40px 0;">
<table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #fff; border: 1px solid #d1d5db;">
  <tr>
    <td style="padding: 32px 40px; border-bottom: 1px solid #d1d5db;">
      <p style="font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #6b7280; margin: 0;">AI Content Agent</p>
    </td>
  </tr>
  <tr>
    <td style="padding: 40px;">
      <h1 style="font-size: 24px; font-weight: 500; letter-spacing: -0.03em; color: #111; margin: 0 0 16px;">Verify your email address</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 24px;">
        Thanks for signing up! Click the button below to verify your email and activate your account.
      </p>
      <a href="{verification_url}" style="display: inline-block; background: #111; color: #fff; padding: 14px 28px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 4px;">
        Verify Email →
      </a>
      <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
        This link expires in {settings.email_verification_token_expire_minutes} minutes.
        If you didn't create this account, you can safely ignore this email.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 24px 40px; border-top: 1px solid #d1d5db;">
      <p style="font-size: 10px; color: #9ca3af; margin: 0; letter-spacing: 0.2em; text-transform: uppercase;">AI Content Agent — Multi-Platform Content Engine</p>
    </td>
  </tr>
</table>
</body>
</html>"""


def _build_password_reset_email_html(reset_url: str) -> str:
    return f"""\
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family: Inter, system-ui, sans-serif; background: #fcfcfc; padding: 40px 0;">
<table width="100%%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto; background: #fff; border: 1px solid #d1d5db;">
  <tr>
    <td style="padding: 32px 40px; border-bottom: 1px solid #d1d5db;">
      <p style="font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #6b7280; margin: 0;">AI Content Agent</p>
    </td>
  </tr>
  <tr>
    <td style="padding: 40px;">
      <h1 style="font-size: 24px; font-weight: 500; letter-spacing: -0.03em; color: #111; margin: 0 0 16px;">Reset your password</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 24px;">
        You requested a password reset. Click the button below to choose a new password.
      </p>
      <a href="{reset_url}" style="display: inline-block; background: #111; color: #fff; padding: 14px 28px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 4px;">
        Reset Password →
      </a>
      <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
        This link expires in {settings.email_verification_token_expire_minutes} minutes.
        If you didn't request this, you can safely ignore it.
      </p>
    </td>
  </tr>
</table>
</body>
</html>"""

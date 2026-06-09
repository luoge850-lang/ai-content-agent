"""Email service — SMTP email sending via aiosmtplib.

Encapsulates all email sending logic.  Called exclusively by Celery tasks
(never directly from an HTTP handler) so the request returns immediately.
"""

from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger("email")


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    text_body: str | None = None,
) -> bool:
    """Send an email via SMTP (synchronous — called from Celery worker).

    Returns True on success, raises on failure (let Celery handle retries).
    """
    if not settings.smtp_host:
        logger.warning(
            "SMTP not configured — skipping email to %s: %s", to_email, subject
        )
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from
    msg["To"] = to_email

    if text_body:
        msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        if settings.smtp_use_tls:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=30)
            server.ehlo()
            server.starttls()
            server.ehlo()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from, [to_email], msg.as_string())
            server.quit()
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=30)
            server.ehlo()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from, [to_email], msg.as_string())
            server.quit()

        logger.info("Email sent to %s: %s", to_email, subject)
        return True

    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to_email, exc)
        raise


def send_email_sync(
    to_email: str,
    subject: str,
    html_body: str,
) -> bool:
    """Alias for send_email — used from Celery tasks (synchronous context)."""
    return send_email(to_email, subject, html_body)

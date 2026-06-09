"""Celery tasks — imported by the Celery worker on startup.

Tasks are also importable from HTTP handlers (for .delay() calls),
but the Celery app itself may not be running in dev mode.
"""

# Import task modules so Celery auto-discovers them
try:
    from app.tasks.celery_app import celery_app
except ImportError:
    celery_app = None  # type: ignore[assignment]

import app.tasks.email_tasks  # noqa: F401, E402
import app.tasks.ai_tasks     # noqa: F401, E402

__all__ = ["celery_app"]

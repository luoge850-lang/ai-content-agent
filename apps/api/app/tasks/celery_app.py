"""Celery application — configured with Redis broker.

Worker is started via:
    celery -A app.tasks.celery_app worker -Q email_queue,ai_queue,default_queue --loglevel=info

Beat is started via:
    celery -A app.tasks.celery_app beat --loglevel=info

If Celery is not installed (dev without Redis), a placeholder is provided
so the FastAPI app can still start.
"""

from __future__ import annotations

import logging

try:
    from celery import Celery
    from celery.signals import after_setup_logger, worker_ready
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False

from app.config import settings

logger = logging.getLogger("celery")


if CELERY_AVAILABLE:
    celery_app = Celery(
        "ai_content_agent",
        broker=settings.celery_broker_url,
        backend=settings.celery_result_backend,
    )

    # ── Celery configuration ─────────────────────────────
    celery_app.conf.update(
        # Serialization
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="Asia/Shanghai",
        enable_utc=True,
        # Task execution
        task_acks_late=True,
        task_reject_on_worker_lost=True,
        task_track_started=True,
        task_time_limit=600,
        task_soft_time_limit=480,
        # Result backend
        result_expires=3600,
        result_extended=True,
        # Retry / error handling
        task_default_retry_delay=60,
        task_max_retries=3,
        # Queues
        task_queues={
            "default_queue": {"exchange": "default", "routing_key": "default"},
            "email_queue": {"exchange": "email", "routing_key": "email"},
            "ai_queue": {"exchange": "ai", "routing_key": "ai"},
            "file_queue": {"exchange": "file", "routing_key": "file"},
        },
        task_routes={
            "app.tasks.email_tasks.*": {"queue": "email_queue"},
            "app.tasks.ai_tasks.*": {"queue": "ai_queue"},
        },
        task_default_queue="default_queue",
        beat_schedule={},
        # Broker
        broker_connection_retry_on_startup=True,
        broker_connection_max_retries=10,
        broker_transport_options={
            "visibility_timeout": 3600,
            "max_retries": 5,
        },
    )

    @worker_ready.connect
    def on_worker_ready(**kwargs):
        logger.info("Celery worker is ready — waiting for tasks")

    @after_setup_logger.connect
    def setup_celery_logger(celery_logger, **kwargs):
        celery_logger.setLevel(logging.INFO)
        if not celery_logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(
                logging.Formatter(
                    "[%(asctime)s] %(levelname)s [%(name)s] %(message)s"
                )
            )
            celery_logger.addHandler(handler)

else:
    # Placeholder — FastAPI can start without Celery for local dev
    celery_app = None  # type: ignore[assignment]
    logger.info("Celery not installed — background tasks disabled")

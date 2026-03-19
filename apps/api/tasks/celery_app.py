from celery import Celery

from core.config import settings


celery_app = Celery(
    "seou_up",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["tasks.simulation_tasks"],
)

celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"

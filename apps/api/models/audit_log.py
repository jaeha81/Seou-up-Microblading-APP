from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON

from core.database import Base


class AuditLog(Base):
    """Admin audit trail — records sensitive actions for compliance."""

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    action = Column(
        String(100), nullable=False
    )  # e.g. "user.deactivate", "simulation.delete"
    target_type = Column(String(50), nullable=True)  # e.g. "user", "simulation"
    target_id = Column(Integer, nullable=True)
    detail = Column(JSON, nullable=True)  # arbitrary JSON payload
    ip_address = Column(String(50), nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

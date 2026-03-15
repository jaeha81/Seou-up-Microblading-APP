from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean

from core.database import Base


class Consultation(Base):
    """Record linking a Pro to a consumer for async consultation."""

    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    pro_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    consumer_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    eyebrow_style_id = Column(Integer, ForeignKey("eyebrow_styles.id"), nullable=True)
    message = Column(Text, nullable=True)
    reply = Column(Text, nullable=True)
    is_resolved = Column(Boolean, default=False)
    status = Column(String(20), default="pending")  # pending | in_progress | resolved
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    resolved_at = Column(DateTime(timezone=True), nullable=True)

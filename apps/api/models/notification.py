from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from core.database import Base


class Notification(Base):
    """In-app notifications for users (consultation replies, session updates, etc.)"""

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(300), nullable=False)
    body = Column(Text, nullable=True)
    notification_type = Column(
        String(50), nullable=True
    )  # system | consultation | session
    is_read = Column(Boolean, default=False, nullable=False)
    action_url = Column(String(500), nullable=True)  # deep-link to relevant page
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", foreign_keys=[user_id])

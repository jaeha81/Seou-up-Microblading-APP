from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from core.database import Base


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    category = Column(String(50), nullable=True)  # bug | feature | general
    rating = Column(Integer, nullable=True)  # 1-5
    message = Column(Text, nullable=False)
    email = Column(String(255), nullable=True)  # anonymous feedback
    page_context = Column(String(200), nullable=True)  # which page
    status = Column(String(20), default="open")  # open | reviewed | closed
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="feedbacks")

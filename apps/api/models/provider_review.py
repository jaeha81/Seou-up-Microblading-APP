from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    ForeignKey,
    DateTime,
    Boolean,
)
from sqlalchemy.orm import relationship

from core.database import Base


class ProviderReview(Base):
    """Consumer reviews for provider listings."""

    __tablename__ = "provider_reviews"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(
        Integer, ForeignKey("provider_listings.id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    rating = Column(Float, nullable=False)  # 1.0 – 5.0
    title = Column(String(200), nullable=True)
    body = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)  # verified purchase/visit
    is_published = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    provider = relationship("ProviderListing", foreign_keys=[provider_id])
    user = relationship("User", foreign_keys=[user_id])

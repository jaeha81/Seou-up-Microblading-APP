from datetime import datetime, timezone
from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship

from core.database import Base


class StyleFavorite(Base):
    """User's saved / favorite eyebrow styles."""

    __tablename__ = "style_favorites"
    __table_args__ = (
        UniqueConstraint("user_id", "eyebrow_style_id", name="uq_user_style_favorite"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    eyebrow_style_id = Column(
        Integer, ForeignKey("eyebrow_styles.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", foreign_keys=[user_id])
    eyebrow_style = relationship("EyebrowStyle", foreign_keys=[eyebrow_style_id])

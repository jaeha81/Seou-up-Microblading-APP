from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime

from core.database import Base


class GuideArticle(Base):
    __tablename__ = "guide_articles"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    title_en = Column(String(300), nullable=False)
    title_ko = Column(String(300), nullable=True)
    title_th = Column(String(300), nullable=True)
    title_vi = Column(String(300), nullable=True)
    body_en = Column(Text, nullable=True)
    body_ko = Column(Text, nullable=True)
    body_th = Column(Text, nullable=True)
    body_vi = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # startup | technique | marketing
    cover_image_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime

from core.database import Base


class ComplianceNotice(Base):
    __tablename__ = "compliance_notices"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(
        String(100), unique=True, index=True, nullable=False
    )  # e.g. "disclaimer", "privacy"
    title_en = Column(String(300), nullable=False)
    title_ko = Column(String(300), nullable=True)
    title_th = Column(String(300), nullable=True)
    title_vi = Column(String(300), nullable=True)
    body_en = Column(Text, nullable=False)
    body_ko = Column(Text, nullable=True)
    body_th = Column(Text, nullable=True)
    body_vi = Column(Text, nullable=True)
    # Banner | Modal | Footer | Inline
    display_type = Column(String(50), default="Banner")
    is_active = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

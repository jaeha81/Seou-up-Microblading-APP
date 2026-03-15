from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from sqlalchemy.orm import relationship

from core.database import Base


class EyebrowStyle(Base):
    __tablename__ = "eyebrow_styles"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(100), nullable=False)
    name_ko = Column(String(100), nullable=True)
    name_th = Column(String(100), nullable=True)
    name_vi = Column(String(100), nullable=True)
    description_en = Column(Text, nullable=True)
    description_ko = Column(Text, nullable=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    image_url = Column(String(500), nullable=True)
    category = Column(String(50), nullable=True)  # e.g. "natural", "defined", "feather"
    difficulty = Column(String(20), default="medium")  # easy | medium | advanced
    price_range_min = Column(Float, nullable=True)
    price_range_max = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    simulations = relationship("Simulation", back_populates="eyebrow_style")

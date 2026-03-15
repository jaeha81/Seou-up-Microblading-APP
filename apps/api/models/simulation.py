from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from core.database import Base


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    eyebrow_style_id = Column(Integer, ForeignKey("eyebrow_styles.id"), nullable=True)
    # "pending" | "processing" | "completed" | "failed"
    status = Column(String(20), default="pending", nullable=False)
    adapter = Column(String(20), default="mock")  # mock | mediapipe
    input_image_url = Column(String(500), nullable=True)
    output_image_url = Column(String(500), nullable=True)
    landmarks_data = Column(JSON, nullable=True)  # facial landmark JSON
    error_message = Column(Text, nullable=True)
    session_note = Column(Text, nullable=True)  # Pro session notes
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="simulations")
    eyebrow_style = relationship("EyebrowStyle", back_populates="simulations")

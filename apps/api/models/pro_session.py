from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from core.database import Base


class ProSession(Base):
    """Expert (Pro) consultation session with a client."""

    __tablename__ = "pro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    pro_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    client_name = Column(String(200), nullable=True)
    client_email = Column(String(255), nullable=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"), nullable=True)
    notes = Column(Text, nullable=True)
    recommended_style_id = Column(
        Integer, ForeignKey("eyebrow_styles.id"), nullable=True
    )
    status = Column(String(20), default="active")  # active | completed | cancelled
    session_data = Column(JSON, nullable=True)  # arbitrary session payload
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    pro_user = relationship("User", foreign_keys=[pro_user_id])
    simulation = relationship("Simulation", foreign_keys=[simulation_id])
    recommended_style = relationship(
        "EyebrowStyle", foreign_keys=[recommended_style_id]
    )

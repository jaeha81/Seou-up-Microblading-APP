from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from core.database import Base


class Booking(Base):
    """Appointment booking request between consumer and provider.

    Phase 6: Activate full booking flow with payments.
    """

    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    consumer_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    provider_id = Column(
        Integer, ForeignKey("provider_listings.id", ondelete="SET NULL"), nullable=True
    )
    eyebrow_style_id = Column(Integer, ForeignKey("eyebrow_styles.id"), nullable=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id"), nullable=True)
    requested_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    # pending | confirmed | cancelled | completed
    status = Column(String(20), default="pending", nullable=False)
    cancellation_reason = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    consumer = relationship("User", foreign_keys=[consumer_user_id])
    provider = relationship("ProviderListing", foreign_keys=[provider_id])
    eyebrow_style = relationship("EyebrowStyle", foreign_keys=[eyebrow_style_id])

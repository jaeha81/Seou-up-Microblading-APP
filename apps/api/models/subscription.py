"""Provider subscription model — Phase 6 paid plans."""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from core.database import Base


class ProviderSubscription(Base):
    __tablename__ = "provider_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(
        Integer,
        ForeignKey("provider_listings.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    plan = Column(String(20), nullable=False, default="free")  # "free" | "featured"
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    stripe_checkout_session_id = Column(String(255), nullable=True)
    # "active" | "cancelled" | "past_due" | "trialing"
    status = Column(String(50), nullable=False, default="active")
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

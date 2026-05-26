"""Clinic (B2B multi-staff tenant) model — SaaS launch."""

from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from core.database import Base


class ClinicPlan(str, enum.Enum):
    basic = "basic"           # $49/mo — up to 3 staff, 300 sims/mo
    pro = "pro"               # $99/mo — unlimited staff + sims


class ClinicMemberRole(str, enum.Enum):
    owner = "owner"
    manager = "manager"
    staff = "staff"


class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    owner_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    name = Column(String(200), nullable=False)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    website_url = Column(String(300), nullable=True)
    logo_url = Column(String(500), nullable=True)

    # Subscription
    plan = Column(String(20), nullable=False, default=ClinicPlan.basic)
    # trialing | active | past_due | cancelled
    plan_status = Column(String(50), nullable=False, default="trialing")
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    members = relationship(
        "ClinicMember", back_populates="clinic", cascade="all, delete-orphan"
    )


class ClinicMember(Base):
    __tablename__ = "clinic_members"
    __table_args__ = (UniqueConstraint("clinic_id", "user_id", name="uq_clinic_user"),)

    id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(
        Integer, ForeignKey("clinics.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role = Column(String(20), nullable=False, default=ClinicMemberRole.staff)
    joined_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    clinic = relationship("Clinic", back_populates="members")

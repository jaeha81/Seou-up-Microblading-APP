from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
import enum

from core.database import Base


class UserRole(str, enum.Enum):
    consumer = "consumer"
    pro = "pro"
    founder = "founder"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_id = Column(String(255), unique=True, index=True, nullable=True)
    kakao_id = Column(String(255), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default=UserRole.consumer, nullable=False)
    language = Column(String(10), default="en", nullable=False)  # en | ko | th | vi
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    legal_consent_accepted = Column(Boolean, default=False, nullable=False)
    legal_consent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    simulations = relationship(
        "Simulation", back_populates="user", cascade="all, delete-orphan"
    )
    feedbacks = relationship(
        "Feedback", back_populates="user", cascade="all, delete-orphan"
    )

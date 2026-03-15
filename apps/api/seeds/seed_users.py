"""Seed initial admin user (development only)."""

import os
from sqlalchemy.orm import Session
from models.user import User
from core.security import hash_password


def seed_admin_user(db: Session) -> int:
    email = os.getenv("ADMIN_EMAIL", "admin@seouup.dev")
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return 0
    admin = User(
        email=email,
        hashed_password=hash_password(os.getenv("ADMIN_PASSWORD", "Admin1234!")),
        full_name="Seou-up Admin",
        role="admin",
        language="en",
        is_active=True,
        is_verified=True,
        legal_consent_accepted=True,
    )
    db.add(admin)
    db.commit()
    return 1

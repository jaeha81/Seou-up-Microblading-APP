"""
run_seeds.py — Execute all seed scripts in order.

Usage:
    cd apps/api
    python seeds/run_seeds.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import SessionLocal
from seeds.seed_eyebrow_styles import seed_eyebrow_styles
from seeds.seed_guides import seed_guides
from seeds.seed_compliance import seed_compliance
from seeds.seed_users import seed_admin_user


def main():
    db = SessionLocal()
    try:
        print("🌱 Starting seed process...")

        n = seed_eyebrow_styles(db)
        print(f"  ✓ Seeded {n} eyebrow styles (total: 12)")

        n = seed_guides(db)
        print(f"  ✓ Seeded {n} guide articles (total: 5)")

        n = seed_compliance(db)
        print(f"  ✓ Seeded {n} compliance notices (total: 5)")

        n = seed_admin_user(db)
        if n:
            print("  ✓ Seeded admin user (admin@seouup.dev)")
        else:
            print("  ℹ Admin user already exists")

        print("\n✅ Seeding complete!")
        print(
            "   Seeded 12 eyebrow styles · Seeded 5 guide articles · Seeded 5 compliance notices"
        )
    except Exception as exc:
        print(f"❌ Seeding failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

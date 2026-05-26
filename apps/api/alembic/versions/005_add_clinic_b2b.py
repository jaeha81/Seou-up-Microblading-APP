"""Add clinics and clinic_members tables for B2B SaaS launch.

Revision ID: 005
Revises: 004
Create Date: 2026-05-27
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "clinics",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "owner_user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(120), unique=True, nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("country", sa.String(100), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("website_url", sa.String(300), nullable=True),
        sa.Column("logo_url", sa.String(500), nullable=True),
        sa.Column("plan", sa.String(20), nullable=False, server_default="basic"),
        sa.Column("plan_status", sa.String(50), nullable=False, server_default="trialing"),
        sa.Column("stripe_customer_id", sa.String(255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(255), nullable=True),
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_clinics_slug", "clinics", ["slug"], unique=True)
    op.create_index("ix_clinics_owner_user_id", "clinics", ["owner_user_id"])

    op.create_table(
        "clinic_members",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "clinic_id",
            sa.Integer(),
            sa.ForeignKey("clinics.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("role", sa.String(20), nullable=False, server_default="staff"),
        sa.Column(
            "joined_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.UniqueConstraint("clinic_id", "user_id", name="uq_clinic_user"),
    )
    op.create_index("ix_clinic_members_clinic_id", "clinic_members", ["clinic_id"])
    op.create_index("ix_clinic_members_user_id", "clinic_members", ["user_id"])


def downgrade() -> None:
    op.drop_table("clinic_members")
    op.drop_table("clinics")

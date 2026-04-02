"""Add provider_subscriptions table (Phase 6 paid plans)

Revision ID: 004
Revises: 003
Create Date: 2026-04-02
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "provider_subscriptions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("provider_id", sa.Integer(), nullable=False),
        sa.Column("plan", sa.String(length=20), nullable=False, server_default="free"),
        sa.Column("stripe_customer_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_checkout_session_id", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="active"),
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["provider_id"], ["provider_listings.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("provider_id", name="uq_provider_subscriptions_provider_id"),
    )
    op.create_index(
        op.f("ix_provider_subscriptions_id"),
        "provider_subscriptions",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_provider_subscriptions_provider_id"),
        "provider_subscriptions",
        ["provider_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_provider_subscriptions_provider_id"),
        table_name="provider_subscriptions",
    )
    op.drop_index(
        op.f("ix_provider_subscriptions_id"),
        table_name="provider_subscriptions",
    )
    op.drop_table("provider_subscriptions")

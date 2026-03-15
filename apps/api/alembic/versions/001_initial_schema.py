"""Initial schema — 9 tables for Seou-up Microblading MVP

Revision ID: 001
Revises:
Create Date: 2026-03-15

Tables created:
  users, eyebrow_styles, simulations, guide_articles,
  compliance_notices, provider_listings, feedbacks,
  pro_sessions, consultations
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=True),
        sa.Column("role", sa.String(50), nullable=False, server_default="consumer"),
        sa.Column("language", sa.String(10), nullable=False, server_default="en"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "legal_consent_accepted",
            sa.Boolean(),
            nullable=False,
            server_default="false",
        ),
        sa.Column("legal_consent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )
    op.create_table(
        "eyebrow_styles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name_en", sa.String(100), nullable=False),
        sa.Column("name_ko", sa.String(100), nullable=True),
        sa.Column("name_th", sa.String(100), nullable=True),
        sa.Column("name_vi", sa.String(100), nullable=True),
        sa.Column("description_en", sa.Text(), nullable=True),
        sa.Column("description_ko", sa.Text(), nullable=True),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("image_url", sa.String(500), nullable=True),
        sa.Column("category", sa.String(50), nullable=True),
        sa.Column("difficulty", sa.String(20), server_default="medium"),
        sa.Column("price_range_min", sa.Float(), nullable=True),
        sa.Column("price_range_max", sa.Float(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("sort_order", sa.Integer(), server_default="0"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )
    op.create_table(
        "simulations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "eyebrow_style_id",
            sa.Integer(),
            sa.ForeignKey("eyebrow_styles.id"),
            nullable=True,
        ),
        sa.Column("status", sa.String(20), server_default="pending"),
        sa.Column("adapter", sa.String(20), server_default="mock"),
        sa.Column("input_image_url", sa.String(500), nullable=True),
        sa.Column("output_image_url", sa.String(500), nullable=True),
        sa.Column("landmarks_data", sa.JSON(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("session_note", sa.Text(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "guide_articles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(150), nullable=False, unique=True),
        sa.Column("title_en", sa.String(300), nullable=False),
        sa.Column("title_ko", sa.String(300), nullable=True),
        sa.Column("title_th", sa.String(300), nullable=True),
        sa.Column("title_vi", sa.String(300), nullable=True),
        sa.Column("body_en", sa.Text(), nullable=True),
        sa.Column("body_ko", sa.Text(), nullable=True),
        sa.Column("body_th", sa.Text(), nullable=True),
        sa.Column("body_vi", sa.Text(), nullable=True),
        sa.Column("category", sa.String(100), nullable=True),
        sa.Column("cover_image_url", sa.String(500), nullable=True),
        sa.Column("is_published", sa.Boolean(), server_default="true"),
        sa.Column("sort_order", sa.Integer(), server_default="0"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )
    op.create_table(
        "compliance_notices",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("key", sa.String(100), nullable=False, unique=True),
        sa.Column("title_en", sa.String(300), nullable=False),
        sa.Column("title_ko", sa.String(300), nullable=True),
        sa.Column("title_th", sa.String(300), nullable=True),
        sa.Column("title_vi", sa.String(300), nullable=True),
        sa.Column("body_en", sa.Text(), nullable=False),
        sa.Column("body_ko", sa.Text(), nullable=True),
        sa.Column("body_th", sa.Text(), nullable=True),
        sa.Column("body_vi", sa.Text(), nullable=True),
        sa.Column("display_type", sa.String(50), server_default="Banner"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )
    op.create_table(
        "provider_listings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("business_name", sa.String(200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("country", sa.String(100), nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("website_url", sa.String(300), nullable=True),
        sa.Column("instagram_url", sa.String(300), nullable=True),
        sa.Column("cover_image_url", sa.String(500), nullable=True),
        sa.Column("is_verified", sa.Boolean(), server_default="false"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("plan", sa.String(20), server_default="free"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )
    op.create_table(
        "feedbacks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("category", sa.String(50), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("page_context", sa.String(200), nullable=True),
        sa.Column("status", sa.String(20), server_default="open"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )
    op.create_table(
        "pro_sessions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "pro_user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("client_name", sa.String(200), nullable=True),
        sa.Column("client_email", sa.String(255), nullable=True),
        sa.Column(
            "simulation_id",
            sa.Integer(),
            sa.ForeignKey("simulations.id"),
            nullable=True,
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "recommended_style_id",
            sa.Integer(),
            sa.ForeignKey("eyebrow_styles.id"),
            nullable=True,
        ),
        sa.Column("status", sa.String(20), server_default="active"),
        sa.Column("session_data", sa.JSON(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_table(
        "consultations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "pro_user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "consumer_user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "eyebrow_style_id",
            sa.Integer(),
            sa.ForeignKey("eyebrow_styles.id"),
            nullable=True,
        ),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("reply", sa.Text(), nullable=True),
        sa.Column("is_resolved", sa.Boolean(), server_default="false"),
        sa.Column("status", sa.String(20), server_default="pending"),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("consultations")
    op.drop_table("pro_sessions")
    op.drop_table("feedbacks")
    op.drop_table("provider_listings")
    op.drop_table("compliance_notices")
    op.drop_table("guide_articles")
    op.drop_table("simulations")
    op.drop_table("eyebrow_styles")
    op.drop_table("users")

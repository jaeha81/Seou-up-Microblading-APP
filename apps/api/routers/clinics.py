"""Clinic (B2B tenant) management — create, staff, subscribe."""

import re
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from models.clinic import Clinic, ClinicMember, ClinicMemberRole, ClinicPlan
from models.user import User

router = APIRouter()

BASIC_STAFF_LIMIT = 3


# ── Schemas ────────────────────────────────────────────────────────────────────

class ClinicCreate(BaseModel):
    name: str
    country: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    website_url: Optional[str] = None
    description: Optional[str] = None


class ClinicUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    website_url: Optional[str] = None
    description: Optional[str] = None


class MemberInvite(BaseModel):
    email: str
    role: str = "staff"


# ── Helpers ────────────────────────────────────────────────────────────────────

def _slug(name: str, clinic_id: int) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:80]
    return f"{base}-{clinic_id}"


def _clinic_out(c: Clinic) -> dict:
    return {
        "id": c.id,
        "name": c.name,
        "slug": c.slug,
        "country": c.country,
        "city": c.city,
        "phone": c.phone,
        "website_url": c.website_url,
        "description": c.description,
        "plan": c.plan,
        "plan_status": c.plan_status,
        "current_period_end": (
            c.current_period_end.isoformat() if c.current_period_end else None
        ),
        "is_active": c.is_active,
        "created_at": c.created_at.isoformat() if c.created_at else None,
    }


def _require_owner(clinic_id: int, user_id: int, db: Session) -> Clinic:
    m = (
        db.query(ClinicMember)
        .filter(
            ClinicMember.clinic_id == clinic_id,
            ClinicMember.user_id == user_id,
            ClinicMember.role == ClinicMemberRole.owner,
        )
        .first()
    )
    if not m:
        raise HTTPException(403, "Only the clinic owner can perform this action.")
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not clinic:
        raise HTTPException(404, "Clinic not found.")
    return clinic


def _require_owner_or_manager(clinic_id: int, user_id: int, db: Session) -> Clinic:
    m = (
        db.query(ClinicMember)
        .filter(
            ClinicMember.clinic_id == clinic_id,
            ClinicMember.user_id == user_id,
            ClinicMember.role.in_([ClinicMemberRole.owner, ClinicMemberRole.manager]),
        )
        .first()
    )
    if not m:
        raise HTTPException(403, "Insufficient permissions.")
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not clinic:
        raise HTTPException(404, "Clinic not found.")
    return clinic


def _require_member(clinic_id: int, user_id: int, db: Session) -> ClinicMember:
    m = (
        db.query(ClinicMember)
        .filter(ClinicMember.clinic_id == clinic_id, ClinicMember.user_id == user_id)
        .first()
    )
    if not m:
        raise HTTPException(403, "You are not a member of this clinic.")
    return m


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.post("")
def create_clinic(
    body: ClinicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    already_owner = (
        db.query(ClinicMember)
        .join(Clinic, Clinic.id == ClinicMember.clinic_id)
        .filter(
            ClinicMember.user_id == current_user.id,
            ClinicMember.role == ClinicMemberRole.owner,
            Clinic.is_active == True,
        )
        .first()
    )
    if already_owner:
        raise HTTPException(400, "You already own a clinic.")

    clinic = Clinic(
        owner_user_id=current_user.id,
        name=body.name,
        slug="pending",
        country=body.country,
        city=body.city,
        phone=body.phone,
        website_url=body.website_url,
        description=body.description,
    )
    db.add(clinic)
    db.flush()
    clinic.slug = _slug(body.name, clinic.id)
    db.add(ClinicMember(
        clinic_id=clinic.id,
        user_id=current_user.id,
        role=ClinicMemberRole.owner,
    ))
    db.commit()
    db.refresh(clinic)
    return _clinic_out(clinic)


@router.get("/mine")
def get_my_clinic(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = (
        db.query(ClinicMember)
        .filter(ClinicMember.user_id == current_user.id)
        .order_by(ClinicMember.joined_at.asc())
        .first()
    )
    if not m:
        return {"clinic": None, "my_role": None}
    clinic = db.query(Clinic).filter(Clinic.id == m.clinic_id).first()
    members = db.query(ClinicMember).filter(ClinicMember.clinic_id == m.clinic_id).all()
    return {
        "clinic": _clinic_out(clinic),
        "my_role": m.role,
        "member_count": len(members),
    }


@router.patch("/{clinic_id}")
def update_clinic(
    clinic_id: int,
    body: ClinicUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clinic = _require_owner(clinic_id, current_user.id, db)
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(clinic, k, v)
    db.commit()
    db.refresh(clinic)
    return _clinic_out(clinic)


@router.get("/{clinic_id}/members")
def list_members(
    clinic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_member(clinic_id, current_user.id, db)
    rows = (
        db.query(ClinicMember, User)
        .join(User, User.id == ClinicMember.user_id)
        .filter(ClinicMember.clinic_id == clinic_id)
        .all()
    )
    return [
        {"user_id": u.id, "email": u.email, "full_name": u.full_name, "role": m.role}
        for m, u in rows
    ]


@router.post("/{clinic_id}/members")
def invite_member(
    clinic_id: int,
    body: MemberInvite,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clinic = _require_owner_or_manager(clinic_id, current_user.id, db)

    if clinic.plan == ClinicPlan.basic:
        count = (
            db.query(ClinicMember)
            .filter(ClinicMember.clinic_id == clinic_id)
            .count()
        )
        if count >= BASIC_STAFF_LIMIT:
            raise HTTPException(
                402,
                f"Staff limit ({BASIC_STAFF_LIMIT}) reached for Basic plan. Upgrade to Pro.",
            )

    invitee = db.query(User).filter(User.email == body.email).first()
    if not invitee:
        raise HTTPException(404, "No user found with that email.")

    already = (
        db.query(ClinicMember)
        .filter(
            ClinicMember.clinic_id == clinic_id,
            ClinicMember.user_id == invitee.id,
        )
        .first()
    )
    if already:
        raise HTTPException(400, "User is already a member.")

    db.add(ClinicMember(clinic_id=clinic_id, user_id=invitee.id, role=body.role))
    db.commit()
    return {"message": f"{invitee.email} added as {body.role}.", "user_id": invitee.id}


@router.delete("/{clinic_id}/members/{user_id}")
def remove_member(
    clinic_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_owner(clinic_id, current_user.id, db)
    if user_id == current_user.id:
        raise HTTPException(400, "Owner cannot remove themselves.")
    m = (
        db.query(ClinicMember)
        .filter(ClinicMember.clinic_id == clinic_id, ClinicMember.user_id == user_id)
        .first()
    )
    if not m:
        raise HTTPException(404, "Member not found.")
    db.delete(m)
    db.commit()
    return {"message": "Member removed."}


@router.post("/{clinic_id}/checkout")
def clinic_checkout(
    clinic_id: int,
    plan: str = "pro",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clinic = _require_owner(clinic_id, current_user.id, db)

    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(503, "Payment gateway not configured.")

    price_map = {
        "basic": settings.STRIPE_PRICE_ID_CLINIC_BASIC,
        "pro": settings.STRIPE_PRICE_ID_CLINIC_PRO,
    }
    price_id = price_map.get(plan)
    if not price_id:
        raise HTTPException(400, f"Unknown plan: {plan}. Choose 'basic' or 'pro'.")

    client = stripe.StripeClient(settings.STRIPE_SECRET_KEY)
    session = client.checkout.sessions.create(
        params={
            "mode": "subscription",
            "line_items": [{"price": price_id, "quantity": 1}],
            "success_url": (
                settings.APP_BASE_URL
                + f"/en/clinic?session_id={{CHECKOUT_SESSION_ID}}&clinic_id={clinic.id}"
            ),
            "cancel_url": settings.APP_BASE_URL + "/en/pricing",
            "customer_email": current_user.email,
            "metadata": {
                "clinic_id": str(clinic.id),
                "user_id": str(current_user.id),
                "plan": plan,
            },
        }
    )
    return {"checkout_url": session.url}


@router.get("/{clinic_id}/subscription")
def get_subscription(
    clinic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_member(clinic_id, current_user.id, db)
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not clinic:
        raise HTTPException(404, "Clinic not found.")
    return {
        "plan": clinic.plan,
        "plan_status": clinic.plan_status,
        "current_period_end": (
            clinic.current_period_end.isoformat() if clinic.current_period_end else None
        ),
        "stripe_subscription_id": clinic.stripe_subscription_id,
    }


@router.post("/webhook")
async def clinic_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db),
):
    if not settings.STRIPE_WEBHOOK_SECRET_CLINIC:
        raise HTTPException(503, "Clinic webhook secret not configured.")

    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET_CLINIC
        )
    except stripe.SignatureVerificationError:
        raise HTTPException(400, "Invalid Stripe signature.")

    data = event["data"]["object"]

    if event["type"] == "checkout.session.completed":
        clinic_id = int(data.get("metadata", {}).get("clinic_id", 0))
        plan = data.get("metadata", {}).get("plan", "basic")
        if clinic_id:
            clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
            if clinic:
                clinic.plan = plan
                clinic.plan_status = "active"
                clinic.stripe_customer_id = data.get("customer")
                clinic.stripe_subscription_id = data.get("subscription")
                db.commit()

    elif event["type"] == "customer.subscription.updated":
        sub_id = data.get("id")
        clinic = (
            db.query(Clinic)
            .filter(Clinic.stripe_subscription_id == sub_id)
            .first()
        )
        if clinic:
            clinic.plan_status = data.get("status", clinic.plan_status)
            from datetime import datetime, timezone as tz
            ped = data.get("current_period_end")
            if ped:
                clinic.current_period_end = datetime.fromtimestamp(ped, tz=tz.utc)
            db.commit()

    elif event["type"] in ("customer.subscription.deleted", "customer.subscription.paused"):
        sub_id = data.get("id")
        clinic = (
            db.query(Clinic)
            .filter(Clinic.stripe_subscription_id == sub_id)
            .first()
        )
        if clinic:
            clinic.plan_status = "cancelled"
            clinic.plan = ClinicPlan.basic
            db.commit()

    return {"status": "ok"}

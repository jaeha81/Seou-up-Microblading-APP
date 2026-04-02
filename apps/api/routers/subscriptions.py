"""Partner subscription management via Stripe."""

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from models.provider import ProviderListing
from models.user import User

router = APIRouter()


def _get_stripe_client() -> stripe.StripeClient:
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=503,
            detail="Payment gateway not configured. Please set STRIPE_SECRET_KEY.",
        )
    return stripe.StripeClient(settings.STRIPE_SECRET_KEY)


@router.post("/checkout")
def create_checkout_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a Stripe Checkout session for the Featured Pro plan."""
    client = _get_stripe_client()

    if not settings.STRIPE_PRICE_ID_FEATURED:
        raise HTTPException(status_code=503, detail="Stripe price not configured.")

    provider = (
        db.query(ProviderListing)
        .filter(ProviderListing.user_id == current_user.id)
        .first()
    )

    metadata = {
        "user_id": str(current_user.id),
        "provider_id": str(provider.id) if provider else "",
    }

    success_url = settings.APP_BASE_URL + "/en/pricing/success?session_id={CHECKOUT_SESSION_ID}"
    cancel_url = settings.APP_BASE_URL + "/en/pricing"

    session = client.checkout.sessions.create(
        params={
            "mode": "subscription",
            "line_items": [{"price": settings.STRIPE_PRICE_ID_FEATURED, "quantity": 1}],
            "success_url": success_url,
            "cancel_url": cancel_url,
            "customer_email": current_user.email,
            "metadata": metadata,
        }
    )
    return {"checkout_url": session.url}


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: Session = Depends(get_db),
):
    """Handle Stripe webhook events to update provider plan status."""
    if not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Webhook secret not configured.")

    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature.")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = int(session.get("metadata", {}).get("user_id", 0))
        provider_id = session.get("metadata", {}).get("provider_id", "")

        if user_id:
            provider = None
            if provider_id:
                provider = db.query(ProviderListing).filter(ProviderListing.id == int(provider_id)).first()
            if not provider:
                provider = db.query(ProviderListing).filter(ProviderListing.user_id == user_id).first()
            if provider:
                provider.plan = "paid_plan"
                db.commit()

    elif event["type"] in ("customer.subscription.deleted", "customer.subscription.paused"):
        sub = event["data"]["object"]
        customer_email = sub.get("customer_email") or ""
        if customer_email:
            provider = (
                db.query(ProviderListing)
                .join(User, User.id == ProviderListing.user_id)
                .filter(User.email == customer_email)
                .first()
            )
            if provider:
                provider.plan = "free"
                db.commit()

    return {"status": "ok"}


@router.get("/status")
def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the current subscription plan for the logged-in user's provider listing."""
    provider = (
        db.query(ProviderListing)
        .filter(ProviderListing.user_id == current_user.id)
        .first()
    )
    if not provider:
        return {"plan": "none", "has_provider": False}
    return {
        "plan": provider.plan,
        "has_provider": True,
        "provider_id": provider.id,
        "business_name": provider.business_name,
    }


@router.post("/cancel")
def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Downgrade provider back to free plan (admin/manual override)."""
    provider = (
        db.query(ProviderListing)
        .filter(ProviderListing.user_id == current_user.id)
        .first()
    )
    if not provider:
        raise HTTPException(status_code=404, detail="No provider listing found.")
    provider.plan = "free"
    db.commit()
    return {"plan": "free", "message": "Downgraded to free plan."}

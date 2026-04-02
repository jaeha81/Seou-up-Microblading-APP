from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class SubscriptionStatus(BaseModel):
    provider_id: int
    plan: str
    status: str
    current_period_end: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str


class PortalSessionResponse(BaseModel):
    portal_url: str

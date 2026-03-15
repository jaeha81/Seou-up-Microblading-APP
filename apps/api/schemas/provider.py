from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProviderResponse(BaseModel):
    id: int
    business_name: str
    description: Optional[str]
    country: Optional[str]
    city: Optional[str]
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    website_url: Optional[str]
    instagram_url: Optional[str]
    cover_image_url: Optional[str]
    is_verified: bool
    plan: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ProviderCreate(BaseModel):
    business_name: str
    description: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    website_url: Optional[str] = None
    instagram_url: Optional[str] = None

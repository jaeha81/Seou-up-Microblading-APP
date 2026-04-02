"""Seed demo provider listings with geographic coordinates (Phase 6)."""

from sqlalchemy.orm import Session
from models.provider import ProviderListing

PROVIDERS = [
    {
        "business_name": "Seoul Brow Studio",
        "city": "Seoul",
        "country": "KR",
        "address": "Gangnam-gu, Seoul, South Korea",
        "latitude": 37.5172,
        "longitude": 127.0473,
        "description": (
            "Premium microblading studio in Gangnam. "
            "Specializing in natural feather and Korean straight brow styles. "
            "Over 5 years of experience."
        ),
        "phone": "+82-10-1234-5678",
        "website_url": "https://example.com/seoul-brow",
        "is_verified": True,
    },
    {
        "business_name": "Bangkok Beauty Lab",
        "city": "Bangkok",
        "country": "TH",
        "address": "Silom, Bangkok, Thailand",
        "latitude": 13.7230,
        "longitude": 100.5247,
        "description": (
            "Expert microblading and ombre powder techniques in central Bangkok. "
            "Certified by international microblading association."
        ),
        "phone": "+66-81-234-5678",
        "website_url": "https://example.com/bangkok-beauty",
        "is_verified": True,
    },
    {
        "business_name": "Hanoi Brow Atelier",
        "city": "Hanoi",
        "country": "VN",
        "address": "Hoan Kiem, Hanoi, Vietnam",
        "latitude": 21.0285,
        "longitude": 105.8542,
        "description": "Boutique brow studio offering nano brow and combination techniques.",
        "phone": "+84-90-123-4567",
        "website_url": None,
        "is_verified": False,
    },
    {
        "business_name": "Busan Micro Arts",
        "city": "Busan",
        "country": "KR",
        "address": "Haeundae-gu, Busan, South Korea",
        "latitude": 35.1631,
        "longitude": 129.1636,
        "description": (
            "3D hair stroke specialist in Haeundae district. "
            "Known for hyper-realistic eyebrow transformations."
        ),
        "phone": "+82-51-123-4567",
        "website_url": "https://example.com/busan-micro",
        "is_verified": True,
    },
    {
        "business_name": "The Brow Room SG",
        "city": "Singapore",
        "country": "SG",
        "address": "Orchard Road, Singapore",
        "latitude": 1.3048,
        "longitude": 103.8318,
        "description": (
            "Luxury microblading studio in Orchard Road. "
            "Specializing in soft classic and fluffy brow styles."
        ),
        "phone": "+65-9123-4567",
        "website_url": "https://example.com/brow-room-sg",
        "is_verified": True,
    },
]


def seed_providers(db: Session) -> int:
    existing_count = db.query(ProviderListing).count()
    if existing_count >= len(PROVIDERS):
        _update_coordinates(db)
        return 0

    added = 0
    for data in PROVIDERS:
        existing = (
            db.query(ProviderListing)
            .filter(ProviderListing.business_name == data["business_name"])
            .first()
        )
        if existing:
            if existing.latitude is None and data.get("latitude"):
                existing.latitude = data["latitude"]
                existing.longitude = data["longitude"]
                existing.address = data.get("address")
            continue
        provider = ProviderListing(**data, is_active=True, user_id=None)
        db.add(provider)
        added += 1

    db.commit()
    return added


def _update_coordinates(db: Session) -> None:
    """Backfill lat/lng for existing providers missing coordinates."""
    coord_map = {p["business_name"]: p for p in PROVIDERS}
    updated = False
    for provider in db.query(ProviderListing).all():
        if provider.business_name in coord_map and provider.latitude is None:
            data = coord_map[provider.business_name]
            provider.latitude = data.get("latitude")
            provider.longitude = data.get("longitude")
            if not provider.address:
                provider.address = data.get("address")
            updated = True
    if updated:
        db.commit()

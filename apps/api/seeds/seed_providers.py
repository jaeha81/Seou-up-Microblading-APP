"""Seed demo provider listings (development only)."""

from sqlalchemy.orm import Session
from models.provider import ProviderListing


PROVIDERS = [
    {
        "business_name": "Seoul Brow Studio",
        "city": "Seoul",
        "country": "KR",
        "description": "Premium microblading studio in Gangnam. Specializing in natural feather and Korean straight brow styles. Over 5 years of experience.",
        "phone": "+82-10-1234-5678",
        "website_url": "https://example.com/seoul-brow",
        "is_verified": True,
    },
    {
        "business_name": "Bangkok Beauty Lab",
        "city": "Bangkok",
        "country": "TH",
        "description": "Expert microblading and ombre powder techniques in central Bangkok. Certified by international microblading association.",
        "phone": "+66-81-234-5678",
        "website_url": "https://example.com/bangkok-beauty",
        "is_verified": True,
    },
    {
        "business_name": "Hanoi Brow Atelier",
        "city": "Hanoi",
        "country": "VN",
        "description": "Boutique brow studio offering nano brow and combination techniques. Consultation available in Vietnamese and English.",
        "phone": "+84-90-123-4567",
        "website_url": None,
        "is_verified": False,
    },
    {
        "business_name": "Busan Micro Arts",
        "city": "Busan",
        "country": "KR",
        "description": "3D hair stroke specialist in Haeundae district. Known for hyper-realistic eyebrow transformations.",
        "phone": "+82-51-123-4567",
        "website_url": "https://example.com/busan-micro",
        "is_verified": True,
    },
    {
        "business_name": "The Brow Room SG",
        "city": "Singapore",
        "country": "SG",
        "description": "Luxury microblading studio in Orchard Road. Specializing in soft classic and fluffy brow styles.",
        "phone": "+65-9123-4567",
        "website_url": "https://example.com/brow-room-sg",
        "is_verified": True,
    },
]


def seed_providers(db: Session) -> int:
    existing_count = db.query(ProviderListing).count()
    if existing_count >= len(PROVIDERS):
        return 0

    added = 0
    for data in PROVIDERS:
        existing = (
            db.query(ProviderListing)
            .filter(ProviderListing.business_name == data["business_name"])
            .first()
        )
        if existing:
            continue
        provider = ProviderListing(
            **data,
            is_active=True,
            user_id=None,
        )
        db.add(provider)
        added += 1

    db.commit()
    return added

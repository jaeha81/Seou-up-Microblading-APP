from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.provider import ProviderListing
from models.user import User
from schemas.provider import ProviderResponse, ProviderCreate

router = APIRouter()


@router.get("", response_model=List[ProviderResponse])
def list_providers(
    country: Optional[str] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(ProviderListing).filter(ProviderListing.is_active == True)
    if country:
        q = q.filter(ProviderListing.country == country)
    if city:
        q = q.filter(ProviderListing.city == city)
    return q.all()


@router.get("/{provider_id}", response_model=ProviderResponse)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    p = db.query(ProviderListing).filter(ProviderListing.id == provider_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Provider not found")
    return p


@router.post("", response_model=ProviderResponse, status_code=201)
def create_provider(
    body: ProviderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    provider = ProviderListing(**body.model_dump(), user_id=current_user.id)
    db.add(provider)
    db.commit()
    db.refresh(provider)
    return provider

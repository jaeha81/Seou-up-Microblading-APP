from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import require_admin
from models.eyebrow_style import EyebrowStyle
from schemas.eyebrow_style import EyebrowStyleResponse, EyebrowStyleCreate

router = APIRouter()


@router.get("", response_model=List[EyebrowStyleResponse])
def list_styles(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(EyebrowStyle).filter(EyebrowStyle.is_active == True)
    if category:
        q = q.filter(EyebrowStyle.category == category)
    return q.order_by(EyebrowStyle.sort_order).all()


@router.get("/{slug}", response_model=EyebrowStyleResponse)
def get_style(slug: str, db: Session = Depends(get_db)):
    style = db.query(EyebrowStyle).filter(EyebrowStyle.slug == slug).first()
    if not style:
        raise HTTPException(status_code=404, detail="Eyebrow style not found")
    return style


@router.post("", response_model=EyebrowStyleResponse, status_code=201)
def create_style(
    body: EyebrowStyleCreate,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
):
    style = EyebrowStyle(**body.model_dump())
    db.add(style)
    db.commit()
    db.refresh(style)
    return style

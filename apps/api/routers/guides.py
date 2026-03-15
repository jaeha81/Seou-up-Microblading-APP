from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.guide import GuideArticle
from schemas.guide import GuideArticleResponse

router = APIRouter()


@router.get("", response_model=List[GuideArticleResponse])
def list_guides(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(GuideArticle).filter(GuideArticle.is_published == True)
    if category:
        q = q.filter(GuideArticle.category == category)
    return q.order_by(GuideArticle.sort_order).all()


@router.get("/{slug}", response_model=GuideArticleResponse)
def get_guide(slug: str, db: Session = Depends(get_db)):
    article = db.query(GuideArticle).filter(GuideArticle.slug == slug).first()
    if not article:
        raise HTTPException(status_code=404, detail="Guide article not found")
    return article

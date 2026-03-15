from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.feedback import Feedback
from models.user import User
from schemas.feedback import FeedbackCreateRequest, FeedbackResponse

router = APIRouter()


@router.post("", response_model=FeedbackResponse, status_code=201)
def submit_feedback(
    body: FeedbackCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fb = Feedback(**body.model_dump(), user_id=current_user.id)
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb


@router.post("/anonymous", response_model=FeedbackResponse, status_code=201)
def submit_anonymous_feedback(
    body: FeedbackCreateRequest, db: Session = Depends(get_db)
):
    fb = Feedback(**body.model_dump())
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb

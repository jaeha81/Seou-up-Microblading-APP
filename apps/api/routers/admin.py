from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import require_admin
from models.user import User
from models.feedback import Feedback
from models.simulation import Simulation
from schemas.user import UserResponse
from schemas.feedback import FeedbackResponse

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/feedbacks", response_model=List[FeedbackResponse])
def list_all_feedbacks(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return {
        "total_users": db.query(User).count(),
        "total_simulations": db.query(Simulation).count(),
        "total_feedbacks": db.query(Feedback).count(),
    }


@router.patch("/users/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_active = False
        db.commit()
    return {"message": "User deactivated"}

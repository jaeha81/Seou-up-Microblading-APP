from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class FeedbackCreateRequest(BaseModel):
    category: Optional[str] = "general"  # bug | feature | general
    rating: Optional[int] = None
    message: str
    email: Optional[str] = None
    page_context: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: int
    user_id: Optional[int]
    category: Optional[str]
    rating: Optional[int]
    message: str
    email: Optional[str]
    page_context: Optional[str]
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}

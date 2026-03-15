from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel


class SimulationCreateRequest(BaseModel):
    eyebrow_style_id: Optional[int] = None


class SimulationResponse(BaseModel):
    id: int
    user_id: int
    eyebrow_style_id: Optional[int]
    status: str
    adapter: str
    input_image_url: Optional[str]
    output_image_url: Optional[str]
    landmarks_data: Optional[Any]
    error_message: Optional[str]
    session_note: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}


class SimulationNoteUpdate(BaseModel):
    session_note: str

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class GuideArticleResponse(BaseModel):
    id: int
    slug: str
    title_en: str
    title_ko: Optional[str]
    title_th: Optional[str]
    title_vi: Optional[str]
    body_en: Optional[str]
    body_ko: Optional[str]
    category: Optional[str]
    cover_image_url: Optional[str]
    is_published: bool
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}

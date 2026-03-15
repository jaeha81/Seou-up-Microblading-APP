from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class EyebrowStyleResponse(BaseModel):
    id: int
    name_en: str
    name_ko: Optional[str]
    name_th: Optional[str]
    name_vi: Optional[str]
    description_en: Optional[str]
    description_ko: Optional[str]
    slug: str
    image_url: Optional[str]
    category: Optional[str]
    difficulty: str
    price_range_min: Optional[float]
    price_range_max: Optional[float]
    is_active: bool
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class EyebrowStyleCreate(BaseModel):
    name_en: str
    name_ko: Optional[str] = None
    name_th: Optional[str] = None
    name_vi: Optional[str] = None
    description_en: Optional[str] = None
    description_ko: Optional[str] = None
    slug: str
    image_url: Optional[str] = None
    category: Optional[str] = None
    difficulty: str = "medium"
    price_range_min: Optional[float] = None
    price_range_max: Optional[float] = None

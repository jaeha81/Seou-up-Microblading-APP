from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "consumer"  # consumer | pro | founder
    language: str = "en"


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    language: str
    is_active: bool
    legal_consent_accepted: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LegalConsentRequest(BaseModel):
    accepted: bool


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    language: Optional[str] = None

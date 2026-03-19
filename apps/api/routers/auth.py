from datetime import datetime, timezone
import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from core.security import hash_password, verify_password, create_access_token
from models.user import User
from schemas.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    LegalConsentRequest,
    UserUpdateRequest,
)

router = APIRouter()


class OAuthCodeRequest(BaseModel):
    code: str


@router.post(
    "/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED
)
def register(body: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        role=body.role,
        language=body.language,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(body: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/google")
def get_google_auth_url():
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
    }
    auth_url = f"https://accounts.google.com/o/oauth2/auth?{urlencode(params)}"
    return {"auth_url": auth_url}


@router.post("/google/callback", response_model=TokenResponse)
async def google_callback(body: OAuthCodeRequest, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth is not configured")

    async with httpx.AsyncClient(timeout=15) as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": body.code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_response.status_code >= 400:
            raise HTTPException(status_code=400, detail="Google token exchange failed")

        access_token = token_response.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Google access token missing")

        profile_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if profile_response.status_code >= 400:
            raise HTTPException(
                status_code=400, detail="Google user info request failed"
            )

    profile = profile_response.json()
    email = profile.get("email")
    google_id = profile.get("id")
    full_name = profile.get("name")

    if not email:
        raise HTTPException(status_code=400, detail="Google account email is required")

    user = db.query(User).filter(User.email == email).first()
    if user:
        if user.google_id and google_id and user.google_id != google_id:
            raise HTTPException(status_code=409, detail="Google account mismatch")
        if google_id and not user.google_id:
            user.google_id = google_id
        if full_name and not user.full_name:
            user.full_name = full_name
    else:
        user = User(
            email=email,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            full_name=full_name,
            role="consumer",
            language="en",
            google_id=google_id,
        )
        db.add(user)

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/kakao")
def get_kakao_auth_url():
    params = {
        "client_id": settings.KAKAO_CLIENT_ID,
        "redirect_uri": settings.KAKAO_REDIRECT_URI_KAKAO,
        "response_type": "code",
    }
    auth_url = f"https://kauth.kakao.com/oauth/authorize?{urlencode(params)}"
    return {"auth_url": auth_url}


@router.post("/kakao/callback", response_model=TokenResponse)
async def kakao_callback(body: OAuthCodeRequest, db: Session = Depends(get_db)):
    if not settings.KAKAO_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Kakao OAuth is not configured")

    async with httpx.AsyncClient(timeout=15) as client:
        token_response = await client.post(
            "https://kauth.kakao.com/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": settings.KAKAO_CLIENT_ID,
                "redirect_uri": settings.KAKAO_REDIRECT_URI_KAKAO,
                "code": body.code,
            },
        )
        if token_response.status_code >= 400:
            raise HTTPException(status_code=400, detail="Kakao token exchange failed")

        access_token = token_response.json().get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Kakao access token missing")

        profile_response = await client.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if profile_response.status_code >= 400:
            raise HTTPException(
                status_code=400, detail="Kakao user info request failed"
            )

    profile = profile_response.json()
    kakao_account = profile.get("kakao_account") or {}
    properties = profile.get("properties") or {}

    email = kakao_account.get("email")
    nickname = properties.get("nickname")
    kakao_id = str(profile.get("id")) if profile.get("id") is not None else None

    if not email:
        raise HTTPException(status_code=400, detail="Kakao account email is required")

    user = db.query(User).filter(User.email == email).first()
    if user:
        if user.kakao_id and kakao_id and user.kakao_id != kakao_id:
            raise HTTPException(status_code=409, detail="Kakao account mismatch")
        if kakao_id and not user.kakao_id:
            user.kakao_id = kakao_id
        if nickname and not user.full_name:
            user.full_name = nickname
    else:
        user = User(
            email=email,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            full_name=nickname,
            role="consumer",
            language="en",
            kakao_id=kakao_id,
        )
        db.add(user)

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    body: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.full_name is not None:
        current_user.full_name = body.full_name
    if body.language is not None:
        current_user.language = body.language
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/consent", response_model=UserResponse)
def accept_legal_consent(
    body: LegalConsentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.legal_consent_accepted = body.accepted
    current_user.legal_consent_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return current_user

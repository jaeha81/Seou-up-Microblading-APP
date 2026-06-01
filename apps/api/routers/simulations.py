import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.deps import get_current_user
from models.user import User
from models.simulation import Simulation
from schemas.simulation import (
    SimulationCreateRequest,
    SimulationResponse,
    SimulationNoteUpdate,
)
from services.simulation_service import SimulationService

router = APIRouter()

_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
async def create_simulation(
    body: SimulationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = SimulationService(db)
    return await service.create(
        user=current_user, eyebrow_style_id=body.eyebrow_style_id
    )


_MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

_MAGIC_BYTES = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp",
}


@router.post("/{simulation_id}/upload", response_model=SimulationResponse)
async def upload_image(
    simulation_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in _ALLOWED_EXTENSIONS or (file.content_type and file.content_type not in _ALLOWED_CONTENT_TYPES):
        raise HTTPException(status_code=400, detail="Only JPG, PNG, or WebP images are allowed.")

    contents = await file.read(_MAX_UPLOAD_BYTES + 1)
    if len(contents) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10 MB.")

    # magic-byte validation
    valid_magic = any(contents.startswith(sig) for sig in _MAGIC_BYTES)
    if not valid_magic:
        raise HTTPException(status_code=400, detail="File content does not match an allowed image format.")

    await file.seek(0)

    sim = (
        db.query(Simulation)
        .filter(Simulation.id == simulation_id, Simulation.user_id == current_user.id)
        .first()
    )
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    service = SimulationService(db)
    return await service.upload_and_process(sim, file)


@router.get("", response_model=List[SimulationResponse])
def list_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Simulation)
        .filter(Simulation.user_id == current_user.id)
        .order_by(Simulation.created_at.desc())
        .all()
    )


@router.get("/{simulation_id}", response_model=SimulationResponse)
def get_simulation(
    simulation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sim = (
        db.query(Simulation)
        .filter(Simulation.id == simulation_id, Simulation.user_id == current_user.id)
        .first()
    )
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return sim


@router.patch("/{simulation_id}/note", response_model=SimulationResponse)
def update_note(
    simulation_id: int,
    body: SimulationNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sim = (
        db.query(Simulation)
        .filter(Simulation.id == simulation_id, Simulation.user_id == current_user.id)
        .first()
    )
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    sim.session_note = body.session_note
    db.commit()
    db.refresh(sim)
    return sim

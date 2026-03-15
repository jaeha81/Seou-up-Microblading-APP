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


@router.post("/{simulation_id}/upload", response_model=SimulationResponse)
async def upload_image(
    simulation_id: int,
    file: UploadFile = File(...),
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

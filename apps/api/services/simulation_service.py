"""
Simulation Service
==================
Supports two adapters:
  - MockAdapter   : immediate deterministic result (MVP / Phase 1–3)
  - MediaPipeAdapter : real facial landmark detection (Phase 4 — swap here)

Set SIMULATION_ADAPTER=mock in .env to stay on MockAdapter.
"""

import os
import uuid
import shutil
from datetime import datetime, timezone
from typing import Optional

from fastapi import UploadFile
from sqlalchemy.orm import Session

from core.config import settings
from models.simulation import Simulation
from models.user import User


# ── Adapter Interface ────────────────────────────────────────────────────────


class BaseSimulationAdapter:
    async def process(
        self, input_image_path: str, eyebrow_style_id: Optional[int]
    ) -> dict:
        raise NotImplementedError


# ── Mock Adapter (MVP) ───────────────────────────────────────────────────────


class MockAdapter(BaseSimulationAdapter):
    """Returns a deterministic mock result immediately — no AI dependencies."""

    async def process(
        self, input_image_path: str, eyebrow_style_id: Optional[int]
    ) -> dict:
        # Simulate processing delay (remove in production)
        return {
            "status": "completed",
            "output_image_url": f"/uploads/mock_result_{eyebrow_style_id or 1}.jpg",
            "landmarks_data": {
                "adapter": "mock",
                "eyebrow_style_id": eyebrow_style_id,
                "note": (
                    "Mock simulation result. "
                    "This platform is for visualization purposes only. "
                    "Not a licensed medical or procedure provider."
                ),
                "landmarks": {
                    "left_eyebrow": [
                        [100, 200],
                        [110, 195],
                        [120, 192],
                        [130, 195],
                        [140, 200],
                    ],
                    "right_eyebrow": [
                        [160, 200],
                        [170, 195],
                        [180, 192],
                        [190, 195],
                        [200, 200],
                    ],
                },
            },
        }


# ── MediaPipe Adapter — Phase 4 swap point ──────────────────────────────────


class MediaPipeAdapter(BaseSimulationAdapter):
    """
    Real AI eyebrow overlay using MediaPipe Face Mesh.
    Phase 4: Replace MockAdapter with this in SimulationService.
    Requirements: mediapipe, opencv-python-headless
    """

    async def process(
        self, input_image_path: str, eyebrow_style_id: Optional[int]
    ) -> dict:
        # TODO Phase 4: implement MediaPipe face mesh landmark detection
        # import mediapipe as mp
        # import cv2
        # mp_face_mesh = mp.solutions.face_mesh
        # ...
        raise NotImplementedError(
            "MediaPipe adapter not yet implemented. Set SIMULATION_ADAPTER=mock."
        )


# ── Factory ──────────────────────────────────────────────────────────────────


def get_adapter() -> BaseSimulationAdapter:
    if settings.SIMULATION_ADAPTER == "mediapipe":
        return MediaPipeAdapter()
    return MockAdapter()


# ── Service ──────────────────────────────────────────────────────────────────


class SimulationService:
    def __init__(self, db: Session):
        self.db = db
        self.adapter = get_adapter()

    async def create(
        self, user: User, eyebrow_style_id: Optional[int] = None
    ) -> Simulation:
        sim = Simulation(
            user_id=user.id,
            eyebrow_style_id=eyebrow_style_id,
            status="pending",
            adapter=settings.SIMULATION_ADAPTER,
        )
        self.db.add(sim)
        self.db.commit()
        self.db.refresh(sim)
        return sim

    async def upload_and_process(self, sim: Simulation, file: UploadFile) -> Simulation:
        # Save uploaded image
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        ext = os.path.splitext(file.filename or "image.jpg")[1] or ".jpg"
        filename = f"sim_{sim.id}_{uuid.uuid4().hex}{ext}"
        save_path = os.path.join(settings.UPLOAD_DIR, filename)

        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        sim.input_image_url = f"/uploads/{filename}"
        sim.status = "processing"
        self.db.commit()

        try:
            result = await self.adapter.process(save_path, sim.eyebrow_style_id)
            sim.status = result.get("status", "completed")
            sim.output_image_url = result.get("output_image_url")
            sim.landmarks_data = result.get("landmarks_data")
            sim.completed_at = datetime.now(timezone.utc)
        except Exception as exc:
            sim.status = "failed"
            sim.error_message = str(exc)

        self.db.commit()
        self.db.refresh(sim)
        return sim

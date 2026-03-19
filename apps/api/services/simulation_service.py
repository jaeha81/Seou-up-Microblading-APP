"""
Simulation Service
==================
Supports two adapters:
  - MockAdapter   : immediate deterministic result (MVP / Phase 1–3)
  - MediaPipeAdapter : real facial landmark detection (Phase 4 — swap here)

Set SIMULATION_ADAPTER=mock in .env to stay on MockAdapter.
"""

import os
import re
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
        async def _mock_fallback(note: str) -> dict:
            fallback = await MockAdapter().process(input_image_path, eyebrow_style_id)
            fallback_landmarks = dict(fallback.get("landmarks_data") or {})
            existing_note = fallback_landmarks.get("note", "").strip()
            fallback_landmarks["note"] = (
                f"{existing_note} Fallback: {note}".strip()
                if existing_note
                else f"Fallback: {note}"
            )
            fallback_landmarks["fallback_reason"] = note
            fallback_landmarks["adapter_requested"] = "mediapipe"
            fallback["landmarks_data"] = fallback_landmarks
            return fallback

        try:
            import mediapipe as mp
            import cv2
        except ImportError:
            # mediapipe/opencv not installed, fall back to mock
            return await _mock_fallback("mediapipe/opencv not installed")

        try:
            import numpy as np
            from PIL import Image, ImageDraw

            image_bgr = cv2.imread(input_image_path)
            if image_bgr is None:
                raise ValueError("Unable to read input image")

            height, width = image_bgr.shape[:2]
            image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

            with mp.solutions.face_mesh.FaceMesh(
                static_image_mode=True,
                max_num_faces=1,
            ) as face_mesh:
                results = face_mesh.process(image_rgb)

            if not results.multi_face_landmarks:
                raise ValueError("No face detected in image")

            face_landmarks = results.multi_face_landmarks[0].landmark
            left_brow_indices = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46]
            right_brow_indices = [336, 296, 334, 293, 300, 285, 295, 282, 283, 276]

            def _to_pixel_points(indices: list[int]) -> list[tuple[int, int]]:
                points: list[tuple[int, int]] = []
                for idx in indices:
                    lm = face_landmarks[idx]
                    px = min(max(int(lm.x * width), 0), width - 1)
                    py = min(max(int(lm.y * height), 0), height - 1)
                    points.append((px, py))
                return points

            left_points = _to_pixel_points(left_brow_indices)
            right_points = _to_pixel_points(right_brow_indices)

            style_map = {
                1: {
                    "opacity": 0.6,
                    "color": (60, 40, 20),
                    "thickness": 2,
                    "mode": "thin",
                },
                2: {
                    "opacity": 0.7,
                    "color": (40, 25, 15),
                    "thickness": 3,
                    "mode": "gradient",
                },
                4: {
                    "opacity": 0.85,
                    "color": (30, 20, 10),
                    "thickness": 7,
                    "mode": "bold",
                },
                5: {
                    "opacity": 0.65,
                    "color": (50, 35, 20),
                    "thickness": 4,
                    "mode": "flat",
                },
            }
            style = style_map.get(
                eyebrow_style_id,
                {
                    "opacity": 0.7,
                    "color": (45, 30, 18),
                    "thickness": 3,
                    "mode": "standard",
                },
            )

            overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay, "RGBA")
            alpha = int(255 * style["opacity"])

            def _flatten_points(points: list[tuple[int, int]]) -> list[tuple[int, int]]:
                avg_y = int(sum(y for _, y in points) / len(points))
                return [(x, int(0.35 * y + 0.65 * avg_y)) for x, y in points]

            def _draw_gradient(
                points: list[tuple[int, int]], color: tuple[int, int, int]
            ) -> None:
                mask = Image.new("L", (width, height), 0)
                ImageDraw.Draw(mask).polygon(points, fill=255)

                y_values = [p[1] for p in points]
                top = max(min(y_values), 0)
                bottom = min(max(y_values), height - 1)
                span = max(bottom - top, 1)

                gradient = Image.new("RGBA", (width, height), (0, 0, 0, 0))
                gradient_draw = ImageDraw.Draw(gradient, "RGBA")
                for y in range(top, bottom + 1):
                    ratio = (y - top) / span
                    row_alpha = int(alpha * (0.4 + 0.6 * ratio))
                    gradient_draw.line(
                        [(0, y), (width, y)],
                        fill=(color[0], color[1], color[2], row_alpha),
                    )
                overlay.paste(gradient, (0, 0), mask)

            def _draw_brow(points: list[tuple[int, int]]) -> list[tuple[int, int]]:
                mode = style["mode"]
                color = style["color"]
                thickness = style["thickness"]

                if mode == "flat":
                    points = _flatten_points(points)

                if mode == "gradient":
                    _draw_gradient(points, color)
                    draw.line(
                        points + [points[0]],
                        fill=(color[0], color[1], color[2], min(alpha + 20, 255)),
                        width=thickness,
                    )
                    return points

                draw.polygon(points, fill=(color[0], color[1], color[2], alpha))
                if mode == "thin":
                    draw.line(
                        points,
                        fill=(color[0], color[1], color[2], min(alpha + 30, 255)),
                        width=thickness,
                    )
                elif mode == "bold":
                    draw.line(
                        points + [points[0]],
                        fill=(color[0], color[1], color[2], min(alpha + 40, 255)),
                        width=thickness,
                    )
                else:
                    draw.line(
                        points + [points[0]],
                        fill=(color[0], color[1], color[2], min(alpha + 20, 255)),
                        width=thickness,
                    )
                return points

            left_points = _draw_brow(left_points)
            right_points = _draw_brow(right_points)

            overlay_rgba = np.array(overlay)
            overlay_bgr = cv2.cvtColor(overlay_rgba[:, :, :3], cv2.COLOR_RGB2BGR)
            alpha_mask = overlay_rgba[:, :, 3].astype(np.float32) / 255.0

            weighted = cv2.addWeighted(image_bgr, 1.0, overlay_bgr, 1.0, 0.0)
            alpha_3 = np.dstack((alpha_mask, alpha_mask, alpha_mask))
            output_bgr = (
                image_bgr.astype(np.float32) * (1.0 - alpha_3)
                + weighted.astype(np.float32) * alpha_3
            ).astype(np.uint8)

            sim_match = re.search(r"sim_(\d+)", os.path.basename(input_image_path))
            sim_fragment = sim_match.group(1) if sim_match else uuid.uuid4().hex
            output_filename = f"sim_{sim_fragment}_result.jpg"
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            output_path = os.path.join(settings.UPLOAD_DIR, output_filename)
            if not cv2.imwrite(output_path, output_bgr):
                raise RuntimeError("Failed to save output image")

            return {
                "status": "completed",
                "output_image_url": f"/uploads/{output_filename}",
                "landmarks_data": {
                    "adapter": "mediapipe",
                    "eyebrow_style_id": eyebrow_style_id,
                    "left_eyebrow_indices": left_brow_indices,
                    "right_eyebrow_indices": right_brow_indices,
                    "landmarks": {
                        "left_eyebrow": [[x, y] for x, y in left_points],
                        "right_eyebrow": [[x, y] for x, y in right_points],
                    },
                },
            }
        except Exception as exc:
            return await _mock_fallback(str(exc))


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

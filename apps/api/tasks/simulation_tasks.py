import asyncio
from datetime import datetime, timezone

from core.database import SessionLocal
from models.simulation import Simulation
from services.simulation_service import get_adapter
from tasks.celery_app import celery_app


@celery_app.task(bind=True, max_retries=3)
def process_simulation_async(self, sim_id: int):
    db = SessionLocal()
    sim = None
    try:
        sim = db.query(Simulation).filter(Simulation.id == sim_id).first()
        if not sim:
            return {"sim_id": sim_id, "status": "not_found"}

        sim.status = "processing"
        sim.error_message = None
        db.commit()

        adapter = get_adapter()
        result = asyncio.run(
            adapter.process(sim.input_image_url or "", sim.eyebrow_style_id)
        )

        sim.status = result.get("status", "completed")
        sim.output_image_url = result.get("output_image_url")
        sim.landmarks_data = result.get("landmarks_data")
        sim.completed_at = datetime.now(timezone.utc)
        db.commit()

        return {"sim_id": sim.id, "status": sim.status}
    except Exception as exc:
        if sim is not None:
            sim.status = "failed"
            sim.error_message = str(exc)
            db.commit()

        if self.request.retries < self.max_retries:
            raise self.retry(exc=exc, countdown=5)

        return {"sim_id": sim_id, "status": "failed", "error": str(exc)}
    finally:
        db.close()

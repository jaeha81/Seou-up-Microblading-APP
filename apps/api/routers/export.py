# pyright: reportImplicitRelativeImport=false, reportGeneralTypeIssues=false, reportArgumentType=false

import io
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from core.config import settings
from core.database import get_db
from core.deps import get_current_user
from models.simulation import Simulation
from models.user import User

router = APIRouter()


def _url_to_disk_path(url: str | None) -> str | None:
    if not url:
        return None
    if url.startswith("/uploads/"):
        return os.path.join(settings.UPLOAD_DIR, url.replace("/uploads/", "", 1))
    return url


def _draw_image_or_placeholder(
    pdf: canvas.Canvas,
    image_path: str | None,
    x: float,
    y: float,
    width: float,
    height: float,
    title: str,
) -> None:
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(x, y + height + 8, title)
    pdf.rect(x, y, width, height)

    if not image_path or not os.path.exists(image_path):
        pdf.setFont("Helvetica", 10)
        pdf.drawCentredString(x + (width / 2), y + (height / 2), "Image not available")
        return

    try:
        image = ImageReader(image_path)
        img_width, img_height = image.getSize()
        if img_width <= 0 or img_height <= 0:
            raise ValueError("Invalid image dimensions")

        ratio = min(width / img_width, height / img_height)
        draw_width = img_width * ratio
        draw_height = img_height * ratio
        draw_x = x + ((width - draw_width) / 2)
        draw_y = y + ((height - draw_height) / 2)
        pdf.drawImage(
            image,
            draw_x,
            draw_y,
            width=draw_width,
            height=draw_height,
            preserveAspectRatio=True,
            mask="auto",
        )
    except Exception:
        pdf.setFont("Helvetica", 10)
        pdf.drawCentredString(x + (width / 2), y + (height / 2), "Failed to load image")


@router.post("/simulation/{sim_id}/pdf")
def export_simulation_pdf(
    sim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sim = (
        db.query(Simulation)
        .filter(Simulation.id == sim_id, Simulation.user_id == current_user.id)
        .first()
    )
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")

    style_name = (
        sim.eyebrow_style.name_en
        if sim.eyebrow_style and sim.eyebrow_style.name_en
        else f"Style #{sim.eyebrow_style_id}"
        if sim.eyebrow_style_id
        else "N/A"
    )
    created_at = sim.created_at or datetime.now(timezone.utc)
    adapter_name = sim.adapter or "unknown"

    input_image_path = _url_to_disk_path(sim.input_image_url)
    output_image_path = _url_to_disk_path(sim.output_image_url)

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    page_width, page_height = A4

    margin = 40
    content_width = page_width - (margin * 2)

    pdf.setTitle(f"Simulation Report #{sim.id}")
    pdf.setAuthor("Seou-up Microblading")

    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawString(margin, page_height - 60, "Seou-up Microblading")

    pdf.setFont("Helvetica", 14)
    pdf.drawString(margin, page_height - 84, "Simulation Report")

    pdf.setFont("Helvetica", 9)
    pdf.drawString(
        margin,
        page_height - 100,
        "Disclaimer: Visualization support only. Not a licensed medical provider.",
    )

    table_top = page_height - 130
    table_row_height = 24
    labels = ["Date", "Style", "Status", "Adapter"]
    values = [
        created_at.strftime("%Y-%m-%d %H:%M:%S"),
        style_name,
        sim.status,
        adapter_name,
    ]

    table_label_width = 120
    table_value_width = content_width - table_label_width

    current_y = table_top
    for label, value in zip(labels, values):
        pdf.rect(
            margin, current_y - table_row_height, table_label_width, table_row_height
        )
        pdf.rect(
            margin + table_label_width,
            current_y - table_row_height,
            table_value_width,
            table_row_height,
        )
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(margin + 6, current_y - 16, label)
        pdf.setFont("Helvetica", 10)
        pdf.drawString(margin + table_label_width + 6, current_y - 16, str(value))
        current_y -= table_row_height

    image_box_y = 170
    image_box_height = current_y - 40 - image_box_y
    image_gap = 16
    image_box_width = (content_width - image_gap) / 2

    _draw_image_or_placeholder(
        pdf,
        input_image_path,
        margin,
        image_box_y,
        image_box_width,
        image_box_height,
        "Input Image",
    )
    _draw_image_or_placeholder(
        pdf,
        output_image_path,
        margin + image_box_width + image_gap,
        image_box_y,
        image_box_width,
        image_box_height,
        "Output Image",
    )

    pdf.setFont("Helvetica", 9)
    pdf.drawString(
        margin,
        40,
        "This report is for visualization purposes only. Not a licensed medical provider.",
    )

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    filename = f"simulation_{sim.id}_report.pdf"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)

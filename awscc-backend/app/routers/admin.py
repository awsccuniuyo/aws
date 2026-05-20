from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
import uuid
import shutil
from pathlib import Path
from typing import List
from collections import Counter
from pydantic import BaseModel

from app.core.database import get_db
from app.core.config import settings
from app.models.models import Event, Registration, ReferredByEnum, GenderEnum
from app.schemas.schemas import (
    RegistrationResponse,
    CheckInResponse,
    EventStats,
)
from app.utils.email import send_event_day_email

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── PIN Verification ─────────────────────────────────────────────────────────

class PinRequest(BaseModel):
    pin: str


@router.post("/verify-pin")
async def verify_pin(payload: PinRequest):
    """Verify admin PIN. Returns 200 on success, 401 on failure."""
    if payload.pin != settings.ADMIN_PIN:
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    return {"ok": True}


# ─── Registrations List ───────────────────────────────────────────────────────

@router.get("/events/{event_id}/registrations", response_model=List[RegistrationResponse])
async def get_registrations(
    event_id: UUID,
    checked_in: bool | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Get all registrations for an event with optional check-in filter."""
    query = select(Registration).where(Registration.event_id == event_id)

    if checked_in is not None:
        query = query.where(Registration.checked_in == checked_in)

    query = query.order_by(Registration.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


# ─── Event Stats ──────────────────────────────────────────────────────────────

@router.get("/events/{event_id}/stats", response_model=EventStats)
async def get_event_stats(event_id: UUID, db: AsyncSession = Depends(get_db)):
    """Dashboard stats for an event."""
    result = await db.execute(
        select(Registration).where(Registration.event_id == event_id)
    )
    registrations = result.scalars().all()

    total = len(registrations)
    checked_in_count = sum(1 for r in registrations if r.checked_in)
    community_count = sum(1 for r in registrations if r.is_community_member)

    gender_counts = Counter(r.gender.value for r in registrations)
    referral_counts = Counter(
        r.referred_by.value for r in registrations if r.referred_by
    )

    return EventStats(
        total_registrations=total,
        checked_in=checked_in_count,
        not_checked_in=total - checked_in_count,
        community_members=community_count,
        non_community_members=total - community_count,
        gender_breakdown=dict(gender_counts),
        referral_breakdown=dict(referral_counts),
    )


# ─── QR Check-in ─────────────────────────────────────────────────────────────

@router.post("/checkin/{qr_token}", response_model=CheckInResponse)
async def check_in(qr_token: UUID, db: AsyncSession = Depends(get_db)):
    """Scan QR token and admit attendee. Idempotent — safe to scan twice."""
    from datetime import datetime

    result = await db.execute(
        select(Registration).where(Registration.qr_token == qr_token)
    )
    registration = result.scalar_one_or_none()

    if not registration:
        raise HTTPException(status_code=404, detail="QR code not recognised")

    if registration.checked_in:
        return CheckInResponse(
            success=False,
            message=f"⚠️ Already checked in at {registration.checked_in_at.strftime('%I:%M %p')}",
            registration=RegistrationResponse.model_validate(registration),
        )

    registration.checked_in = True
    registration.checked_in_at = datetime.utcnow()
    await db.flush()
    await db.refresh(registration)

    return CheckInResponse(
        success=True,
        message=f"✅ Welcome, {registration.full_name}!",
        registration=RegistrationResponse.model_validate(registration),
    )


# ─── Bulk Event Day Emails ────────────────────────────────────────────────────

@router.post("/events/{event_id}/send-qr-emails")
async def send_qr_emails(
    event_id: UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    Trigger event-day emails with QR codes to all registrants.
    Call this on the morning of the event from the admin dashboard.
    """
    event_result = await db.execute(select(Event).where(Event.id == event_id))
    event = event_result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    reg_result = await db.execute(
        select(Registration).where(Registration.event_id == event_id)
    )
    registrations = reg_result.scalars().all()

    if not registrations:
        return {"message": "No registrations found for this event", "count": 0}

    for reg in registrations:
        background_tasks.add_task(
            send_event_day_email,
            to_email=reg.email,
            full_name=reg.full_name,
            event_title=event.title,
            event_date=event.date,
            event_location=event.location or "TBA",
            qr_token=reg.qr_token,
        )

    return {
        "message": f"Queued {len(registrations)} event-day emails",
        "count": len(registrations),
    }


# ─── Image Upload ─────────────────────────────────────────────────────────────

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return the public URL. Admin use only."""
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    ext = file.filename.split(".")[-1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Validate file size
    if file.size and file.size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )
    
    try:
        # Generate unique filename
        unique_id = str(uuid.uuid4())
        filename = f"{unique_id}.{ext}"
        filepath = settings.upload_path / filename
        
        # Save file
        with open(filepath, "wb") as f:
            contents = await file.read()
            if len(contents) > settings.MAX_UPLOAD_SIZE:
                filepath.unlink()  # Delete the file if it's too large
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
                )
            f.write(contents)
        
        # Return URL
        return {
            "url": f"/uploads/images/{filename}",
            "filename": filename,
            "size": len(contents),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

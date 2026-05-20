from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.database import get_db
from app.models.models import Event, Registration
from app.schemas.schemas import (
    RegistrationCreate,
    RegistrationPublicResponse,
)
from app.utils.email import send_registration_confirmation

router = APIRouter(prefix="/registrations", tags=["Registrations"])


@router.post(
    "/",
    response_model=RegistrationPublicResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: RegistrationCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    # 1. Check event exists and is open
    event_result = await db.execute(
        select(Event).where(Event.id == payload.event_id)
    )
    event = event_result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if not event.is_active:
        raise HTTPException(status_code=400, detail="This event is no longer active")

    if not event.registration_open:
        raise HTTPException(
            status_code=400, detail="Registration for this event is closed"
        )

    # 2. Check capacity
    if event.max_attendees:
        from sqlalchemy import func
        count_result = await db.execute(
            select(func.count(Registration.id)).where(
                Registration.event_id == payload.event_id
            )
        )
        count = count_result.scalar() or 0
        if count >= event.max_attendees:
            raise HTTPException(
                status_code=400, detail="This event has reached maximum capacity"
            )

    # 3. Check for duplicate registration
    existing = await db.execute(
        select(Registration).where(
            Registration.event_id == payload.event_id,
            Registration.email == payload.email,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="This email is already registered for this event",
        )

    # 4. Create registration
    registration = Registration(**payload.model_dump())
    db.add(registration)
    await db.flush()
    await db.refresh(registration)

    # 5. Send confirmation email in background
    background_tasks.add_task(
        send_registration_confirmation,
        to_email=registration.email,
        full_name=registration.full_name,
        event_title=event.title,
        event_date=event.date,
        event_location=event.location or "TBA",
        qr_token=registration.qr_token,
    )

    return registration

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from typing import List

from app.core.database import get_db
from app.models.models import Event, Registration
from app.schemas.schemas import EventCreate, EventUpdate, EventResponse

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("/", response_model=List[EventResponse])
async def get_events(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """Get all events. Optionally filter to active only."""
    query = select(Event)
    if active_only:
        query = query.where(Event.is_active == True)
    query = query.order_by(Event.date.asc())

    result = await db.execute(query)
    events = result.scalars().all()

    # Attach registration counts
    response = []
    for event in events:
        count_result = await db.execute(
            select(func.count(Registration.id)).where(
                Registration.event_id == event.id
            )
        )
        count = count_result.scalar() or 0
        event_dict = EventResponse.model_validate(event).model_dump()
        event_dict["registration_count"] = count
        response.append(EventResponse(**event_dict))

    return response


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single event by ID."""
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    count_result = await db.execute(
        select(func.count(Registration.id)).where(Registration.event_id == event.id)
    )
    count = count_result.scalar() or 0

    event_dict = EventResponse.model_validate(event).model_dump()
    event_dict["registration_count"] = count
    return EventResponse(**event_dict)


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(payload: EventCreate, db: AsyncSession = Depends(get_db)):
    """Create a new event. (Admin use)"""
    event = Event(**payload.model_dump())
    db.add(event)
    await db.flush()
    await db.refresh(event)

    event_dict = EventResponse.model_validate(event).model_dump()
    event_dict["registration_count"] = 0
    return EventResponse(**event_dict)


@router.patch("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: UUID,
    payload: EventUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update event fields."""
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(event, field, value)

    await db.flush()
    await db.refresh(event)

    count_result = await db.execute(
        select(func.count(Registration.id)).where(Registration.event_id == event.id)
    )
    count = count_result.scalar() or 0

    event_dict = EventResponse.model_validate(event).model_dump()
    event_dict["registration_count"] = count
    return EventResponse(**event_dict)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete an event."""
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    await db.delete(event)

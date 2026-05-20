from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.models.models import Announcement
from app.schemas.schemas import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementResponse,
)

router = APIRouter(tags=["Announcements"])


# ─── Public ───────────────────────────────────────────────────────────────────

@router.get("/api/v1/announcements", response_model=List[AnnouncementResponse])
async def get_announcements(
    published_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """Get all announcements. Public endpoint — returns published only by default."""
    query = select(Announcement).order_by(Announcement.created_at.desc())
    if published_only:
        query = query.where(Announcement.is_published == True)
    result = await db.execute(query)
    return result.scalars().all()


# ─── Admin ────────────────────────────────────────────────────────────────────

@router.post(
    "/api/v1/admin/announcements",
    response_model=AnnouncementResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_announcement(
    payload: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
):
    announcement = Announcement(**payload.model_dump())
    db.add(announcement)
    await db.flush()
    await db.refresh(announcement)
    return announcement


@router.patch(
    "/api/v1/admin/announcements/{announcement_id}",
    response_model=AnnouncementResponse,
)
async def update_announcement(
    announcement_id: UUID,
    payload: AnnouncementUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Announcement).where(Announcement.id == announcement_id)
    )
    ann = result.scalar_one_or_none()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(ann, field, value)

    ann.updated_at = datetime.utcnow()
    await db.flush()
    await db.refresh(ann)
    return ann


@router.delete(
    "/api/v1/admin/announcements/{announcement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_announcement(
    announcement_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Announcement).where(Announcement.id == announcement_id)
    )
    ann = result.scalar_one_or_none()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    await db.delete(ann)

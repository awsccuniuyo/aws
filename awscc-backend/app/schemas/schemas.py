from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.models import GenderEnum, ReferredByEnum


# ─── Announcement Schemas ─────────────────────────────────────────────────────

ANNOUNCEMENT_TAGS = ["Announcement", "Event", "Resource", "Opportunity", "News"]

class AnnouncementCreate(BaseModel):
    title: str
    body: str
    tag: str = "Announcement"
    link: Optional[str] = None
    link_label: Optional[str] = None
    is_published: bool = True


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    tag: Optional[str] = None
    link: Optional[str] = None
    link_label: Optional[str] = None
    is_published: Optional[bool] = None


class AnnouncementResponse(BaseModel):
    id: UUID
    title: str
    body: str
    tag: str
    link: Optional[str]
    link_label: Optional[str]
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Event Schemas ────────────────────────────────────────────────────────────

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    location: Optional[str] = None
    banner_url: Optional[str] = None
    max_attendees: Optional[int] = None
    is_active: bool = True
    registration_open: bool = True


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    banner_url: Optional[str] = None
    max_attendees: Optional[int] = None
    is_active: Optional[bool] = None
    registration_open: Optional[bool] = None


class EventResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    date: datetime
    location: Optional[str]
    banner_url: Optional[str]
    is_active: bool
    registration_open: bool
    max_attendees: Optional[int]
    created_at: datetime
    registration_count: Optional[int] = 0

    model_config = {"from_attributes": True}


# ─── Registration Schemas ─────────────────────────────────────────────────────

class RegistrationCreate(BaseModel):
    event_id: UUID
    full_name: str
    email: EmailStr
    gender: GenderEnum

    # Optional education fields
    university: Optional[str] = None
    department: Optional[str] = None

    # Referral
    referred_by: Optional[ReferredByEnum] = None
    referred_by_detail: Optional[str] = None

    # Community & social
    is_community_member: bool = False
    follows_x: bool = False
    follows_instagram: bool = False

    @field_validator("department")
    @classmethod
    def department_requires_university(cls, v, info):
        if v and not info.data.get("university"):
            raise ValueError("Department requires university to be provided")
        return v

    @field_validator("referred_by_detail")
    @classmethod
    def detail_not_needed_for_flyer(cls, v, info):
        referred_by = info.data.get("referred_by")
        if referred_by == ReferredByEnum.flyer and v:
            return None  # silently strip it for flyer
        return v


class RegistrationResponse(BaseModel):
    id: UUID
    event_id: UUID
    full_name: str
    email: str
    gender: GenderEnum
    university: Optional[str]
    department: Optional[str]
    referred_by: Optional[ReferredByEnum]
    referred_by_detail: Optional[str]
    is_community_member: bool
    follows_x: bool
    follows_instagram: bool
    qr_token: UUID
    checked_in: bool
    checked_in_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


class RegistrationPublicResponse(BaseModel):
    """Returned to user after successful registration — no sensitive admin data"""
    id: UUID
    full_name: str
    email: str
    event_id: UUID
    qr_token: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Check-in Schemas ─────────────────────────────────────────────────────────

class CheckInResponse(BaseModel):
    success: bool
    message: str
    registration: Optional[RegistrationResponse] = None


# ─── Admin Stats Schema ───────────────────────────────────────────────────────

class EventStats(BaseModel):
    total_registrations: int
    checked_in: int
    not_checked_in: int
    community_members: int
    non_community_members: int
    gender_breakdown: dict
    referral_breakdown: dict

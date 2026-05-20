import type {
  Event,
  Registration,
  RegistrationCreate,
  RegistrationPublic,
  EventStats,
  CheckInResponse,
} from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

// ─── Events ──────────────────────────────────────────────────────────────────

export const getEvents = (activeOnly = true) =>
  request<Event[]>(`/api/v1/events?active_only=${activeOnly}`)

export const getEvent = (id: string) =>
  request<Event>(`/api/v1/events/${id}`)

export const createEvent = (data: Partial<Event>) =>
  request<Event>('/api/v1/events', { method: 'POST', body: JSON.stringify(data) })

export const updateEvent = (id: string, data: Partial<Event>) =>
  request<Event>(`/api/v1/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteEvent = (id: string) =>
  request<void>(`/api/v1/events/${id}`, { method: 'DELETE' })

// ─── Registrations ────────────────────────────────────────────────────────────

export const registerForEvent = (data: RegistrationCreate) =>
  request<RegistrationPublic>('/api/v1/registrations', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getRegistrations = (eventId: string, checkedIn?: boolean) => {
  const params = checkedIn !== undefined ? `?checked_in=${checkedIn}` : ''
  return request<Registration[]>(`/api/v1/admin/events/${eventId}/registrations${params}`)
}

export const getEventStats = (eventId: string) =>
  request<EventStats>(`/api/v1/admin/events/${eventId}/stats`)

export const checkIn = (qrToken: string) =>
  request<CheckInResponse>(`/api/v1/admin/checkin/${qrToken}`, { method: 'POST' })

export const sendQrEmails = (eventId: string) =>
  request<{ message: string; count: number }>(
    `/api/v1/admin/events/${eventId}/send-qr-emails`,
    { method: 'POST' }
  )

// ─── Announcements ────────────────────────────────────────────────────────────

export const getAnnouncements = (publishedOnly = true) =>
  request<import('./types').Announcement[]>(
    `/api/v1/announcements?published_only=${publishedOnly}`
  )

export const createAnnouncement = (data: Partial<import('./types').Announcement>) =>
  request<import('./types').Announcement>('/api/v1/admin/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateAnnouncement = (id: string, data: Partial<import('./types').Announcement>) =>
  request<import('./types').Announcement>(`/api/v1/admin/announcements/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteAnnouncement = (id: string) =>
  request<void>(`/api/v1/admin/announcements/${id}`, { method: 'DELETE' })

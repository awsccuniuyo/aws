'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Calendar, Users, CheckSquare, BarChart2, Mail, Plus,
  Pencil, Trash2, Send, RefreshCw, ChevronDown,
  Bell, Lock, Eye, EyeOff,
} from 'lucide-react'
import {
  getEvents, createEvent, updateEvent, deleteEvent,
  getRegistrations, getEventStats, sendQrEmails,
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  uploadImage,
} from '@/lib/api'
import type { Event, Registration, EventStats, Announcement } from '@/lib/types'

const QRScanner = dynamic(() => import('@/components/admin/QRScanner'), { ssr: false })

type Tab = 'overview' | 'events' | 'registrations' | 'checkin' | 'announcements' | 'emails'

const ANNOUNCEMENT_TAGS = ['Announcement', 'Event', 'Resource', 'Opportunity', 'News']
const STORAGE_KEY = 'awscc_admin_auth'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })

// ─── PIN Gate ─────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin]         = useState('')
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!pin) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/v1/admin/verify-pin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin }),
        }
      )
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEY, 'true')
        onUnlock()
      } else {
        setError('Incorrect PIN. Try again.')
        setPin('')
      }
    } catch {
      setError('Could not reach server. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center mx-auto mb-5">
          <Lock size={24} className="text-brand-orange" />
        </div>
        <h1 className="font-display font-black text-2xl text-brand-dark mb-1">Admin Access</h1>
        <p className="text-gray-500 text-sm mb-7">Enter your PIN to continue</p>

        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Enter PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="input-field pr-10 text-center text-lg tracking-widest"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !pin}
          className="w-full bg-brand-dark text-white font-semibold py-3 rounded-full
                     hover:bg-brand-navy transition-colors disabled:opacity-60
                     flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Verifying…' : 'Enter Dashboard'}
        </button>
      </div>
    </div>
  )
}

// ─── Event Form ───────────────────────────────────────────────────────────────
interface EventFormData {
  title: string; description: string; date: string
  location: string; max_attendees: string; banner_url: string
}
const EMPTY_EVENT: EventFormData = {
  title: '', description: '', date: '', location: '', max_attendees: '', banner_url: '',
}

function EventForm({
  initial, onSave, onCancel,
}: { initial?: EventFormData; onSave: (d: EventFormData) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<EventFormData>(initial ?? EMPTY_EVENT)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const set = (k: keyof EventFormData, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadImage(file)
      set('banner_url', result.url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function submit() {
    if (!form.title || !form.date) return
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label-text">Event Title *</label>
          <input className="input-field" placeholder="e.g. AWS Build Challenge"
            value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-text">Description</label>
          <textarea className="input-field resize-none" rows={3}
            placeholder="What's this event about?"
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Date &amp; Time *</label>
          <input type="datetime-local" className="input-field"
            value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Location</label>
          <input className="input-field" placeholder="e.g. Senate Building, UniUyo"
            value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Max Attendees</label>
          <input type="number" className="input-field" placeholder="Leave blank for unlimited"
            value={form.max_attendees} onChange={e => set('max_attendees', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-text">Banner Image</label>
          <div className="flex gap-3">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg
                         hover:border-gray-300 disabled:opacity-60"
            />
            <input 
              type="url" 
              className="flex-1 input-field" 
              placeholder="Or paste image URL"
              value={form.banner_url} 
              onChange={e => set('banner_url', e.target.value)} 
            />
          </div>
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          {form.banner_url && (
            <div className="mt-3 rounded-lg overflow-hidden max-h-32 bg-gray-100">
              <img src={form.banner_url} alt="Banner preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={submit} disabled={saving || !form.title || !form.date}
          className="flex-1 bg-brand-dark text-white font-medium py-2.5 rounded-full text-sm
                     hover:bg-brand-navy transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : initial ? 'Update Event' : 'Create Event'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:border-gray-400">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Announcement Form ────────────────────────────────────────────────────────
interface AnnFormData {
  title: string; body: string; tag: string
  link: string; link_label: string; is_published: boolean
}
const EMPTY_ANN: AnnFormData = {
  title: '', body: '', tag: 'Announcement', link: '', link_label: '', is_published: true,
}

function AnnouncementForm({
  initial, onSave, onCancel,
}: { initial?: AnnFormData; onSave: (d: AnnFormData) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<AnnFormData>(initial ?? EMPTY_ANN)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof AnnFormData, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    if (!form.title || !form.body) return
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label-text">Title *</label>
          <input className="input-field" placeholder="e.g. 🚀 Registration is Now Open!"
            value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-text">Body *</label>
          <textarea className="input-field resize-none" rows={4}
            placeholder="Full announcement text…"
            value={form.body} onChange={e => set('body', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Tag</label>
          <select className="input-field" value={form.tag} onChange={e => set('tag', e.target.value)}>
            {ANNOUNCEMENT_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label-text">Visibility</label>
          <select className="input-field"
            value={form.is_published ? 'true' : 'false'}
            onChange={e => set('is_published', e.target.value === 'true')}>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <div>
          <label className="label-text">Link URL (optional)</label>
          <input className="input-field" placeholder="https://… or /events"
            value={form.link} onChange={e => set('link', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Link Label</label>
          <input className="input-field" placeholder="e.g. Register Now"
            value={form.link_label} onChange={e => set('link_label', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={submit} disabled={saving || !form.title || !form.body}
          className="flex-1 bg-brand-dark text-white font-medium py-2.5 rounded-full text-sm
                     hover:bg-brand-navy transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : initial ? 'Update' : 'Publish Announcement'}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:border-gray-400">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-sm">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="font-display font-black text-3xl text-brand-dark">{value}</p>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [tab, setTab]                         = useState<Tab>('overview')
  const [events, setEvents]                   = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [registrations, setRegistrations]     = useState<Registration[]>([])
  const [stats, setStats]                     = useState<EventStats | null>(null)
  const [announcements, setAnnouncements]     = useState<Announcement[]>([])
  const [loading, setLoading]                 = useState(true)
  const [showEventForm, setShowEventForm]     = useState(false)
  const [editingEvent, setEditingEvent]       = useState<Event | null>(null)
  const [showAnnForm, setShowAnnForm]         = useState(false)
  const [editingAnn, setEditingAnn]           = useState<Announcement | null>(null)
  const [toast, setToast]                     = useState('')
  const [emailSending, setEmailSending]       = useState(false)
  const [regFilter, setRegFilter]             = useState<'all' | 'in' | 'out'>('all')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getEvents(false)
      setEvents(data)
      if (!selectedEventId && data.length > 0) setSelectedEventId(data[0].id)
    } finally { setLoading(false) }
  }, [selectedEventId])

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await getAnnouncements(false)
      setAnnouncements(data)
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => { loadEvents(); loadAnnouncements() }, [loadEvents, loadAnnouncements])

  useEffect(() => {
    if (!selectedEventId) return
    getRegistrations(selectedEventId).then(setRegistrations).catch(console.error)
    getEventStats(selectedEventId).then(setStats).catch(console.error)
  }, [selectedEventId])

  // Event actions
  async function handleCreateEvent(form: EventFormData) {
    await createEvent({
      title: form.title, description: form.description,
      date: new Date(form.date).toISOString(), location: form.location,
      max_attendees: form.max_attendees ? parseInt(form.max_attendees) : undefined,
      banner_url: form.banner_url || undefined,
    })
    setShowEventForm(false)
    await loadEvents()
    showToast('Event created ✅')
  }

  async function handleUpdateEvent(form: EventFormData) {
    if (!editingEvent) return
    await updateEvent(editingEvent.id, {
      title: form.title, description: form.description,
      date: new Date(form.date).toISOString(), location: form.location,
      max_attendees: form.max_attendees ? parseInt(form.max_attendees) : undefined,
      banner_url: form.banner_url || undefined,
    })
    setEditingEvent(null)
    await loadEvents()
    showToast('Event updated ✅')
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Delete this event? This cannot be undone.')) return
    await deleteEvent(id)
    await loadEvents()
    showToast('Event deleted')
  }

  // Announcement actions
  async function handleCreateAnn(form: AnnFormData) {
    await createAnnouncement({
      title: form.title, body: form.body, tag: form.tag,
      link: form.link || undefined, link_label: form.link_label || undefined,
      is_published: form.is_published,
    })
    setShowAnnForm(false)
    await loadAnnouncements()
    showToast('Announcement published ✅')
  }

  async function handleUpdateAnn(form: AnnFormData) {
    if (!editingAnn) return
    await updateAnnouncement(String(editingAnn.id), {
      title: form.title, body: form.body, tag: form.tag,
      link: form.link || undefined, link_label: form.link_label || undefined,
      is_published: form.is_published,
    })
    setEditingAnn(null)
    await loadAnnouncements()
    showToast('Announcement updated ✅')
  }

  async function handleDeleteAnn(id: string) {
    if (!confirm('Delete this announcement?')) return
    await deleteAnnouncement(id)
    await loadAnnouncements()
    showToast('Announcement deleted')
  }

  async function handleSendEmails() {
    if (!selectedEventId) return
    if (!confirm('Send event-day QR code emails to all registrants?')) return
    setEmailSending(true)
    try {
      const res = await sendQrEmails(selectedEventId)
      showToast(`📧 Queued ${res.count} emails`)
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Email send failed')
    } finally { setEmailSending(false) }
  }

  const filteredRegs = registrations.filter(r =>
    regFilter === 'in' ? r.checked_in : regFilter === 'out' ? !r.checked_in : true
  )

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',      label: 'Overview',       icon: BarChart2   },
    { id: 'events',        label: 'Events',          icon: Calendar    },
    { id: 'registrations', label: 'Registrations',   icon: Users       },
    { id: 'checkin',       label: 'QR Check-in',     icon: CheckSquare },
    { id: 'announcements', label: 'Announcements',   icon: Bell        },
    { id: 'emails',        label: 'Send Emails',     icon: Mail        },
  ]

  return (
    <div className="pt-16 min-h-screen bg-brand-light">
      {/* Header */}
      <div className="bg-brand-dark text-white px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-1">
              Admin Dashboard
            </p>
            <h1 className="font-display font-black text-2xl md:text-3xl">
              AWS Cloud Club UniUyo
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { loadEvents(); loadAnnouncements() }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={18} className="text-white/60" />
            </button>
            <button
              onClick={() => { sessionStorage.removeItem(STORAGE_KEY); window.location.reload() }}
              className="text-xs text-white/40 hover:text-white/70 px-3 py-1.5 rounded-full
                         border border-white/10 hover:border-white/30 transition-colors"
            >
              Lock
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex overflow-x-auto gap-1 py-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                            whitespace-nowrap transition-colors ${
                  tab === id
                    ? 'bg-brand-dark text-white'
                    : 'text-gray-500 hover:bg-brand-light'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-8 space-y-6">

        {/* Event selector */}
        {['overview', 'registrations', 'checkin', 'emails'].includes(tab) && events.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Active Event:
            </label>
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="input-field pr-8 py-2 text-sm appearance-none"
              >
                {events.map(e => (
                  <option key={e.id} value={e.id}>{e.title} — {fmt(e.date)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* ── OVERVIEW ─────────────────────────────────────────────── */}
        {tab === 'overview' && stats && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Registrations" value={stats.total_registrations} icon={Users}       color="bg-brand-dark"  />
              <StatCard label="Checked In"           value={stats.checked_in}          icon={CheckSquare} color="bg-green-500"   />
              <StatCard label="Not Checked In"       value={stats.not_checked_in}      icon={Users}       color="bg-yellow-500"  />
              <StatCard label="Community Members"    value={stats.community_members}   icon={BarChart2}   color="bg-brand-navy"  />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-display font-bold text-brand-dark text-base mb-4">
                  Gender Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.gender_breakdown).map(([gender, count]) => {
                    const pct = stats.total_registrations > 0
                      ? Math.round((count / stats.total_registrations) * 100) : 0
                    return (
                      <div key={gender}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{gender}</span>
                          <span className="font-medium text-brand-dark">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-brand-light rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-display font-bold text-brand-dark text-base mb-4">
                  Referral Sources
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.referral_breakdown).map(([source, count]) => {
                    const pct = stats.total_registrations > 0
                      ? Math.round((count / stats.total_registrations) * 100) : 0
                    return (
                      <div key={source}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{source}</span>
                          <span className="font-medium text-brand-dark">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-brand-light rounded-full overflow-hidden">
                          <div className="h-full bg-brand-navy rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── EVENTS ───────────────────────────────────────────────── */}
        {tab === 'events' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="font-display font-bold text-xl text-brand-dark">All Events</h2>
              <button
                onClick={() => { setShowEventForm(true); setEditingEvent(null) }}
                className="flex items-center gap-2 bg-brand-dark text-white text-sm font-medium
                           px-5 py-2.5 rounded-full hover:bg-brand-navy transition-colors"
              >
                <Plus size={14} /> New Event
              </button>
            </div>

            {showEventForm && !editingEvent && (
              <EventForm onSave={handleCreateEvent} onCancel={() => setShowEventForm(false)} />
            )}

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-gray-400">No events yet. Create your first one above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map(e => (
                  <div key={e.id}>
                    {editingEvent?.id === e.id ? (
                      <EventForm
                        initial={{
                          title: e.title, description: e.description ?? '',
                          date: e.date.slice(0, 16), location: e.location ?? '',
                          max_attendees: e.max_attendees?.toString() ?? '',
                          banner_url: e.banner_url ?? '',
                        }}
                        onSave={handleUpdateEvent}
                        onCancel={() => setEditingEvent(null)}
                      />
                    ) : (
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-brand-dark text-base truncate">
                              {e.title}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                              e.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {e.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {fmt(e.date)} at {fmtTime(e.date)}
                            {e.location && ` · ${e.location}`}
                            {' · '}
                            <span className="font-medium text-brand-dark">
                              {e.registration_count} registered
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => setEditingEvent(e)}
                            className="p-2 rounded-xl hover:bg-brand-light text-gray-500 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(e.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── REGISTRATIONS ────────────────────────────────────────── */}
        {tab === 'registrations' && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display font-bold text-xl text-brand-dark">
                Registrations{' '}
                {registrations.length > 0 && (
                  <span className="text-gray-400 font-normal text-base">({registrations.length})</span>
                )}
              </h2>
              <div className="flex gap-2">
                {(['all', 'in', 'out'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setRegFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      regFilter === f
                        ? 'bg-brand-dark text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'in' ? '✅ Checked In' : '⏳ Pending'}
                  </button>
                ))}
              </div>
            </div>

            {filteredRegs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-gray-400">No registrations for this filter.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-brand-light">
                      <tr>
                        {['Name', 'Email', 'Gender', 'University', 'Community', 'Referred By', 'Status', 'Registered'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredRegs.map(r => (
                        <tr key={r.id} className="hover:bg-brand-light/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-brand-dark whitespace-nowrap">{r.full_name}</td>
                          <td className="px-4 py-3 text-gray-500">{r.email}</td>
                          <td className="px-4 py-3 text-gray-500">{r.gender}</td>
                          <td className="px-4 py-3 text-gray-500">{r.university ?? '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              r.is_community_member ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {r.is_community_member ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {r.referred_by ?? '—'}
                            {r.referred_by_detail && (
                              <span className="text-gray-400"> ({r.referred_by_detail})</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              r.checked_in
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}>
                              {r.checked_in
                                ? `✅ ${r.checked_in_at ? fmtTime(r.checked_in_at) : 'In'}`
                                : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                            {fmt(r.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CHECK-IN ─────────────────────────────────────────────── */}
        {tab === 'checkin' && (
          <div className="max-w-md">
            <h2 className="font-display font-bold text-xl text-brand-dark mb-2">QR Code Scanner</h2>
            <p className="text-gray-500 text-sm mb-6">
              Point the camera at an attendee&apos;s QR code to admit them.
              Works on mobile and desktop.
            </p>
            <QRScanner />
          </div>
        )}

        {/* ── ANNOUNCEMENTS ────────────────────────────────────────── */}
        {tab === 'announcements' && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display font-bold text-xl text-brand-dark">Announcements</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Posts here appear live on the Student Community page.
                </p>
              </div>
              <button
                onClick={() => { setShowAnnForm(true); setEditingAnn(null) }}
                className="flex items-center gap-2 bg-brand-dark text-white text-sm font-medium
                           px-5 py-2.5 rounded-full hover:bg-brand-navy transition-colors"
              >
                <Plus size={14} /> New Announcement
              </button>
            </div>

            {showAnnForm && !editingAnn && (
              <AnnouncementForm onSave={handleCreateAnn} onCancel={() => setShowAnnForm(false)} />
            )}

            {announcements.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Bell size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No announcements yet.</p>
                <p className="text-gray-300 text-sm mt-1">
                  Create one above — it will appear on the community page immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={String(a.id)}>
                    {editingAnn?.id === a.id ? (
                      <AnnouncementForm
                        initial={{
                          title: a.title, body: a.body, tag: a.tag,
                          link: a.link ?? '', link_label: a.link_label ?? '',
                          is_published: a.is_published,
                        }}
                        onSave={handleUpdateAnn}
                        onCancel={() => setEditingAnn(null)}
                      />
                    ) : (
                      <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                a.tag === 'Event'       ? 'bg-brand-orange/10 text-brand-orange' :
                                a.tag === 'Resource'    ? 'bg-blue-50 text-blue-700'             :
                                a.tag === 'Opportunity' ? 'bg-purple-50 text-purple-700'         :
                                a.tag === 'News'        ? 'bg-teal-50 text-teal-700'             :
                                                          'bg-green-50 text-green-700'
                              }`}>
                                {a.tag}
                              </span>
                              {!a.is_published && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                  Draft
                                </span>
                              )}
                              <span className="text-xs text-gray-400">{fmt(a.created_at)}</span>
                            </div>
                            <h3 className="font-display font-bold text-brand-dark text-base">
                              {a.title}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{a.body}</p>
                            {a.link && (
                              <p className="text-brand-orange text-xs mt-1.5 flex items-center gap-1">
                                🔗 {a.link}
                                {a.link_label && <span className="text-gray-400">→ &quot;{a.link_label}&quot;</span>}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => setEditingAnn(a)}
                              className="p-2 rounded-xl hover:bg-brand-light text-gray-500 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAnn(String(a.id))}
                              className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SEND EMAILS ──────────────────────────────────────────── */}
        {tab === 'emails' && (
          <div className="max-w-lg">
            <h2 className="font-display font-bold text-xl text-brand-dark mb-2">
              Send Event-Day Emails
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Sends a personalised email with QR code to every registrant.
              Trigger on the morning of the event.
            </p>

            {selectedEventId && (() => {
              const ev = events.find(e => e.id === selectedEventId)
              return ev ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
                  <h3 className="font-display font-bold text-brand-dark mb-1">{ev.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {fmt(ev.date)} · {ev.registration_count} registrants
                  </p>
                  <div className="bg-brand-orange/10 rounded-xl px-4 py-3 mb-4">
                    <p className="text-brand-dark text-sm">
                      <strong>{ev.registration_count}</strong> emails will be sent
                    </p>
                  </div>
                  <button
                    onClick={handleSendEmails}
                    disabled={emailSending || ev.registration_count === 0}
                    className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white
                               font-medium py-3 rounded-full hover:bg-brand-navy transition-colors
                               disabled:opacity-60 text-sm"
                  >
                    {emailSending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <><Send size={14} /> Send QR Code Emails</>
                    )}
                  </button>
                </div>
              ) : null
            })()}

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <p className="text-yellow-800 text-sm font-medium mb-2">⚠️ Before you send</p>
              <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                <li>This sends emails to all registrants immediately</li>
                <li>Each email includes event details and a QR code attachment</li>
                <li>Only trigger this on event day — it cannot be undone</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-sm
                        font-medium px-6 py-3 rounded-full shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── Root with PIN gate ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const auth = sessionStorage.getItem(STORAGE_KEY)
    if (auth === 'true') setUnlocked(true)
    setChecking(false)
  }, [])

  if (checking) return null
  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />
  return <Dashboard />
}

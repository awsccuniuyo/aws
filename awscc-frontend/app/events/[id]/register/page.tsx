'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react'
import { getEvent, registerForEvent } from '@/lib/api'
import type { Event, Gender, ReferredBy, RegistrationPublic } from '@/lib/types'

interface Props { params: { id: string } }

const GENDERS: Gender[]      = ['Male', 'Female', 'Prefer not to say']
const REFERRED_BY: ReferredBy[] = ['Friend / Colleague', 'Social Media', 'Flyer / Poster', 'Lecturer', 'Other']

const referralSubLabel: Partial<Record<ReferredBy, string>> = {
  'Friend / Colleague': "What's their name?",
  'Social Media':       'Which platform? (e.g. Twitter, WhatsApp)',
  'Lecturer':           "What's their name?",
  'Other':              'Please specify',
}

interface FormState {
  full_name: string
  email: string
  gender: Gender | ''
  university: string
  department: string
  referred_by: ReferredBy | ''
  referred_by_detail: string
  is_community_member: boolean | null
  follows_x: boolean
  follows_instagram: boolean
}

const INITIAL: FormState = {
  full_name: '', email: '', gender: '', university: '', department: '',
  referred_by: '', referred_by_detail: '', is_community_member: null,
  follows_x: false, follows_instagram: false,
}

export default function RegisterPage({ params }: Props) {
  const [event, setEvent]     = useState<Event | null>(null)
  const [form, setForm]       = useState<FormState>(INITIAL)
  const [errors, setErrors]   = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<RegistrationPublic | null>(null)
  const [apiError, setApiError]   = useState('')

  useEffect(() => {
    getEvent(params.id).then(setEvent).catch(console.error)
  }, [params.id])

  const set = (key: keyof FormState, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e: typeof errors = {}
    if (!form.full_name.trim())   e.full_name = 'Full name is required'
    if (!form.email.trim())       e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email'
    if (!form.gender)             e.gender = 'Please select your gender'
    if (form.is_community_member === null) e.is_community_member = 'Please answer this'
    if (form.department && !form.university) e.department = 'Enter university first'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setApiError('')
    try {
      const payload = {
        event_id:           params.id,
        full_name:          form.full_name.trim(),
        email:              form.email.trim(),
        gender:             form.gender as Gender,
        university:         form.university.trim() || undefined,
        department:         form.department.trim() || undefined,
        referred_by:        form.referred_by || undefined,
        referred_by_detail: form.referred_by !== 'Flyer / Poster' && form.referred_by_detail
                              ? form.referred_by_detail.trim()
                              : undefined,
        is_community_member: form.is_community_member ?? false,
        follows_x:          form.follows_x,
        follows_instagram:  form.follows_instagram,
      }
      const result = await registerForEvent(payload)
      setSubmitted(result)
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="pt-16 min-h-screen bg-brand-light flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="font-display font-black text-2xl text-brand-dark mb-2">
            You&apos;re registered, {submitted.full_name.split(' ')[0]}!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Check your inbox at <strong>{submitted.email}</strong> for a confirmation email.
            Your QR code entry pass will be sent on the morning of the event.
          </p>
          <div className="bg-brand-light rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-gray-400 mb-1">Registration ID</p>
            <p className="font-mono text-xs text-brand-dark break-all">{submitted.id}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/events/${params.id}`} className="text-center bg-brand-dark text-white font-medium py-3 rounded-full text-sm">
              Back to Event
            </Link>
            <Link href="/events" className="text-center text-gray-500 text-sm py-2 hover:text-brand-dark">
              Explore More Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="pt-16 min-h-screen bg-brand-light">
      <div className="container-max px-4 md:px-8 lg:px-16 py-12">
        <Link href={`/events/${params.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-dark text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Event
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {event && (
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h3 className="font-display font-bold text-brand-dark text-base mb-3">You&apos;re registering for</h3>
                <div className="bg-brand-dark rounded-xl p-4 mb-4">
                  <p className="text-brand-orange text-xs font-semibold uppercase tracking-wide mb-1">Event</p>
                  <p className="text-white font-bold text-sm">{event.title}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📅 {new Date(event.date).toLocaleDateString('en-NG', { weekday:'short', month:'long', day:'numeric' })}</p>
                  {event.location && <p>📍 {event.location}</p>}
                  <p>👥 {event.registration_count} registered{event.max_attendees ? ` / ${event.max_attendees}` : ''}</p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h1 className="font-display font-black text-2xl text-brand-dark mb-1">Register for Event</h1>
              <p className="text-gray-500 text-sm mb-8">Fill in your details to reserve your spot.</p>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="label-text">Full Name *</label>
                  <input
                    type="text" placeholder="e.g. Ada Johnson"
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                    className={`input-field ${errors.full_name ? 'border-red-300 focus:ring-red-200' : ''}`}
                  />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="label-text">Email Address *</label>
                  <input
                    type="email" placeholder="e.g. ada@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="label-text">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={e => set('gender', e.target.value)}
                    className={`input-field ${errors.gender ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>

                {/* University + Department */}
                <div className="bg-brand-light rounded-xl p-4 space-y-4">
                  <p className="text-xs text-gray-400 italic">
                    Leave university and department blank if you haven&apos;t started university yet.
                  </p>
                  <div>
                    <label className="label-text">University</label>
                    <input
                      type="text" placeholder="e.g. University of Uyo"
                      value={form.university}
                      onChange={e => { set('university', e.target.value); if (!e.target.value) set('department', '') }}
                      className="input-field bg-white"
                    />
                  </div>
                  {form.university && (
                    <div>
                      <label className="label-text">Department</label>
                      <input
                        type="text" placeholder="e.g. Computer Science"
                        value={form.department}
                        onChange={e => set('department', e.target.value)}
                        className={`input-field bg-white ${errors.department ? 'border-red-300' : ''}`}
                      />
                      {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>
                  )}
                </div>

                {/* Referred By */}
                <div>
                  <label className="label-text">How did you hear about us?</label>
                  <select
                    value={form.referred_by}
                    onChange={e => { set('referred_by', e.target.value); set('referred_by_detail', '') }}
                    className="input-field"
                  >
                    <option value="">Select an option</option>
                    {REFERRED_BY.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {form.referred_by && form.referred_by !== 'Flyer / Poster' && (
                  <div>
                    <label className="label-text">{referralSubLabel[form.referred_by as ReferredBy]}</label>
                    <input
                      type="text"
                      placeholder={referralSubLabel[form.referred_by as ReferredBy]}
                      value={form.referred_by_detail}
                      onChange={e => set('referred_by_detail', e.target.value)}
                      className="input-field"
                    />
                  </div>
                )}

                {/* Community member */}
                <div>
                  <label className="label-text">Are you part of the AWS Student Builder Group Community? *</label>
                  <div className="flex gap-3 mt-1">
                    {[true, false].map((val) => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => set('is_community_member', val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                          form.is_community_member === val
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                  {errors.is_community_member && (
                    <p className="text-red-500 text-xs mt-1">{errors.is_community_member}</p>
                  )}
                  {form.is_community_member === false && (
                    <div className="mt-2 p-3 bg-brand-orange/10 rounded-xl flex items-center gap-2">
                      <span className="text-xs text-brand-dark">
                        Join our community first →{' '}
                        <a href="https://bit.ly/AWSCCC" target="_blank" rel="noopener noreferrer"
                           className="font-semibold text-brand-orange underline inline-flex items-center gap-0.5">
                          bit.ly/AWSCCC <ExternalLink size={10} />
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                {/* Social follows */}
                <div className="space-y-2">
                  <label className="label-text">Follow us on social media</label>
                  {[
                    { key: 'follows_x' as const,         label: 'Follow us on X (Twitter)',  href: 'https://x.com/AWSUniuyo' },
                    { key: 'follows_instagram' as const,  label: 'Follow us on Instagram',    href: 'https://www.instagram.com/awsccuniuyo/' },
                  ].map(({ key, label, href }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={e => set(key, e.target.checked)}
                        className="w-4 h-4 rounded accent-brand-dark"
                      />
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        {label}
                        <a href={href} target="_blank" rel="noopener noreferrer"
                           onClick={e => e.stopPropagation()}
                           className="text-brand-orange hover:underline inline-flex items-center gap-0.5 text-xs">
                          <ExternalLink size={10} />
                        </a>
                      </span>
                    </label>
                  ))}
                </div>

                {/* API error */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-red-600 text-sm">{apiError}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-brand-dark text-white font-semibold py-3.5 rounded-full
                             hover:bg-brand-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Registering…' : 'Complete Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

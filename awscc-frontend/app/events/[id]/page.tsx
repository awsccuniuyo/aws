import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowLeft, Clock, Share2 } from 'lucide-react'
import { getEvent } from '@/lib/api'
import type { Event } from '@/lib/types'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const event = await getEvent(params.id)
    return { title: `${event.title} — AWS Cloud Club UniUyo`, description: event.description ?? '' }
  } catch {
    return { title: 'Event — AWS Cloud Club UniUyo' }
  }
}

export default async function EventDetailPage({ params }: Props) {
  let event: Event | null = null
  try { event = await getEvent(params.id) } catch {}

  if (!event) {
    return (
      <div className="pt-16 min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-3xl text-brand-dark mb-3">Event not found</h1>
          <p className="text-gray-500 mb-6">This event may have been removed or the link is incorrect.</p>
          <Link href="/events" className="bg-brand-dark text-white px-6 py-2.5 rounded-full text-sm font-medium">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const formattedTime = new Date(event.date).toLocaleTimeString('en-NG', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="pt-16">
      {/* Banner */}
      <div className="h-64 md:h-80 bg-brand-dark relative overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-dark" />
        <div className="relative z-10 container-max px-4 md:px-8 lg:px-16 pb-10 w-full">
          <Link href="/events" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Events
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="bg-brand-orange text-brand-dark text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                {event.registration_open ? 'Registration Open' : 'Registration Closed'}
              </span>
              <h1 className="font-display font-black text-3xl md:text-4xl text-white">{event.title}</h1>
            </div>
            {event.registration_open && (
              <Link
                href={`/events/${event.id}/register`}
                className="bg-brand-orange text-brand-dark font-semibold px-7 py-3 rounded-full
                           hover:bg-brand-orange/90 transition-colors flex-shrink-0"
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="section-pad bg-brand-light">
        <div className="container-max grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 mb-6">
              <h2 className="font-display font-bold text-brand-dark text-xl mb-4">About This Event</h2>
              <p className="text-gray-500 text-base leading-relaxed whitespace-pre-line">
                {event.description ?? 'Full event details coming soon. Register to stay updated!'}
              </p>
            </div>

            {/* What to expect */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-display font-bold text-brand-dark text-xl mb-4">What to Expect</h2>
              <ul className="space-y-3">
                {[
                  'Hands-on AWS cloud sessions',
                  'Networking with fellow builders',
                  'Expert-led talks and Q&A',
                  'Certificates of participation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                    <span className="w-5 h-5 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Details card */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-display font-bold text-brand-dark text-base mb-4">Event Details</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-brand-orange mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-brand-dark">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-brand-orange flex-shrink-0" />
                  <span>{formattedTime}</span>
                </div>
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-brand-orange mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-brand-orange flex-shrink-0" />
                  <span>
                    {event.registration_count} registered
                    {event.max_attendees ? ` / ${event.max_attendees} spots` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            {event.registration_open ? (
              <Link
                href={`/events/${event.id}/register`}
                className="block w-full text-center bg-brand-dark text-white font-semibold
                           py-3.5 rounded-2xl hover:bg-brand-navy transition-colors"
              >
                Reserve Your Spot
              </Link>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-5 text-center">
                <p className="text-gray-500 text-sm font-medium">Registration is closed for this event.</p>
              </div>
            )}

            {/* Share */}
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200
                               text-gray-600 text-sm font-medium py-3 rounded-2xl hover:border-gray-400 transition-colors">
              <Share2 size={14} /> Share Event
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

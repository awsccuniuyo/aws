'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, ChevronRight, Search } from 'lucide-react'
import { getEvents } from '@/lib/api'
import type { Event } from '@/lib/types'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

const FILTERS = ['All', 'Hackday', 'Tech Talk', 'Career Growth', 'Workshop']

function tagFromTitle(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('hack') || t.includes('build')) return 'Hackday'
  if (t.includes('certification') || t.includes('career')) return 'Career Growth'
  if (t.includes('workshop')) return 'Workshop'
  return 'Tech Talk'
}

const tagColors: Record<string, string> = {
  Hackday:       'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  'Career Growth': 'bg-blue-50 text-blue-700 border-blue-200',
  Workshop:      'bg-green-50 text-green-700 border-green-200',
  'Tech Talk':   'bg-purple-50 text-purple-700 border-purple-200',
}

function EventCard({ event }: { event: Event }) {
  const tag = tagFromTitle(event.title)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
    >
      {/* Banner */}
      <div className="h-44 bg-brand-dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/60 to-brand-dark" />
        <div className="relative z-10 text-center">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-16 h-16 rounded-full border-2 border-white/30 bg-white/10
                            flex items-center justify-center mx-auto mb-2 cursor-pointer transition-all"
          >
            <span className="text-white text-xs font-black text-center leading-tight">Cloud<br/>Clubs</span>
          </motion.div>
        </div>
        <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full border ${tagColors[tag]}`}>
          {tag}
        </span>
        {!event.registration_open && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
            Closed
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display font-bold text-brand-dark text-lg mb-2 group-hover:text-brand-navy transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {event.description ?? 'Details coming soon.'}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(event.date).toLocaleDateString('en-NG', {
                weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={12} /> {event.registration_count} registered
            </span>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 text-center border border-gray-200 text-brand-dark text-sm font-medium
                         py-2 rounded-full hover:border-brand-dark transition-colors"
            >
              View Details
            </Link>
            {event.registration_open && (
              <Link
                href={`/events/${event.id}/register`}
                className="flex-1 text-center bg-brand-dark text-white text-sm font-medium
                           py-2 rounded-full hover:bg-brand-navy transition-colors"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function EventsPage() {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    getEvents(false)
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = events.filter((e) => {
    const matchFilter = filter === 'All' || tagFromTitle(e.title) === filter
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        (e.description ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="pt-16 overflow-hidden">
      {/* Page header */}
      <section className="section-pad bg-brand-dark text-white relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-80 h-80 bg-brand-navy rounded-full blur-[90px] opacity-30 animate-glow-pulse" />
        </div>

        <StaggerContainer className="container-max text-center relative z-10">
          <FadeIn direction="up">
            <span className="pill-label-dark mb-5">Events</span>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              Upcoming Events &amp; Workshops
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-white/70 text-base max-w-xl mx-auto">
              Hackdays, tech talks, career sessions, and campus gatherings designed to
              sharpen your cloud skills and grow your network.
            </p>
          </FadeIn>
        </StaggerContainer>
      </section>

      {/* Filters + Search */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="container-max px-4 md:px-8 lg:px-16 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/10'
                    : 'bg-brand-light text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-pad bg-brand-light min-h-[400px]">
        <div className="container-max">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 shimmer-placeholder" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <FadeIn direction="up" className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No events found</p>
              <p className="text-gray-300 text-sm">Try a different filter or check back soon.</p>
            </FadeIn>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

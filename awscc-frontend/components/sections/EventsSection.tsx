'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import type { Event } from '@/lib/types'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

function EventCard({ event }: { event: Event }) {
  const tag = event.title.toLowerCase().includes('hackday') ? 'Hackday'
    : event.title.toLowerCase().includes('certification') ? 'Career Growth'
    : 'Tech Talk'

  const tagColor = tag === 'Hackday' ? 'bg-brand-orange text-brand-dark'
    : tag === 'Career Growth' ? 'bg-blue-500 text-white'
    : 'bg-purple-500 text-white'

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="bg-brand-black rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:shadow-brand-navy/10 transition-shadow duration-300"
    >
      {/* Card header with gradient */}
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #101419 0%, #1B4170 100%)',
        }}
      >
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagColor}`}>{tag}</span>
        </div>
        {/* Cloud Clubs badge */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all"
        >
          <span className="text-white text-xs font-black text-center leading-tight">Cloud<br/>Clubs</span>
        </motion.div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-white text-base mb-2">{event.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
          {event.description?.slice(0, 100)}...
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {new Date(event.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {event.location}
            </span>
          )}
        </div>
        <Link
          href={`/events/${event.id}`}
          className="w-full text-center bg-brand-orange text-brand-dark text-sm font-semibold
                     py-2.5 rounded-full hover:bg-brand-orange/90 transition-all duration-300 hover:shadow-md block"
        >
          {event.registration_open ? 'Reserve a Spot' : 'View Details'}
        </Link>
      </div>
    </motion.div>
  )
}

// Fallback placeholder cards when no API data
function PlaceholderCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  const tagColor = tag === 'Hackday' ? 'bg-brand-orange text-brand-dark'
    : tag === 'Career Growth' ? 'bg-blue-500 text-white'
    : 'bg-purple-500 text-white'

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="bg-brand-black rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:shadow-brand-navy/10 transition-shadow duration-300"
    >
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #101419 0%, #1B4170 100%)',
        }}
      >
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagColor}`}>{tag}</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all"
        >
          <span className="text-white text-xs font-black text-center leading-tight">Cloud<br/>Clubs</span>
        </motion.div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{body}</p>
        <Link
          href="/events"
          className="w-full text-center bg-brand-orange text-brand-dark text-sm font-semibold
                     py-2.5 rounded-full hover:bg-brand-orange/90 transition-all duration-300 hover:shadow-md block"
        >
          Reserve a Spot
        </Link>
      </div>
    </motion.div>
  )
}

interface Props { events?: Event[] }

export default function EventsSection({ events }: Props) {
  const hasEvents = events && events.length > 0

  return (
    <section className="section-pad bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-4">
          <FadeIn direction="up" delay={0.05}>
            <span className="pill-label">Explore Our Next Events</span>
          </FadeIn>
        </div>
        <FadeIn direction="up" delay={0.15}>
          <p className="text-center font-display font-bold text-brand-navy text-xl md:text-2xl max-w-2xl mx-auto mb-12">
            Stay updated with workshops, info sessions, hackdays, and campus tech gatherings
            designed to boost your skills.
          </p>
        </FadeIn>

        {/* Cards */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-10" staggerDelay={0.12}>
          {hasEvents ? (
            events.slice(0, 3).map((e) => (
              <FadeIn key={e.id} direction="up">
                <EventCard event={e} />
              </FadeIn>
            ))
          ) : (
            <>
              <FadeIn direction="up">
                <PlaceholderCard
                  tag="Hackday"
                  title="AWS Build Challenge"
                  body="Collaborate in teams to design and build innovative solutions using AWS tools and cloud-native technologies."
                />
              </FadeIn>
              <FadeIn direction="up">
                <PlaceholderCard
                  tag="Career Growth"
                  title="AWS Certification & Career Roadmap"
                  body="Understand AWS certification paths, cloud career opportunities, and how to position yourself for internships and tech roles."
                />
              </FadeIn>
              <FadeIn direction="up">
                <PlaceholderCard
                  tag="Tech Talk"
                  title="Exploring AI Solutions with AWS"
                  body="Discover how AI and cloud technologies work together to power modern products, automation, and intelligent systems."
                />
              </FadeIn>
            </>
          )}
        </StaggerContainer>

        {/* View All */}
        <FadeIn direction="up" delay={0.1} className="text-center">
          <Magnetic>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-brand-dark text-white text-sm font-semibold
                         px-7 py-3 rounded-full hover:bg-brand-navy transition-all duration-300 hover:shadow-lg inline-block"
            >
              View All Events <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  )
}

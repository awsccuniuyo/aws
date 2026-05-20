'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, MessageCircle, Instagram, Twitter, Bell, BookOpen, Ticket, Handshake, Brain, Briefcase, Trophy } from 'lucide-react'
import { getAnnouncements } from '@/lib/api'
import type { Announcement } from '@/lib/types'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

function WhatsAppIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      className={className} 
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/\D/g, ''))
  const suffix = value.replace(/\d/g, '')
  const elementRef = useRef<HTMLSpanElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const currentElement = elementRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
        }
      },
      { threshold: 0.1 }
    )
    if (currentElement) observer.observe(currentElement)
    return () => {
      if (currentElement) observer.unobserve(currentElement)
    }
  }, [])

  useEffect(() => {
    if (!isIntersecting) return

    let start = 0
    const end = target
    if (start === end) {
      setCount(end)
      return
    }

    const incrementTime = Math.max(Math.floor(duration / end), 15)
    
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) {
        clearInterval(timer)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [target, duration, isIntersecting])

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  )
}

const tagColors: Record<string, string> = {
  Event:        'bg-brand-orange/10 text-brand-orange',
  Resource:     'bg-blue-50 text-blue-700',
  Announcement: 'bg-green-50 text-green-700',
}

function getAnnouncementTag(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('event') || t.includes('workshop') || t.includes('hackday')) return 'Event'
  if (t.includes('resource') || t.includes('guide') || t.includes('learn')) return 'Resource'
  return 'Announcement'
}

const benefits = [
  { icon: BookOpen, title: 'Free Learning Resources',   desc: 'Curated AWS study materials, whitepapers, and learning paths shared directly in the community.' },
  { icon: Ticket, title: 'Early Event Access',        desc: 'Community members get first access to event registration before public announcements.' },
  { icon: Handshake, title: 'Project Collaboration',     desc: 'Find teammates, get feedback on your projects, and build real things with fellow members.' },
  { icon: Brain, title: 'Support and Mentorship',    desc: 'Ask questions, get answers, and connect with more experienced builders in the community.' },
  { icon: Briefcase, title: 'Career Opportunities',      desc: 'Job postings, internship leads, and referrals shared exclusively with community members.' },
  { icon: Trophy, title: 'Hackathons & Challenges',   desc: 'Regular mini-challenges and hackathons with prizes and real cloud credits.' },
]

const socials = [
  {
    platform: 'WhatsApp Community',
    handle:   'AWS Student Builder Group Uniuyo',
    href:     'https://bit.ly/AWSCCC',
    icon:     WhatsAppIcon,
    color:    'bg-green-500',
    desc:     'The main hub. Daily conversations, resource drops, event updates, and community support.',
    cta:      'Join Now',
  },
  {
    platform: 'X (Twitter)',
    handle:   '@AWSUniuyo',
    href:     'https://x.com/AWSUniuyo',
    icon:     Twitter,
    color:    'bg-brand-dark',
    desc:     'Tech news, event announcements, member spotlights, and live event coverage.',
    cta:      'Follow',
  },
  {
    platform: 'Instagram',
    handle:   '@awsccuniuyo',
    href:     'https://www.instagram.com/awsccuniuyo/',
    icon:     Instagram,
    color:    'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    desc:     'Behind-the-scenes moments, event photos, team highlights, and community stories.',
    cta:      'Follow',
  },
]

export default function StudentCommunityPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnnouncements(true)
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-16 overflow-hidden">
      {/* Hero */}
      <section className="section-pad bg-brand-dark text-white relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-brand-navy rounded-full blur-[90px] opacity-30 animate-glow-pulse" />
        </div>

        <div className="container-max relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <span className="pill-label-dark mb-5">Student Community</span>
              <h1 className="font-display font-black text-4xl md:text-5xl leading-tight mb-5">
                Your Cloud Journey<br />
                Starts with <span className="text-brand-orange">Community</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
                Join hundreds of students, builders, and cloud enthusiasts at UniUyo and beyond.
                Get access to resources, events, mentorship, and real collaboration opportunities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Magnetic>
                  <a
                    href="https://bit.ly/AWSCCC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-orange text-brand-dark font-semibold
                               px-7 py-3 rounded-full hover:bg-brand-orange/90 transition-colors inline-block"
                  >
                    <WhatsAppIcon size={16} className="inline mr-1" /> Join WhatsApp Community
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 border border-white/30 text-white font-medium
                               px-7 py-3 rounded-full hover:bg-white/10 transition-colors inline-block"
                  >
                    View Events
                  </Link>
                </Magnetic>
              </div>
            </FadeIn>

            {/* Stats */}
            <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.08}>
              {[
                { stat: '200+', label: 'Community Members' },
                { stat: '10+',  label: 'Events Hosted' },
                { stat: '5+',   label: 'Partner Organisations' },
                { stat: '3+',   label: 'Universities' },
              ].map(({ stat, label }) => (
                <FadeIn key={label} direction="up">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="bg-white/10 rounded-2xl p-6 text-center border border-white/5 hover:border-brand-orange/30 transition-all duration-300"
                  >
                    <p className="font-display font-black text-3xl text-brand-orange">
                      <AnimatedCounter value={stat} />
                    </p>
                    <p className="text-white/70 text-sm mt-1">{label}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">Member Benefits</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark">
                What You Get as a Member
              </h2>
            </FadeIn>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <FadeIn key={b.title} direction="up">
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className="bg-brand-light rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4 text-brand-orange">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display font-bold text-brand-dark text-base mb-2">{b.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                  </motion.div>
                </FadeIn>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Announcements / Updates feed */}
      <section className="section-pad bg-brand-light">
        <div className="container-max">
          <div className="flex items-center justify-between mb-10">
            <FadeIn direction="up">
              <span className="pill-label mb-3">Updates</span>
              <h2 className="font-display font-black text-3xl text-brand-dark">
                Latest from the Club
              </h2>
            </FadeIn>
            <Bell size={20} className="text-gray-400" />
          </div>

          {loading ? (
            <div className="space-y-4 max-w-2xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-32 shimmer-placeholder" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <FadeIn direction="up">
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 max-w-2xl">
                <p className="text-gray-400 text-sm">No announcements yet. Check back soon!</p>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="space-y-4 max-w-2xl" staggerDelay={0.1}>
              {announcements.map((a) => (
                <FadeIn key={a.id.toString()} direction="up">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[getAnnouncementTag(a.title)] ?? 'bg-gray-100 text-gray-600'}`}>
                        {getAnnouncementTag(a.title)}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(a.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-brand-dark text-base mb-2">{a.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{a.body}</p>
                    {a.link && (
                      <a
                        href={a.link}
                        target={a.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold hover:underline"
                      >
                        {a.link_label ?? 'Learn more'} <ExternalLink size={12} className="inline ml-1" />
                      </a>
                    )}
                  </motion.div>
                </FadeIn>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Social channels */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">Connect With Us</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark">
                Follow Us Everywhere
              </h2>
              <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
                Stay plugged in across all our platforms. Each one has its own flavour — pick yours.
              </p>
            </FadeIn>
          </div>
          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.12}>
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <FadeIn key={s.platform} direction="up">
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className="border border-gray-100 rounded-2xl p-7 text-center hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between"
                  >
                    <div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center mx-auto mb-4 cursor-pointer`}
                      >
                        <Icon size={24} className="text-white" />
                      </motion.div>
                      <h3 className="font-display font-bold text-brand-dark text-base mb-1">{s.platform}</h3>
                      <p className="text-brand-orange text-sm font-medium mb-3">{s.handle}</p>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
                    </div>
                    <Magnetic>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-brand-dark text-white text-sm font-semibold
                                   px-6 py-2.5 rounded-full hover:bg-brand-navy transition-colors inline-block"
                      >
                        {s.cta} <ExternalLink size={12} className="inline ml-1" />
                      </a>
                    </Magnetic>
                  </motion.div>
                </FadeIn>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-pad bg-brand-dark text-white relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-brand-orange rounded-full blur-[100px] opacity-10 animate-glow-pulse-reverse" />
        </div>

        <div className="container-max text-center relative z-10">
          <FadeIn direction="up">
            <h2 className="font-display font-black text-3xl md:text-4xl mb-4">
              Ready to Join the Community?
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              It&apos;s free, open to everyone, and filled with students who are serious about building
              their future in tech. Come as you are.
            </p>
          </FadeIn>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Magnetic>
              <a
                href="https://bit.ly/AWSCCC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange text-brand-dark font-semibold
                           px-8 py-3 rounded-full hover:bg-brand-orange/90 transition-colors inline-block"
              >
                <WhatsAppIcon size={16} className="inline mr-1" /> Join Our WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium
                           px-8 py-3 rounded-full hover:bg-white/10 transition-colors inline-block"
              >
                Explore Events
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

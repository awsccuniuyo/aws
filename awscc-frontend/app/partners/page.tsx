'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Mail } from 'lucide-react'
import type { Partner } from '@/lib/types'
import PartnerLogo from '@/components/PartnerLogo'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

const partners: Partner[] = [
  { name: 'Amazon Web Services',   description: 'Official cloud platform powering our learning programmes and providing credits, resources, and certification support for our members.', logo: '/partners/partner1.png', website: 'https://aws.amazon.com', category: 'core' },
  { name: 'Campus Tech Clubs',     description: 'A network of student-led tech communities across Nigerian campuses collaborating on events, projects, and skill building.', logo: '/partners/partner2.png', website: '#', category: 'community' },
  { name: 'Blockchain Hubs',       description: 'Connecting our members to the web3 and blockchain ecosystem through workshops, mentorship, and collaborative projects.', logo: '/partners/partner3.png', website: '#', category: 'community' },
  { name: 'Local Tech Communities', description: 'Regional developer groups and tech hubs that co-host events and open doors to real-world networking opportunities.', logo: '/partners/partner4.png', website: '#', category: 'community' },
]

const partnerTiers = [
  {
    tier: 'Gold Partner',
    price: 'Custom',
    color: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-400 text-yellow-900',
    benefits: ['Primary logo placement on all materials', 'Speaking slot at flagship events', 'Access to member talent pool', 'Co-branded content creation', 'Dedicated sponsor spotlight'],
  },
  {
    tier: 'Silver Partner',
    price: 'Custom',
    color: 'bg-gray-50 border-gray-200',
    badge: 'bg-gray-400 text-white',
    benefits: ['Logo placement on event materials', 'Social media mention', 'Booth at flagship events', 'Access to member CVs', 'Sponsor spotlight post'],
  },
  {
    tier: 'Community Partner',
    price: 'Free',
    color: 'bg-blue-50 border-blue-100',
    badge: 'bg-blue-500 text-white',
    benefits: ['Community page listing', 'Cross-promotion of events', 'Shared social media posts', 'Co-hosting opportunities'],
  },
]

export default function PartnersPage() {
  return (
    <div className="pt-16 overflow-hidden">
      {/* Hero */}
      <section className="section-pad bg-brand-dark text-white relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-brand-navy rounded-full blur-[90px] opacity-30 animate-glow-pulse" />
        </div>

        <StaggerContainer className="container-max text-center relative z-10">
          <FadeIn direction="up">
            <span className="pill-label-dark mb-5">Our Partners &amp; Supporters</span>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-5 leading-tight">
              Building Together with<br />
              <span className="text-brand-orange">Forward-Thinking Organisations</span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
              We collaborate with companies, communities, and institutions that believe in
              empowering the next generation of African cloud builders.
            </p>
          </FadeIn>
        </StaggerContainer>
      </section>

      {/* Current Partners */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">Current Partners</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark">
                Who We Work With
              </h2>
            </FadeIn>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6" staggerDelay={0.1}>
            {partners.map((p, i) => (
              <FadeIn key={p.name} direction="up" delay={i * 0.05} className="h-full">
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.25 } }}
                  className="bg-brand-light rounded-2xl p-7 flex gap-5 items-start h-full hover:shadow-lg transition-all duration-300"
                >
                  {/* Logo */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer"
                  >
                    <PartnerLogo src={p.logo} name={p.name} />
                  </motion.div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-bold text-brand-dark text-base">{p.name}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                        p.category === 'core' ? 'bg-brand-orange/10 text-brand-orange' :
                        p.category === 'media' ? 'bg-purple-50 text-purple-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {p.category === 'core' ? 'Core Partner' : p.category === 'media' ? 'Media Partner' : 'Community Partner'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.description}</p>
                    {p.website && p.website !== '#' && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-brand-orange text-xs font-semibold hover:underline"
                      >
                        Visit Website <ExternalLink size={11} className="inline ml-1" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="section-pad bg-brand-light">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">Become a Partner</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark mb-3">
                Partnership Tiers
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                Choose the collaboration level that aligns with your goals and budget.
                All partners get direct access to our growing community of student builders.
              </p>
            </FadeIn>
          </div>
          <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
            {partnerTiers.map((t, i) => (
              <FadeIn key={t.tier} direction="up" delay={i * 0.05} className="h-full">
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className={`rounded-2xl border p-7 h-full hover:shadow-lg transition-all duration-300 ${t.color}`}
                >
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${t.badge} mb-4 inline-block`}>
                    {t.tier}
                  </span>
                  <p className="font-display font-black text-2xl text-brand-dark mb-5">{t.price}</p>
                  <ul className="space-y-2.5 mb-6">
                    {t.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-brand-dark/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Partner */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <span className="pill-label mb-5">Why Partner With Us</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark leading-tight mb-5">
                Access a Highly Engaged<br />Student Tech Community
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                AWS Cloud Club UniUyo gives you direct access to motivated, cloud-curious
                students at one of Nigeria&apos;s leading universities. Our members are tomorrow&apos;s
                developers, architects, and founders — actively building skills and looking for
                opportunities.
              </p>
              <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.08}>
                {[
                  { stat: '200+',  label: 'Active Members' },
                  { stat: '10+',   label: 'Events Per Year' },
                  { stat: '5+',    label: 'Partner Organisations' },
                  { stat: '3+',    label: 'Universities Reached' },
                ].map(({ stat, label }) => (
                  <FadeIn key={label} direction="up">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      className="bg-brand-light rounded-xl p-4 transition-all duration-300"
                    >
                      <p className="font-display font-black text-2xl text-brand-dark">{stat}</p>
                      <p className="text-gray-500 text-sm">{label}</p>
                    </motion.div>
                  </FadeIn>
                ))}
              </StaggerContainer>
            </FadeIn>

            {/* Contact form */}
            <FadeIn direction="right" className="bg-brand-dark rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-brand-navy rounded-full blur-[70px] opacity-35" />
              <div className="relative z-10">
                <h3 className="font-display font-bold text-white text-xl mb-2">Get in Touch</h3>
                <p className="text-white/60 text-sm mb-6">
                  Interested in partnering with us? Reach out and we&apos;ll get back to you within 48 hours.
                </p>
                <div className="space-y-4">
                  <input type="text" placeholder="Your name or organisation" className="input-field bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-brand-orange/30 focus:border-brand-orange" />
                  <input type="email" placeholder="Email address" className="input-field bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-brand-orange/30 focus:border-brand-orange" />
                  <select className="input-field bg-white/10 border-white/20 text-white/80 focus:ring-brand-orange/30 focus:border-brand-orange">
                    <option value="" className="text-brand-dark">Type of partnership</option>
                    <option value="gold" className="text-brand-dark">Gold Partner</option>
                    <option value="silver" className="text-brand-dark">Silver Partner</option>
                    <option value="community" className="text-brand-dark">Community Partner</option>
                    <option value="speaker" className="text-brand-dark">Speaker / Facilitator</option>
                    <option value="sponsor" className="text-brand-dark">Event Sponsor</option>
                    <option value="vendor" className="text-brand-dark">Vendor</option>
                  </select>
                  <textarea
                    placeholder="Tell us about your goals for this partnership…"
                    rows={3}
                    className="input-field bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                  />
                  <Magnetic>
                    <a
                      href="mailto:partnerships@awsccuniuyo.com"
                      className="flex items-center justify-center gap-2 bg-brand-orange text-brand-dark
                                 font-semibold py-3 px-8 rounded-full hover:bg-brand-orange/90 transition-colors text-sm inline-block w-full text-center"
                    >
                      <Mail size={14} className="inline mr-1" /> Send Partnership Inquiry
                    </a>
                  </Magnetic>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-brand-light">
        <div className="container-max text-center">
          <FadeIn direction="up">
            <h2 className="font-display font-black text-3xl text-brand-dark mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
              Let&apos;s build something meaningful together for the next generation of cloud builders in Nigeria.
            </p>
          </FadeIn>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Magnetic>
              <Link href="/events" className="bg-brand-dark text-white font-semibold px-7 py-3 rounded-full hover:bg-brand-navy transition-colors text-sm inline-block">
                See Upcoming Events
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/student-community" className="border-2 border-brand-dark text-brand-dark font-semibold px-7 py-3 rounded-full hover:bg-brand-dark hover:text-white transition-colors text-sm inline-block">
                Meet Our Community
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

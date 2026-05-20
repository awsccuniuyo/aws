'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

export function CommunitySection() {
  return (
    <section className="section-pad bg-brand-dark overflow-hidden">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden min-h-[420px]">
          {/* Left text panel */}
          <FadeIn direction="left" className="bg-brand-navy p-10 md:p-14 flex flex-col justify-center">
            <span className="pill-label-dark mb-6">Explore Our Next Events</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-tight mb-5">
              Become Part of the<br />Cloud Community
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              Connect with students, developers, and cloud enthusiasts. Get access to resources,
              updates, and collaboration opportunities.
            </p>
            <StaggerContainer className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8" staggerDelay={0.1}>
              {[
                'Free learning resources',
                'Early event access',
                'Project collaboration',
                'Support and mentorship',
              ].map((item, idx) => (
                <FadeIn key={item} direction="up" delay={idx * 0.05}>
                  <li className="flex items-center gap-2 text-white/80 text-sm list-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />
                    {item}
                  </li>
                </FadeIn>
              ))}
            </StaggerContainer>
            <Magnetic>
              <Link
                href="/student-community"
                className="self-start bg-brand-orange text-brand-dark font-semibold text-sm
                           px-7 py-3 rounded-full hover:bg-brand-orange/90 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/20"
              >
                Contact Us
              </Link>
            </Magnetic>
          </FadeIn>

          {/* Right photo */}
          <FadeIn direction="right" className="relative min-h-[300px] lg:min-h-0">
            <Image
              src="/aws-students.png"
              alt="AWS Students Club members at a campus event"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 to-transparent" />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export function PartnersSection() {
  const partners = ['AWS', 'Campus Tech Clubs', 'Blockchain Hubs', 'Local Tech Communities']

  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="container-max text-center">
        <FadeIn direction="up">
          <span className="pill-label mb-6">Our Partners &amp; Supporters</span>
          <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark max-w-2xl mx-auto leading-tight mb-6">
            We collaborate with forward-thinking organizations to create impactful learning experiences.
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            {partners.join(' • ')}
          </p>
        </FadeIn>

        {/* Logo placeholders */}
        <StaggerContainer className="flex flex-wrap justify-center gap-6 mb-10" staggerDelay={0.08}>
          {partners.map((name, i) => (
            <FadeIn key={i} direction="up" delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.06, rotate: i % 2 === 0 ? 1.5 : -1.5 }}
                className="w-32 h-20 rounded-xl bg-brand-light border border-gray-100
                           flex items-center justify-center text-gray-400 text-xs font-medium
                           hover:border-brand-orange/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-8 h-8 rounded-lg bg-gray-200/60 mx-auto mb-1.5 flex items-center justify-center">
                    <span className="text-gray-400 text-[10px] font-bold">{name.charAt(0)}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{name}</span>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.2}>
          <Magnetic>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 border border-brand-dark text-brand-dark
                         text-sm font-semibold px-7 py-3 rounded-full hover:bg-brand-dark hover:text-white transition-all duration-300"
            >
              See All Partners <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="section-pad bg-brand-light overflow-hidden">
      <div className="container-max">
        <div
          className="rounded-3xl bg-brand-dark px-8 md:px-16 py-16 text-center relative overflow-hidden"
        >
          {/* Background animated accents */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 80% 50%, rgba(27,65,112,0.6) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,170,43,0.08) 0%, transparent 50%)',
            }}
          />
          
          {/* Pulsing floating blobs inside CTA */}
          <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-brand-navy rounded-full blur-[80px] pointer-events-none opacity-20 animate-glow-pulse" />
          <div className="absolute bottom-[-40px] left-[-40px] w-80 h-80 bg-brand-orange rounded-full blur-[100px] pointer-events-none opacity-10 animate-glow-pulse-reverse" />

          <FadeIn direction="up" className="relative z-10">
            <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4 leading-tight">
              Ready to Start Your Cloud<br />Journey?
            </h2>
            <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto mb-8">
              Whether you&apos;re a beginner or advanced, there&apos;s a place for you in our community.
            </p>
            <Magnetic>
              <Link
                href="/student-community"
                className="inline-block bg-brand-orange text-brand-dark font-semibold text-base
                           px-8 py-3 rounded-full hover:bg-brand-orange/90 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/20"
              >
                Contact Us
              </Link>
            </Magnetic>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

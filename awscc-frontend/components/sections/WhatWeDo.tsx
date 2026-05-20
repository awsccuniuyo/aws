'use client'

import Link from 'next/link'
import { BookOpen, Briefcase, Users } from 'lucide-react'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

const pillars = [
  {
    icon: BookOpen,
    title: 'Learn AWS the Smart Way',
    body:  'Follow structured learning paths designed for beginners and intermediate learners.',
  },
  {
    icon: Briefcase,
    title: 'Work on Real Projects',
    body:  'Build solutions you can showcase in your portfolio.',
  },
  {
    icon: Users,
    title: 'Grow with a Community',
    body:  'Attend meetups, collaborate with peers, and access mentorship.',
  },
]

export default function WhatWeDo() {
  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <FadeIn direction="left" delay={0.1} className="flex flex-col items-start">
            <span className="pill-label mb-4">What we do</span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-brand-dark leading-tight mb-5">
              Empowering You to<br />Create with Cloud
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              We provide hands-on trainings, guided learning pathways, real projects, and a supportive
              community to help you build confidently on AWS. Whether you&apos;re just starting in tech
              or sharpening your cloud skills, we&apos;ve built a place where you can grow.
            </p>
            <Magnetic>
              <Link
                href="/events"
                className="mt-8 inline-flex items-center gap-2 border border-gray-300 text-brand-dark
                           text-sm font-semibold px-6 py-2.5 rounded-full hover:border-brand-dark hover:shadow-md transition-all duration-300"
              >
                Explore Our Next Events
              </Link>
            </Magnetic>
          </FadeIn>

          {/* Right — blue accent divider + pillars */}
          <StaggerContainer className="border-l-4 border-brand-navy pl-8 space-y-8" staggerDelay={0.15}>
            {pillars.map(({ icon: Icon, title, body }, index) => (
              <FadeIn key={title} direction="right" delay={index * 0.1}>
                <div className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-navy/10 flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-all duration-300">
                      <Icon size={15} className="text-brand-navy group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-display font-bold text-brand-dark text-base transition-colors duration-300 group-hover:text-brand-navy">
                      {title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed pl-11">{body}</p>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}

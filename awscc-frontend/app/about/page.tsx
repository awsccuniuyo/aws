'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'
import type { TeamMember } from '@/lib/types'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

const team: TeamMember[] = [
  { name: 'Divine Justice ',    role: 'Club President',          bio: 'Cloud enthusiast and AWS Community Builder. Passionate about making cloud accessible to every student.', photo: '', socials: { x: '#', linkedin: '#' } },
  { name: ' Queen ',     role: 'Vice President',          bio: 'Full-stack developer and AWS Solutions Architect Associate. Leads technical workshops and hackathons.', photo: '', socials: { linkedin: '#', instagram: '#' } },
  { name: 'Blessing Etim', role: 'Technical Lead',          bio: 'DevOps engineer in training. Passionate about CI/CD, infrastructure as code, and serverless architectures.', photo: '', socials: { x: '#', linkedin: '#' } },
  { name: 'Chidi Nweze',   role: 'Events Coordinator',     bio: 'Organizes impactful tech events and builds bridges between students and industry professionals.', photo: '', socials: { instagram: '#', linkedin: '#' } },
  { name: 'Sola Adeyemi',  role: 'Community Manager',      bio: 'Connects members, manages community platforms, and ensures every student feels welcome and supported.', photo: '', socials: { x: '#', instagram: '#' } },
  { name: 'Fortune Divinewill',  role: 'Content & Media Lead',   bio: 'Storyteller and content strategist. Documents our community journey and amplifies member stories.', photo: '', socials: { instagram: '@nodexxplorer', x: '@nodexxplorer' } },
  { name: 'Uche Eze',      role: 'Partnerships Lead',      bio: 'Builds relationships with sponsors, speakers, and partner organizations to bring opportunities to members.', photo: '', socials: { linkedin: '#', x: '#' } },
  { name: 'Ngozi Okafor',  role: 'Learning & Dev Lead',    bio: 'Designs learning paths, curates AWS study resources, and mentors members on their cloud certifications.', photo: '', socials: { linkedin: '#', instagram: '#' } },
]

const values = [
  { title: 'Learn',       desc: 'Structured AWS learning paths for all skill levels — from cloud fundamentals to advanced architectures.' },
  { title: 'Build',       desc: 'Real-world projects and hackathons that sharpen your skills and fill your portfolio.' },
  { title: 'Connect',     desc: 'A thriving community of students, builders, and tech professionals across Nigeria.' },
  { title: 'Grow',        desc: 'Career resources, certifications support, and industry connections that open doors.' },
]

export default function AboutPage() {
  return (
    <div className="pt-16 overflow-hidden">

      {/* Hero */}
      <section className="section-pad bg-brand-dark text-white relative">
        {/* Ambient background blur */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-brand-navy rounded-full blur-[90px] opacity-30 animate-glow-pulse" />
        </div>
        
        <StaggerContainer className="container-max text-center relative z-10">
          <FadeIn direction="up">
            <span className="pill-label-dark mb-6">About Us</span>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <h1 className="font-display font-black text-4xl md:text-6xl leading-tight mb-6">
              Building the Next Generation<br />
              of <span className="text-brand-orange">Cloud Builders</span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
              AWS Student Community UniUyo is a student-led tech community at the University of Uyo
              dedicated to making cloud computing education accessible, practical, and community-driven.
            </p>
          </FadeIn>
        </StaggerContainer>
      </section>

      {/* Our Story */}
      <section className="section-pad bg-white">
        <div className="container-max max-w-3xl text-center">
          <FadeIn direction="up">
            <span className="pill-label mb-6">Our Story</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark mb-6">
              From a Shared Vision to a Growing Movement
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              AWS Cloud Club UniUyo was founded by a group of passionate students who believed
              that world-class cloud education shouldn&apos;t be reserved for students at elite institutions.
              Starting with a small study group, we grew into a fully-fledged community chapter
              officially recognized under the AWS Cloud Clubs program.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-gray-500 text-base leading-relaxed">
              Today, we run hands-on workshops, host hackathons, facilitate certification prep sessions,
              and connect our members with real opportunities in the Nigerian and global tech ecosystem.
              Our story is still being written — and we want you to be part of it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-pad bg-brand-light">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">What We Do</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark">
                Four Pillars of Everything We Do
              </h2>
            </FadeIn>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {values.map((v, i) => (
              <FadeIn key={v.title} direction="up" className="h-full">
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 h-full hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center mb-4">
                    <span className="text-brand-orange font-black text-sm">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="font-display font-bold text-brand-dark text-lg mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">Our Team</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark">
                Meet the People Behind the Club
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
                A dedicated team of students passionate about cloud technology and community building.
              </p>
            </FadeIn>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
            {team.map((member) => (
              <FadeIn key={member.name} direction="up">
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="bg-brand-light rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-brand-dark mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-brand-orange/20">
                      {member.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-brand-orange font-black text-2xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-brand-dark text-base">{member.name}</h3>
                    <p className="text-brand-orange text-xs font-semibold uppercase tracking-wide mt-1 mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">{member.bio}</p>
                  </div>
                  {/* Socials */}
                  <div className="flex justify-center gap-2 mt-auto">
                    {member.socials.x && (
                      <a href={member.socials.x} className="w-7 h-7 rounded-full bg-brand-dark/10 hover:bg-brand-dark
                                                              flex items-center justify-center group transition-colors">
                        <Twitter size={12} className="text-brand-dark group-hover:text-white" />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} className="w-7 h-7 rounded-full bg-brand-dark/10 hover:bg-brand-dark
                                                                     flex items-center justify-center group transition-colors">
                        <Linkedin size={12} className="text-brand-dark group-hover:text-white" />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a href={member.socials.instagram} className="w-7 h-7 rounded-full bg-brand-dark/10 hover:bg-brand-dark
                                                                      flex items-center justify-center group transition-colors">
                        <Instagram size={12} className="text-brand-dark group-hover:text-white" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Get Involved */}
      <section className="section-pad bg-brand-dark text-white relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-brand-orange rounded-full blur-[100px] opacity-10 animate-glow-pulse-reverse" />
        </div>

        <div className="container-max max-w-3xl text-center relative z-10">
          <FadeIn direction="up">
            <h2 className="font-display font-black text-3xl md:text-4xl mb-5">How to Get Involved</h2>
            <p className="text-white/70 text-base mb-10 leading-relaxed">
              There are many ways to be part of AWS Cloud Club UniUyo — whether you want to learn,
              build, volunteer, speak, or partner with us.
            </p>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-3 gap-4 mb-10" staggerDelay={0.1}>
            {[
              { title: 'Join as a Member', desc: 'Access events, resources, and community.', href: '/student-community' },
              { title: 'Speak at an Event', desc: 'Share your knowledge with our community.', href: '/partners' },
              { title: 'Partner With Us',   desc: 'Collaborate on events and initiatives.', href: '/partners' },
            ].map((item, i) => (
              <FadeIn key={item.title} direction="up" delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  className="bg-white/10 transition-all duration-300 rounded-2xl p-6 text-left cursor-pointer h-full"
                >
                  <Link href={item.href} className="block h-full">
                    <h3 className="font-display font-bold text-white text-base mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </Link>
                </motion.div>
              </FadeIn>
            ))}
          </StaggerContainer>

          <FadeIn direction="up" delay={0.2}>
            <Magnetic>
              <Link
                href="/events"
                className="inline-block bg-brand-orange text-brand-dark font-semibold px-8 py-3 rounded-full
                           hover:bg-brand-orange/90 transition-colors inline-block"
              >
                Explore Upcoming Events
              </Link>
            </Magnetic>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

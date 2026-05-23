'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Github, Twitter, Linkedin, Instagram, 
  BookOpen, Code, Users, Trophy, GraduationCap, 
  Sparkles, Compass, MessageCircle,
  Library
} from 'lucide-react'
import type { TeamMember } from '@/lib/types'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'
import corevic from '@/public/assets/corevic.jpeg'
import fortune from '@/public/assets/fortune.jpg'
import queen from '@/public/assets/queen.jpg'
import udy from '@/public/assets/udy.jpg'
import divine from '@/public/assets/divine.jpg'

const image1: string = corevic.src
const image2: string = fortune.src
const image3: string = queen.src
const image4: string = udy.src
const image5: string = divine.src

const team: TeamMember[] = [
  { name: 'Divine Justice ',    role: 'Club President',          bio: 'Cloud enthusiast, community builder, and AWS advocate. As Club President of AWS Student Builder Group Uniuyo, Divine leads a growing community of student builders at the University of Uyo, making cloud computing accessible, practical, and exciting for the next generation of tech innovators.', photo: image5, socials: { x: '@awscloudboy',} },
  { name: ' Queen Bassey  ',     role: 'Vice President',          bio: 'A cloud and Blockchain infrastructure expert dedicated to building technologies that strengthens the backbone of modern decentralized and cloud-native systems. She explores how scalable technologies power real-world applications and actively contributes to community learning by simplifying complex concepts, supporting emerging builders, and fostering inclusive tech spaces where innovation can thrive. ', photo: image3, socials: { linkedin: 'queen bassey', x: '@Techgirl_gabby' } },
  { name: 'Victor Nwoke',  role: 'Community Manager',      bio: 'Connects members, manages community platforms, and ensures every student feels welcome and supported.', photo: image1, socials: { x: 'bastilista', instagram: 'bastillsta' } },
  { name: 'Fortune Divinewill',  role: 'Partnerships and Events Management Lead',   bio: 'Storyteller and Events strategist. Full-stack developer Documents our community journey and amplifies member stories.', photo: image2, socials: { instagram: '@nodexxplorer', x: '@nodexxplorer' } },
  { name: 'uduak Etuk', role: 'Content & Media Lead',          bio: 'Serves as the Content Lead, where she is responsible for shaping and communicating the narrative around AWS-driven initiatives. She leads the creation and distribution of content that drives awareness, engagement, and participation within the community covering event promotion, storytelling, and post-event content. She brings a structured, insight-driven approach to content ensuring that ideas are not only shared, but understood and impactful.', photo: image4, socials: { x: 'uduak_etuk_', linkedin: 'uduak-etuk-349b73240', instagram: 'udy_etuk_' } },
]

function getSocialUrl(platform: 'x' | 'linkedin' | 'instagram', handle?: string) {
  if (!handle || handle === '#') return '#'
  if (handle.startsWith('http')) return handle
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle
  if (platform === 'x') return `https://x.com/${cleanHandle}`
  if (platform === 'instagram') return `https://instagram.com/${cleanHandle}`
  if (platform === 'linkedin') return `https://linkedin.com/in/${cleanHandle.toLowerCase().replace(/\s+/g, '')}`
  return '#'
}

const growthWays = [
  {
    icon: BookOpen,
    title: 'Workshops & Study Sessions',
    desc: 'We host beginner-friendly workshops and guided study sessions to break down complex cloud concepts and make learning accessible.',
  },
  {
    icon: Code,
    title: 'Community Projects',
    desc: 'Work on collaborative community projects that let you apply what you learn to real-world scenarios and build a career-ready portfolio.',
  },
  {
    icon: Users,
    title: 'Expert Connections',
    desc: 'Attend tech talks and panels that connect you directly with AWS cloud experts, mentors, and industry-wide career opportunities.',
  },
  {
    icon: Trophy,
    title: 'Certification Prep & Hackathons',
    desc: 'Get preparation support for AWS certifications combined with exciting hackathons and challenges to test your builder skills.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-16 overflow-hidden">

      {/* Hero */}
      <section className="section-pad bg-brand-dark text-white relative">
        {/* Ambient background blur */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-brand-navy rounded-full blur-[100px] opacity-35 animate-glow-pulse" />
        </div>
        
        <StaggerContainer className="container-max text-center relative z-10">
          <FadeIn direction="up">
            <span className="pill-label-dark mb-6">About Us</span>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <h1 className="font-display font-black text-4xl md:text-6xl leading-tight mb-6">
              AWS Student Builder Group<br />
              <span className="text-brand-orange">Uniuyo</span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              AWS Student Builder Group, Uniuyo is a student-led cloud community at the University of Uyo, 
              supported by Amazon Web Services (AWS). We empower students with practical cloud skills and 
              help them access real opportunities in the tech ecosystem. Whether you’re new to tech or 
              already building, this is a space where you can learn, experiment, and grow.
            </p>
          </FadeIn>
        </StaggerContainer>
      </section>

      {/* Our Mission */}
      <section className="section-pad bg-white relative">
        <div className="container-max max-w-4xl text-center">
          <FadeIn direction="up">
            <span className="pill-label mb-6">Our Mission</span>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.15}>
            <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark max-w-3xl mx-auto leading-tight mb-8">
              To demystify cloud computing, make learning accessible, and help students build career-ready skills.
            </h2>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.3}>
            <div className="bg-brand-light rounded-3xl p-8 md:p-10 border border-gray-100/60 max-w-2xl mx-auto flex items-start gap-5 text-left shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                <Compass size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-brand-dark text-lg mb-2">Our Guiding Principle</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We believe that cloud computing shouldn&apos;t be intimidating. Through hands-on experiences, 
                  active collaboration, and continuous community support, we translate complex concepts into 
                  practical, builder-ready knowledge.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How We Help Students Grow */}
      <section className="section-pad bg-brand-light">
        <div className="container-max">
          <div className="text-center mb-12">
            <FadeIn direction="up">
              <span className="pill-label mb-4">Empowerment</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-brand-dark">
                How We Help Students Grow
              </h2>
              <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
                Everything we do is designed to help our members build cloud knowledge confidently and practically.
              </p>
            </FadeIn>
          </div>
          
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {growthWays.map((item, i) => {
              const Icon = item.icon
              return (
                <FadeIn key={item.title} direction="up" className="h-full">
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 h-full hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-brand-navy/10 flex items-center justify-center mb-5 text-brand-navy">
                        <Icon size={22} />
                      </div>
                      <h3 className="font-display font-bold text-brand-dark text-base mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-brand-orange/40 font-black text-sm mt-5 block text-right">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                </FadeIn>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="section-pad bg-brand-dark text-white relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[-60px] left-[-60px] w-96 h-96 bg-brand-orange rounded-full blur-[110px] opacity-15 animate-glow-pulse" />
          <div className="absolute top-[-60px] right-[-60px] w-80 h-80 bg-brand-navy rounded-full blur-[90px] opacity-20 animate-glow-pulse-reverse" />
        </div>

        <div className="container-max max-w-4xl text-center relative z-10">
          <FadeIn direction="up">
            <span className="pill-label-dark mb-5">Open to Everyone</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-6 leading-tight">
              Who Can Join Us?
            </h2>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.15}>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12 text-center max-w-3xl mx-auto hover:border-brand-orange/30 transition-all duration-300">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center mx-auto mb-6 text-brand-orange"
              >
                <GraduationCap size={32} />
              </motion.div>
              <h3 className="font-display font-extrabold text-2xl text-brand-orange mb-4">Anyone and Everyone</h3>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Students from <strong>any department or background</strong> are welcome, with <strong>no experience required</strong>. 
                If you&apos;re curious about technology, passionate about innovation, or simply ready to explore the cloud, 
                <strong> you belong here</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <a
                    href="https://bit.ly/AWSCCC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-orange text-brand-dark font-semibold
                               px-8 py-3.5 rounded-full hover:bg-brand-orange/90 transition-colors inline-block"
                  >
                    <MessageCircle size={16} /> Join WhatsApp Group
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 border border-white/30 text-white font-medium
                               px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors inline-block"
                  >
                    View Events
                  </Link>
                </Magnetic>
              </div>
            </div>
          </FadeIn>
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
                      <a
                        href={getSocialUrl('x', member.socials.x)}
                        target={member.socials.x !== '#' ? '_blank' : undefined}
                        rel={member.socials.x !== '#' ? 'noopener noreferrer' : undefined}
                        className="w-7 h-7 rounded-full bg-brand-dark/10 hover:bg-brand-dark flex items-center justify-center group transition-colors"
                      >
                        <Twitter size={12} className="text-brand-dark group-hover:text-white" />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a
                        href={getSocialUrl('linkedin', member.socials.linkedin)}
                        target={member.socials.linkedin !== '#' ? '_blank' : undefined}
                        rel={member.socials.linkedin !== '#' ? 'noopener noreferrer' : undefined}
                        className="w-7 h-7 rounded-full bg-brand-dark/10 hover:bg-brand-dark flex items-center justify-center group transition-colors"
                      >
                        <Linkedin size={12} className="text-brand-dark group-hover:text-white" />
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a
                        href={getSocialUrl('instagram', member.socials.instagram)}
                        target={member.socials.instagram !== '#' ? '_blank' : undefined}
                        rel={member.socials.instagram !== '#' ? 'noopener noreferrer' : undefined}
                        className="w-7 h-7 rounded-full bg-brand-dark/10 hover:bg-brand-dark flex items-center justify-center group transition-colors"
                      >
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

    </div>
  )
}

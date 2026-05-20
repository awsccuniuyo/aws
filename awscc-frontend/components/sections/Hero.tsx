'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import FloatingIcon from '@/components/FloatingIcon'
import { FadeIn, StaggerContainer, Magnetic } from '@/components/ui/MotionReveal'

const floatingIcons = [
  { src: '/partners/partner1.png', alt: 'Partner 1', top: '18%', left: '8%',  delay: 0,   size: 52 },
  { src: '/partners/partner2.png', alt: 'Partner 2', top: '12%', right: '14%', delay: 0.4, size: 44 },
  { src: '/partners/partner3.png', alt: 'Partner 3', top: '55%', left: '5%',   delay: 0.2, size: 48 },
  { src: '/partners/partner4.png', alt: 'Partner 4', top: '60%', right: '8%',  delay: 0.6, size: 52 },
  { src: '/partners/partner5.png', alt: 'Partner 5', top: '80%', left: '18%',  delay: 0.3, size: 40 },
  { src: '/partners/partner6.png', alt: 'Partner 6', top: '78%', right: '20%', delay: 0.5, size: 48 },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden px-4 pt-16">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#101419 1px, transparent 1px), linear-gradient(90deg, #101419 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FFAA2B 0%, transparent 70%)',
        }}
      />

      {/* Floating partner icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{
            top: icon.top,
            left: (icon as any).left,
            right: (icon as any).right,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 3 + i * 0.5,
              ease: 'easeInOut',
              delay: icon.delay,
            },
            scale: {
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: 0.4 + icon.delay,
            },
            opacity: {
              duration: 0.5,
              delay: 0.4 + icon.delay,
            },
          }}
          whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-orange/30 hover:shadow-brand-orange/10 transition-all duration-300">
            <FloatingIcon src={icon.src} alt={icon.alt} size={icon.size} />
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <StaggerContainer className="relative z-10 text-center max-w-3xl mx-auto py-20">
        {/* AWS pill — prominent */}
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2.5 bg-white border-2 border-brand-orange/30 rounded-full
                          px-5 py-2 mb-8 shadow-md">
            <span className="text-sm text-gray-600">Brought to you and powered by</span>
            <span className="font-black text-[#FF9900] text-lg tracking-tight">aws</span>
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.25}>
          <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-brand-dark leading-[1.08] mb-6">
            Build,{' '}
            <em className="not-italic font-black text-brand-navy underline decoration-brand-orange decoration-4 underline-offset-4">
              Learn
            </em>{' '}
            &amp; Grow<br />
            in the{' '}
            <span className="text-brand-dark">Cloud</span>
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.4}>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join a vibrant community of innovators, creators, and students exploring AWS Cloud
            technologies and real-world solutions.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.55}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Magnetic>
              <Link
                href="/student-community"
                className="bg-brand-dark text-white font-semibold px-7 py-3 rounded-full hover:bg-brand-navy
                           transition-all duration-300 text-sm md:text-base hover:shadow-xl hover:shadow-brand-dark/20 inline-block"
              >
                Join the Community
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/events"
                className="border-2 border-brand-dark text-brand-dark font-semibold px-7 py-3 rounded-full
                           hover:bg-brand-dark hover:text-white transition-all duration-300 text-sm md:text-base inline-block"
              >
                Explore the learning paths
              </Link>
            </Magnetic>
          </div>
        </FadeIn>
      </StaggerContainer>
    </section>
  )
}

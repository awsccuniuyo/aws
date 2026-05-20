'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'none'

interface RevealProps {
  children: React.ReactNode
  type?: AnimationType
  delay?: number // in ms
  duration?: number // in ms
  className?: string
  threshold?: number
  once?: boolean
}

const StaggerContext = createContext<{ index: number; active: boolean }>({
  index: 0,
  active: false,
})

export function StaggerContainer({
  children,
  className = '',
  once = true,
  threshold = 0.1,
}: {
  children: React.ReactNode
  className?: string
  once?: boolean
  threshold?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once, threshold])

  // Count the children to stagger them
  let childIndex = 0
  const staggeredChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const currentIdx = childIndex++
      return (
        <StaggerContext.Provider value={{ index: currentIdx, active: isVisible }}>
          {child}
        </StaggerContext.Provider>
      )
    }
    return child
  })

  return (
    <div ref={ref} className={className}>
      {staggeredChildren}
    </div>
  )
}

export default function Reveal({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  threshold = 0.1,
  once = true,
}: RevealProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const stagger = useContext(StaggerContext)

  useEffect(() => {
    if (stagger.active) {
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsIntersecting(false)
        }
      },
      { threshold }
    )

    if (ref.current && !stagger.active) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once, threshold, stagger.active])

  // Determine actual delay, factoring in stagger container
  const actualDelay = stagger.active ? stagger.index * 100 + delay : delay

  const getTransitionStyle = () => {
    return {
      transitionDelay: `${actualDelay}ms`,
      transitionDuration: `${duration}ms`,
    }
  }

  const getAnimationClasses = () => {
    if (isIntersecting || (stagger.active && stagger.index >= 0)) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100'
    }

    switch (type) {
      case 'fade-up':
        return 'opacity-0 translate-y-12'
      case 'fade-down':
        return 'opacity-0 -translate-y-12'
      case 'fade-left':
        return 'opacity-0 translate-x-12'
      case 'fade-right':
        return 'opacity-0 -translate-x-12'
      case 'scale-up':
        return 'opacity-0 scale-90'
      default:
        return ''
    }
  }

  return (
    <div
      ref={ref}
      style={getTransitionStyle()}
      className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  )
}

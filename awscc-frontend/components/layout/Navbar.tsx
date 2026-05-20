'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home',              href: '/' },
  { label: 'About',             href: '/about' },
  { label: 'Events',            href: '/events' },
  { label: 'Partners',          href: '/partners' },
  { label: 'Student Community', href: '/student-community' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname              = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center group-hover:bg-brand-navy transition-colors">
            <span className="text-brand-orange text-xs font-black">AWS</span>
          </div>
          <span className="font-display font-bold text-brand-dark text-sm hidden sm:block leading-tight">
            Cloud Clubs<br />
            <span className="text-xs font-normal text-gray-500">UniUyo</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'border border-brand-dark text-brand-dark'
                    : 'text-gray-600 hover:text-brand-dark'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/student-community"
            className="bg-brand-dark text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-brand-navy transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-brand-dark"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname === l.href
                      ? 'bg-brand-light text-brand-dark'
                      : 'text-gray-600 hover:bg-brand-light'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/student-community"
            className="mt-3 block w-full text-center bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  )
}

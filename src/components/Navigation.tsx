'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, memo } from 'react'
import { gsap, ScrollTrigger, ensureGSAP } from '@/lib/animations'
import { useSettings } from '@/contexts/SettingsContext'

function Navigation() {
  const settings = useSettings()
  const siteName = settings?.siteName?.replace(/\s+Restaurant\s*$/i, '') || settings?.siteName || 'Veloria'
  const [isOpen, setIsOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetch('/api/site/logo')
      .then((res) => {
        if (res.ok) return res.url
        setLogoError(true)
        return null
      })
      .then((url) => {
        if (url) setLogoUrl(url + '?t=' + Date.now())
      })
      .catch(() => setLogoError(true))
  }, [mounted])

  useEffect(() => {
    let cancelled = false
    ensureGSAP().then(() => {
      if (cancelled || !navRef.current) return
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      if (logoRef.current) {
        gsap.fromTo(logoRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' })
      }
      if (linksRef.current) {
        gsap.fromTo(linksRef.current.children, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.3, ease: 'power3.out' })
      }
      if (innerRef.current) {
        gsap.fromTo(
          innerRef.current,
          { height: 64 },
          {
            height: 56,
            ease: 'none',
            scrollTrigger: { trigger: document.body, start: '120px top', end: '280px top', scrub: 0.8 },
          }
        )
      }
    })
    return () => {
      cancelled = true
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  // Only show img after mount to avoid hydration mismatch (server and first client paint both show text)
  const showImgLogo = mounted && logoUrl && !logoError

  return (
    <nav ref={navRef} className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm w-full">
      <div className="section-container w-full">
        <div ref={innerRef} className="flex items-center justify-between h-14 sm:h-16 py-0 min-h-[56px]">
          <Link ref={logoRef} href="/" className="flex items-center gap-2 shrink-0 min-h-[44px] min-w-[44px] justify-start md:min-w-0 md:min-h-0">
            {showImgLogo ? (
              <img src={logoUrl!} alt={siteName} className="h-8 sm:h-9 md:h-10 w-auto max-w-[140px] sm:max-w-[160px] md:max-w-[180px] object-contain object-left" />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{siteName}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div ref={linksRef} className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-gray-600 hover:text-gray-900 transition-colors">
              Menu
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-gray-900 transition-colors">
              Gallery
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link href="/book-a-table" className="btn-primary">
              Book a Table
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-0 border-t border-gray-100">
            <Link
              href="/"
              className="block py-3 px-1 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="block py-3 px-1 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/gallery"
              className="block py-3 px-1 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className="block py-3 px-1 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/book-a-table"
              className="block py-3 px-1 btn-primary text-center min-h-[44px] flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              Book a Table
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default memo(Navigation)

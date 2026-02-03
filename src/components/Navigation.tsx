'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '@/lib/animations'

export default function Navigation() {
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
    registerGSAP()
    if (!navRef.current) return
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
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  // Only show img after mount to avoid hydration mismatch (server and first client paint both show text)
  const showImgLogo = mounted && logoUrl && !logoError

  return (
    <nav ref={navRef} className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="section-container">
        <div ref={innerRef} className="flex items-center justify-between h-16 py-0">
          <Link ref={logoRef} href="/" className="flex items-center gap-2 shrink-0">
            {showImgLogo ? (
              <img src={logoUrl!} alt="Veloria" className="h-10 w-auto max-w-[180px] object-contain object-left" />
            ) : (
              <span className="text-2xl font-bold text-gray-900">Veloria</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div ref={linksRef} className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-gray-600 hover:text-gray-900 transition-colors">
              Menu
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
            className="md:hidden text-gray-600 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
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
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100">
            <Link
              href="/"
              className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/book-a-table"
              className="block py-2 btn-primary text-center"
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

'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, memo } from 'react'
import { gsap, ScrollTrigger, ensureGSAP } from '@/lib/animations'
import { useSettings } from '@/contexts/SettingsContext'

const socialIconClass = 'w-6 h-6 text-gray-500 hover:text-primary-600 transition-colors'

interface ContactInfo {
  address: string
  addressLine2: string
  phone: string
  email: string
  hours: string
}

const defaultContact: ContactInfo = {
  address: '123 Restaurant Street',
  addressLine2: 'City, State 12345',
  phone: '(555) 123-4567',
  email: 'info@veloria.com',
  hours: '',
}

function Footer() {
  const settings = useSettings()
  const [contact, setContact] = useState<ContactInfo>(defaultContact)
  const footerRef = useRef<HTMLElement>(null)
  const columnsRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    fetch('/api/contact')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setContact({
            address: data.address ?? defaultContact.address,
            addressLine2: data.addressLine2 ?? defaultContact.addressLine2,
            phone: data.phone ?? defaultContact.phone,
            email: data.email ?? defaultContact.email,
            hours: data.hours ?? defaultContact.hours,
          })
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    ensureGSAP().then(() => {
      if (cancelled || !footerRef.current || !columnsRef.current) return
      const cols = columnsRef.current.children
      gsap.fromTo(
        cols,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 92%', toggleActions: 'play none none reverse' },
        }
      )
      if (socialRef.current) {
        gsap.fromTo(
          socialRef.current,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 92%', toggleActions: 'play none none reverse' },
          }
        )
      }
      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.35,
            ease: 'power2.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      }
    })
    return () => {
      cancelled = true
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
    setEmail('')
  }

  return (
    <footer ref={footerRef} className="bg-gray-50 border-t border-gray-200 text-gray-900 w-full">
      <div className="section-container py-8 sm:py-10 md:py-12 w-full">
        <div ref={columnsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">{settings?.siteName ?? 'Veloria Restaurant'}</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Experience exceptional cuisine in an elegant atmosphere.
              We bring you the finest dining experience.
            </p>
          </div>

          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-gray-900 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/book-a-table" className="hover:text-gray-900 transition-colors">
                  Book a Table
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Contact Info</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
              {contact.address && <li>{contact.address}</li>}
              {contact.addressLine2 && <li>{contact.addressLine2}</li>}
              {contact.phone && <li><a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-gray-900 transition-colors">{contact.phone}</a></li>}
              {contact.email && <li><a href={`mailto:${contact.email}`} className="hover:text-gray-900 transition-colors break-all">{contact.email}</a></li>}
              {contact.hours && <li className="whitespace-pre-line pt-1">{contact.hours}</li>}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Newsletter</h4>
            <p className="text-gray-600 text-sm mb-2 sm:mb-3">
              Get updates on events, seasonal menus, and special offers.
            </p>
            {subscribed ? (
              <p className="text-primary-600 text-sm font-medium">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition min-h-[44px] sm:min-h-0"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200 min-h-[44px] sm:min-h-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Social links – center */}
        {settings && (settings.facebookUrl || settings.whatsappUrl || settings.instagramUrl || settings.googleBusinessUrl || settings.tripadvisorUrl) && (
          <div ref={socialRef} className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center" aria-label="Facebook">
                <svg className={socialIconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            )}
            {settings.whatsappUrl && (
              <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center" aria-label="WhatsApp">
                <svg className={socialIconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center" aria-label="Instagram">
                <svg className={socialIconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
            )}
            {settings.googleBusinessUrl && (
              <a href={settings.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center" aria-label="Google Business">
                <svg className={socialIconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg>
              </a>
            )}
            {settings.tripadvisorUrl && (
              <a href={settings.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center" aria-label="TripAdvisor">
                <svg className={socialIconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.976 5.976 0 0 0 4.075 1.6 5.997 5.997 0 0 0 4.04-10.43L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM12 6.255c1.531 0 3.063.303 4.504.91l-2.784 3.024a3.396 3.396 0 0 0-3.44 0L6.5 7.165a11.45 11.45 0 0 1 5.5-.91zm-6.002 4.5a3.398 3.398 0 0 1 2.304-.94c.53 0 1.045.12 1.52.34L6.35 11.16a3.396 3.396 0 0 0-1.352 2.665 3.398 3.398 0 0 0 2.352 3.244 3.398 3.398 0 0 0 2.352-3.244c0-.995-.5-1.92-1.352-2.665l1.172-1.275a5.997 5.997 0 0 1 5.924 5.14 5.976 5.976 0 0 1-2.352 4.645 5.976 5.976 0 0 1-7.144 0 5.997 5.997 0 0 1-2.352-4.645c0-1.22.36-2.42 1.044-3.405zm12 0a3.398 3.398 0 0 1 2.304-.94c.53 0 1.045.12 1.52.34l-1.122 1.22a3.396 3.396 0 0 0-1.352 2.665 3.398 3.398 0 0 0 2.352 3.244 3.398 3.398 0 0 0 2.352-3.244c0-.995-.5-1.92-1.352-2.665l1.172-1.275a5.997 5.997 0 0 1 5.924 5.14 5.976 5.976 0 0 1-2.352 4.645 5.976 5.976 0 0 1-7.144 0 5.997 5.997 0 0 1-2.352-4.645c0-1.22.36-2.42 1.044-3.405z" /></svg>
              </a>
            )}
          </div>
        )}

        <div ref={bottomRef} className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-500 text-sm sm:text-base px-2">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} {settings?.siteName ?? 'Veloria Restaurant'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)

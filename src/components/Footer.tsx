'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '@/lib/animations'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const columnsRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    registerGSAP()
    if (!footerRef.current || !columnsRef.current) return
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
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
    setEmail('')
  }

  return (
    <footer ref={footerRef} className="bg-gray-50 border-t border-gray-200 text-gray-900">
      <div className="section-container py-12">
        <div ref={columnsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Veloria</h3>
            <p className="text-gray-600">
              Experience exceptional cuisine in an elegant atmosphere.
              We bring you the finest dining experience.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
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
              <li>
                <Link href="/admin" className="hover:text-gray-500 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact Info</h4>
            <ul className="space-y-2 text-gray-600">
              <li>123 Restaurant Street</li>
              <li>City, State 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@veloria.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Newsletter</h4>
            <p className="text-gray-600 text-sm mb-3">
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
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div ref={bottomRef} className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Veloria Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '@/lib/animations'
import PageHeader from '@/components/PageHeader'

export default function BookATable() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const formCardRef = useRef<HTMLDivElement>(null)
  const policyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAP()
    if (formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.15 }
      )
      const formEl = formCardRef.current.querySelector('form')
      const rows = formEl ? Array.from(formEl.querySelectorAll(':scope > div')) : []
      if (rows.length) {
        gsap.fromTo(
          rows,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.35, ease: 'power2.out' }
        )
      }
    }
    if (policyRef.current) {
      gsap.fromTo(
        policyRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.6 }
      )
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          specialRequests: formData.specialRequests,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          specialRequests: '',
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError((data.error as string) || 'Could not save reservation. Please try again.')
      }
    } catch {
      setError('Could not save reservation. Please check your connection and try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const today = new Date().toISOString().split('T')[0]
  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900 placeholder-gray-500'

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Book a Table"
        subtitle="Reserve your table for an unforgettable dining experience"
      />

      <section className="py-10 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="book-heading">
        <div className="section-container max-w-2xl w-full">
          <div ref={formCardRef} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
            <h2 id="book-heading" className="sr-only">Reservation form</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="book-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="book-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="John Doe"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="book-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="book-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="john@example.com"
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="book-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="book-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="(555) 123-4567"
                  aria-required="true"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="book-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="book-date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={today}
                    className={inputClass}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="book-time" className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="book-time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="book-guests" className="block text-sm font-medium text-gray-700 mb-2">
                    Guests *
                  </label>
                  <select
                    id="book-guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    aria-required="true"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="7">7 Guests</option>
                    <option value="8">8+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="book-specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  id="book-specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Dietary restrictions, allergies, or special occasions?"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  {error}
                </div>
              )}

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm" role="status">
                  <p className="font-semibold">Reservation Confirmed!</p>
                  <p className="mt-1">
                    We&apos;ve received your request. You will receive a confirmation email shortly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg py-4 rounded-lg transition-colors duration-200 disabled:opacity-70"
                disabled={submitted}
              >
                {submitted ? 'Reservation Submitted' : 'Reserve Table'}
              </button>
            </form>

            <div ref={policyRef} className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Reservation Policy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reservations are held for 15 minutes past the reserved time</li>
                <li>• For parties of 8 or more, please call us directly</li>
                <li>• Cancellations should be made at least 24 hours in advance</li>
                <li>• We recommend booking in advance for weekend dining</li>
              </ul>
              <p className="mt-4 text-gray-600 text-sm">
                Questions? <Link href="/contact" className="text-primary-500 hover:text-primary-600">Contact us</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

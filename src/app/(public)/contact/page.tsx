'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, ensureGSAP } from '@/lib/animations'
import PageHeader from '@/components/PageHeader'

interface ContactInfo {
  heading: string
  intro: string
  address: string
  addressLine2: string
  phone: string
  email: string
  hours: string
}

const defaultContact: ContactInfo = {
  heading: 'Get in Touch',
  intro: "Have a question or want to make a reservation? We're here to help. Reach out to us through any of the following ways.",
  address: '123 Restaurant Street',
  addressLine2: 'City, State 12345',
  phone: '(555) 123-4567',
  email: 'info@veloria.com',
  hours: 'Monday - Thursday: 5:00 PM - 10:00 PM\nFriday - Saturday: 5:00 PM - 11:00 PM\nSunday: 4:00 PM - 9:00 PM',
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContact)
  const contentRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/contact')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setContactInfo(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    ensureGSAP().then(() => {
      if (cancelled) return
      if (leftRef.current) {
        gsap.fromTo(leftRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15 })
        const infoBlocks = leftRef.current.querySelectorAll('.flex.items-start')
        if (infoBlocks.length) {
          gsap.fromTo(
            infoBlocks,
            { x: -24, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.35, ease: 'power2.out' }
          )
        }
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 })
        const formWrapper = formRef.current.querySelector('.bg-white')
        const formGroups = formWrapper?.querySelectorAll('.space-y-6 > div')
        if (formGroups?.length) {
          gsap.fromTo(
            formGroups,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, delay: 0.45, ease: 'power2.out' }
          )
        }
      }
    })
    return () => {
      cancelled = true
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitted(true)
    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setSubmitted(false)
      }
    } catch {
      setError('Something went wrong. Please check your connection.')
      setSubmitted(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900 placeholder-gray-500'

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with us."
      />

      <section ref={contentRef} className="py-10 sm:py-12 md:py-16 bg-gray-50" aria-labelledby="contact-heading">
        <div className="section-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">
            {/* Contact Information */}
            <div ref={leftRef} className="lg:sticky lg:top-24 min-w-0">
              <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">{contactInfo.heading}</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                {contactInfo.intro}
              </p>

              <Link
                href="/book-a-table"
                className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-semibold px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-colors duration-200 mb-8 sm:mb-10 min-h-[44px] sm:min-h-0 inline-flex items-center justify-center"
              >
                Book a Table
              </Link>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Address</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{contactInfo.address}<br />{contactInfo.addressLine2}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Phone</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Email</h3>
                    <p className="text-gray-600 text-sm sm:text-base break-all">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Hours</h3>
                    <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div ref={formRef} className="min-w-0">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className={inputClass}
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className={`${inputClass} resize-none`}
                      aria-required="true"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm" role="alert">
                      {error}
                    </div>
                  )}
                  {submitted && !error && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm" role="status">
                      Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 disabled:opacity-70"
                    disabled={submitted}
                  >
                    {submitted ? 'Sent' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Google Map - Oceana Beach Cafe, Tangalle */}
          <div className="mt-10 sm:mt-12 md:mt-16 flex justify-center">
            <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  title="Oceana Beach Cafe and Seafood Restaurant location"
                  src="https://www.google.com/maps?q=6.0264335,80.797514&z=17&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="text-center text-sm text-gray-500 py-2 px-3 bg-white border-t border-gray-200">
                Oceana Beach Cafe and Seafood Restaurant — Parakrama Rd, Tangalle 82200
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

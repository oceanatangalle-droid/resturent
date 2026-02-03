'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '@/lib/animations'
import { formatPrice } from '@/lib/formatPrice'

interface HomeContent {
  heroWords: string[]
  subtitle: string
  aboutTitle: string
  aboutText: string
  feature1Title: string
  feature1Text: string
  feature2Title: string
  feature2Text: string
  feature3Title: string
  feature3Text: string
  menuSectionTitle: string
  menuSectionSubtitle: string
  featuredMenuLimit: number
  discountVisible?: boolean
  discountTitle?: string
  discountSubtitle?: string
  discountCtaText?: string
  discountCtaLink?: string
  discountImageBase64?: string
}

interface FeaturedItem {
  id: string
  name: string
  description: string
  price: string
  category: string
}

const defaultHome: HomeContent = {
  heroWords: ['Welcome', 'to', 'Veloria'],
  subtitle: 'Experience exceptional cuisine in an elegant atmosphere. Where every meal is a celebration.',
  aboutTitle: 'About Veloria',
  aboutText: 'At Veloria, we believe that dining is an experience that should engage all your senses. Our chefs craft each dish with passion, using only the finest ingredients sourced from local farms and trusted suppliers. Every plate tells a story, and every meal creates a memory.',
  feature1Title: 'Fine Dining',
  feature1Text: 'Exquisite dishes prepared with the finest ingredients and culinary expertise.',
  feature2Title: 'Elegant Atmosphere',
  feature2Text: 'A sophisticated ambiance perfect for special occasions and intimate dinners.',
  feature3Title: 'Quality Service',
  feature3Text: 'Attentive staff dedicated to making your dining experience unforgettable.',
  menuSectionTitle: 'Featured from Our Menu',
  menuSectionSubtitle: 'A taste of what we offer. Explore our full menu for the complete experience.',
  featuredMenuLimit: 6,
  discountVisible: true,
  discountTitle: 'Special Offer',
  discountSubtitle: 'Enjoy 20% off your next dinner when you book online. Limited time only.',
  discountCtaText: 'Book Now',
  discountCtaLink: '/book-a-table',
}

const defaultFeatured: FeaturedItem[] = [
  { id: '1', name: 'Bruschetta Trio', description: 'Artisanal bruschetta with fresh tomatoes, basil, and mozzarella', price: '$14', category: 'Appetizers' },
  { id: '2', name: 'Grilled Salmon', description: 'Atlantic salmon with roasted vegetables and herb butter', price: '$28', category: 'Main Courses' },
  { id: '3', name: 'Ribeye Steak', description: '12oz prime ribeye with garlic mashed potatoes', price: '$42', category: 'Main Courses' },
  { id: '4', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center and vanilla ice cream', price: '$10', category: 'Desserts' },
  { id: '5', name: 'Tiramisu', description: 'Classic Italian with coffee-soaked ladyfingers and mascarpone', price: '$9', category: 'Desserts' },
  { id: '6', name: 'Craft Cocktails', description: 'Handcrafted cocktails with premium spirits', price: '$12-16', category: 'Beverages' },
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const titleWordsRef = useRef<HTMLSpanElement[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const aboutLineRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const featureCardsRef = useRef<HTMLDivElement>(null)
  const menuSectionRef = useRef<HTMLElement>(null)
  const menuCardsRef = useRef<HTMLDivElement>(null)
  const menuHeadingRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLElement>(null)
  const contactHeadingRef = useRef<HTMLDivElement>(null)
  const contactFormRef = useRef<HTMLFormElement>(null)
  const discountRef = useRef<HTMLElement>(null)
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHome)
  const [featuredMenuItems, setFeaturedMenuItems] = useState<FeaturedItem[]>(defaultFeatured)
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/home').then((r) => r.ok ? r.json() : null),
      fetch('/api/menu/items').then((r) => r.ok ? r.json() : []),
      fetch('/api/settings').then((r) => r.ok ? r.json().then((s: { currencySymbol?: string }) => s?.currencySymbol ?? '$') : '$'),
    ]).then(([homeData, items, symbol]: [HomeContent | null, FeaturedItem[], string]) => {
      if (homeData) setHomeContent(homeData)
      if (items?.length) {
        const limit = (homeData || defaultHome).featuredMenuLimit
        setFeaturedMenuItems(items.slice(0, limit))
      }
      setCurrencySymbol(symbol ?? '$')
    }).catch(() => {})
  }, [])

  useEffect(() => {
    registerGSAP()
    const ctx = gsap.context(() => {
      // Hero: word-by-word title reveal
      gsap.fromTo(
        titleWordsRef.current,
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.2,
        }
      )
      gsap.fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.6 })
      gsap.fromTo(buttonsRef.current?.children || [], { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out', delay: 0.9 })

      // Discount section: fade in on scroll
      if (discountRef.current) {
        gsap.from(discountRef.current, {
          scrollTrigger: { trigger: discountRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        })
      }

      // Hero parallax: content moves slightly on scroll
      if (heroContentRef.current && heroRef.current) {
        gsap.to(heroContentRef.current, {
          y: 80,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // About: line draw + content stagger
      if (aboutRef.current && aboutContentRef.current) {
        if (aboutLineRef.current) {
          gsap.fromTo(aboutLineRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 78%', toggleActions: 'play none none reverse' } })
        }
        gsap.from(aboutContentRef.current.children, {
          scrollTrigger: { trigger: aboutRef.current, start: 'top 78%', toggleActions: 'play none none reverse' },
          y: 48,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
        })
      }

      // Features: icons pop + cards stagger with slight scale
      if (featuresRef.current && featureCardsRef.current) {
        const cards = Array.from(featureCardsRef.current.children)
        cards.forEach((card, i) => {
          const icon = card.querySelector('.feature-icon-wrap')
          if (icon) {
            gsap.from(icon, {
              scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
              scale: 0,
              rotation: -12,
              duration: 0.6,
              ease: 'back.out(1.4)',
              delay: 0.1,
            })
          }
        })
        gsap.from(cards, {
          scrollTrigger: { trigger: featuresRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          y: 64,
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        })
      }

      // Menu section: heading + cards stagger
      if (menuSectionRef.current) {
        if (menuHeadingRef.current) {
          gsap.from(menuHeadingRef.current.children, {
            scrollTrigger: { trigger: menuSectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
            y: 36,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          })
        }
        if (menuCardsRef.current?.children?.length) {
          gsap.from(menuCardsRef.current.children, {
            scrollTrigger: { trigger: menuSectionRef.current, start: 'top 78%', toggleActions: 'play none none reverse' },
            y: 44,
            opacity: 0,
            duration: 0.65,
            stagger: 0.06,
            ease: 'power3.out',
          })
        }
      }

      // Contact: heading + form stagger
      if (contactSectionRef.current) {
        if (contactHeadingRef.current) {
          gsap.from(contactHeadingRef.current.children, {
            scrollTrigger: { trigger: contactSectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
            y: 32,
            opacity: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: 'power3.out',
          })
        }
        if (contactFormRef.current) {
          gsap.from(contactFormRef.current, {
            scrollTrigger: { trigger: contactSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
            y: 36,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
          })
          const fields = contactFormRef.current.querySelectorAll('div')
          if (fields.length) {
            gsap.from(fields, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              stagger: 0.06,
              delay: 0.25,
              ease: 'power2.out',
              scrollTrigger: { trigger: contactSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
            })
          }
        }
      }

      // Menu cards: smooth scale on hover
      const menuCards = menuCardsRef.current?.children
      if (menuCards?.length) {
        Array.from(menuCards).forEach((card) => {
          const el = card as HTMLDivElement
          el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.02, duration: 0.35, ease: 'power2.out' }))
          el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.35, ease: 'power2.out' }))
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const onContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSubmitted(true)
    setContactFormData({ name: '', email: '', message: '' })
    setTimeout(() => setContactSubmitted(false), 3000)
  }
  const onContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900 placeholder-gray-500'

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Widget */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center bg-white text-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(220,38,38,0.08) 0%, transparent 50%)' }} />
        <div className="section-container relative z-10 w-full py-24 md:py-32">
          <div ref={heroContentRef} className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight flex flex-wrap gap-x-3 gap-y-1 text-gray-900">
              {(homeContent.heroWords.length ? homeContent.heroWords : ['Welcome', 'to', 'Veloria']).map((word, i) => (
                <span key={`${word}-${i}`} ref={(el) => { if (el) titleWordsRef.current[i] = el }} className="inline-block">
                  {word}
                </span>
              ))}
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl"
            >
              {homeContent.subtitle}
            </p>
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/book-a-table" className="btn-primary text-center">
                Reserve Your Table
              </Link>
              <Link href="/menu" className="btn-secondary text-center">
                View Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Section (editable in Admin > Home / Special Offer) */}
      {homeContent.discountVisible !== false && (
        <section ref={discountRef} className="py-12 md:py-16 bg-gray-100 border-y border-gray-200">
          <div className="section-container">
            <div className={`max-w-5xl mx-auto ${homeContent.discountImageBase64 ? 'flex flex-col md:flex-row md:items-center gap-8 md:gap-12' : 'text-center'}`}>
              {homeContent.discountImageBase64 && (
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={homeContent.discountImageBase64}
                    alt={homeContent.discountTitle ?? 'Special Offer'}
                    className="rounded-xl shadow-lg max-h-64 w-auto object-cover"
                  />
                </div>
              )}
              <div className={homeContent.discountImageBase64 ? 'flex-1 text-center md:text-left' : 'max-w-3xl mx-auto text-center'}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {homeContent.discountTitle ?? 'Special Offer'}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {homeContent.discountSubtitle ?? 'Enjoy 20% off your next dinner when you book online. Limited time only.'}
                </p>
                <Link
                  href={homeContent.discountCtaLink ?? '/book-a-table'}
                  className="btn-primary inline-block"
                >
                  {homeContent.discountCtaText ?? 'Book Now'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-white">
        <div className="section-container">
          <div ref={aboutContentRef} className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {homeContent.aboutTitle}
            </h2>
            <div ref={aboutLineRef} className="w-20 h-0.5 bg-primary-500 mx-auto mb-6" />
            <p className="text-lg text-gray-600 leading-relaxed">
              {homeContent.aboutText}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="section-container">
          <div
            ref={featureCardsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6">
              <div className="feature-icon-wrap w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {homeContent.feature1Title}
              </h3>
              <p className="text-gray-600">
                {homeContent.feature1Text}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="feature-icon-wrap w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {homeContent.feature2Title}
              </h3>
              <p className="text-gray-600">
                {homeContent.feature2Text}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="feature-icon-wrap w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {homeContent.feature3Title}
              </h3>
              <p className="text-gray-600">
                {homeContent.feature3Text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Section */}
      <section ref={menuSectionRef} className="py-20 bg-white">
        <div className="section-container">
          <div ref={menuHeadingRef} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{homeContent.menuSectionTitle}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {homeContent.menuSectionSubtitle}
            </p>
          </div>
          <div ref={menuCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-primary-500 font-bold text-lg">{formatPrice(item.price, currencySymbol)}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/menu" className="btn-secondary inline-block">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactSectionRef} className="py-20 bg-gray-50">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <div ref={contactHeadingRef} className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600">
                Have a question or feedback? Send us a message and we&apos;ll get back to you.
              </p>
            </div>
            <form
              ref={contactFormRef}
              onSubmit={onContactSubmit}
              className="bg-white border border-gray-200 rounded-lg p-8 space-y-6 shadow-sm"
            >
              <div>
                <label htmlFor="home-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="home-name"
                  name="name"
                  value={contactFormData.name}
                  onChange={onContactChange}
                  required
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="home-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="home-email"
                  name="email"
                  value={contactFormData.email}
                  onChange={onContactChange}
                  required
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="home-message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="home-message"
                  name="message"
                  value={contactFormData.message}
                  onChange={onContactChange}
                  required
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Your message..."
                />
              </div>
              {contactSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  Thank you! Your message has been sent.
                </div>
              )}
              <button type="submit" className="w-full btn-primary">
                Send Message
              </button>
            </form>
            <p className="text-center text-gray-600 mt-6">
              Prefer more options? <Link href="/contact" className="text-primary-500 hover:text-primary-600">Visit our full Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

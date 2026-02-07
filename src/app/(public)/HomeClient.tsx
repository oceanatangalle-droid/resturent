'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap, ScrollTrigger, ensureGSAP } from '@/lib/animations'
import { formatPrice } from '@/lib/formatPrice'
import { useSettings } from '@/contexts/SettingsContext'
import { useInView, useLoadMore } from '@/hooks/useInView'

export interface HomeContent {
  heroWords: string[]
  subtitle: string
  heroBackgroundImageBase64?: string
  heroRightImageBase64?: string
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

export interface FeaturedItem {
  id: string
  name: string
  description: string
  price: string
  category: string
}

const defaultHome: HomeContent = {
  heroWords: ['Welcome', 'to', 'Veloria'],
  subtitle: 'Experience exceptional cuisine in an elegant atmosphere. Where every meal is a celebration.',
  heroBackgroundImageBase64: '',
  heroRightImageBase64: '',
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

export default function HomeClient({
  initialHome,
  initialFeatured,
}: {
  initialHome: HomeContent
  initialFeatured: FeaturedItem[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
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
  const settings = useSettings()
  const currencySymbol = settings?.currencySymbol ?? '$'
  const [homeContent, setHomeContent] = useState<HomeContent>(() => initialHome ?? defaultHome)
  const [featuredMenuItems, setFeaturedMenuItems] = useState<FeaturedItem[]>(() => initialFeatured ?? defaultFeatured)
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactError, setContactError] = useState('')
  const [menuSectionInView, setMenuSectionInView] = useState(false)
  const [displayedFeaturedCount, setDisplayedFeaturedCount] = useState(3)
  const [reviewsInView, setReviewsInView] = useState(false)

  const [menuSectionInViewRef] = useInView(() => setMenuSectionInView(true))
  const [reviewsSectionRef] = useInView(() => setReviewsInView(true))
  const featuredLoadMore = useCallback(() => {
    setDisplayedFeaturedCount((c) => Math.min(c + 3, featuredMenuItems.length))
  }, [featuredMenuItems.length])
  const featuredLoadMoreRef = useLoadMore(featuredLoadMore, menuSectionInView && displayedFeaturedCount < featuredMenuItems.length)

  // Defer background refresh to idle so FCP/LCP aren't blocked
  useEffect(() => {
    const refresh = () => {
      Promise.all([
        fetch('/api/home').then((r) => r.ok ? r.json() : null),
        fetch('/api/menu/items').then((r) => r.ok ? r.json() : []),
      ]).then(([homeData, items]: [HomeContent | null, FeaturedItem[]]) => {
        if (homeData) setHomeContent(homeData)
        if (items?.length) setFeaturedMenuItems((prev) => items.slice(0, (homeData || defaultHome).featuredMenuLimit ?? 6))
      }).catch(() => {})
    }
    const id = typeof window.requestIdleCallback !== 'undefined'
      ? window.requestIdleCallback(refresh, { timeout: 2000 })
      : window.setTimeout(refresh, 500)
    return () => (typeof window.cancelIdleCallback !== 'undefined' ? window.cancelIdleCallback(id as number) : window.clearTimeout(id as number))
  }, [])

  useEffect(() => {
    let cancelled = false
    let ctx: { revert: () => void } | null = null
    const runAnimations = () => {
      ensureGSAP().then(() => {
        if (cancelled) return
        ctx = gsap.context(() => {
          gsap.fromTo(titleWordsRef.current, { y: 24, opacity: 1 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.1, overwrite: true })
          gsap.fromTo(subtitleRef.current, { y: 16, opacity: 1 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.35, overwrite: true })
          gsap.fromTo(buttonsRef.current?.children || [], { y: 12, opacity: 1 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.5, overwrite: true })
          if (discountRef.current) {
            gsap.from(discountRef.current, { scrollTrigger: { trigger: discountRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }, y: 32, opacity: 0, duration: 0.7, ease: 'power3.out' })
          }
          if (heroContentRef.current && heroRef.current) {
            gsap.to(heroContentRef.current, { y: 80, opacity: 0.4, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 } })
          }
          if (aboutRef.current && aboutContentRef.current) {
            if (aboutLineRef.current) gsap.fromTo(aboutLineRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: aboutRef.current, start: 'top 78%', toggleActions: 'play none none reverse' } })
            gsap.from(aboutContentRef.current.children, { scrollTrigger: { trigger: aboutRef.current, start: 'top 78%', toggleActions: 'play none none reverse' }, y: 48, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' })
          }
          if (featuresRef.current && featureCardsRef.current) {
            const cards = Array.from(featureCardsRef.current.children)
            cards.forEach((card) => {
              const icon = card.querySelector('.feature-icon-wrap')
              if (icon) gsap.from(icon, { scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' }, scale: 0, rotation: -12, duration: 0.6, ease: 'back.out(1.4)', delay: 0.1 })
            })
            gsap.from(cards, { scrollTrigger: { trigger: featuresRef.current, start: 'top 75%', toggleActions: 'play none none reverse' }, y: 64, opacity: 0, scale: 0.96, duration: 0.8, stagger: 0.12, ease: 'power3.out' })
          }
          if (menuSectionRef.current && menuHeadingRef.current) {
            gsap.from(menuHeadingRef.current.children, { scrollTrigger: { trigger: menuSectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' }, y: 36, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
          }
          if (menuCardsRef.current?.children?.length) {
            gsap.from(menuCardsRef.current.children, { scrollTrigger: { trigger: menuSectionRef.current, start: 'top 78%', toggleActions: 'play none none reverse' }, y: 44, opacity: 0, duration: 0.65, stagger: 0.06, ease: 'power3.out' })
            Array.from(menuCardsRef.current.children).forEach((card) => {
              const el = card as HTMLDivElement
              el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.02, duration: 0.35, ease: 'power2.out' }))
              el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.35, ease: 'power2.out' }))
            })
          }
          if (contactSectionRef.current) {
            if (contactHeadingRef.current) gsap.from(contactHeadingRef.current.children, { scrollTrigger: { trigger: contactSectionRef.current, start: 'top 82%', toggleActions: 'play none none reverse' }, y: 32, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' })
            if (contactFormRef.current) {
              gsap.from(contactFormRef.current, { scrollTrigger: { trigger: contactSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 36, opacity: 0, duration: 0.75, ease: 'power3.out' })
            }
          }
        }, containerRef)
      })
    }
    const id = typeof window.requestIdleCallback !== 'undefined' ? window.requestIdleCallback(runAnimations, { timeout: 400 }) : window.setTimeout(runAnimations, 100)
    return () => {
      cancelled = true
      if (typeof window.cancelIdleCallback !== 'undefined') window.cancelIdleCallback(id as number)
      else window.clearTimeout(id as number)
      ctx?.revert()
    }
  }, [])

  useEffect(() => {
    if (!menuSectionInView) return
    let cancelled = false
    ensureGSAP().then(() => {
      if (cancelled) return
      if (menuHeadingRef.current) gsap.from(menuHeadingRef.current.children, { y: 32, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' })
      if (menuCardsRef.current?.children?.length) gsap.from(menuCardsRef.current.children, { y: 24, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' })
    })
    return () => { cancelled = true }
  }, [menuSectionInView])

  const onContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError('')
    setContactSubmitted(true)
    try {
      const res = await fetch('/api/contact-submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactFormData) })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setContactFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setContactSubmitted(false), 5000)
      } else {
        setContactError(data.error || 'Something went wrong. Please try again.')
        setContactSubmitted(false)
      }
    } catch {
      setContactError('Something went wrong. Please check your connection.')
      setContactSubmitted(false)
    }
  }
  const onContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-gray-900 placeholder-gray-500'

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      <section ref={heroRef} className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] flex items-center text-gray-900 overflow-hidden">
        {/* Background image (from admin) or fallback gradient */}
        {homeContent.heroBackgroundImageBase64 && homeContent.heroBackgroundImageBase64.startsWith('data:') ? (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${homeContent.heroBackgroundImageBase64})` }} aria-hidden />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" aria-hidden />
        )}
        {/* 30% black overlay (only when background image is set) */}
        {homeContent.heroBackgroundImageBase64 && homeContent.heroBackgroundImageBase64.startsWith('data:') && (
          <div className="absolute inset-0 bg-black/30" aria-hidden />
        )}
        <div className="section-container relative z-10 w-full py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            <div ref={heroContentRef} className="max-w-3xl w-full lg:col-span-7">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 ${homeContent.heroBackgroundImageBase64 && homeContent.heroBackgroundImageBase64.startsWith('data:') ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>
                {(homeContent.heroWords.length ? homeContent.heroWords : ['Welcome', 'to', 'Veloria']).map((word, i) => (
                  <span key={`${word}-${i}`} ref={(el) => { if (el) titleWordsRef.current[i] = el }} className="inline-block">{word}</span>
                ))}
              </h1>
              <p ref={subtitleRef} className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-2xl ${homeContent.heroBackgroundImageBase64 && homeContent.heroBackgroundImageBase64.startsWith('data:') ? 'text-gray-200 drop-shadow' : 'text-gray-600'}`}>{homeContent.subtitle}</p>
              <div ref={buttonsRef} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/book-a-table" className="btn-primary text-center">Reserve Your Table</Link>
                  <Link href="/menu" className={`text-center rounded-lg font-semibold px-6 py-3 transition-colors ${homeContent.heroBackgroundImageBase64 && homeContent.heroBackgroundImageBase64.startsWith('data:') ? 'btn-secondary border-white/80 text-white hover:bg-white/10' : 'btn-secondary'}`}>View Our Menu</Link>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button type="button" onClick={() => document.getElementById('reviews-tripadvisor')?.scrollIntoView({ behavior: 'smooth' })} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00AF87]" style={{ backgroundColor: '#00AF87' }} aria-label="Scroll to TripAdvisor reviews">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" aria-hidden><path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l2.363 2.638a.582.582 0 0 1-.375.958H.192v3.016h1.15a.582.582 0 0 1 .375.957L0 14.875h4.361a8.385 8.385 0 0 0 7.645 5.083 8.385 8.385 0 0 0 7.646-5.083h4.36l-2.362-2.638a.582.582 0 0 1 .375-.957h1.15V8.244h-1.15a.582.582 0 0 1-.375-.958L24 4.295h-4.361a8.385 8.385 0 0 0-7.633-5.083zm-.027 10.652a3.313 3.313 0 1 1 0-6.626 3.313 3.313 0 0 1 0 6.626zm7.646-3.313a3.313 3.313 0 1 1 0-6.626 3.313 3.313 0 0 1 0 6.626z" /></svg>
                  </button>
                  <button type="button" onClick={() => document.getElementById('reviews-google')?.scrollIntoView({ behavior: 'smooth' })} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 bg-white/90 border border-white" aria-label="Scroll to Google reviews">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  </button>
                </div>
              </div>
            </div>
            {homeContent.heroRightImageBase64 && homeContent.heroRightImageBase64.startsWith('data:') && (
              <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
                <div className="relative w-full max-w-md aspect-[4/5] rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                  <img src={homeContent.heroRightImageBase64} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="reviews-google" ref={reviewsSectionRef} className="py-8 sm:py-12 md:py-16 bg-white border-y border-gray-200 overflow-hidden scroll-mt-20 content-visibility-auto">
        <div className="section-container min-h-[200px]">
          {reviewsInView && (<><Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" /><div className="elfsight-app-d90e30fa-b02f-4784-abda-018adaadb207" data-elfsight-app-lazy /></>)}
        </div>
      </section>

      {homeContent.discountVisible !== false && (
        <section ref={discountRef} className="py-8 sm:py-12 md:py-16 bg-gray-100 border-y border-gray-200 content-visibility-auto">
          <div className="section-container">
            <div className={`max-w-5xl mx-auto ${homeContent.discountImageBase64 ? 'flex flex-col md:flex-row md:items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12' : 'text-center'}`}>
              {homeContent.discountImageBase64 && (
                <div className="flex-shrink-0 mx-auto md:mx-0 w-full max-w-[280px] sm:max-w-xs md:w-[38%] md:max-w-[360px] aspect-[4/3] min-h-[180px]">
                  <img src={homeContent.discountImageBase64} alt={homeContent.discountTitle ?? 'Special Offer'} width={360} height={270} className="rounded-xl shadow-lg max-h-48 sm:max-h-56 md:max-h-64 w-full h-auto object-cover" />
                </div>
              )}
              <div className={homeContent.discountImageBase64 ? 'flex-1 min-w-0 text-center md:text-left' : 'max-w-3xl mx-auto text-center'}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{homeContent.discountTitle ?? 'Special Offer'}</h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{homeContent.discountSubtitle ?? 'Enjoy 20% off your next dinner when you book online. Limited time only.'}</p>
                <Link href={homeContent.discountCtaLink ?? '/book-a-table'} className="btn-primary inline-block">{homeContent.discountCtaText ?? 'Book Now'}</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="reviews-tripadvisor" className="py-8 sm:py-12 md:py-16 bg-white border-y border-gray-200 overflow-hidden scroll-mt-20 content-visibility-auto">
        <div className="section-container"><div className="elfsight-app-b29f3b82-39f0-432b-a569-e92275647c5b" data-elfsight-app-lazy /></div>
      </section>

      <section ref={aboutRef} className="py-12 sm:py-16 md:py-20 bg-white content-visibility-auto">
        <div className="section-container">
          <div ref={aboutContentRef} className="max-w-3xl mx-auto text-center w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">{homeContent.aboutTitle}</h2>
            <div ref={aboutLineRef} className="w-20 h-0.5 bg-primary-500 mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed px-0">{homeContent.aboutText}</p>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-12 sm:py-16 md:py-20 bg-gray-50 content-visibility-auto">
        <div className="section-container">
          <div ref={featureCardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="feature-icon-wrap w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{homeContent.feature1Title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{homeContent.feature1Text}</p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="feature-icon-wrap w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{homeContent.feature2Title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{homeContent.feature2Text}</p>
            </div>
            <div className="text-center p-4 sm:p-6 sm:col-span-2 md:col-span-1">
              <div className="feature-icon-wrap w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">{homeContent.feature3Title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{homeContent.feature3Text}</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={menuSectionRef} className="py-12 sm:py-16 md:py-20 bg-white content-visibility-auto">
        <div className="section-container" ref={menuSectionInViewRef}>
          {!menuSectionInView ? (
            <div className="min-h-[320px] flex items-center justify-center" aria-hidden />
          ) : (
            <>
              <div ref={menuHeadingRef} className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{homeContent.menuSectionTitle}</h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-1">{homeContent.menuSectionSubtitle}</p>
              </div>
              <div ref={menuCardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {featuredMenuItems.slice(0, displayedFeaturedCount).map((item) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors duration-200 min-w-0 min-h-[140px]">
                    <div className="flex justify-between items-start gap-2 mb-2 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate min-w-0">{item.name}</h3>
                      <span className="text-primary-500 font-bold text-base sm:text-lg flex-shrink-0">{formatPrice(item.price, currencySymbol)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</span>
                  </div>
                ))}
              </div>
              {displayedFeaturedCount < featuredMenuItems.length && <div ref={featuredLoadMoreRef as React.RefObject<HTMLDivElement>} className="h-4 w-full" aria-hidden />}
              <div className="text-center mt-6 sm:mt-10"><Link href="/menu" className="btn-secondary inline-block">View Full Menu</Link></div>
            </>
          )}
        </div>
      </section>

      <section ref={contactSectionRef} className="py-12 sm:py-16 md:py-20 bg-gray-50 content-visibility-auto">
        <div className="section-container">
          <div className="max-w-2xl mx-auto w-full">
            <div ref={contactHeadingRef} className="text-center mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get in Touch</h2>
              <p className="text-base sm:text-lg text-gray-600">Have a question or feedback? Send us a message and we&apos;ll get back to you.</p>
            </div>
            <form ref={contactFormRef} onSubmit={onContactSubmit} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-sm" noValidate>
              <div><label htmlFor="home-name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label><input type="text" id="home-name" name="name" value={contactFormData.name} onChange={onContactChange} required className={inputClass} placeholder="Your full name" aria-required="true" /></div>
              <div><label htmlFor="home-email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" id="home-email" name="email" value={contactFormData.email} onChange={onContactChange} required className={inputClass} placeholder="you@example.com" aria-required="true" /></div>
              <div><label htmlFor="home-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="tel" id="home-phone" name="phone" value={contactFormData.phone} onChange={onContactChange} className={inputClass} placeholder="(555) 000-0000" /></div>
              <div><label htmlFor="home-message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label><textarea id="home-message" name="message" value={contactFormData.message} onChange={onContactChange} required rows={5} className={`${inputClass} resize-none`} placeholder="How can we help you?" aria-required="true" /></div>
              {contactError && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm" role="alert">{contactError}</div>}
              {contactSubmitted && !contactError && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm" role="status">Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</div>}
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 disabled:opacity-70" disabled={contactSubmitted}>{contactSubmitted ? 'Sent' : 'Send Message'}</button>
            </form>
            <p className="text-center text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base">Prefer more options? <Link href="/contact" className="text-primary-500 hover:text-primary-600">Visit our full Contact page</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

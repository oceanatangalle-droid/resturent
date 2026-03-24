'use client'

import { useEffect, useRef } from 'react'
import { gsap, ensureGSAP } from '@/lib/animations'

interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    let cancelled = false
    ensureGSAP().then(() => {
      if (cancelled || !sectionRef.current) return
      gsap.fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 })
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0, transformOrigin: 'center' }, { scaleX: 1, duration: 0.6, ease: 'power2.out', delay: 0.35 })
      }
      gsap.fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.45 })
    })
    return () => { cancelled = true }
  }, [])

  return (
    <section ref={sectionRef} className="bg-white text-gray-900 py-12 sm:py-16 md:py-20 border-b border-gray-100">
      <div className="section-container text-center w-full">
        <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tighter text-gray-900 px-1">
          {title}
        </h1>
        <div ref={lineRef} className="w-20 h-0.5 bg-primary-600 mx-auto mb-5 sm:mb-6" />
        <p ref={subtitleRef} className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto px-2 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  )
}

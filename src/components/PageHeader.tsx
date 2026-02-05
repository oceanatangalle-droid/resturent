'use client'

import { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '@/lib/animations'

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
    registerGSAP()
    if (!sectionRef.current) return
    gsap.fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 })
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleX: 0, transformOrigin: 'center' }, { scaleX: 1, duration: 0.6, ease: 'power2.out', delay: 0.35 })
    }
    gsap.fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.45 })
  }, [])

  return (
    <section ref={sectionRef} className="bg-white text-gray-900 py-10 sm:py-12 md:py-16 border-b border-gray-100">
      <div className="section-container text-center w-full">
        <h1 ref={titleRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 px-1">
          {title}
        </h1>
        <div ref={lineRef} className="w-16 h-0.5 bg-primary-500 mx-auto mb-3 sm:mb-4" />
        <p ref={subtitleRef} className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
          {subtitle}
        </p>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, ensureGSAP } from '@/lib/animations'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  sortOrder: number
  caption?: string
  imageBase64?: string
  imageUrl?: string
  videoYoutubeUrl?: string
  videoUrl?: string
}

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm aspect-[4/3] flex flex-col">
      {item.type === 'image' ? (
        <>
          {item.imageBase64 && item.imageBase64.startsWith('data:') ? (
            <img src={item.imageBase64} alt={item.caption ?? 'Gallery'} className="w-full h-full object-cover" />
          ) : item.imageUrl ? (
            <img src={item.imageUrl} alt={item.caption ?? 'Gallery'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
            </div>
          )}
        </>
      ) : (
        <div className="relative w-full h-full min-h-[200px] bg-black">
          {item.videoYoutubeUrl ? (() => {
            const m = item.videoYoutubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
            const vid = m ? m[1] : null
            return vid ? (
              <iframe
                src={`https://www.youtube.com/embed/${vid}?rel=0`}
                title={item.caption ?? 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
            )
          })() : item.videoUrl ? (
            <video
              src={item.videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
          )}
        </div>
      )}
      {item.caption && (
        <p className="p-3 text-sm text-gray-600 text-center border-t border-gray-200">{item.caption}</p>
      )}
    </div>
  )
}

export default function GalleryClient({ initialGallery }: { initialGallery: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialGallery)
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.ok ? r.json() : [])
      .then((list) => Array.isArray(list) && setItems(list))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    let ctx: { revert: () => void } | null = null
    ensureGSAP().then(() => {
      if (cancelled || !sectionRef.current || !gridRef.current?.children.length) return
      ctx = gsap.context(() => {
        gsap.from(gridRef.current!.children, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        })
      }, sectionRef)
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [items.length])

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Gallery"
        subtitle="Photos and videos from our restaurant"
      />
      <section ref={sectionRef} className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="section-container w-full">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">No photos or videos yet. Check back soon.</p>
              <Link href="/" className="btn-secondary inline-block">Back to Home</Link>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

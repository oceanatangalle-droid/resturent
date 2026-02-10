'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap, ScrollTrigger, ensureGSAP } from '@/lib/animations'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import GalleryLightbox, { type GalleryLightboxItem } from '@/components/GalleryLightbox'

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

// Album row pattern: 3 items, 2 big, 3 items, 3, 2 big, 3... (like the reference HTML)
function chunkAlbum(items: GalleryItem[]): GalleryItem[][] {
  const rows: GalleryItem[][] = []
  const pattern = [3, 2, 3]
  let i = 0
  while (i < items.length) {
    const size = pattern[rows.length % pattern.length]
    rows.push(items.slice(i, i + size))
    i += size
  }
  return rows
}

function GalleryCard({
  item,
  size,
  onClick,
}: {
  item: GalleryItem
  size: 'normal' | 'big'
  onClick: () => void
}) {
  const lightboxItem: GalleryLightboxItem = {
    type: item.type,
    caption: item.caption,
    imageBase64: item.imageBase64,
    imageUrl: item.imageUrl,
    videoYoutubeUrl: item.videoYoutubeUrl,
    videoUrl: item.videoUrl,
  }

  const isImage = item.type === 'image'
  const imgSrc = isImage ? (item.imageBase64 && item.imageBase64.startsWith('data:') ? item.imageBase64 : item.imageUrl) : null
  const ytId = !isImage && item.videoYoutubeUrl ? item.videoYoutubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] : null

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        size === 'big' ? 'min-h-[240px] sm:min-h-[280px]' : 'min-h-[180px] sm:min-h-[200px]'
      }`}
    >
      <div className="w-full h-full min-h-[160px] sm:min-h-[180px] flex items-center justify-center overflow-hidden bg-gray-200">
        {isImage && imgSrc ? (
          <img
            src={imgSrc}
            alt={item.caption ?? 'Gallery'}
            className="w-full h-full object-contain"
          />
        ) : !isImage && ytId ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
              alt=""
              className="w-full h-full object-contain"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full w-16 h-16 mx-auto my-auto">
              <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        ) : !isImage && item.videoUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
        )}
      </div>
      {item.caption && (
        <p className="p-2 sm:p-3 text-sm text-gray-600 text-center border-t border-gray-200 bg-white">
          {item.caption}
        </p>
      )}
    </button>
  )
}

export default function GalleryClient({ initialGallery }: { initialGallery: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialGallery)
  const [lightboxItem, setLightboxItem] = useState<GalleryLightboxItem | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const albumRef = useRef<HTMLDivElement>(null)

  const rows = useMemo(() => chunkAlbum(items), [items])

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
      if (cancelled || !sectionRef.current || !albumRef.current?.children.length) return
      ctx = gsap.context(() => {
        gsap.from(albumRef.current!.children, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        })
      }, sectionRef)
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [items.length])

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem({
      type: item.type,
      caption: item.caption,
      imageBase64: item.imageBase64,
      imageUrl: item.imageUrl,
      videoYoutubeUrl: item.videoYoutubeUrl,
      videoUrl: item.videoUrl,
    })
    setLightboxOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Gallery"
        subtitle="Photos and videos from our restaurant"
      />
      <section ref={sectionRef} className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="section-container w-full max-w-6xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">No photos or videos yet. Check back soon.</p>
              <Link href="/" className="btn-secondary inline-block">Back to Home</Link>
            </div>
          ) : (
            <div ref={albumRef} className="album space-y-4 sm:space-y-6">
              {rows.map((row, rowIndex) => {
                const isBigRow = row.length === 2
                return (
                  <div
                    key={rowIndex}
                    className={`responsive-container-block img-cont grid gap-3 sm:gap-4 w-full ${
                      isBigRow ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
                    }`}
                  >
                    {row.map((item) => (
                      <div key={item.id} className={isBigRow ? 'img img-big' : 'img'}>
                        <GalleryCard
                          item={item}
                          size={isBigRow ? 'big' : 'normal'}
                          onClick={() => openLightbox(item)}
                        />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <GalleryLightbox
        item={lightboxItem}
        open={lightboxOpen}
        onClose={() => {
          setLightboxOpen(false)
          setLightboxItem(null)
        }}
      />
    </div>
  )
}

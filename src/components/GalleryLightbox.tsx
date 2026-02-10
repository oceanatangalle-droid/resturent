'use client'

import { useEffect, useCallback } from 'react'

export interface GalleryLightboxItem {
  type: 'image' | 'video'
  caption?: string
  imageBase64?: string
  imageUrl?: string
  videoYoutubeUrl?: string
  videoUrl?: string
}

interface GalleryLightboxProps {
  item: GalleryLightboxItem | null
  open: boolean
  onClose: () => void
}

function getYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  const m = url.trim().match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function GalleryLightbox({ item, open, onClose }: GalleryLightboxProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  if (!open || !item) return null

  const isImage = item.type === 'image'
  const imgSrc = isImage ? (item.imageBase64 && item.imageBase64.startsWith('data:') ? item.imageBase64 : item.imageUrl) : null
  const ytId = !isImage && item.videoYoutubeUrl ? getYouTubeId(item.videoYoutubeUrl) : null
  const videoUrl = !isImage ? item.videoUrl : null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? (isImage ? 'View image' : 'View video')}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 sm:right-0 sm:-top-14 z-10 w-10 h-10 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isImage && imgSrc && (
          <img
            src={imgSrc}
            alt={item.caption ?? 'Gallery'}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {!isImage && ytId && (
          <div className="w-full aspect-video max-h-[85vh] rounded-lg overflow-hidden shadow-2xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={item.caption ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {!isImage && !ytId && videoUrl && (
          <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl bg-black">
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[85vh] object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {item.caption && (
          <p className="absolute bottom-0 left-0 right-0 py-2 px-4 text-center text-white text-sm bg-black/50 rounded-b-lg">
            {item.caption}
          </p>
        )}
      </div>
    </div>
  )
}

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
  const isVideo = item.type === 'video'
  const ytId = isVideo && item.videoYoutubeUrl ? getYouTubeId(item.videoYoutubeUrl) : null
  const videoUrl = isVideo && item.videoUrl ? item.videoUrl.trim() : null
  const hasVideoSource = Boolean(ytId || videoUrl)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? (isImage ? 'View image' : 'View video')}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-14 z-10 w-10 h-10 rounded-full bg-white/90 text-gray-800 flex items-center justify-center hover:bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
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

        {isVideo && ytId && (
          <div className="w-full aspect-video max-h-[85vh] rounded-lg overflow-hidden shadow-2xl bg-black flex-shrink-0">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={item.caption ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full min-h-[200px]"
            />
          </div>
        )}

        {isVideo && !ytId && videoUrl && (
          <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl bg-black flex-shrink-0">
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              playsInline
              preload="auto"
              className="w-full max-h-[85vh] object-contain"
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-center py-2 text-white/80 text-xs">
              If the video does not play,{' '}
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="underline">
                open it in a new tab
              </a>
              .
            </p>
          </div>
        )}

        {isVideo && !hasVideoSource && (
          <div className="rounded-lg bg-gray-800/90 px-6 py-8 text-center text-white max-w-md">
            <p className="text-sm mb-4">This video could not be loaded.</p>
            {(item.videoYoutubeUrl || item.videoUrl) && (
              <a
                href={item.videoYoutubeUrl || item.videoUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 underline text-sm"
              >
                Open link in new tab
              </a>
            )}
          </div>
        )}

        {item.caption && (
          <p className="mt-3 text-center text-white text-sm bg-black/50 rounded-lg py-2 px-4 w-full max-w-2xl">
            {item.caption}
          </p>
        )}
      </div>
    </div>
  )
}

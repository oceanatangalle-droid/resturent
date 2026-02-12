'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import type { GalleryItem } from '@/lib/store'

function getYouTubeId(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  const m = url.trim().match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  // Add form state
  const [imageUpload, setImageUpload] = useState<string>('')
  const [imageLink, setImageLink] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [videoYtLink, setVideoYtLink] = useState('')
  const [videoDirectLink, setVideoDirectLink] = useState('')
  const [videoCaption, setVideoCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadItems = () => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved('')
    const imageBase64 = imageUpload.trim() || undefined
    const imageUrl = imageLink.trim() || undefined
    if (!imageBase64 && !imageUrl) {
      setError('Add an image by uploading a file or pasting an image URL.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          caption: imageCaption.trim() || undefined,
          imageBase64: imageBase64 || undefined,
          imageUrl: imageUrl || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to add image.')
        setSubmitting(false)
        return
      }
      setSaved('Image added.')
      setImageUpload('')
      setImageLink('')
      setImageCaption('')
      loadItems()
      setTimeout(() => setSaved(''), 3000)
    } catch {
      setError('Something went wrong.')
    }
    setSubmitting(false)
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved('')
    const yt = videoYtLink.trim()
    const direct = videoDirectLink.trim()
    if (!yt && !direct) {
      setError('Enter a YouTube link or a direct video URL (e.g. .mp4).')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video',
          caption: videoCaption.trim() || undefined,
          videoYoutubeUrl: yt || undefined,
          videoUrl: direct || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to add video.')
        setSubmitting(false)
        return
      }
      setSaved('Video added.')
      setVideoYtLink('')
      setVideoDirectLink('')
      setVideoCaption('')
      loadItems()
      setTimeout(() => setSaved(''), 3000)
    } catch {
      setError('Something went wrong.')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this item from the gallery?')) return
    setError('')
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== id))
        setSaved('Item removed.')
        setTimeout(() => setSaved(''), 3000)
      } else {
        setError('Failed to delete.')
      }
    } catch {
      setError('Something went wrong.')
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        subtitle="Add photos and videos to the gallery on your site. Images can be uploaded (stored in high quality) or added by link. Videos: YouTube link or direct video URL."
      />

      <div className="space-y-8 max-w-2xl">
        {/* Add Image */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Add image</h2>
          <p className="text-xs text-zinc-500 mb-4">
            Upload a file (saved at full quality in the database) or paste an image URL. On Vercel, large uploads may hit size limits—use &quot;Or image URL&quot; for big images.
          </p>
          <form onSubmit={handleAddImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Upload image</label>
              {imageUpload ? (
                <div className="space-y-2">
                  <div className="relative inline-block rounded-lg overflow-hidden border border-zinc-600 max-w-xs max-h-40">
                    <img src={imageUpload} alt="Preview" className="max-h-40 w-auto object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <label className="px-3 py-2 rounded-lg bg-zinc-700 text-zinc-200 text-sm font-medium cursor-pointer hover:bg-zinc-600 transition-colors">
                      Change
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = () => {
                            const r = reader.result
                            if (typeof r === 'string') setImageUpload(r)
                          }
                          reader.readAsDataURL(file)
                          e.target.value = ''
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageUpload('')}
                      className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <span className="text-sm text-zinc-400">Upload image (max quality stored)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = () => {
                        const r = reader.result
                        if (typeof r === 'string') setImageUpload(r)
                      }
                      reader.readAsDataURL(file)
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Or image URL</label>
              <input
                type="url"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                className={inputClass}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Caption (optional)</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                className={inputClass}
                placeholder="Caption"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || (!imageUpload && !imageLink.trim())}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add image'}
            </button>
          </form>
        </div>

        {/* Add Video */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Add video</h2>
          <p className="text-xs text-zinc-500 mb-4">
            YouTube link (e.g. https://www.youtube.com/watch?v=...) or direct video URL (.mp4, .webm).
          </p>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">YouTube link</label>
              <input
                type="url"
                value={videoYtLink}
                onChange={(e) => setVideoYtLink(e.target.value)}
                className={inputClass}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Or direct video URL</label>
              <input
                type="url"
                value={videoDirectLink}
                onChange={(e) => setVideoDirectLink(e.target.value)}
                className={inputClass}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Caption (optional)</label>
              <input
                type="text"
                value={videoCaption}
                onChange={(e) => setVideoCaption(e.target.value)}
                className={inputClass}
                placeholder="Caption"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || (!videoYtLink.trim() && !videoDirectLink.trim())}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add video'}
            </button>
          </form>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {saved}
          </div>
        )}

        {/* List */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Gallery items ({items.length})</h2>
          {loading ? (
            <p className="text-zinc-400 text-sm">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-zinc-500 text-sm">No items yet. Add an image or video above.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const ytId = item.type === 'video' ? getYouTubeId(item.videoYoutubeUrl) : null
                const videoThumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null
                return (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700"
                >
                  <div className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
                    {item.type === 'image' ? (
                      item.imageBase64 ? (
                        <img src={item.imageBase64} alt="" className="w-full h-full object-contain" />
                      ) : item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-zinc-500 text-xs">Image</span>
                      )
                    ) : videoThumbUrl ? (
                      <div className="relative w-full h-full">
                        <img src={videoThumbUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <span className="text-xs">Video</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {item.type === 'image' ? 'Image' : 'Video'}
                      {item.caption ? ` — ${item.caption}` : ''}
                    </p>
                    {item.type === 'video' && (
                      <p className="text-xs text-zinc-500 truncate mt-1" title={item.videoYoutubeUrl || item.videoUrl || ''}>
                        {item.videoYoutubeUrl ? 'YouTube' : item.videoUrl ? 'Direct video' : '—'}
                        {item.videoYoutubeUrl && item.videoUrl ? ' + direct' : ''}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="self-start sm:self-center px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              );})}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

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

export default function AdminHome() {
  const [data, setData] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setError('')
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        setError('Failed to save. Please try again.')
        setSaving(false)
        return
      }
      setSaved(true)
      setSaving(false)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Something went wrong. Please check your connection.')
      setSaving(false)
    }
  }

  const update = (key: keyof HomeContent, value: string | number | string[] | boolean) => {
    if (data) setData({ ...data, [key]: value })
  }

  if (loading || !data) {
    return (
      <div>
        <AdminPageHeader title="Home" subtitle="Edit home page content." />
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

  const sectionClass = 'border-b border-zinc-800 pb-6 last:border-0 last:pb-0'
  const sectionTitle = 'text-base font-semibold text-white mb-4'

  return (
    <div>
      <AdminPageHeader
        title="Home page content"
        subtitle="Edit hero, about, features, and menu section text."
      />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Saved successfully.
            </div>
          )}

          <section className={sectionClass}>
            <h2 className={sectionTitle}>Hero</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Hero title words (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(data.heroWords) ? data.heroWords.join(', ') : ''}
                  onChange={(e) => update('heroWords', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  className={inputClass}
                  placeholder="Welcome, to, Veloria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={data.subtitle}
                  onChange={(e) => update('subtitle', e.target.value)}
                  className={inputClass}
                  placeholder="Experience exceptional cuisine..."
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitle}>Special Offer (below hero on home page)</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.discountVisible !== false}
                  onChange={(e) => update('discountVisible', e.target.checked)}
                  className="rounded border-zinc-600 bg-zinc-800 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-zinc-300">Show Special Offer section on home page</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Offer image (optional)</label>
                <p className="text-xs text-zinc-500 mb-2">Upload an image to display in the Special Offer section. JPG or PNG, recommended max 1200×600px.</p>
                {data.discountImageBase64 ? (
                  <div className="space-y-2">
                    <div className="relative inline-block rounded-lg overflow-hidden border border-zinc-600 max-w-md">
                      <img
                        src={data.discountImageBase64}
                        alt="Special Offer"
                        className="max-h-48 w-auto object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className="px-3 py-2 rounded-lg bg-zinc-700 text-zinc-200 text-sm font-medium cursor-pointer hover:bg-zinc-600 transition-colors">
                        Change image
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            const reader = new FileReader()
                            reader.onload = () => {
                              const result = reader.result
                              if (typeof result === 'string') update('discountImageBase64', result)
                            }
                            reader.readAsDataURL(file)
                            e.target.value = ''
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => update('discountImageBase64', '')}
                        className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                    <span className="text-sm text-zinc-400">Click to upload image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          const result = reader.result
                          if (typeof result === 'string') update('discountImageBase64', result)
                        }
                        reader.readAsDataURL(file)
                        e.target.value = ''
                      }}
                    />
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Offer title</label>
                <input
                  type="text"
                  value={data.discountTitle ?? ''}
                  onChange={(e) => update('discountTitle', e.target.value)}
                  className={inputClass}
                  placeholder="Special Offer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Offer subtitle / description</label>
                <textarea
                  value={data.discountSubtitle ?? ''}
                  onChange={(e) => update('discountSubtitle', e.target.value)}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="Enjoy 20% off your next dinner when you book online. Limited time only."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Button text</label>
                <input
                  type="text"
                  value={data.discountCtaText ?? ''}
                  onChange={(e) => update('discountCtaText', e.target.value)}
                  className={inputClass}
                  placeholder="Book Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Button link</label>
                <input
                  type="text"
                  value={data.discountCtaLink ?? ''}
                  onChange={(e) => update('discountCtaLink', e.target.value)}
                  className={inputClass}
                  placeholder="/book-a-table"
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitle}>About section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">About title</label>
                <input
                  type="text"
                  value={data.aboutTitle}
                  onChange={(e) => update('aboutTitle', e.target.value)}
                  className={inputClass}
                  placeholder="About Veloria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">About text</label>
                <textarea
                  value={data.aboutText}
                  onChange={(e) => update('aboutText', e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="At Veloria, we believe..."
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitle}>Features (3 cards)</h2>
            <div className="space-y-4">
              {([1, 2, 3] as const).map((n) => (
                <div key={n} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Feature {n} title</label>
                    <input
                      type="text"
                      value={data[`feature${n}Title` as keyof HomeContent] as string}
                      onChange={(e) => update(`feature${n}Title` as keyof HomeContent, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Feature {n} text</label>
                    <textarea
                      value={data[`feature${n}Text` as keyof HomeContent] as string}
                      onChange={(e) => update(`feature${n}Text` as keyof HomeContent, e.target.value)}
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitle}>Featured menu section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Section title</label>
                <input
                  type="text"
                  value={data.menuSectionTitle}
                  onChange={(e) => update('menuSectionTitle', e.target.value)}
                  className={inputClass}
                  placeholder="Featured from Our Menu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Section subtitle</label>
                <input
                  type="text"
                  value={data.menuSectionSubtitle}
                  onChange={(e) => update('menuSectionSubtitle', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Number of items to show on home</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={data.featuredMenuLimit}
                  onChange={(e) => update('featuredMenuLimit', parseInt(e.target.value, 10) || 6)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface BrandingData {
  faviconBase64: string
  logoBase64: string
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminBranding() {
  const [data, setData] = useState<BrandingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/site/branding')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ faviconBase64: '', logoBase64: '' }))
      .finally(() => setLoading(false))
  }, [])

  const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !data) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, ICO, etc.)')
      return
    }
    setError('')
    try {
      const dataUrl = await fileToDataUrl(file)
      setData({ ...data, faviconBase64: dataUrl })
    } catch {
      setError('Failed to read favicon file')
    }
    e.target.value = ''
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !data) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, SVG, etc.)')
      return
    }
    setError('')
    try {
      const dataUrl = await fileToDataUrl(file)
      setData({ ...data, logoBase64: dataUrl })
    } catch {
      setError('Failed to read logo file')
    }
    e.target.value = ''
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setError('')
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/site/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faviconBase64: data.faviconBase64,
          logoBase64: data.logoBase64,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Failed to save')
        setSaving(false)
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Something went wrong')
    }
    setSaving(false)
  }

  const clearFavicon = () => {
    if (data) setData({ ...data, faviconBase64: '' })
  }
  const clearLogo = () => {
    if (data) setData({ ...data, logoBase64: '' })
  }

  if (loading || !data) {
    return (
      <div>
        <AdminPageHeader title="Branding" subtitle="Favicon and logo." />
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Branding"
        subtitle="Upload favicon and logo. Images are stored in the database as base64 and shown on the site."
      />
      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Saved. Favicon and logo will appear on the site.
            </div>
          )}

          <div>
            <h2 className="text-base font-semibold text-white mb-3">Favicon</h2>
            <p className="text-sm text-zinc-400 mb-3">Browser tab icon. Use a small square image (e.g. 32×32 or 64×64 PNG/ICO).</p>
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaviconChange}
              className="hidden"
            />
            <div className="flex items-center gap-4 flex-wrap">
              {data.faviconBase64 ? (
                <>
                  <img src={data.faviconBase64} alt="Favicon preview" className="w-10 h-10 object-contain rounded border border-zinc-600 bg-white" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => faviconInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white">
                      Replace
                    </button>
                    <button type="button" onClick={clearFavicon} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700">
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={() => faviconInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white">
                  Upload favicon
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-white mb-3">Logo (navbar)</h2>
            <p className="text-sm text-zinc-400 mb-3">Logo shown in the site navigation bar. PNG, JPG, or SVG recommended.</p>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <div className="flex items-center gap-4 flex-wrap">
              {data.logoBase64 ? (
                <>
                  <img src={data.logoBase64} alt="Logo preview" className="h-10 max-w-[180px] object-contain object-left" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-700 hover:bg-zinc-600 text-white">
                      Replace
                    </button>
                    <button type="button" onClick={clearLogo} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-700">
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white">
                  Upload logo
                </button>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save branding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

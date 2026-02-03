'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface ContactInfo {
  heading: string
  intro: string
  address: string
  addressLine2: string
  phone: string
  email: string
  hours: string
}

export default function AdminContact() {
  const [data, setData] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/contact')
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
      const res = await fetch('/api/contact', {
        method: 'PUT',
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

  const update = (key: keyof ContactInfo, value: string) => {
    if (data) setData({ ...data, [key]: value })
  }

  if (loading || !data) {
    return (
      <div>
        <AdminPageHeader title="Contact" subtitle="Edit contact details." />
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

  return (
    <div>
      <AdminPageHeader
        title="Contact information"
        subtitle="Edit the contact details shown on the Contact page."
      />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
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
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Heading</label>
            <input
              type="text"
              value={data.heading}
              onChange={(e) => update('heading', e.target.value)}
              className={inputClass}
              placeholder="Get in Touch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Intro paragraph</label>
            <textarea
              value={data.intro}
              onChange={(e) => update('intro', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Have a question or want to make a reservation?"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Address line 1</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => update('address', e.target.value)}
                className={inputClass}
                placeholder="123 Restaurant Street"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Address line 2</label>
              <input
                type="text"
                value={data.addressLine2}
                onChange={(e) => update('addressLine2', e.target.value)}
                className={inputClass}
                placeholder="City, State 12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
                placeholder="info@veloria.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Hours <span className="text-zinc-500 font-normal">(one line per entry)</span>
            </label>
            <textarea
              value={data.hours}
              onChange={(e) => update('hours', e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Monday - Thursday: 5:00 PM - 10:00 PM"
            />
          </div>
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

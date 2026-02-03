'use client'

import { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface SiteSettings {
  currencySymbol: string
  currencyCode: string
}

const CURRENCY_OPTIONS: { code: string; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'LKR', symbol: 'Rs', label: 'Sri Lankan Rupee (Rs)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc (Fr)' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan (¥)' },
  { code: 'MXN', symbol: '$', label: 'Mexican Peso ($)' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real (R$)' },
  { code: 'KRW', symbol: '₩', label: 'South Korean Won (₩)' },
]

export default function AdminSettings() {
  const [data, setData] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
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
      const res = await fetch('/api/settings', {
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

  const setCurrency = (option: (typeof CURRENCY_OPTIONS)[0]) => {
    if (data) setData({ ...data, currencySymbol: option.symbol, currencyCode: option.code })
  }

  if (loading || !data) {
    return (
      <div>
        <AdminPageHeader title="Settings" subtitle="Site-wide settings." />
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
        title="Settings"
        subtitle="Change currency and other site options. Prices on the menu and home page will use the selected currency."
      />
      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Settings saved. Prices on the website will now show in the selected currency.
            </div>
          )}

          <section>
            <h2 className="text-base font-semibold text-white mb-4">Currency</h2>
            <p className="text-sm text-zinc-400 mb-3">
              Choose the currency symbol/code used for menu and featured item prices across the site.
            </p>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Currency</label>
            <select
              value={CURRENCY_OPTIONS.find((o) => o.code === data.currencyCode)?.code ?? data.currencyCode}
              onChange={(e) => {
                const option = CURRENCY_OPTIONS.find((o) => o.code === e.target.value)
                if (option) setCurrency(option)
              }}
              className={inputClass}
            >
              {CURRENCY_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500 mt-2">
              Preview: {data.currencySymbol}14 (single price), {data.currencySymbol}12–16 (range)
            </p>
          </section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

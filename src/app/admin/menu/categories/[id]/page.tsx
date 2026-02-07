'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default function EditCategory() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/menu/categories')
      .then((res) => res.json())
      .then((list: { id: string; name: string }[]) => {
        const cat = list.find((c) => c.id === id)
        if (cat) setName(cat.name)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`/api/menu/categories/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed')
        setSaving(false)
        return
      }
      router.push('/admin/menu')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

  if (loading) {
    return (
      <div>
        <Link href="/admin/menu" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
          ← Back to Menu
        </Link>
        <AdminPageHeader title="Edit category" subtitle="Loading..." />
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link href="/admin/menu" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
        ← Back to Menu
      </Link>
      <AdminPageHeader title="Edit category" subtitle="Update the category name." />
      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Category name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <Link
              href="/admin/menu"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-zinc-700 hover:bg-zinc-600 text-white transition-colors inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

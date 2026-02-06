'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Category {
  id: string
  name: string
}

const inputClass =
  'w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors'

export default function NewMenuItem() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/menu/categories')
      .then((res) => res.json())
      .then((list: Category[]) => {
        setCategories(list)
        if (list.length) setCategory((prev) => (prev ? prev : list[0].name))
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: price.trim(),
          category: category.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed')
        setLoading(false)
        return
      }
      router.push('/admin/menu')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/admin/menu" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
        ← Back to Menu
      </Link>
      <AdminPageHeader title="Add menu item" subtitle="Create a new dish or drink." />
      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
              placeholder="Dish name"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1.5">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-300 mb-1.5">Price</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="$12"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Short description"
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
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
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

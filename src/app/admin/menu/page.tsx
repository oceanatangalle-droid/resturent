'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface Category {
  id: string
  name: string
  sortOrder: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: string
  sortOrder: number
}

export default function AdminMenu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [catRes, itemRes] = await Promise.all([
        fetch('/api/menu/categories'),
        fetch('/api/menu/items'),
      ])
      if (catRes.ok) setCategories(await catRes.json())
      if (itemRes.ok) setItems(await itemRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Menu"
        subtitle="Manage categories and menu items."
      />

      {loading ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading menu...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-white">Categories</h2>
              <Link
                href="/admin/menu/categories/new"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white transition-colors min-h-[44px] sm:min-h-0 w-full sm:w-auto"
              >
                Add category
              </Link>
            </div>
            <ul className="bg-zinc-900/80 border border-zinc-800 rounded-xl divide-y divide-zinc-800 overflow-hidden">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors">
                  <span className="font-medium text-white">{c.name}</span>
                  <Link
                    href={`/admin/menu/categories/${c.id}`}
                    className="text-sm font-medium text-primary-400 hover:text-primary-300"
                  >
                    Edit
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="px-5 py-6 text-center text-zinc-500 text-sm">No categories yet. Add one to get started.</li>
              )}
            </ul>
          </section>

          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-white">Menu items</h2>
              <Link
                href="/admin/menu/items/new"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white transition-colors min-h-[44px] sm:min-h-0 w-full sm:w-auto"
              >
                Add item
              </Link>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-800/50">
                      <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Price</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-white">{item.name}</td>
                        <td className="px-5 py-3.5 text-zinc-400">{item.category}</td>
                        <td className="px-5 py-3.5 text-primary-400 font-medium">{item.price}</td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/admin/menu/items/${item.id}`}
                            className="text-sm font-medium text-primary-400 hover:text-primary-300"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {items.length === 0 && (
                <div className="px-5 py-8 text-center text-zinc-500 text-sm">No menu items yet. Add one to get started.</div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

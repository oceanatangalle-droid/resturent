'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { IconRefresh, IconMailEmpty } from '@/components/admin/AdminIcons'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export default function AdminContactMessages() {
  const [list, setList] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/contact-submissions')
      if (res.ok) setList(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div>
      <AdminPageHeader
        title="Contact messages"
        subtitle="Messages submitted from the Contact Us form."
        action={
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <IconRefresh />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        }
      />

      {loading && list.length === 0 ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading messages...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <IconMailEmpty />
          <p className="text-zinc-400 font-medium">No contact messages yet</p>
          <p className="text-zinc-500 text-sm mt-1">Messages from the Contact Us form will appear here.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-zinc-400 text-sm whitespace-nowrap">{formatDate(m.createdAt)}</td>
                    <td className="px-5 py-3.5 font-medium text-white">{m.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">
                      <a
                        href={`mailto:${m.email}`}
                        className="text-primary-400 hover:text-primary-300 hover:underline block"
                      >
                        {m.email}
                      </a>
                      {m.phone && <div className="mt-0.5">{m.phone}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm max-w-[280px]">
                      <span className="line-clamp-3 block" title={m.message}>
                        {m.message || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

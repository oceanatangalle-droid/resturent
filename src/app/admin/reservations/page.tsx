'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { IconRefresh, IconCalendarEmpty } from '@/components/admin/AdminIcons'

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  specialRequests: string
  status?: 'pending' | 'accepted' | 'rejected'
  respondedAt?: string
  createdAt: string
}

export default function AdminReservations() {
  const [list, setList] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [respondingId, setRespondingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reservations')
      if (res.ok) setList(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleRespond = async (id: string, status: 'accepted' | 'rejected') => {
    setMessage(null)
    setRespondingId(id)
    try {
      const res = await fetch(`/api/reservations/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to respond' })
        return
      }
      setMessage({
        type: 'success',
        text: data.emailSent
          ? `Reservation ${status}. Email sent to client.`
          : `Reservation ${status}. Email could not be sent (check Gmail setup).`,
      })
      await load()
    } catch {
      setMessage({ type: 'error', text: 'Request failed' })
    } finally {
      setRespondingId(null)
    }
  }

  const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const formatDate = (d: string) => new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  const statusBadge = (status: string) => {
    const s = status || 'pending'
    const classes =
      s === 'accepted'
        ? 'bg-green-500/20 text-green-400 border-green-500/40'
        : s === 'rejected'
          ? 'bg-red-500/20 text-red-400 border-red-500/40'
          : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40'
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
        {s}
      </span>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Reservations"
        subtitle="Accept or reject requests; an email is sent to the client via Gmail."
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

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading && list.length === 0 ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading reservations...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-12 text-center">
          <IconCalendarEmpty />
          <p className="text-zinc-400 font-medium">No reservations yet</p>
          <p className="text-zinc-500 text-sm mt-1">New bookings from the Book a Table form will appear here.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/50">
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date / Time</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Guests</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Requests</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-white">{formatDate(r.date)}</div>
                      <div className="text-zinc-400 text-sm">{r.time}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm">
                      <a href={`mailto:${r.email}`} className="text-primary-400 hover:text-primary-300 hover:underline">
                        {r.email}
                      </a>
                      <div className="mt-0.5">{r.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-white">{r.guests}</td>
                    <td className="px-5 py-3.5">{statusBadge(r.status || 'pending')}</td>
                    <td className="px-5 py-3.5">
                      {(r.status || 'pending') === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={respondingId !== null}
                            onClick={() => handleRespond(r.id, 'accepted')}
                            className="px-3 py-1.5 rounded text-xs font-medium bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
                          >
                            {respondingId === r.id ? '...' : 'Accept'}
                          </button>
                          <button
                            type="button"
                            disabled={respondingId !== null}
                            onClick={() => handleRespond(r.id, 'rejected')}
                            className="px-3 py-1.5 rounded text-xs font-medium bg-red-600 hover:bg-red-500 text-white disabled:opacity-50"
                          >
                            {respondingId === r.id ? '...' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 text-sm max-w-[180px] truncate" title={r.specialRequests || undefined}>
                      {r.specialRequests || '—'}
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

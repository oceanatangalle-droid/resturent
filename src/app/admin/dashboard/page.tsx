'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { IconMenu, IconReservations, IconContact, IconHome, IconBranding, IconSpecialOffer, IconSettings } from '@/components/admin/AdminIcons'

const cards = [
  { href: '/admin/menu', title: 'Menu', desc: 'Categories & items', icon: IconMenu },
  { href: '/admin/contact', title: 'Contact', desc: 'Address, phone, hours', icon: IconContact },
  { href: '/admin/home', title: 'Home', desc: 'Hero, about, features', icon: IconHome },
  { href: '/admin/home', title: 'Special Offer', desc: 'Discount section & image', icon: IconSpecialOffer },
  { href: '/admin/branding', title: 'Branding', desc: 'Favicon & logo', icon: IconBranding },
  { href: '/admin/settings', title: 'Settings', desc: 'Currency & site options', icon: IconSettings },
  { href: '/admin/reservations', title: 'Reservations', desc: 'Book table requests', icon: IconReservations },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ reservations: number; menuItems: number } | null>(null)

  useEffect(() => {
    Promise.all([fetch('/api/reservations'), fetch('/api/menu/items')])
      .then(async ([resRes, itemsRes]) => {
        const reservations = resRes.ok ? (await resRes.json()).length : 0
        const menuItems = itemsRes.ok ? (await itemsRes.json()).length : 0
        setStats({ reservations, menuItems })
      })
      .catch(() => setStats({ reservations: 0, menuItems: 0 }))
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Manage your restaurant content and reservations."
      />
      {stats !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm font-medium text-zinc-400">Reservations</p>
            <p className="text-2xl font-semibold text-white mt-1">{stats.reservations}</p>
            <p className="text-xs text-zinc-500 mt-1">Total bookings</p>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm font-medium text-zinc-400">Menu items</p>
            <p className="text-2xl font-semibold text-white mt-1">{stats.menuItems}</p>
            <p className="text-xs text-zinc-500 mt-1">Across all categories</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200"
          >
            <span className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-primary-600/20 group-hover:text-primary-400 flex items-center justify-center shrink-0 transition-colors">
              <Icon />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                {title}
              </h2>
              <p className="text-sm text-zinc-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

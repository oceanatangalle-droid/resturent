'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  IconDashboard,
  IconMenu,
  IconContact,
  IconHome,
  IconReservations,
  IconBranding,
  IconSettings,
  IconExternal,
  IconLogout,
} from './AdminIcons'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
  { href: '/admin/menu', label: 'Menu', icon: IconMenu },
  { href: '/admin/contact', label: 'Contact', icon: IconContact },
  { href: '/admin/home', label: 'Home', icon: IconHome },
  { href: '/admin/branding', label: 'Branding', icon: IconBranding },
  { href: '/admin/settings', label: 'Settings', icon: IconSettings },
  { href: '/admin/reservations', label: 'Reservations', icon: IconReservations },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [siteName, setSiteName] = useState('Veloria')

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const name = d?.siteName ?? 'Veloria Restaurant'
        setSiteName(name.replace(/\s+Restaurant\s*$/i, '') || name)
      })
      .catch(() => {})
  }, [])

  if (pathname === '/admin/login') return null

  return (
    <>
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`
          w-64 bg-zinc-900/95 border-r border-zinc-800 flex flex-col min-h-screen flex-shrink-0
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
      <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-lg font-semibold text-white tracking-tight min-w-0"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
            V
          </span>
          {siteName} Admin
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 -mr-2 text-zinc-400 hover:text-white rounded-lg"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] md:min-h-0 items-center ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-400 border-l-2 border-primary-500 -ml-[2px] pl-[14px]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-zinc-800 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors min-h-[44px] md:min-h-0 items-center"
        >
          <IconExternal />
          View site
        </Link>
        <form
          action="/api/admin/logout"
          method="POST"
          className="block"
          onSubmit={(e) => {
            e.preventDefault()
            fetch('/api/admin/logout', { method: 'POST' }).then(() => {
              window.location.href = '/admin/login'
            })
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-left min-h-[44px] md:min-h-0 items-center"
          >
            <IconLogout />
            Log out
          </button>
        </form>
      </div>
    </aside>
    </>
  )
}

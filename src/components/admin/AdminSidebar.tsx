'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  if (pathname === '/admin/login') return null

  return (
    <aside className="w-64 bg-zinc-900/95 border-r border-zinc-800 flex flex-col min-h-screen flex-shrink-0">
      <div className="p-5 border-b border-zinc-800">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-lg font-semibold text-white tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
            V
          </span>
          Veloria Admin
        </Link>
      </div>
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-left"
          >
            <IconLogout />
            Log out
          </button>
        </form>
      </div>
    </aside>
  )
}

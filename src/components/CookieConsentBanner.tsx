'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type CookiePreferences = {
  analytics: boolean
}

const COOKIE_NAME = 'veloria_cookie_preferences'

function readPrefs(): CookiePreferences | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!raw) return null
  try {
    const value = decodeURIComponent(raw.split('=')[1] ?? '')
    const parsed = JSON.parse(value) as CookiePreferences
    if (typeof parsed.analytics === 'boolean') return parsed
    return null
  } catch {
    return null
  }
}

function writePrefs(prefs: CookiePreferences) {
  if (typeof document === 'undefined') return
  const value = encodeURIComponent(JSON.stringify(prefs))
  const maxAge = 60 * 60 * 24 * 180 // 6 months
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

export function getHasAnalyticsConsent(): boolean {
  const prefs = readPrefs()
  return !!prefs?.analytics
}

export default function CookieConsentBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Hide on admin area – cookie banner is for public visitors
    if (pathname?.startsWith('/admin')) {
      setVisible(false)
      return
    }
    const existing = readPrefs()
    setVisible(!existing)
  }, [pathname])

  const handleChoice = (analytics: boolean) => {
    writePrefs({ analytics })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="max-w-3xl mx-auto rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-xl backdrop-blur">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Cookies & analytics</p>
            <p className="text-xs sm:text-sm text-zinc-400">
              We use essential cookies to make this site work and optional analytics cookies to understand how
              guests use our website. You can accept or decline analytics at any time by clearing your cookies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleChoice(false)}
              className="px-3 py-2 rounded-lg border border-zinc-600 text-xs sm:text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Only necessary
            </button>
            <button
              type="button"
              onClick={() => handleChoice(true)}
              className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-xs sm:text-sm font-semibold text-white transition-colors"
            >
              Accept analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


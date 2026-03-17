'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getHasAnalyticsConsent } from './CookieConsentBanner'

function deriveCountryFromLocale(): string | undefined {
  if (typeof navigator === 'undefined') return undefined
  const locale = navigator.language || ''
  const parts = locale.split('-')
  if (parts.length === 2 && parts[1].length === 2) {
    return parts[1].toUpperCase()
  }
  return undefined
}

async function sendEvent(path: string) {
  if (!getHasAnalyticsConsent()) return
  const referrer = typeof document !== 'undefined' ? document.referrer || undefined : undefined
  const countryCode = deriveCountryFromLocale()

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        path,
        referrer,
        countryCode,
      }),
    })
  } catch {
    // Ignore – analytics should never block the page
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const search = searchParams?.toString()
    const fullPath = search ? `${pathname}?${search}` : pathname
    void sendEvent(fullPath)
  }, [pathname, searchParams])

  return null
}


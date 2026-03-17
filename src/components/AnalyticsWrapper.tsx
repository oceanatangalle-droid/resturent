'use client'

import { Analytics } from '@vercel/analytics/next'
import { useEffect, useState } from 'react'
import { getHasAnalyticsConsent } from './CookieConsentBanner'

export default function AnalyticsWrapper() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(getHasAnalyticsConsent())
  }, [])

  if (!enabled) return null
  return <Analytics />
}


'use client'

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'

export interface SiteSettings {
  siteName: string
  currencySymbol: string
  currencyCode: string
  facebookUrl: string
  whatsappUrl: string
  instagramUrl: string
  googleBusinessUrl: string
  tripadvisorUrl: string
}

const defaultSettings: SiteSettings = {
  siteName: 'Veloria Restaurant',
  currencySymbol: '$',
  currencyCode: 'USD',
  facebookUrl: '',
  whatsappUrl: '',
  instagramUrl: '',
  googleBusinessUrl: '',
  tripadvisorUrl: '',
}

const SettingsContext = createContext<SiteSettings | null>(null)

export function useSettings(): SiteSettings | null {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setSettings({
            siteName: data.siteName ?? defaultSettings.siteName,
            currencySymbol: data.currencySymbol ?? defaultSettings.currencySymbol,
            currencyCode: data.currencyCode ?? defaultSettings.currencyCode,
            facebookUrl: data.facebookUrl ?? '',
            whatsappUrl: data.whatsappUrl ?? '',
            instagramUrl: data.instagramUrl ?? '',
            googleBusinessUrl: data.googleBusinessUrl ?? '',
            tripadvisorUrl: data.tripadvisorUrl ?? '',
          })
        } else {
          setSettings(defaultSettings)
        }
      })
      .catch(() => setSettings(defaultSettings))
  }, [])

  const value = useMemo(() => settings, [settings])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

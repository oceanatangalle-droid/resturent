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
  primaryColor: string
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
  primaryColor: '#dc2626',
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeHex(hex: string | undefined): string {
  const raw = (hex ?? '').trim()
  const short = /^#([a-f\d]{3})$/i.exec(raw)
  if (short) {
    const [, v] = short
    return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`.toLowerCase()
  }
  const full = /^#([a-f\d]{6})$/i.exec(raw)
  if (full) return `#${full[1].toLowerCase()}`
  return defaultSettings.primaryColor
}

function shiftHex(hex: string, amount: number): string {
  const normalized = normalizeHex(hex).replace('#', '')
  const num = parseInt(normalized, 16)
  const r = clamp((num >> 16) + amount, 0, 255)
  const g = clamp(((num >> 8) & 0x00ff) + amount, 0, 255)
  const b = clamp((num & 0x0000ff) + amount, 0, 255)
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
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
            primaryColor: normalizeHex(data.primaryColor),
          })
        } else {
          setSettings(defaultSettings)
        }
      })
      .catch(() => setSettings(defaultSettings))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const base = normalizeHex(settings?.primaryColor)
    const color500 = shiftHex(base, 16)
    const color600 = base
    const color700 = shiftHex(base, -20)
    root.style.setProperty('--theme-primary-500', color500)
    root.style.setProperty('--theme-primary-600', color600)
    root.style.setProperty('--theme-primary-700', color700)
  }, [settings?.primaryColor])

  const value = useMemo(() => settings, [settings])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

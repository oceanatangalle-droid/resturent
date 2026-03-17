'use client'

import { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type CountryStat = {
  countryCode: string
  count: number
}

type SummaryResponse = {
  totalEvents: number
  byCountry: CountryStat[]
}

const colorScale = (value: number, max: number) => {
  if (max === 0) return '#18181b'
  const t = Math.min(1, value / max)
  // Interpolate between #1d2433 and #3b82f6
  const from = [29, 36, 51]
  const to = [59, 130, 246]
  const r = Math.round(from[0] + (to[0] - from[0]) * t)
  const g = Math.round(from[1] + (to[1] - from[1]) * t)
  const b = Math.round(from[2] + (to[2] - from[2]) * t)
  return `rgb(${r}, ${g}, ${b})`
}

export default function AnalyticsWorldMap() {
  const [data, setData] = useState<SummaryResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/analytics/summary')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load analytics'))))
      .then((json: SummaryResponse) => {
        setData(json)
      })
      .catch(() => setError('Unable to load analytics data right now.'))
  }, [])

  const byCode = new Map<string, number>()
  let max = 0
  if (data?.byCountry) {
    for (const c of data.byCountry) {
      byCode.set(c.countryCode.toUpperCase(), c.count)
      if (c.count > max) max = c.count
    }
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white">Visitors by country</h2>
          <p className="text-xs text-zinc-400">
            Lightweight first‑party analytics based on page views (approximate by browser locale).
          </p>
        </div>
        {data && (
          <p className="text-xs text-zinc-400">
            Total page views tracked:{' '}
            <span className="font-semibold text-zinc-100">{data.totalEvents}</span>
          </p>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="w-full aspect-[3/2]">
        <ComposableMap
          projectionConfig={{ scale: 150 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = (geo.properties.iso_a2 || geo.properties.ISO_A2 || '').toUpperCase()
                const count = byCode.get(iso) ?? 0
                const fill = count > 0 ? colorScale(count, max) : '#18181b'
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                    fill={fill}
                    stroke="#27272f"
                    strokeWidth={0.5}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <p className="text-[11px] text-zinc-500">
        For privacy, location is approximated using the visitor&apos;s browser locale and stored without IP
        addresses. Counts are indicative, not exact like Google Analytics.
      </p>
    </div>
  )
}


import { NextRequest, NextResponse } from 'next/server'
import { addAnalyticsEvent } from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const { path, referrer, countryCode, city } = (await req.json().catch(() => ({}))) as {
      path?: string
      referrer?: string
      countryCode?: string
      city?: string
    }

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') ?? undefined

    await addAnalyticsEvent({
      path,
      referrer,
      countryCode,
      city,
      userAgent: ua,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Analytics track error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


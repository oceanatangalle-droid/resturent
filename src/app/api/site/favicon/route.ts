import { NextResponse } from 'next/server'
import { getBranding } from '@/lib/store'

export async function GET() {
  let faviconBase64 = ''
  try {
    const branding = await getBranding()
    faviconBase64 = branding.faviconBase64 || ''
  } catch (error) {
    console.warn('Failed to get favicon, using default')
  }

  if (!faviconBase64 || !faviconBase64.startsWith('data:')) {
    return new NextResponse(null, { status: 404 })
  }
  const match = faviconBase64.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return new NextResponse(null, { status: 404 })
  const mime = match[1]
  const base64 = match[2]
  try {
    const buf = Buffer.from(base64, 'base64')
    return new NextResponse(buf, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}

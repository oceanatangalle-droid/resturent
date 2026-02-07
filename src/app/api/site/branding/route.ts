import { NextResponse } from 'next/server'
import { getBranding, updateBranding } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getBranding()
  return NextResponse.json(data)
}

async function handleUpdate(request: Request) {
  const res = await fetch(new URL('/api/admin/me', request.url), { headers: request.headers })
  if (res.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Body must be object' }, { status: 400 })
  }
  const b = body as Record<string, unknown>
  const faviconBase64 = typeof b.faviconBase64 === 'string' ? b.faviconBase64 : undefined
  const logoBase64 = typeof b.logoBase64 === 'string' ? b.logoBase64 : undefined
  const data = await updateBranding({ faviconBase64, logoBase64 })
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  return handleUpdate(request)
}

export async function POST(request: Request) {
  return handleUpdate(request)
}

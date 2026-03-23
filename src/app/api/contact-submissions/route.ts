import { NextResponse } from 'next/server'
import { getContactSubmissions, addContactSubmission } from '@/lib/store'

export async function GET() {
  const data = await getContactSubmissions()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  // Basic rate limiting simulation (in production use Upstash or similar)
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  console.log(`Contact form submission from ${ip}`)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 })
  }
  const b = body as Record<string, unknown>
  const name = b.name != null ? String(b.name).trim() : ''
  const email = b.email != null ? String(b.email).trim() : ''
  const phone = b.phone != null ? String(b.phone).trim() : ''
  const message = b.message != null ? String(b.message).trim() : ''

  // Basic validation + sanitization
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Required fields: name, email, message' },
      { status: 400 }
    )
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 })
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  try {
    const { id, createdAt } = await addContactSubmission({
      name,
      email,
      phone,
      message,
    })
    return NextResponse.json({ id, createdAt })
  } catch (err) {
    console.error('addContactSubmission failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save message' },
      { status: 500 }
    )
  }
}

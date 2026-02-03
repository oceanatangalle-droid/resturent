import { NextResponse } from 'next/server'
import { getReservations, addReservation } from '@/lib/store'

export async function GET() {
  const data = await getReservations()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
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
  const date = b.date != null ? String(b.date).trim() : ''
  const time = b.time != null ? String(b.time).trim() : ''
  const guests = b.guests != null ? String(b.guests).trim() : ''
  const specialRequests = b.specialRequests != null ? String(b.specialRequests).trim() : ''
  if (!name || !email || !phone || !date || !time || !guests) {
    return NextResponse.json(
      { error: 'Required fields: name, email, phone, date, time, guests' },
      { status: 400 }
    )
  }
  try {
    const { id, createdAt } = await addReservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests,
    })
    return NextResponse.json({ id, createdAt })
  } catch (err) {
    console.error('addReservation failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save reservation' },
      { status: 500 }
    )
  }
}

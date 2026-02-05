import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  getReservationById,
  updateReservationStatus,
  getSettings,
  type ReservationStatus,
} from '@/lib/store'
import { sendEmail } from '@/lib/gmail'

const COOKIE_NAME = 'admin_session'

function isAdmin(): boolean {
  const c = cookies()
  return c.get(COOKIE_NAME)?.value === '1'
}

function reservationEmailHtml(
  name: string,
  date: string,
  time: string,
  guests: string,
  status: 'accepted' | 'rejected',
  siteName: string
): string {
  const body =
    status === 'accepted'
      ? `Dear ${name},<br><br>Your table reservation for <strong>${date}</strong> at <strong>${time}</strong> for <strong>${guests} guests</strong> has been confirmed. We look forward to seeing you.<br><br>— ${siteName}`
      : `Dear ${name},<br><br>Unfortunately we are unable to confirm your reservation for ${date} at ${time}. Please call us or try another date/time.<br><br>— ${siteName}`
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;">${body}</body></html>`
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ok = isAdmin()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const status = body?.status === 'accepted' || body?.status === 'rejected' ? (body.status as ReservationStatus) : null
  if (!status) {
    return NextResponse.json({ error: 'Body must include status: "accepted" or "rejected"' }, { status: 400 })
  }

  const reservation = await getReservationById(id)
  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  if (reservation.status !== 'pending') {
    return NextResponse.json({ error: 'Reservation already responded to' }, { status: 400 })
  }

  const updated = await updateReservationStatus(id, status)
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 })

  const settings = await getSettings()
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  const siteShortName = siteName.replace(/\s+Restaurant\s*$/i, '') || siteName

  try {
    const subject =
      status === 'accepted'
        ? `Your reservation at ${siteShortName} is confirmed`
        : `Update on your reservation at ${siteShortName}`
    const html = reservationEmailHtml(
      reservation.name,
      reservation.date,
      reservation.time,
      reservation.guests,
      status as 'accepted' | 'rejected',
      siteName
    )
    await sendEmail(reservation.email, subject, html)
  } catch (err) {
    console.error('Gmail send failed:', err)
    return NextResponse.json(
      {
        reservation: updated,
        emailSent: false,
        error: err instanceof Error ? err.message : 'Email could not be sent. Check Gmail env vars.',
      },
      { status: 200 }
    )
  }

  return NextResponse.json({ reservation: updated, emailSent: true })
}

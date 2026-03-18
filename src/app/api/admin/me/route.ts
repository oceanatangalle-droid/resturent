import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/app/api/admin/session-constants'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE_NAME)
  if (session?.value === '1') {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

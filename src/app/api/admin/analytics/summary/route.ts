import { NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/store'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME } from '@/app/api/admin/session-constants'

export async function GET() {
  // Require admin session cookie – same simple guard as other admin APIs
  const c = await cookies()
  const session = c.get(ADMIN_COOKIE_NAME)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const summary = await getAnalyticsSummary()
  return NextResponse.json(summary)
}


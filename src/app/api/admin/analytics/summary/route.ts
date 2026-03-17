import { NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/store'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/app/api/admin/login/route'

export async function GET() {
  // Require admin session cookie – same simple guard as other admin APIs
  const c = await cookies()
  const session = c.get(COOKIE_NAME)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const summary = await getAnalyticsSummary()
  return NextResponse.json(summary)
}


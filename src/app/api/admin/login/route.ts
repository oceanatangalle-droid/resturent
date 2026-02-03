import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const COOKIE_NAME = 'admin_session'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ ok: true })
      res.cookies.set(COOKIE_NAME, '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      return res
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

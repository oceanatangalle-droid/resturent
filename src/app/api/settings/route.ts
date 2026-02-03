import { NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/store'

export async function GET() {
  const data = await getSettings()
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = await updateSettings(body)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

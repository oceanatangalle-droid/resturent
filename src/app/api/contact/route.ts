import { NextResponse } from 'next/server'
import { getContact, updateContact } from '@/lib/store'

export async function GET() {
  const data = await getContact()
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = await updateContact(body)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

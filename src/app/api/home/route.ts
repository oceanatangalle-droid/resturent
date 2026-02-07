import { NextResponse } from 'next/server'
import { getHome, updateHome } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getHome()
  return NextResponse.json(data)
}

async function handleUpdate(request: Request) {
  const body = await request.json()
  const data = await updateHome(body)
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  try {
    return handleUpdate(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    return handleUpdate(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

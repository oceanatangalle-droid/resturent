import { NextResponse } from 'next/server'
import { getCategories, addCategory } from '@/lib/store'

export async function GET() {
  const data = await getCategories()
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
  const name = (body as { name?: unknown }).name
  if (name == null || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }
  const trimmed = name.trim()
  if (!trimmed) {
    return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
  }
  try {
    const category = await addCategory(trimmed)
    return NextResponse.json(category)
  } catch (err) {
    console.error('addCategory failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create category' },
      { status: 500 }
    )
  }
}

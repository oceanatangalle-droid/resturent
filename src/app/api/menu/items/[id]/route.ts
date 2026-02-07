import { NextResponse } from 'next/server'
import { updateItem, deleteItem } from '@/lib/store'

export const dynamic = 'force-dynamic'

async function handleUpdate(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const category = body.category !== undefined ? String(body.category).trim() : undefined
  const name = body.name !== undefined ? String(body.name).trim() : undefined
  const description = body.description !== undefined ? String(body.description).trim() : undefined
  const price = body.price !== undefined ? String(body.price).trim() : undefined
  const item = await updateItem(id, { name, description, price, category })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    return handleUpdate(request, context)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    return handleUpdate(request, context)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await deleteItem(id)
  return NextResponse.json({ ok: true })
}

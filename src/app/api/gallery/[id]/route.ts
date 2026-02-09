import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getGalleryItems, updateGalleryItem, deleteGalleryItem } from '@/lib/store'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'admin_session'

function isAdmin(): boolean {
  const c = cookies()
  return c.get(COOKIE_NAME)?.value === '1'
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payload: Parameters<typeof updateGalleryItem>[1] = {}
  if (typeof body.caption === 'string') payload.caption = body.caption
  if (typeof body.sortOrder === 'number') payload.sortOrder = body.sortOrder

  const updated = await updateGalleryItem(id, payload)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await deleteGalleryItem(id)
  return NextResponse.json({ ok: true })
}

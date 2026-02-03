import { NextResponse } from 'next/server'
import { getItems, addItem } from '@/lib/store'

export async function GET() {
  const data = await getItems()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, category } = body
    if (!name || !category || typeof name !== 'string' || typeof category !== 'string') {
      return NextResponse.json({ error: 'Name and category required' }, { status: 400 })
    }
    const item = await addItem({
      name: name.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      price: typeof price === 'string' ? price.trim() : '',
      category: category.trim(),
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

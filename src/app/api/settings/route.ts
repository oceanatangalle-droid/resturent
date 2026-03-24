import { NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getSettings()
  return NextResponse.json(data)
}

async function handleUpdate(request: Request) {
  try {
    const body = await request.json()
    
    // Ensure reviewCount is properly converted to number or null
    if (body.reviewCount !== undefined) {
      if (body.reviewCount === '' || body.reviewCount === null) {
        body.reviewCount = null
      } else {
        const num = parseInt(body.reviewCount, 10)
        body.reviewCount = isNaN(num) ? null : num
      }
    }

    if (body.primaryColor !== undefined) {
      const color = String(body.primaryColor).trim()
      body.primaryColor = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color) ? color : '#dc2626'
    }

    const data = await updateSettings(body)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update settings' 
    }, { status: 500 })
  }
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

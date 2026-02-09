import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getGalleryItems, addGalleryItem, type GalleryItem } from '@/lib/store'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'admin_session'

function isAdmin(): boolean {
  const c = cookies()
  return c.get(COOKIE_NAME)?.value === '1'
}

export async function GET() {
  const items = await getGalleryItems()
  return NextResponse.json(items)
}

function parseYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  const match =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/) ||
    trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export async function POST(request: Request) {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = body.type as string
  if (type !== 'image' && type !== 'video') {
    return NextResponse.json({ error: 'type must be "image" or "video"' }, { status: 400 })
  }

  const caption = typeof body.caption === 'string' ? body.caption : undefined
  const items = await getGalleryItems()
  const sortOrder = items.length

  if (type === 'image') {
    const imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64 : undefined
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined
    if (!imageBase64 && !imageUrl) {
      return NextResponse.json({ error: 'Image requires imageBase64 (upload) or imageUrl (link)' }, { status: 400 })
    }
    const data: Omit<GalleryItem, 'id'> = {
      type: 'image',
      sortOrder,
      caption,
      imageBase64: imageBase64 || undefined,
      imageUrl: imageUrl || undefined,
    }
    const item = await addGalleryItem(data)
    return NextResponse.json(item)
  }

  // type === 'video'
  const videoYoutubeUrl = typeof body.videoYoutubeUrl === 'string' ? body.videoYoutubeUrl.trim() : undefined
  const videoUrl = typeof body.videoUrl === 'string' ? body.videoUrl.trim() : undefined
  if (!videoYoutubeUrl && !videoUrl) {
    return NextResponse.json({ error: 'Video requires videoYoutubeUrl or videoUrl (direct link)' }, { status: 400 })
  }
  const ytId = videoYoutubeUrl ? parseYouTubeId(videoYoutubeUrl) : null
  const data: Omit<GalleryItem, 'id'> = {
    type: 'video',
    sortOrder,
    caption,
    videoYoutubeUrl: ytId ? `https://www.youtube.com/watch?v=${ytId}` : videoYoutubeUrl,
    videoUrl: videoUrl || undefined,
  }
  const item = await addGalleryItem(data)
  return NextResponse.json(item)
}

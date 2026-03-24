import { getGalleryItems } from '@/lib/store'
import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  let items: any[] = []
  try {
    items = await getGalleryItems()
  } catch (error) {
    console.warn('Gallery data not available during build')
  }

  const initialGallery = items.map((g) => ({
    id: g.id,
    type: g.type,
    sortOrder: g.sortOrder,
    caption: g.caption,
    imageBase64: g.imageBase64,
    imageUrl: g.imageUrl,
    videoYoutubeUrl: g.videoYoutubeUrl,
    videoUrl: g.videoUrl,
  }))
  return <GalleryClient initialGallery={initialGallery} />
}

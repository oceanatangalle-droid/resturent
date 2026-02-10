import { getGalleryItems } from '@/lib/store'
import GalleryClient from './GalleryClient'

export default async function GalleryPage() {
  const items = await getGalleryItems()
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

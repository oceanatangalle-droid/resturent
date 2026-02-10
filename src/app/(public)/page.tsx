import { getHome, getItems, getGalleryItems } from '@/lib/store'
import HomeClient from './HomeClient'

// Avoid DB connection exhaustion during build (many pages generated in parallel)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [homeData, items, gallery] = await Promise.all([getHome(), getItems(), getGalleryItems()])
  const limit = homeData.featuredMenuLimit ?? 6
  const featured = items.slice(0, limit).map((item) => ({
    id: String(item.id),
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
  }))
  const initialGallery = gallery.map((g) => ({
    id: g.id,
    type: g.type,
    sortOrder: g.sortOrder,
    caption: g.caption,
    imageBase64: g.imageBase64,
    imageUrl: g.imageUrl,
    videoYoutubeUrl: g.videoYoutubeUrl,
    videoUrl: g.videoUrl,
  }))
  return <HomeClient initialHome={homeData} initialFeatured={featured} initialGallery={initialGallery} />
}

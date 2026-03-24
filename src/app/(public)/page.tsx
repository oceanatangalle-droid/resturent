import { getHome, getItems, getGalleryItems } from '@/lib/store'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let homeData: any
  let items: any[] = []
  let gallery: any[] = []

  try {
    const data = await Promise.all([
      getHome(),
      getItems(),
      getGalleryItems()
    ])
    homeData = data[0]
    items = data[1]
    gallery = data[2]
  } catch (error) {
    // Graceful fallback during build/Vercel if DB not ready
    console.warn('DB not available during build, using minimal data')
    homeData = { featuredMenuLimit: 6 }
    items = []
    gallery = []
  }
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

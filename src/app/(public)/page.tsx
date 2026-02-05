import { getHome, getItems } from '@/lib/store'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const [homeData, items] = await Promise.all([getHome(), getItems()])
  const limit = homeData.featuredMenuLimit ?? 6
  const featured = items.slice(0, limit).map((item) => ({
    id: String(item.id),
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
  }))
  return <HomeClient initialHome={homeData} initialFeatured={featured} />
}

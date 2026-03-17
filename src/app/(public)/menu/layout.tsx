import type { Metadata } from 'next'
import { getSettings } from '@/lib/store'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  return {
    title: `Our Menu | ${siteName}`,
    description:
      'Discover our carefully crafted selection of dishes. Fresh ingredients, exceptional flavors. View our full menu and reserve your table.',
    openGraph: {
      title: `Our Menu | ${siteName}`,
      description:
        'Discover our carefully crafted selection of dishes. Fresh ingredients, exceptional flavors.',
    },
  }
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

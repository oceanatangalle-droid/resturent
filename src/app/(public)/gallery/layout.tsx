import type { Metadata } from 'next'
import { getSettings } from '@/lib/store'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  return {
    title: `Gallery | ${siteName}`,
    description:
      'Photos and videos from our restaurant. See our atmosphere, dishes, and dining experience.',
    openGraph: {
      title: `Gallery | ${siteName}`,
      description:
        'Photos and videos from our restaurant. See our atmosphere, dishes, and dining experience.',
    },
  }
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

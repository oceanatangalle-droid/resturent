import type { Metadata } from 'next'
import { getSettings } from '@/lib/store'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  return {
    title: `Book a Table | ${siteName}`,
    description:
      'Reserve your table online for an unforgettable dining experience. Book now for lunch or dinner.',
    openGraph: {
      title: `Book a Table | ${siteName}`,
      description:
        'Reserve your table online for an unforgettable dining experience.',
    },
  }
}

export default function BookATableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

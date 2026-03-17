import type { Metadata } from 'next'
import { getSettings } from '@/lib/store'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  return {
    title: `Contact Us | ${siteName}`,
    description:
      "Get in touch for reservations, events, or questions. Find our address, opening hours, phone and email. We'd love to hear from you.",
    openGraph: {
      title: `Contact Us | ${siteName}`,
      description:
        "Get in touch for reservations, events, or questions. Find our address, opening hours, phone and email.",
    },
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

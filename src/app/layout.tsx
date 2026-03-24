import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import { JsonLdRestaurant } from '@/components/JsonLdRestaurant'
import { getSettings, getHome } from '@/lib/store'
import CookieConsentBanner from '@/components/CookieConsentBanner'
import AnalyticsWrapper from '@/components/AnalyticsWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export async function generateMetadata(): Promise<Metadata> {
  let siteName = 'Veloria Restaurant'
  let description =
    'Experience exceptional cuisine in an elegant atmosphere. Reserve your table and explore our menu.'

  try {
    const [settings, home] = await Promise.all([getSettings(), getHome()])
    siteName = settings?.siteName ?? siteName
    description = home?.subtitle?.trim() || description
  } catch (error) {
    console.warn('generateMetadata fallback mode:', error)
  }

  const title = `${siteName} - Fine Dining Experience`
  const canonical = baseUrl ? { url: baseUrl } : undefined

  return {
    title,
    description,
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    alternates: canonical ? { canonical } : undefined,
    icons: {
      icon: '/api/site/favicon',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: baseUrl || undefined,
      images: [
        {
          url: `${baseUrl}/api/site/logo`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    other: {
      'format-detection': 'telephone=no',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Suspense fallback={null}>
          <JsonLdRestaurant />
        </Suspense>
        <ErrorBoundary>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </ErrorBoundary>
        <CookieConsentBanner />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {/* Vercel analytics, only when user consented to analytics cookies */}
        <AnalyticsWrapper />
      </body>
    </html>
  )
}

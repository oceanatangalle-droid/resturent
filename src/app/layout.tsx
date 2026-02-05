import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import { getSettings } from '@/lib/store'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteName = settings?.siteName ?? 'Veloria Restaurant'
  return {
    title: `${siteName} - Fine Dining Experience`,
    description: 'Experience exceptional cuisine in an elegant atmosphere',
    icons: {
      icon: '/api/site/favicon',
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
        <ErrorBoundary>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}

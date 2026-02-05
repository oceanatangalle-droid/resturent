import { Suspense } from 'react'
import { SettingsProvider } from '@/contexts/SettingsContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsProvider>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Suspense>
      </div>
    </SettingsProvider>
  )
}

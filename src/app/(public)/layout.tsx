import { Suspense } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </Suspense>
    </div>
  )
}

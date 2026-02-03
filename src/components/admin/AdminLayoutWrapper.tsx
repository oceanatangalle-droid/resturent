'use client'

import { usePathname } from 'next/navigation'
import AuthGuard from './AuthGuard'

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login') return <>{children}</>
  return <AuthGuard>{children}</AuthGuard>
}

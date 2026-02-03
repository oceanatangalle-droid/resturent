'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => {
        if (res.status === 401) {
          router.replace('/admin/login?from=' + encodeURIComponent(window.location.pathname))
          return
        }
        setReady(true)
      })
      .catch(() => router.replace('/admin/login'))
  }, [router])

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    )
  }
  return <>{children}</>
}

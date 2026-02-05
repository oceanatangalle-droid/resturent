'use client'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white truncate">{title}</h1>
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 w-full sm:w-auto">{action}</div>}
    </div>
  )
}

import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0 w-full">
        <AdminLayoutWrapper>
          <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pt-14 sm:pt-4 sm:py-6 md:py-8 pb-4 sm:pb-6 md:pb-8 w-full box-border">{children}</div>
        </AdminLayoutWrapper>
      </main>
    </div>
  )
}

import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <AdminLayoutWrapper>
          <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
        </AdminLayoutWrapper>
      </main>
    </div>
  )
}

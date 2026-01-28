"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/menu/new", label: "+ Add Item", icon: "➕" },
    { href: "/admin/sections/new", label: "+ Add Section", icon: "📁" },
    { href: "/admin/hero", label: "Hero", icon: "🎯" },
    { href: "/admin/about", label: "About", icon: "ℹ️" },
    { href: "/admin/contact", label: "Contact", icon: "📞" },
    { href: "/admin/reservations", label: "Reservations", icon: "📅" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-veloria-border bg-veloria-black/95 backdrop-blur-lg z-30">
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="border-b border-veloria-border p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-veloria-border bg-gradient-to-br from-veloria-gold/40 via-veloria-elevated to-veloria-black text-sm font-semibold text-veloria-black shadow-[0_0_0_1px_rgba(0,0,0,0.7)]">
              V
            </div>
            <div>
              <div className="text-sm font-medium tracking-[0.28em] uppercase text-veloria-muted">
                Veloria
              </div>
              <p className="text-xs text-veloria-muted/80">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-veloria-gold/20 text-veloria-gold border border-veloria-gold/30"
                    : "text-veloria-muted hover:bg-veloria-elevated/50 hover:text-veloria-cream"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="border-t border-veloria-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-veloria-muted transition hover:bg-veloria-elevated/50 hover:text-veloria-cream"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-veloria-muted transition hover:bg-veloria-elevated/50 hover:text-veloria-cream"
          >
            <span className="text-base">🌐</span>
            <span>View Website</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

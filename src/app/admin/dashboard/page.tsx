"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface MenuSection {
  id: number;
  title: string;
  subtitle: string | null;
  display_order: number;
  items: MenuItem[];
}

interface MenuItem {
  id: number;
  section_id: number;
  name: string;
  description: string | null;
  price: string;
  image_src: string | null;
  display_order: number;
}

export default function AdminDashboard() {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu/full");
      if (!response.ok) throw new Error("Failed to fetch menu");
      const data = await response.json();
      setSections(data);
    } catch (err) {
      setError("Failed to load menu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/menu/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");
      fetchMenu();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!confirm("Are you sure? This will delete all items in this section."))
      return;

    try {
      const response = await fetch(`/api/menu/sections/${sectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete section");
      fetchMenu();
    } catch (err) {
      alert("Failed to delete section");
    }
  };

  const handleLogout = () => {
    document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-veloria-black p-8">
        <div className="veloria-container">
          <div className="text-center text-veloria-cream">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-veloria-black pb-16 pt-10">
      <header className="border-b border-white/5 bg-veloria-black/80 sticky top-0 z-20">
        <div className="veloria-container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-veloria-muted hover:text-veloria-cream">
              Veloria
            </Link>
            <span className="text-xs text-veloria-muted">/</span>
            <span className="text-xs text-veloria-cream">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/menu/new"
              className="rounded-full bg-veloria-gold px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft"
            >
              + Add Item
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-veloria-muted hover:text-veloria-cream"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mt-10">
        <div className="veloria-container">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-veloria-cream mb-2">
              Menu Management
            </h1>
            <p className="text-sm text-veloria-muted">
              Manage your menu sections and items
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.id}
                className="rounded-xl border border-veloria-border bg-veloria-elevated/70 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-veloria-cream">
                      {section.title}
                    </h2>
                    {section.subtitle && (
                      <p className="text-xs text-veloria-muted mt-1">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/sections/${section.id}/edit`}
                      className="text-xs text-veloria-gold-soft hover:text-veloria-gold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {section.items.length === 0 ? (
                    <p className="text-sm text-veloria-muted italic">
                      No items in this section
                    </p>
                  ) : (
                    section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-lg border border-veloria-border bg-veloria-black/60 p-4"
                      >
                        {item.image_src && (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-veloria-border">
                            <Image
                              src={item.image_src}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-veloria-cream">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-veloria-muted mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-veloria-cream">
                            {item.price}
                          </span>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/menu/${item.id}/edit`}
                              className="text-xs text-veloria-gold-soft hover:text-veloria-gold"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <Link
                href="/admin/sections/new"
                className="inline-flex items-center justify-center rounded-full border border-veloria-border bg-veloria-elevated/70 px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream hover:bg-veloria-elevated"
              >
                + Add Section
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

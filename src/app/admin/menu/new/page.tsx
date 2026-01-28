"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Section {
  id: number;
  title: string;
}

export default function NewMenuItemPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    section_id: "",
    name: "",
    description: "",
    price: "",
    image_src: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/menu/sections");
      const data = await response.json();
      setSections(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, section_id: data[0].id.toString() }));
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          section_id: parseInt(formData.section_id),
          display_order: parseInt(formData.display_order.toString()) || 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create item");
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-veloria-black pb-16 pt-10">
      <header className="border-b border-white/5 bg-veloria-black/80">
        <div className="veloria-container flex items-center justify-between py-4">
          <Link href="/admin/dashboard" className="text-xs font-semibold uppercase tracking-[0.22em] text-veloria-muted hover:text-veloria-cream">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mt-10">
        <div className="veloria-container max-w-2xl">
          <h1 className="text-2xl font-semibold text-veloria-cream mb-6">
            Add New Menu Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-veloria-border bg-veloria-elevated/70 p-6">
            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Section</label>
              <select
                value={formData.section_id}
                onChange={(e) =>
                  setFormData({ ...formData, section_id: e.target.value })
                }
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                required
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="$12.00"
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Image URL</label>
              <input
                type="text"
                value={formData.image_src}
                onChange={(e) =>
                  setFormData({ ...formData, image_src: e.target.value })
                }
                placeholder="/images/pancakes.jpg"
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-veloria-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Item"}
              </button>
              <Link
                href="/admin/dashboard"
                className="rounded-full border border-veloria-border px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream hover:bg-veloria-elevated"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

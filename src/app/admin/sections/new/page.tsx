"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/menu/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          display_order: parseInt(formData.display_order.toString()) || 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create section");
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
            Add New Section
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-veloria-border bg-veloria-elevated/70 p-6">
            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="🍳 Breakfast"
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Subtitle (optional)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="7 AM - 11 AM"
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
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

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-veloria-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Section"}
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

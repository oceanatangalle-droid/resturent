"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchSection();
  }, [sectionId]);

  const fetchSection = async () => {
    try {
      const response = await fetch(`/api/menu/sections/${sectionId}`);
      const data = await response.json();
      setFormData({
        title: data.title,
        subtitle: data.subtitle || "",
        display_order: data.display_order || 0,
      });
    } catch (error) {
      console.error("Failed to fetch section:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/menu/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          display_order: parseInt(formData.display_order.toString()) || 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update section");
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
    <div className="flex min-h-screen bg-veloria-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 pb-16 pt-10">
        <section className="mt-10">
          <div className="veloria-container px-8 max-w-2xl">
          <h1 className="text-2xl font-semibold text-veloria-cream mb-6">
            Edit Section
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
                {loading ? "Updating..." : "Update Section"}
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
    </div>
  );
}

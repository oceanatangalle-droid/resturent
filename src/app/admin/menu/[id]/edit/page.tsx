"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

interface Section {
  id: number;
  title: string;
}

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    section_id: "",
    name: "",
    description: "",
    price: "",
    image_src: "",
    image_data: "",
    image_mime_type: "",
    display_order: 0,
  });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
    fetchItem();
  }, [itemId]);

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/menu/sections");
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  };

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/menu/items/${itemId}`);
      const data = await response.json();
      setFormData({
        section_id: data.section_id.toString(),
        name: data.name,
        description: data.description || "",
        price: data.price,
        image_src: data.image_src || "",
        image_data: data.image_data || "",
        image_mime_type: data.image_mime_type || "",
        display_order: data.display_order || 0,
      });
      if (data.image_data) {
        setPreview(
          `data:${data.image_mime_type || "image/jpeg"};base64,${data.image_data}`
        );
      } else if (data.image_src) {
        setPreview(data.image_src);
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/menu/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          section_id: parseInt(formData.section_id),
          display_order: parseInt(formData.display_order.toString()) || 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update item");
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
            Edit Menu Item
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
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">
                Upload Image (saved as Base64)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const result = reader.result as string;
                    const base64 = result.split(",")[1] || "";
                    setFormData((prev) => ({
                      ...prev,
                      image_data: base64,
                      image_mime_type: file.type,
                    }));
                    setPreview(result);
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-xs text-veloria-muted file:mr-3 file:rounded-full file:border-0 file:bg-veloria-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.18em] file:text-veloria-black hover:file:bg-veloria-gold-soft"
              />
              {preview && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg border border-veloria-border">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-[0.7rem] text-veloria-muted">
                    This image will be stored in the database as Base64 and
                    decoded on display.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-veloria-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Item"}
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

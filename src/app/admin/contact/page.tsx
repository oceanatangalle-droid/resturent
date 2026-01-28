"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

type ContactForm = {
  restaurant_name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  map_embed_url: string;
  notes: string;
};

export default function AdminContactPage() {
  const router = useRouter();
  const [form, setForm] = useState<ContactForm>({
    restaurant_name: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    map_embed_url: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setForm({
          restaurant_name: data.restaurant_name || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          hours: data.hours || "",
          map_embed_url: data.map_embed_url || "",
          notes: data.notes || "",
        });
      } catch (e) {
        setError("Failed to load contact details");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const handleChange =
    (field: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save contact details");
        return;
      }

      setSuccess("Contact details saved");
    } catch (e) {
      setError("Failed to save contact details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-veloria-black">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <p className="text-veloria-cream text-center">Loading contact details…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-veloria-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 pb-16 pt-10">
        <section className="mt-10">
          <div className="veloria-container px-8 max-w-3xl">
          <h1 className="text-2xl font-semibold text-veloria-cream mb-4">
            Contact Details
          </h1>
          <p className="text-sm text-veloria-muted mb-6">
            Edit the address, phone, email, and hours shown on the public contact page.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-veloria-border bg-veloria-elevated/70 p-6"
          >
            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/50 p-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Restaurant name</label>
              <input
                type="text"
                value={form.restaurant_name}
                onChange={handleChange("restaurant_name")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={handleChange("address")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">
                Hours (one per line)
              </label>
              <textarea
                rows={3}
                value={form.hours}
                onChange={handleChange("hours")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">
                Map embed URL (optional)
              </label>
              <input
                type="text"
                value={form.map_embed_url}
                onChange={handleChange("map_embed_url")}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">
                Extra notes (small text under hours)
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={handleChange("notes")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-veloria-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Contact Details"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/contact")}
                className="rounded-full border border-veloria-border px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream hover:bg-veloria-elevated"
              >
                View Public Page
              </button>
            </div>
          </form>
        </div>
        </section>
      </main>
    </div>
  );
}


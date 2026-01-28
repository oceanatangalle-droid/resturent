"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

type HeroForm = {
  badge_text: string;
  title_line1: string;
  title_line2: string;
  title_highlight: string;
  description: string;
  button_text: string;
  find_us_text: string;
  opening_hours_text: string;
  since_year: string;
  since_description: string;
  badge_title: string;
  badge_subtitle: string;
  highlights_title: string;
  highlight_items: string; // JSON string
  footer_text: string;
};

export default function AdminHeroPage() {
  const router = useRouter();
  const [form, setForm] = useState<HeroForm>({
    badge_text: "",
    title_line1: "",
    title_line2: "",
    title_highlight: "",
    description: "",
    button_text: "",
    find_us_text: "",
    opening_hours_text: "",
    since_year: "",
    since_description: "",
    badge_title: "",
    badge_subtitle: "",
    highlights_title: "",
    highlight_items: JSON.stringify([
      { name: "Black Truffle Risotto", price: "$29" },
      { name: "Herb-Crusted Salmon", price: "$20" },
      { name: "Wagyu Beef Burger", price: "$18" },
    ]),
    footer_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        setForm({
          badge_text: data.badge_text || "",
          title_line1: data.title_line1 || "",
          title_line2: data.title_line2 || "",
          title_highlight: data.title_highlight || "",
          description: data.description || "",
          button_text: data.button_text || "",
          find_us_text: data.find_us_text || "",
          opening_hours_text: data.opening_hours_text || "",
          since_year: data.since_year || "",
          since_description: data.since_description || "",
          badge_title: data.badge_title || "",
          badge_subtitle: data.badge_subtitle || "",
          highlights_title: data.highlights_title || "",
          highlight_items: data.highlight_items || form.highlight_items,
          footer_text: data.footer_text || "",
        });
      } catch (e) {
        setError("Failed to load hero content");
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleChange =
    (field: keyof HeroForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save hero content");
        return;
      }

      setSuccess("Hero content saved successfully!");
    } catch (e) {
      setError("Failed to save hero content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-veloria-black">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          <p className="text-veloria-cream text-center">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-veloria-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 pb-16 pt-10">
        <section className="mt-10">
          <div className="veloria-container px-8 max-w-4xl">
          <h1 className="text-2xl font-semibold text-veloria-cream mb-4">
            Edit Hero Section
          </h1>

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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Badge Text</label>
                <input
                  type="text"
                  value={form.badge_text}
                  onChange={handleChange("badge_text")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Button Text</label>
                <input
                  type="text"
                  value={form.button_text}
                  onChange={handleChange("button_text")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Title Line 1</label>
              <input
                type="text"
                value={form.title_line1}
                onChange={handleChange("title_line1")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Title Line 2</label>
                <input
                  type="text"
                  value={form.title_line2}
                  onChange={handleChange("title_line2")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Title Highlight</label>
                <input
                  type="text"
                  value={form.title_highlight}
                  onChange={handleChange("title_highlight")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={handleChange("description")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Find Us Text</label>
                <textarea
                  rows={2}
                  value={form.find_us_text}
                  onChange={handleChange("find_us_text")}
                  className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Opening Hours</label>
                <textarea
                  rows={2}
                  value={form.opening_hours_text}
                  onChange={handleChange("opening_hours_text")}
                  className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Since Year</label>
                <input
                  type="text"
                  value={form.since_year}
                  onChange={handleChange("since_year")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Since Description</label>
                <input
                  type="text"
                  value={form.since_description}
                  onChange={handleChange("since_description")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Badge Title</label>
                <input
                  type="text"
                  value={form.badge_title}
                  onChange={handleChange("badge_title")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Badge Subtitle</label>
                <input
                  type="text"
                  value={form.badge_subtitle}
                  onChange={handleChange("badge_subtitle")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Highlights Title</label>
              <input
                type="text"
                value={form.highlights_title}
                onChange={handleChange("highlights_title")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">
                Highlight Items (JSON array: [{"{"}"name": "...", "price": "..."{"}"}])
              </label>
              <textarea
                rows={5}
                value={form.highlight_items}
                onChange={handleChange("highlight_items")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Footer Text</label>
              <input
                type="text"
                value={form.footer_text}
                onChange={handleChange("footer_text")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-veloria-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Hero Content"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full border border-veloria-border px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream hover:bg-veloria-elevated"
              >
                View Homepage
              </button>
            </div>
          </form>
        </div>
        </section>
      </main>
    </div>
  );
}

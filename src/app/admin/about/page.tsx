"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

type AboutForm = {
  section_title: string;
  main_title: string;
  paragraph1: string;
  paragraph2: string;
  since_year: string;
  since_description: string;
  seats_number: string;
  seats_description: string;
  style_name: string;
  style_description: string;
  room_title: string;
  room_paragraph1: string;
  room_paragraph2: string;
  room_footer_text: string;
};

export default function AdminAboutPage() {
  const router = useRouter();
  const [form, setForm] = useState<AboutForm>({
    section_title: "",
    main_title: "",
    paragraph1: "",
    paragraph2: "",
    since_year: "",
    since_description: "",
    seats_number: "",
    seats_description: "",
    style_name: "",
    style_description: "",
    room_title: "",
    room_paragraph1: "",
    room_paragraph2: "",
    room_footer_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        setForm({
          section_title: data.section_title || "",
          main_title: data.main_title || "",
          paragraph1: data.paragraph1 || "",
          paragraph2: data.paragraph2 || "",
          since_year: data.since_year || "",
          since_description: data.since_description || "",
          seats_number: data.seats_number || "",
          seats_description: data.seats_description || "",
          style_name: data.style_name || "",
          style_description: data.style_description || "",
          room_title: data.room_title || "",
          room_paragraph1: data.room_paragraph1 || "",
          room_paragraph2: data.room_paragraph2 || "",
          room_footer_text: data.room_footer_text || "",
        });
      } catch (e) {
        setError("Failed to load about content");
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleChange =
    (field: keyof AboutForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save about content");
        return;
      }

      setSuccess("About content saved successfully!");
    } catch (e) {
      setError("Failed to save about content");
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
            Edit About Section
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

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Section Title</label>
              <input
                type="text"
                value={form.section_title}
                onChange={handleChange("section_title")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Main Title</label>
              <input
                type="text"
                value={form.main_title}
                onChange={handleChange("main_title")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Paragraph 1</label>
              <textarea
                rows={4}
                value={form.paragraph1}
                onChange={handleChange("paragraph1")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Paragraph 2</label>
              <textarea
                rows={4}
                value={form.paragraph2}
                onChange={handleChange("paragraph2")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Since Year</label>
                <input
                  type="text"
                  value={form.since_year}
                  onChange={handleChange("since_year")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
                <input
                  type="text"
                  value={form.since_description}
                  onChange={handleChange("since_description")}
                  placeholder="Since description"
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Seats Number</label>
                <input
                  type="text"
                  value={form.seats_number}
                  onChange={handleChange("seats_number")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
                <input
                  type="text"
                  value={form.seats_description}
                  onChange={handleChange("seats_description")}
                  placeholder="Seats description"
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-veloria-muted">Style Name</label>
                <input
                  type="text"
                  value={form.style_name}
                  onChange={handleChange("style_name")}
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
                <input
                  type="text"
                  value={form.style_description}
                  onChange={handleChange("style_description")}
                  placeholder="Style description"
                  className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Room Title</label>
              <input
                type="text"
                value={form.room_title}
                onChange={handleChange("room_title")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Room Paragraph 1</label>
              <textarea
                rows={3}
                value={form.room_paragraph1}
                onChange={handleChange("room_paragraph1")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Room Paragraph 2</label>
              <textarea
                rows={3}
                value={form.room_paragraph2}
                onChange={handleChange("room_paragraph2")}
                className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-veloria-muted">Room Footer Text</label>
              <input
                type="text"
                value={form.room_footer_text}
                onChange={handleChange("room_footer_text")}
                className="w-full h-10 rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-veloria-gold px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black hover:bg-veloria-gold-soft disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save About Content"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/about")}
                className="rounded-full border border-veloria-border px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream hover:bg-veloria-elevated"
              >
                View About Page
              </button>
            </div>
          </form>
        </div>
        </section>
      </main>
    </div>
  );
}

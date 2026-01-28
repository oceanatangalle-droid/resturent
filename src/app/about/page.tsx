 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

type AboutContent = {
  section_title?: string;
  main_title?: string;
  paragraph1?: string;
  paragraph2?: string;
  since_year?: string;
  since_description?: string;
  seats_number?: string;
  seats_description?: string;
  style_name?: string;
  style_description?: string;
  room_title?: string;
  room_paragraph1?: string;
  room_paragraph2?: string;
  room_footer_text?: string;
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        setContent(data);
      } catch (e) {
        // Use defaults if fetch fails
      }
    };
    fetchAbout();
  }, []);

  return (
    <main className="min-h-screen bg-veloria-black pb-16 pt-10">
      <header className="border-b border-white/5 bg-veloria-black/80">
        <div className="veloria-container flex items-center justify-between py-4">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-veloria-muted hover:text-veloria-cream">
            Veloria
          </Link>
          <nav className="flex items-center gap-6 text-xs font-medium text-veloria-muted">
            <Link href="/menu" className="hover:text-veloria-cream">
              Menu
            </Link>
            <span className="text-veloria-cream">About</span>
            <Link
              href="/book-a-table"
              className="rounded-full bg-veloria-cream px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_16px_36px_rgba(0,0,0,0.7)] hover:bg-white"
            >
              Book A Table
            </Link>
          </nav>
        </div>
      </header>

      <section className="mt-10">
        <div className="veloria-container">
          <motion.div
            className="grid gap-10 md:grid-cols-[1.1fr_minmax(0,0.9fr)]"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            <div className="space-y-6">
              <p className="veloria-section-title text-veloria-muted">
                {content?.section_title || "About Veloria"}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-veloria-cream md:text-4xl">
                {content?.main_title || "A neighborhood classic with a cinematic glow."}
              </h1>
              <p className="text-sm leading-relaxed text-veloria-muted md:text-base">
                {content?.paragraph1 || "Veloria is imagined as a warm, modern restaurant tucked beside Washington Square, inspired by the atmosphere of the Veloria – Premium Framer Restaurant Template. We translated its visual identity into this Next.js experience: deep blacks, soft golden highlights, and minimal typography that lets the food do the talking."}
              </p>
              <p className="text-sm leading-relaxed text-veloria-muted md:text-base">
                {content?.paragraph2 || "From breakfast to late-night mocktails, the menu is designed around shared plates, bright flavors, and a laid-back rhythm. The energy is relaxed yet intentional—perfect for unhurried conversations, anniversaries, and everything in between."}
              </p>
              <div className="grid gap-4 text-xs text-veloria-muted md:grid-cols-3">
                <div>
                  <p className="uppercase tracking-[0.22em]">Since</p>
                  <p className="mt-1 text-veloria-cream">{content?.since_year || "1980"}</p>
                  <p className="mt-1">
                    {content?.since_description || "Four decades of hospitality in the heart of New York."}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.22em]">Seats</p>
                  <p className="mt-1 text-veloria-cream">{content?.seats_number || "64"}</p>
                  <p className="mt-1">
                    {content?.seats_description || "Intimate booths, window tables, and bar seating."}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.22em]">Style</p>
                  <p className="mt-1 text-veloria-cream">{content?.style_name || "Modern European"}</p>
                  <p className="mt-1">
                    {content?.style_description || "Seasonal produce and classic techniques with a twist."}
                  </p>
                </div>
              </div>
            </div>

            <div className="veloria-card relative overflow-hidden p-6">
              <div className="veloria-gradient-ring" />
              <div className="relative space-y-4 text-sm text-veloria-muted">
                <p className="text-xs uppercase tracking-[0.22em] text-veloria-muted">
                  {content?.room_title || "The Room"}
                </p>
                <p>
                  {content?.room_paragraph1 || "Low lighting, brass details, and soft playlists shape the atmosphere. The palette is dark and cinematic, echoing the original template's mood while remaining timeless."}
                </p>
                <p>
                  {content?.room_paragraph2 || "We designed this clone to be a starting point for real restaurants: fully built in Next.js and animated with Framer Motion, ready for your own brand, photography, and content."}
                </p>
                <p className="pt-2 text-xs text-veloria-gold-soft">
                  {content?.room_footer_text || "Built as a faithful, code-based interpretation of the Veloria Framer template."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}


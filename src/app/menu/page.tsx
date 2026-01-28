"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.04,
      ease: [0.25, 0.6, 0.3, 0.98],
    },
  }),
};

type MenuItem = {
  id: number;
  section_id: number;
  name: string;
  description: string | null;
  price: string;
  image_src: string | null;
  image_data: string | null;
  image_mime_type: string | null;
  display_order: number;
};

type Section = {
  id: number;
  title: string;
  subtitle: string | null;
  display_order: number;
  items: MenuItem[];
};

export default function MenuPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu/full");
      if (!response.ok) throw new Error("Failed to fetch menu");
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-veloria-black pb-16 pt-10">
      <header className="border-b border-white/5 bg-veloria-black/80">
        <div className="veloria-container flex items-center justify-between py-4">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.22em] text-veloria-muted hover:text-veloria-cream">
            Veloria
          </Link>
          <nav className="flex items-center gap-6 text-xs font-medium text-veloria-muted">
            <span className="text-veloria-cream">Menu</span>
            <Link href="/about" className="hover:text-veloria-cream">
              About
            </Link>
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
        <div className="veloria-container space-y-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="max-w-2xl space-y-4"
          >
            <p className="veloria-section-title text-veloria-muted">Our Menu</p>
            <h1 className="text-3xl font-semibold tracking-tight text-veloria-cream md:text-4xl">
              Seasonal plates, crafted to share or savour.
            </h1>
            <p className="text-sm leading-relaxed text-veloria-muted md:text-base">
              Explore our curated menu inspired by the original Veloria
              template at{" "}
              <a
                href="https://navy-usability-579669.framer.app/menu"
                className="underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                navy-usability-579669.framer.app/menu
              </a>
              . From bright breakfasts to late-night signatures, every dish is
              designed to pair with our warm interior and soft playlists.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-veloria-cream py-20">
              Loading menu...
            </div>
          ) : (
            <div className="space-y-14">
              {sections.map((section) => (
                <motion.section
                  key={section.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={container}
              >
                <header className="mb-4 flex items-center justify-between gap-4 border-b border-veloria-border/50 pb-3">
                  <h2 className="text-lg font-semibold tracking-tight text-veloria-cream md:text-xl">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-xs uppercase tracking-[0.22em] text-veloria-muted">
                      {section.subtitle}
                    </p>
                  )}
                </header>

                <div className="space-y-3">
                  {section.items.length === 0 ? (
                    <p className="text-sm text-veloria-muted italic py-4">
                      No items available in this section
                    </p>
                  ) : (
                    section.items.map((menuItem, index) => (
                      <motion.article
                        key={menuItem.id}
                      className="flex items-center gap-4 rounded-xl border border-veloria-border bg-veloria-elevated/70 p-4 transition hover:bg-veloria-elevated/90"
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={item}
                    >
                      {(menuItem.image_src || menuItem.image_data) && (
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-veloria-border bg-veloria-black/60">
                          <Image
                            src={
                              menuItem.image_src ||
                              `data:${menuItem.image_mime_type || "image/jpeg"};base64,${menuItem.image_data}`
                            }
                            alt={menuItem.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-veloria-cream md:text-base">
                          {menuItem.name}
                        </h3>
                        {menuItem.description && (
                          <p className="mt-1 text-xs leading-relaxed text-veloria-muted md:text-sm">
                            {menuItem.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center rounded-lg bg-veloria-black px-3 py-1.5 text-sm font-medium text-veloria-cream">
                          {menuItem.price}
                        </span>
                      </div>
                      </motion.article>
                    ))
                  )}
                </div>
              </motion.section>
            ))}
          </div>
          )}
        </div>
      </section>
    </main>
  );
}


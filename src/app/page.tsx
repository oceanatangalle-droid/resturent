 "use client";

import Link from "next/link";
import { Hero } from "@/components/hero";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export default function Home() {
  return (
    <main className="relative min-h-screen pb-16 pt-10">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-veloria-black/80 backdrop-blur-lg">
        <div className="veloria-container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-veloria-border bg-gradient-to-br from-veloria-gold/40 via-veloria-elevated to-veloria-black text-sm font-semibold text-veloria-black shadow-[0_0_0_1px_rgba(0,0,0,0.7)]">
              V
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium tracking-[0.28em] uppercase text-veloria-muted">
                Veloria
              </div>
              <p className="text-xs text-veloria-muted/80">
                Fine Dining Restaurant
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-veloria-muted md:flex">
            <Link href="/menu" className="transition hover:text-veloria-cream">
              Menu
            </Link>
            <Link href="/about" className="transition hover:text-veloria-cream">
              About
            </Link>
            <Link
              href="/book-a-table"
              className="inline-flex items-center gap-2 rounded-full bg-veloria-cream px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_18px_40px_rgba(0,0,0,0.65)] transition hover:bg-white"
            >
              Book A Table
            </Link>
          </nav>
          <Link
            href="/book-a-table"
            className="inline-flex items-center gap-2 rounded-full bg-veloria-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_16px_32px_rgba(0,0,0,0.7)] transition hover:bg-white md:hidden"
          >
            Book
          </Link>
        </div>
      </header>

      <section className="mt-10">
        <div className="veloria-container">
          <Hero />
        </div>
      </section>

      <section className="mt-20">
        <div className="veloria-container">
          <motion.div
            className="grid gap-10 rounded-3xl border border-veloria-border bg-gradient-to-br from-veloria-elevated/70 via-veloria-black to-veloria-black/95 p-8 md:grid-cols-[1.1fr_minmax(0,0.9fr)] md:p-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            <div className="space-y-6">
              <p className="veloria-section-title text-veloria-muted">
                Our Philosophy
              </p>
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-veloria-cream md:text-3xl">
                Great moments begin with great tastes.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-veloria-muted md:text-base">
                Inspired by the timeless brasseries of Europe and the vibrant
                energy of New York, Veloria is where seasonal ingredients meet
                careful craft. From sunrise breakfasts to candlelit dinners, our
                kitchen is dedicated to turning every visit into a memory.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-veloria-muted">
                <span className="veloria-pill px-3 py-1">
                  Chef-crafted seasonal menus
                </span>
                <span className="veloria-pill px-3 py-1">
                  Locally sourced ingredients
                </span>
                <span className="veloria-pill px-3 py-1">
                  Intimate dining ambience
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-veloria-border bg-veloria-black/60 p-6">
              <div>
                <p className="veloria-section-title text-veloria-muted">
                  Visit Us
                </p>
                <p className="mt-3 text-sm text-veloria-muted">
                  70 Washington Square South,
                  <br />
                  New York, NY 10012, United States
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="veloria-badge flex items-center gap-3 px-4 py-2 text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-veloria-gold/15 text-[0.7rem] font-semibold text-veloria-gold-soft">
                    1980
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.2em]">
                      Since
                    </p>
                    <p className="text-xs text-veloria-cream">
                      Four decades of flavor
                    </p>
                  </div>
                </div>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-gold-soft"
                >
                  View Full Menu
                  <span className="h-px w-7 bg-veloria-gold-soft/70" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-20 md:mt-24">
        <div className="veloria-container">
          <motion.div
            className="rounded-3xl border border-veloria-border bg-veloria-elevated/60 px-6 py-7 md:flex md:items-center md:justify-between md:px-10 md:py-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            <div className="space-y-2">
              <p className="veloria-section-title text-veloria-muted">
                Book A Table
              </p>
              <h3 className="text-lg font-semibold tracking-tight text-veloria-cream md:text-xl">
                Reserve your next evening at Veloria.
              </h3>
              <p className="max-w-xl text-sm text-veloria-muted">
                Whether it&apos;s a quiet date night or a celebration with
                friends, secure your preferred time in just a few clicks.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-0">
              <Link
                href="/book-a-table"
                className="inline-flex items-center justify-center rounded-full bg-veloria-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_18px_40px_rgba(0,0,0,0.75)] transition hover:bg-veloria-gold-soft"
              >
                Book Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-veloria-border px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream/80 hover:bg-veloria-black/60"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="mt-16 border-t border-white/5 pt-6 pb-8 text-xs text-veloria-muted">
        <div className="veloria-container flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Veloria Restaurant. All rights reserved.</p>
          <p className="text-[0.7rem]">
            Concept inspired by{" "}
            <a
              href="https://navy-usability-579669.framer.app"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Veloria – Premium Framer Restaurant Template
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}

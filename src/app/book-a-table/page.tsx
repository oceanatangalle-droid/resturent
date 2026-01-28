 "use client";

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

export default function BookATablePage() {
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
            <Link href="/about" className="hover:text-veloria-cream">
              About
            </Link>
            <span className="rounded-full bg-veloria-cream px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_16px_36px_rgba(0,0,0,0.7)]">
              Book A Table
            </span>
          </nav>
        </div>
      </header>

      <section className="mt-10">
        <div className="veloria-container">
          <motion.div
            className="grid gap-10 md:grid-cols-[1.05fr_minmax(0,0.95fr)]"
            initial="hidden"
            animate="visible"
            variants={container}
          >
            <div className="space-y-6">
              <p className="veloria-section-title text-veloria-muted">
                Reservations
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-veloria-cream md:text-4xl">
                Book your next evening at Veloria.
              </h1>
              <p className="text-sm leading-relaxed text-veloria-muted md:text-base">
                Reserve a table for two, four, or a small celebration. Once this
                template is connected to your backend or booking provider, these
                details can be sent directly to your system of choice.
              </p>

              <form className="space-y-4 rounded-2xl border border-veloria-border bg-veloria-elevated/80 p-5 text-sm md:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs text-veloria-muted">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Alex Rivera"
                      className="h-10 w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs text-veloria-muted">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-10 w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label htmlFor="date" className="text-xs text-veloria-muted">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      className="h-10 w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="time" className="text-xs text-veloria-muted">
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      className="h-10 w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="guests" className="text-xs text-veloria-muted">
                      Guests
                    </label>
                    <select
                      id="guests"
                      className="h-10 w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                      <option value="7+">7+ guests</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-xs text-veloria-muted">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Allergies, celebrations, or special requests…"
                    className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                  />
                </div>

                <button
                  type="button"
                  className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-veloria-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_18px_40px_rgba(0,0,0,0.75)] transition hover:bg-veloria-gold-soft"
                >
                  Submit Request (demo)
                </button>

                <p className="pt-1 text-[0.7rem] text-veloria-muted">
                  This is a front-end only booking form in this clone. Connect
                  it to your own API, booking provider, or email workflow.
                </p>
              </form>
            </div>

            <div className="space-y-6 text-sm text-veloria-muted">
              <div className="veloria-card p-6">
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-veloria-muted">
                    Dining Guide
                  </p>
                  <p>
                    We hold tables for 15 minutes from your selected time. For
                    groups of 7 or more, our team will follow up to confirm
                    details and a set menu if needed.
                  </p>
                  <p>
                    Cancellations within 24 hours are appreciated so we can
                    offer your table to guests on our waitlist.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-veloria-border bg-veloria-elevated/80 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-veloria-muted">
                  Contact
                </p>
                <p className="mt-3 text-veloria-cream">
                  70 Washington Square South,
                  <br />
                  New York, NY 10012, United States
                </p>
                <p className="mt-3">
                  Phone:{" "}
                  <a
                    href="tel:+11234567890"
                    className="text-veloria-gold-soft underline-offset-4 hover:underline"
                  >
                    +1 (123) 456-7890
                  </a>
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:reservations@veloria.nyc"
                    className="text-veloria-gold-soft underline-offset-4 hover:underline"
                  >
                    reservations@veloria.nyc
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}


"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  },
};

type ContactDetails = {
  restaurant_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  map_embed_url?: string;
  notes?: string;
};

export default function ContactPage() {
  const [contact, setContact] = useState<ContactDetails | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setContact(data);
      } catch (e) {
        // ignore, fallback UI will render
      }
    };
    fetchContact();
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
            <Link href="/about" className="hover:text-veloria-cream">
              About
            </Link>
            <span className="text-veloria-cream">Contact</span>
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
                Contact
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-veloria-cream md:text-4xl">
                Let&apos;s make your next visit unforgettable.
              </h1>
              <p className="text-sm leading-relaxed text-veloria-muted md:text-base">
                Reach out for private events, special occasions, or press.
                This contact page mirrors the intent of the{" "}
                <a
                  href="https://navy-usability-579669.framer.app/contact"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Veloria Framer contact template
                </a>{" "}
                and is ready to be wired to your own API or form provider.
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

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs text-veloria-muted">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Private dinner, press, or reservation question…"
                    className="h-10 w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs text-veloria-muted">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us a bit more about how we can help…"
                    className="w-full rounded-lg border border-veloria-border bg-veloria-black/70 px-3 py-2 text-sm text-veloria-cream outline-none ring-0 focus:border-veloria-gold focus:ring-1 focus:ring-veloria-gold/60"
                  />
                </div>

                <button
                  type="button"
                  className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-veloria-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_18px_40px_rgba(0,0,0,0.75)] transition hover:bg-veloria-gold-soft"
                >
                  Send Message (demo)
                </button>

                <p className="pt-1 text-[0.7rem] text-veloria-muted">
                  This form is for demonstration only. Hook it up to your email
                  service, CRM, or serverless function.
                </p>
              </form>
            </div>

            <div className="space-y-6 text-sm text-veloria-muted">
              <div className="rounded-2xl border border-veloria-border bg-veloria-elevated/80 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-veloria-muted">
                  Visit Us
                </p>
                <p className="mt-3 text-veloria-cream">
                  {(contact?.address || "70 Washington Square South,\nNew York, NY 10012, United States")
                    .split("\n")
                    .map((line) => (
                      <>
                        {line}
                        <br />
                      </>
                    ))}
                </p>
                <p className="mt-3">
                  Phone:{" "}
                  <a
                    href={`tel:${contact?.phone || "+11234567890"}`}
                    className="text-veloria-gold-soft underline-offset-4 hover:underline"
                  >
                    {contact?.phone || "+1 (123) 456-7890"}
                  </a>
                  <br />
                  Email:{" "}
                  <a
                    href={`mailto:${contact?.email || "hello@veloria.nyc"}`}
                    className="text-veloria-gold-soft underline-offset-4 hover:underline"
                  >
                    {contact?.email || "hello@veloria.nyc"}
                  </a>
                </p>
              </div>

              <div className="rounded-2xl border border-veloria-border bg-veloria-black/60 p-6 text-xs">
                <p className="uppercase tracking-[0.22em] text-veloria-muted">
                  Hours
                </p>
                <p className="mt-3">
                  {(contact?.hours ||
                    "Breakfast 7 – 11 AM\nLunch 12 – 3 PM\nDinner 6 – 11 PM")
                    .split("\n")
                    .map((line) => (
                      <>
                        {line}
                        <br />
                      </>
                    ))}
                </p>
                <p className="mt-3 text-veloria-muted">
                  {contact?.notes ||
                    "For last-minute availability, please call the restaurant directly."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}


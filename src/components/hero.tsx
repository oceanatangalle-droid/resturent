"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.19, 0.6, 0.26, 0.98] as [number, number, number, number],
    },
  },
};

const imageCard = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 0.7, 0.24, 1] as [number, number, number, number],
      delay: 0.12,
    },
  },
};

type HeroContent = {
  badge_text?: string;
  title_line1?: string;
  title_line2?: string;
  title_highlight?: string;
  description?: string;
  button_text?: string;
  find_us_text?: string;
  opening_hours_text?: string;
  since_year?: string;
  since_description?: string;
  badge_title?: string;
  badge_subtitle?: string;
  highlights_title?: string;
  highlight_items?: string;
  footer_text?: string;
};

export const Hero = () => {
  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        setContent(data);
      } catch (e) {
        // Use defaults if fetch fails
      }
    };
    fetchHero();
  }, []);

  const highlights = content?.highlight_items
    ? (typeof content.highlight_items === 'string'
        ? JSON.parse(content.highlight_items)
        : content.highlight_items)
    : [
        { name: 'Black Truffle Risotto', price: '$29' },
        { name: 'Herb-Crusted Salmon', price: '$20' },
        { name: 'Wagyu Beef Burger', price: '$18' },
      ];

  return (
    <div className="veloria-grid items-start">
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-veloria-border bg-veloria-black/60 px-3 py-1.5 text-xs text-veloria-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-veloria-gold-soft" />
          <span className="uppercase tracking-[0.22em]">
            {content?.badge_text || "Great Moments with Great Tastes"}
          </span>
        </div>

        <div className="space-y-6">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-veloria-cream md:text-5xl lg:text-[3.3rem] lg:leading-[1.05]">
            {content?.title_line1 || "Great moments begin"}
            <br />
            {content?.title_line2 || "with"}{" "}
            <span className="bg-gradient-to-r from-veloria-gold via-veloria-gold-soft to-veloria-cream bg-clip-text text-transparent">
              {content?.title_highlight || "unforgettable tastes."}
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-veloria-muted md:text-base">
            {content?.description || "Step into Veloria, a warm corner of New York where refined flavors, candlelight, and curated playlists set the stage for evenings you will want to linger in."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/book-a-table"
            className="inline-flex items-center justify-center rounded-full bg-veloria-gold px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-black shadow-[0_22px_55px_rgba(0,0,0,0.85)] transition hover:bg-veloria-gold-soft"
          >
            {content?.button_text || "Book A Table"}
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-veloria-border px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-veloria-cream/85 hover:bg-veloria-black/60"
          >
            View Menu
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-veloria-muted">
          <div className="space-y-1">
            <p className="uppercase tracking-[0.2em]">Find Us</p>
            <p className="max-w-xs text-veloria-muted">
              {content?.find_us_text || "70 Washington Square South, New York, NY 10012, United States"}
            </p>
          </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-veloria-border to-transparent" />
          <div>
            <p className="uppercase tracking-[0.2em]">Opening Hours</p>
            <p className="text-veloria-muted">
              {content?.opening_hours_text || "Breakfast 7 – 11 AM • Lunch 12 – 3 PM • Dinner 6 – 11 PM"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative mt-10 md:mt-0"
        initial="hidden"
        animate="visible"
        variants={imageCard}
      >
        <div className="veloria-card relative overflow-hidden p-5 md:p-6">
          <div className="veloria-gradient-ring" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-veloria-muted">
                  Since {content?.since_year || "1980"}
                </p>
                <p className="mt-1 text-sm text-veloria-cream">
                  {content?.since_description || "A New York classic for over 40 years."}
                </p>
              </div>
              <div className="veloria-badge px-3 py-2 text-right text-[0.7rem] leading-tight">
                <p className="uppercase tracking-[0.22em]">{content?.badge_title || "Michelin-level"}</p>
                <p className="text-xs text-veloria-cream">
                  {content?.badge_subtitle || "Dining without the formality."}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-veloria-border bg-veloria-black/60 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-veloria-muted">
                {content?.highlights_title || "Tonight's Highlights"}
              </p>
              <div className="space-y-2 text-xs text-veloria-cream/90">
                {highlights.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <span>{item.name}</span>
                    <span className="text-veloria-muted">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[0.7rem] text-veloria-muted">
              <p>{content?.footer_text || "Walk-ins welcome • Limited terrace seating"}</p>
              <p className="text-veloria-gold-soft">NYC • EST. {content?.since_year || "1980"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


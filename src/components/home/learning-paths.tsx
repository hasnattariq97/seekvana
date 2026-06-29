"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, CheckCircle2, Layers, ImageIcon } from "lucide-react";

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

const PILLS = [
  { icon: Clock3,       label: "Under 5 min per topic" },
  { icon: CheckCircle2, label: "Hands-on from day one" },
  { icon: Layers,       label: "10 modules · 101 topics" },
];

export function LearningPaths() {
  return (
    <section className="bg-surface-subtle py-20 px-4">
      <div className="max-w-screen-lg mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-fraunces text-3xl text-primary">Learning paths</h2>
            <p className="text-sm text-secondary mt-1.5">
              Three structured paths through Agentic AI — pick your level.
            </p>
          </div>
          <Link
            href="/paths"
            className="text-sm text-accent font-medium hover:text-accent-deep transition-colors shrink-0 mb-1"
          >
            View all →
          </Link>
        </div>

        {/* Featured card */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EXPO_EASE }}
          whileHover={{ y: -2, transition: { duration: 0.18, ease: "easeOut" } }}
          className="group relative bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent/25 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
        >
          {/* Full-card link */}
          <Link
            href="/paths/getting-started"
            className="absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:outline-none"
            aria-label="Start Getting Started learning path"
          />

          {/* ── Left: content ── */}
          <div className="flex-1 flex flex-col justify-between px-8 py-7 md:px-10 md:py-8 min-w-0">

            <div>
              {/* Eyebrow */}
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary mb-4">
                Learning Path · Beginner · Free
              </p>

              {/* Title */}
              <h3 className="font-fraunces text-[1.85rem] md:text-[2.1rem] leading-[1.08] font-medium tracking-tight text-primary mb-3">
                Your journey from{" "}
                <em className="not-italic text-accent">curious</em>
                {" "}to{" "}
                <em className="italic text-primary">confident</em>
              </h3>

              {/* Description */}
              <p className="text-[13.5px] text-secondary leading-relaxed max-w-[42ch] mb-5">
                Terminal, Python, Git, APIs, deployment — everything you need before you build your first AI app.
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-2">
                {PILLS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-[11.5px] text-secondary bg-surface-subtle border border-border rounded-full px-3 py-1.5"
                  >
                    <Icon size={10} strokeWidth={2.2} className="text-accent shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 mt-7">
              <span
                className="inline-flex items-center gap-2 bg-accent group-hover:bg-accent-deep text-white rounded-xl px-5 py-2.5 text-[13.5px] font-semibold transition-colors duration-200"
                aria-hidden="true"
              >
                Start the path
                <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="text-[12px] text-secondary">No experience needed</span>
            </div>
          </div>

          {/* ── Right: image area ── */}
          <div className="hidden md:flex w-[360px] lg:w-[420px] shrink-0 relative overflow-hidden bg-[var(--color-surface-subtle)] border-l border-border min-h-[260px]">

            {/* Subtle warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/40 via-transparent to-surface-subtle pointer-events-none" />

            {/* Placeholder */}
            <div className="absolute inset-5 rounded-xl border-2 border-dashed border-border/70 flex flex-col items-center justify-center gap-2 text-center p-4">
              <div className="w-9 h-9 rounded-xl bg-accent-soft flex items-center justify-center mb-0.5">
                <ImageIcon size={16} className="text-accent" aria-hidden="true" />
              </div>
              <p className="text-[11px] font-semibold text-secondary">Your illustration here</p>
              <p className="text-[15px] font-bold text-primary font-mono tracking-tight">880 × 560 px</p>
              <p className="text-[10px] text-secondary/60 leading-relaxed">
                WebP or PNG · object-cover<br />
                <code className="text-accent/70 text-[9px]">public/images/paths/getting-started/cover.webp</code>
              </p>
            </div>

            {/* Hover brightening */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none" />
          </div>

        </motion.article>
      </div>
    </section>
  );
}

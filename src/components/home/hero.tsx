"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "@/context/search-context";

const SEARCH_CHIPS = ["Agentic AI", "RAG", "Prompting", "Evals"] as const;

interface HeroProps {
  articleCount: number;
  pathCount: number;
}

export function Hero({ articleCount, pathCount }: HeroProps) {
  const { openSearch } = useSearch();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] bg-canvas overflow-hidden px-4">
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,99,63,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto py-24 md:py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 bg-accent-soft text-accent text-sm rounded-full px-4 py-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            {articleCount} articles · {pathCount} learning paths
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="font-fraunces text-5xl md:text-6xl font-medium text-primary leading-tight tracking-tight text-balance"
        >
          Learn AI,{" "}
          <span className="text-accent">clearly.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          className="font-inter text-lg text-secondary max-w-lg mx-auto leading-relaxed"
        >
          From your first prompt to production-grade agents — clear, well-sourced
          writing for beginners and builders alike.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          className="w-full max-w-md"
        >
          <button
            onClick={openSearch}
            className="flex items-center gap-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-secondary hover:ring-2 hover:ring-accent/30 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none transition-all"
          >
            <Search size={18} className="shrink-0 text-secondary" />
            <span className="text-sm">What do you want to understand?</span>
          </button>
        </motion.div>

        {/* Quick chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.27 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={openSearch}
              className="bg-surface-subtle border border-border rounded-full text-sm text-secondary px-4 py-1.5 hover:text-accent hover:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none transition-colors"
            >
              {chip}
            </button>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.33 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/paths/getting-started"
            className="bg-accent text-white rounded-lg px-8 py-3 font-medium hover:bg-accent-deep focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors"
          >
            Start Learning →
          </Link>
          <Link
            href="/library"
            className="border border-border text-primary rounded-lg px-6 py-3 font-medium hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors"
          >
            Explore Library
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-secondary pt-1"
        >
          {["Beginner Friendly", "Production Focused", "Expert Crafted", "Practical Examples"].map(
            (label) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="text-accent text-xs" aria-hidden="true">✦</span>
                {label}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}

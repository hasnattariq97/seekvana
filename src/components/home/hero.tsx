"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "@/context/search-context";

const SEARCH_CHIPS = ["Agentic AI", "RAG", "Prompting", "Evals"] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  };
}

export function Hero() {
  const { openSearch } = useSearch();

  return (
    <section className="bg-canvas py-24 md:py-32 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Pill badge */}
        <motion.div {...fadeUp(0)}>
          <span className="bg-accent-soft text-accent text-sm rounded-full px-4 py-1 inline-block">
            218 articles · 9 learning paths
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.08)}
          className="font-fraunces text-5xl md:text-6xl font-medium text-primary leading-tight"
        >
          Learn AI, clearly —
          <br className="hidden sm:block" />
          from zero to agentic
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeUp(0.16)}
          className="font-inter text-lg text-secondary max-w-xl mx-auto"
        >
          From your first prompt to production-grade agents — clear,
          well-sourced writing for beginners and builders alike.
        </motion.p>

        {/* Search bar + chips */}
        <motion.div {...fadeUp(0.24)} className="w-full max-w-lg space-y-3">
          <button
            onClick={openSearch}
            className="flex items-center gap-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-secondary hover:ring-2 hover:ring-accent/30 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none transition-all"
          >
            <Search size={18} className="shrink-0 text-secondary" />
            <span className="text-sm">What do you want to understand?</span>
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            {SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={openSearch}
                className="bg-surface-subtle border border-border rounded-full text-sm text-secondary px-4 py-1.5 hover:text-accent hover:border-accent transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.32)} className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/paths/ai-for-beginners"
            className="bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent-deep transition-colors"
          >
            Start Learning →
          </Link>
          <Link
            href="/library"
            className="border border-border text-primary rounded-lg px-6 py-3 font-medium hover:bg-surface-subtle transition-colors"
          >
            Explore Topics
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

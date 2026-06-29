"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  MessageSquareText,
  Bot,
  Wrench,
  Share2,
  Brain,
  BarChart3,
  CloudUpload,
  UserRound,
  Rocket,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearch } from "@/context/search-context";

const CYCLE_WORDS = ["LEARN", "BUILD", "GROW", "TOGETHER"] as const;
const CYCLE_INTERVAL_MS = 2000;

const TOPIC_CHIPS = ["Agentic AI", "RAG", "Prompting", "Evals"] as const;

const TRUST_ITEMS: { label: string; Icon: LucideIcon }[] = [
  { label: "Beginner Friendly", Icon: UserRound },
  { label: "Production Focused", Icon: Rocket },
  { label: "Expert Crafted", Icon: ShieldCheck },
  { label: "Practical Examples", Icon: Lightbulb },
];

const FLOATING_CARDS: {
  label: string;
  Icon: LucideIcon;
  className: string;
  delay: string;
}[] = [
  { label: "Prompt Engineering", Icon: MessageSquareText, className: "left-[2%] top-[16%]",                delay: "0s"   },
  { label: "Agentic AI",         Icon: Bot,               className: "left-1/2 top-[4%] -translate-x-1/2", delay: "0.5s" },
  { label: "Tools",              Icon: Wrench,            className: "right-[2%] top-[16%]",               delay: "1s"   },
  { label: "RAG",                Icon: Share2,            className: "left-[0%] top-[44%]",                delay: "1.4s" },
  { label: "LLMs",               Icon: Brain,             className: "right-[0%] top-[44%]",               delay: "0.8s" },
  { label: "Evals",              Icon: BarChart3,         className: "left-[4%] bottom-[18%]",             delay: "1.2s" },
  { label: "Deploy",             Icon: CloudUpload,       className: "right-[4%] bottom-[14%]",            delay: "0.3s" },
];

function TaglineCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CYCLE_WORDS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const word = CYCLE_WORDS[index];
  const isLast = word === "TOGETHER";

  return (
    <span className="block overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className={`block ${isLast ? "text-accent" : "text-primary"}`}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const { openSearch } = useSearch();

  return (
    <section className="relative overflow-hidden bg-canvas">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-6">

        {/* Left content */}
        <div className="flex flex-col items-start">
          {/* Animated headline */}
          <h1 className="font-fraunces text-7xl font-semibold leading-[0.95] tracking-tight sm:text-8xl">
            <TaglineCycle />
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary">
            From your first prompt to production-grade agents — clear, well-sourced writing for beginners and builders alike.
          </p>

          {/* Search bar */}
          <button
            onClick={openSearch}
            className="mt-8 flex w-full max-w-md items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-sm text-left hover:ring-2 hover:ring-accent/20 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none transition-all"
            aria-label="Open search"
          >
            <Search className="size-5 shrink-0 text-secondary" aria-hidden="true" />
            <span className="text-base text-secondary">What do you want to understand?</span>
          </button>

          {/* Topic chips */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            {TOPIC_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={openSearch}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-secondary transition-colors hover:border-accent/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/paths/getting-started"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-accent-deep focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors"
            >
              Start Learning <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-7 py-3.5 text-base font-semibold text-primary hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors"
            >
              Explore Library
            </Link>
          </div>

          {/* Trust row */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {TRUST_ITEMS.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-secondary">
                <Icon className="size-4 text-accent" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right visual */}
        <div className="relative w-full">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-2xl">
      {/* Scene illustration with edge fade */}
      <Image
        src="/seekvana-scene.png"
        alt="A friendly AI robot holding a laptop, sitting on a stack of books surrounded by coffee, a plant, and a notebook"
        fill
        className="object-contain"
        priority
        style={{
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 92%)",
          maskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 92%)",
        }}
      />

      {/* Floating topic cards */}
      {FLOATING_CARDS.map(({ label, Icon, className, delay }) => (
        <div
          key={label}
          className={`absolute ${className} flex items-center gap-2 rounded-2xl border border-border/60 bg-surface/85 px-3.5 py-2.5 shadow-lg backdrop-blur-sm`}
          style={{ animation: `seekvana-float 5s ease-in-out ${delay} infinite` }}
        >
          <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</span>
        </div>
      ))}
    </div>
  );
}

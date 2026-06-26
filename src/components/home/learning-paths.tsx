"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type IllustrationKey = "compass" | "sprout" | "network" | "rocket";

interface Path {
  badge: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  lessons: number;
  href: string;
  panelBg: string;
  illustration: IllustrationKey;
}

const PATHS: Path[] = [
  {
    badge: "No experience needed",
    title: "Getting Started",
    description:
      "Everything you need before you build anything — Terminal, Python, Git, APIs, and deployment, at your own pace. 10 modules, 101 hands-on topics.",
    difficulty: "Beginner",
    lessons: 101,
    href: "/paths/getting-started",
    panelBg: "bg-success",
    illustration: "compass",
  },
];

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

// ── Illustrations ───────────────────────────────────────────────────────────

function CompassIllustration() {
  return (
    <svg viewBox="0 0 180 180" fill="none" aria-hidden="true" className="w-44 h-44">
      {/* Outer ring */}
      <circle cx="90" cy="90" r="76" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Tick marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = Math.PI / 180
        const x1 = 90 + 76 * Math.sin(deg * r)
        const y1 = 90 - 76 * Math.cos(deg * r)
        const x2 = 90 + 68 * Math.sin(deg * r)
        const y2 = 90 - 68 * Math.cos(deg * r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={deg % 90 === 0 ? 2 : 1} strokeOpacity={deg % 90 === 0 ? 0.6 : 0.3} strokeLinecap="round" />
      })}
      {/* N S E W labels */}
      <text x="90" y="18" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="11" fontWeight="700" fontFamily="monospace">N</text>
      <text x="90" y="170" textAnchor="middle" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="monospace">S</text>
      <text x="167" y="94" textAnchor="middle" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="monospace">E</text>
      <text x="13" y="94" textAnchor="middle" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="monospace">W</text>
      {/* Inner disc */}
      <circle cx="90" cy="90" r="48" fill="white" fillOpacity="0.1" />
      {/* North needle — white */}
      <path d="M90 90 L84 112 L90 44 L96 112 Z" fill="white" fillOpacity="0.9" />
      {/* South needle — dimmed */}
      <path d="M90 90 L96 68 L90 136 L84 68 Z" fill="white" fillOpacity="0.25" />
      {/* Centre pin */}
      <circle cx="90" cy="90" r="6" fill="white" fillOpacity="0.95" />
      <circle cx="90" cy="90" r="2.5" fill="white" fillOpacity="0.4" />
    </svg>
  )
}

function SproutIllustration() {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      aria-hidden="true"
      className="w-40 h-56"
    >
      {/* Dotted stem */}
      <line
        x1="80" y1="220" x2="80" y2="68"
        stroke="white" strokeWidth="3" strokeOpacity="0.45"
        strokeLinecap="round" strokeDasharray="6 6"
      />
      {/* Left leaf */}
      <path
        d="M78 148 C40 140 14 108 26 76 C52 84 76 118 78 148 Z"
        fill="white" fillOpacity="0.22"
      />
      {/* Left leaf vein */}
      <line
        x1="78" y1="148" x2="44" y2="108"
        stroke="white" strokeWidth="1" strokeOpacity="0.18" strokeLinecap="round"
      />
      {/* Right leaf */}
      <path
        d="M82 108 C120 100 150 68 138 36 C112 46 86 80 82 108 Z"
        fill="white" fillOpacity="0.28"
      />
      {/* Right leaf vein */}
      <line
        x1="82" y1="108" x2="118" y2="70"
        stroke="white" strokeWidth="1" strokeOpacity="0.18" strokeLinecap="round"
      />
      {/* Top bud */}
      <path
        d="M80 70 C65 52 67 28 80 16 C93 28 95 52 80 70 Z"
        fill="white" fillOpacity="0.36"
      />
    </svg>
  );
}

function NetworkIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className="w-52 h-52"
    >
      {/* Outer orbit */}
      <circle
        cx="100" cy="100" r="82"
        stroke="white" strokeWidth="1" strokeOpacity="0.18"
        strokeDasharray="4 5"
      />
      {/* Inner orbit */}
      <circle
        cx="100" cy="100" r="52"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.24"
      />
      {/* Central hub */}
      <circle cx="100" cy="100" r="24" fill="white" fillOpacity="0.2" />
      <circle cx="100" cy="100" r="13" fill="white" fillOpacity="0.52" />
      {/* Orbital nodes */}
      <circle cx="100" cy="18" r="11" fill="white" fillOpacity="0.7" />
      <circle cx="172" cy="58" r="9"  fill="white" fillOpacity="0.55" />
      <circle cx="172" cy="142" r="9" fill="white" fillOpacity="0.55" />
      <circle cx="100" cy="182" r="11" fill="white" fillOpacity="0.7" />
      <circle cx="28"  cy="142" r="9"  fill="white" fillOpacity="0.55" />
      <circle cx="28"  cy="58"  r="9"  fill="white" fillOpacity="0.55" />
      {/* Spokes */}
      <line x1="100" y1="76" x2="100" y2="29" stroke="white" strokeWidth="1.5" strokeOpacity="0.32" />
      <line x1="119" y1="81" x2="163" y2="62" stroke="white" strokeWidth="1.5" strokeOpacity="0.32" />
      <line x1="119" y1="119" x2="163" y2="138" stroke="white" strokeWidth="1.5" strokeOpacity="0.32" />
      <line x1="100" y1="124" x2="100" y2="171" stroke="white" strokeWidth="1.5" strokeOpacity="0.32" />
      <line x1="81"  y1="119" x2="37"  y2="138" stroke="white" strokeWidth="1.5" strokeOpacity="0.32" />
      <line x1="81"  y1="81"  x2="37"  y2="62"  stroke="white" strokeWidth="1.5" strokeOpacity="0.32" />
      {/* Pulse dots mid-spoke */}
      <circle cx="100" cy="53"  r="3.5" fill="white" fillOpacity="0.75" />
      <circle cx="141" cy="70"  r="3"   fill="white" fillOpacity="0.6"  />
    </svg>
  );
}

function RocketIllustration() {
  return (
    <svg
      viewBox="0 0 140 185"
      fill="none"
      aria-hidden="true"
      className="w-36 h-48"
    >
      {/* Body */}
      <path
        d="M70 10 C70 10 102 42 102 95 L102 132 Q102 140 94 140 L46 140 Q38 140 38 132 L38 95 C38 42 70 10 70 10 Z"
        fill="white" fillOpacity="0.2"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.38"
      />
      {/* Porthole */}
      <circle
        cx="70" cy="78" r="19"
        fill="white" fillOpacity="0.25"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.42"
      />
      <circle cx="70" cy="78" r="10" fill="white" fillOpacity="0.55" />
      {/* Fins */}
      <path d="M38 108 L20 134 L38 134 Z" fill="white" fillOpacity="0.32" />
      <path d="M102 108 L120 134 L102 134 Z" fill="white" fillOpacity="0.32" />
      {/* Nozzle */}
      <rect x="50" y="140" width="40" height="7" rx="3.5" fill="white" fillOpacity="0.38" />
      {/* Flames */}
      <ellipse cx="70" cy="160" rx="15" ry="18" fill="white" fillOpacity="0.28" />
      <ellipse cx="70" cy="163" rx="9"  ry="12" fill="white" fillOpacity="0.44" />
      <ellipse cx="70" cy="167" rx="5"  ry="7"  fill="white" fillOpacity="0.62" />
      {/* Stars */}
      <circle cx="16"  cy="28" r="3.5" fill="white" fillOpacity="0.6"  />
      <circle cx="126" cy="20" r="2.5" fill="white" fillOpacity="0.48" />
      <circle cx="10"  cy="70" r="2"   fill="white" fillOpacity="0.42" />
      <circle cx="128" cy="66" r="3"   fill="white" fillOpacity="0.52" />
      <circle cx="124" cy="98" r="2"   fill="white" fillOpacity="0.38" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<IllustrationKey, React.ComponentType> = {
  compass: CompassIllustration,
  sprout: SproutIllustration,
  network: NetworkIllustration,
  rocket: RocketIllustration,
};

// ── Component ───────────────────────────────────────────────────────────────

export function LearningPaths() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-surface-subtle py-20 px-4">
      <div className="max-w-screen-lg mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-fraunces text-3xl text-primary">
              Learning paths
            </h2>
            <p className="font-inter text-sm text-secondary mt-1.5">
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

        {/* Stacked horizontal cards */}
        <div className="flex flex-col gap-5">
          {PATHS.map((path, i) => {
            const Illustration = ILLUSTRATIONS[path.illustration];
            return (
              <motion.article
                key={path.href}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  ease: EXPO_EASE,
                  delay: shouldReduceMotion ? 0 : i * 0.1,
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -3, transition: { duration: 0.2, ease: "easeOut" } }
                }
                className="group relative bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row"
              >
                {/* Invisible full-card link */}
                <Link
                  href={path.href}
                  className="absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:outline-none"
                  aria-label={`Start learning path: ${path.title}`}
                />

                {/* ── Left text panel ── */}
                <div className="flex-1 flex flex-col p-8 md:p-10">
                  {/* Badge */}
                  <span className="inline-flex self-start px-4 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-inter font-semibold">
                    {path.badge}
                  </span>

                  {/* Title */}
                  <h3 className="font-fraunces text-2xl md:text-[1.75rem] text-primary mt-4 leading-tight">
                    {path.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-base text-secondary leading-relaxed mt-3">
                    {path.description}
                  </p>

                  {/* CTA row — pushed to bottom */}
                  <div className="flex items-center gap-5 mt-auto pt-8">
                    <span
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-accent text-white font-inter font-semibold text-sm group-hover:bg-accent-deep transition-colors duration-200"
                      aria-hidden="true"
                    >
                      Start the path
                    </span>
                    <span className="font-inter text-sm text-secondary">
                      {path.lessons} lessons · {path.difficulty}
                    </span>
                  </div>
                </div>

                {/* ── Right illustration panel ── */}
                <div
                  className={cn(
                    "relative w-full md:w-72 lg:w-96 min-h-56 md:min-h-0 overflow-hidden flex items-center justify-center",
                    path.panelBg
                  )}
                >
                  {/* Dot grid texture */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1.2px, transparent 1.2px)",
                      backgroundSize: "22px 22px",
                    }}
                  />
                  {/* Blob — top-right */}
                  <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
                  {/* Blob — bottom-left */}
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/5 pointer-events-none" />
                  {/* Hover brightening */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none" />
                  {/* Illustration */}
                  <div className="relative z-10">
                    <Illustration />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

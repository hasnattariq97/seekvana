"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearch } from "@/context/search-context";
import { useParticleCanvas } from "@/hooks/use-particle-canvas";
import { useOrbLines } from "@/hooks/use-orb-lines";
import type { OrbRefs } from "@/hooks/use-orb-lines";

const SEARCH_CHIPS = ["Agentic AI", "RAG", "Prompting", "Evals"] as const;
const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  articleCount: number;
  pathCount: number;
}

// Orb image wrapper — no label, just the PNG in a fixed-size box
function OrbImage({
  src,
  alt,
  size = 88,
  orbRef,
}: {
  src: string;
  alt: string;
  size?: number;
  orbRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={orbRef}
      style={{ width: size, height: size }}
      className="relative flex-shrink-0 drop-shadow-xl"
    >
      <Image src={src} alt={alt} fill className="object-contain" sizes={`${size}px`} />
    </div>
  );
}

export function Hero({ articleCount, pathCount }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const { openSearch } = useSearch();

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef);

  // Hero section ref (SVG coordinate space)
  const heroRef = useRef<HTMLElement>(null);

  // Individual orb refs
  const orbRefs: OrbRefs = {
    tools:         useRef<HTMLDivElement | null>(null),
    database:      useRef<HTMLDivElement | null>(null),
    knowledge:     useRef<HTMLDivElement | null>(null),
    memory:        useRef<HTMLDivElement | null>(null),
    agent:         useRef<HTMLDivElement | null>(null),
    evaluation:    useRef<HTMLDivElement | null>(null),
    orchestration: useRef<HTMLDivElement | null>(null),
    deployment:    useRef<HTMLDivElement | null>(null),
    robot:         useRef<HTMLDivElement | null>(null),
    hero:          heroRef,
  };

  const lines = useOrbLines(orbRefs);

  function fadeUp(delay: number) {
    return {
      initial: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 22 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: shouldReduceMotion ? ("easeOut" as const) : EXPO_EASE,
        delay: shouldReduceMotion ? 0 : delay,
      },
    };
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden bg-canvas"
    >
      {/* ── Canvas particles (z-0) ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Radial glow behind robot (bottom-center) ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 480,
          height: 260,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(201,99,63,0.32) 0%, transparent 70%)",
          filter: "blur(18px)",
          zIndex: 1,
        }}
      />

      {/* ── SVG connection lines (z-2, desktop only) ── */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
        style={{ zIndex: 2 }}
      >
        {lines.map((l) => (
          <g key={l.id}>
            <line
              x1={l.x1} y1={l.y1}
              x2={l.x2} y2={l.y2}
              stroke="rgba(201,99,63,0.20)"
              strokeWidth="1"
              strokeDasharray="5 6"
            />
            {/* Travelling dot along the line */}
            <circle r="2.5" fill="rgba(201,99,63,0.65)">
              <animateMotion
                dur={`${3 + Math.random() * 2}s`}
                repeatCount="indefinite"
                path={`M${l.x1},${l.y1} L${l.x2},${l.y2}`}
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* ── LEFT orb column: Tools, Database, Knowledge (desktop only) ── */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-10"
        style={{ zIndex: 10 }}
      >
        <OrbImage src="/orbs/Tools.png"     alt="Tools"     orbRef={orbRefs.tools} />
        <OrbImage src="/orbs/Database.png"  alt="Database"  orbRef={orbRefs.database} />
        <OrbImage src="/orbs/Knowledge.png" alt="Knowledge" orbRef={orbRefs.knowledge} />
      </div>

      {/* ── RIGHT orb column: Memory, Agent, Evaluation (desktop only) ── */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-10"
        style={{ zIndex: 10 }}
      >
        <OrbImage src="/orbs/Memory.png"     alt="Memory"     orbRef={orbRefs.memory} />
        <OrbImage src="/orbs/Agent.png"      alt="Agent"      orbRef={orbRefs.agent} />
        <OrbImage src="/orbs/Evaluation.png" alt="Evaluation" orbRef={orbRefs.evaluation} />
      </div>

      {/* ── BOTTOM-LEFT: Orchestration (desktop only) ── */}
      <div
        className="absolute hidden lg:block"
        style={{ left: "15%", bottom: "2.5rem", zIndex: 10 }}
      >
        <OrbImage src="/orbs/Orchestration.png" alt="Orchestration" size={72} orbRef={orbRefs.orchestration} />
      </div>

      {/* ── BOTTOM-RIGHT: Deployment (desktop only) ── */}
      <div
        className="absolute hidden lg:block"
        style={{ right: "15%", bottom: "2.5rem", zIndex: 10 }}
      >
        <OrbImage src="/orbs/Deployment.png" alt="Deployment" size={72} orbRef={orbRefs.deployment} />
      </div>

      {/* ── ROBOT: bottom-center ── */}
      <div
        ref={orbRefs.robot}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden lg:block"
        style={{ zIndex: 8 }}
      >
        {/* Spotlight ring under robot */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 160,
            height: 28,
            background: "radial-gradient(ellipse, rgba(201,99,63,0.55) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <Image
          src="/orbs/Robot.png"
          alt="AI Robot"
          width={140}
          height={160}
          className="relative"
          style={{ zIndex: 2 }}
          priority
        />
      </div>

      {/* ── CENTER CONTENT ── */}
      <div className="relative flex flex-col items-center text-center gap-5 max-w-xl mx-auto px-4 lg:px-0" style={{ zIndex: 10 }}>
        {/* Pill badge */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 bg-accent-soft border border-accent/20 text-accent text-sm rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            {articleCount} article{articleCount !== 1 ? "s" : ""} · {pathCount} learning path{pathCount !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.08)}
          className="font-fraunces text-5xl md:text-6xl font-medium text-primary leading-tight tracking-tight text-balance"
        >
          From Prompt to{" "}
          <span className="text-accent">Production.</span>
          <br />
          Build{" "}
          <span className="text-accent">AI</span>{" "}
          that Works.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeUp(0.16)}
          className="font-inter text-lg text-secondary max-w-lg mx-auto"
        >
          Learn by building. Go from fundamentals to production-ready
          AI agents with clarity, best practices, and real-world results.
        </motion.p>

        {/* Search bar */}
        <motion.div {...fadeUp(0.22)} className="w-full max-w-md">
          <button
            onClick={openSearch}
            className="flex items-center gap-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-secondary hover:ring-2 hover:ring-accent/30 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none transition-all"
          >
            <Search size={18} className="shrink-0 text-secondary" />
            <span className="text-sm">What do you want to understand?</span>
          </button>
        </motion.div>

        {/* Quick-search chips */}
        <motion.div {...fadeUp(0.27)} className="flex flex-wrap justify-center gap-2">
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
        <motion.div {...fadeUp(0.33)} className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/paths/getting-started"
            className="bg-accent text-white rounded-lg px-8 py-3 font-medium hover:bg-accent-deep focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors"
          >
            Start Learning →
          </Link>
          <Link
            href="/library"
            className="border border-border text-primary rounded-lg px-6 py-3 font-medium hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Library
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          {...fadeUp(0.39)}
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

# Hero Orb Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing text-only hero with a full-viewport cinematic hero featuring 8 orb PNGs floating on either side, a canvas particle background, animated SVG connection lines from each orb to a central robot PNG, and full light/dark theme support.

**Architecture:** A single `hero.tsx` client component owns the layout. Canvas particles live in a `useParticleCanvas` hook (reads `isDark` every RAF frame so theme toggle works live). SVG connection lines are computed from DOM refs via `ResizeObserver` so lines stay accurate at any viewport size. Orb images and Robot.png are copied to `public/orbs/` and served via `next/image`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, `next/image`, native Canvas API, native ResizeObserver/SVG.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `public/orbs/Tools.png` … `Robot.png` | **Copy** from `D:\seekvana\Orbs\` | Static assets served by Next.js |
| `src/hooks/use-particle-canvas.ts` | **Create** | Canvas particle animation, theme-aware each frame |
| `src/hooks/use-orb-lines.ts` | **Create** | Measures orb + robot DOM positions, returns SVG line data |
| `src/components/home/hero.tsx` | **Rewrite** | Full hero layout: canvas, orbs, SVG, robot, center content |

---

## Task 1: Copy orb assets to public/

**Files:**
- Create: `public/orbs/` (8 orb PNGs + Robot.png)

- [ ] **Step 1: Copy all PNGs**

```bash
mkdir -p d:/seekvana/public/orbs
cp "D:/seekvana/Orbs/Tools.png"         d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Database.png"      d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Knowledge.png"     d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Memory.png"        d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Agent.png"         d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Evaluation.png"    d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Orchestration.png" d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Deployment.png"    d:/seekvana/public/orbs/
cp "D:/seekvana/Orbs/Robot.png"         d:/seekvana/public/orbs/
```

- [ ] **Step 2: Verify files exist**

```bash
ls d:/seekvana/public/orbs/
```

Expected: 9 files listed (Tools.png, Database.png, Knowledge.png, Memory.png, Agent.png, Evaluation.png, Orchestration.png, Deployment.png, Robot.png)

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana
git add public/orbs/
git commit -m "feat(hero): add orb and robot PNG assets"
```

---

## Task 2: Create useParticleCanvas hook

**Files:**
- Create: `src/hooks/use-particle-canvas.ts`

This hook runs a canvas particle animation. It reads `isDark` from the DOM class list **every animation frame** so the theme toggle works without a page reload. Particles are small warm dots drifting slowly. The canvas is sized to match its container via ResizeObserver.

- [ ] **Step 1: Create the hook file**

Create `src/hooks/use-particle-canvas.ts`:

```typescript
'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

const PARTICLE_COUNT = 60

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: 1 + Math.random() * 2.5,
    opacity: 0.08 + Math.random() * 0.18,
  }
}

export function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        makeParticle(canvas.width, canvas.height)
      )
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw() {
      if (!canvas || !ctx) return
      const isDark = document.documentElement.classList.contains('dark')
      const dotColor = isDark ? '224,175,140' : '150,100,70'

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dotColor},${p.opacity})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [canvasRef])
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `use-particle-canvas.ts`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-particle-canvas.ts
git commit -m "feat(hero): add theme-aware particle canvas hook"
```

---

## Task 3: Create useOrbLines hook

**Files:**
- Create: `src/hooks/use-orb-lines.ts`

This hook takes refs for each of the 8 orb containers and the robot container, plus the hero section ref. On mount and on resize it computes the center of each orb relative to the hero section and returns SVG `<line>` data. Lines go from each orb center to the robot center.

- [ ] **Step 1: Create the hook file**

Create `src/hooks/use-orb-lines.ts`:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

export interface LineData {
  x1: number
  y1: number
  x2: number
  y2: number
  id: string
}

export interface OrbRefs {
  // left column
  tools: React.RefObject<HTMLDivElement | null>
  database: React.RefObject<HTMLDivElement | null>
  knowledge: React.RefObject<HTMLDivElement | null>
  // right column
  memory: React.RefObject<HTMLDivElement | null>
  agent: React.RefObject<HTMLDivElement | null>
  evaluation: React.RefObject<HTMLDivElement | null>
  // bottom
  orchestration: React.RefObject<HTMLDivElement | null>
  deployment: React.RefObject<HTMLDivElement | null>
  // robot
  robot: React.RefObject<HTMLDivElement | null>
  // hero section
  hero: React.RefObject<HTMLElement | null>
}

function getCenter(el: HTMLElement, hero: HTMLElement): { x: number; y: number } {
  const eRect = el.getBoundingClientRect()
  const hRect = hero.getBoundingClientRect()
  return {
    x: eRect.left - hRect.left + eRect.width / 2,
    y: eRect.top - hRect.top + eRect.height / 2,
  }
}

export function useOrbLines(refs: OrbRefs): LineData[] {
  const [lines, setLines] = useState<LineData[]>([])

  useEffect(() => {
    function compute() {
      const hero = refs.hero.current
      const robot = refs.robot.current
      if (!hero || !robot) return

      const robotCenter = getCenter(robot, hero)

      const orbEntries: Array<[string, React.RefObject<HTMLDivElement | null>]> = [
        ['tools', refs.tools],
        ['database', refs.database],
        ['knowledge', refs.knowledge],
        ['memory', refs.memory],
        ['agent', refs.agent],
        ['evaluation', refs.evaluation],
        ['orchestration', refs.orchestration],
        ['deployment', refs.deployment],
      ]

      const next: LineData[] = []
      for (const [id, ref] of orbEntries) {
        if (!ref.current) continue
        const c = getCenter(ref.current, hero)
        next.push({ id, x1: c.x, y1: c.y, x2: robotCenter.x, y2: robotCenter.y })
      }
      setLines(next)
    }

    const ro = new ResizeObserver(compute)
    if (refs.hero.current) ro.observe(refs.hero.current)
    compute()

    return () => ro.disconnect()
  }, [refs])

  return lines
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `use-orb-lines.ts`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-orb-lines.ts
git commit -m "feat(hero): add ResizeObserver orb connection lines hook"
```

---

## Task 4: Rewrite hero.tsx

**Files:**
- Modify: `src/components/home/hero.tsx` (full rewrite)

This is the main component. It composes the canvas, SVG lines, orb images, robot, and center content. Orbs are hidden on mobile (`hidden lg:block`) to avoid overlap. The SVG is sized to match the hero section.

- [ ] **Step 1: Rewrite the file**

Replace `src/components/home/hero.tsx` entirely:

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, createRef } from "react";
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
    tools:         useRef<HTMLDivElement>(null),
    database:      useRef<HTMLDivElement>(null),
    knowledge:     useRef<HTMLDivElement>(null),
    memory:        useRef<HTMLDivElement>(null),
    agent:         useRef<HTMLDivElement>(null),
    evaluation:    useRef<HTMLDivElement>(null),
    orchestration: useRef<HTMLDivElement>(null),
    deployment:    useRef<HTMLDivElement>(null),
    robot:         useRef<HTMLDivElement>(null),
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
```

- [ ] **Step 2: Check TypeScript compiles**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors. If `useRef` hook-in-loop TypeScript errors appear, see note below.

> **Note on `useRef` in a loop:** React hooks cannot be called inside loops. The refs above are called at component top level and assigned via an object literal — this is valid. Each `useRef` call is a separate statement, not inside a loop. TypeScript will accept this.

- [ ] **Step 3: Run dev server and visually verify**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Full-viewport height hero
- Canvas particles drifting
- 3 orbs left column, 3 right column, 2 bottom, robot bottom-center (desktop)
- Dashed SVG lines from each orb to robot, with travelling dots
- Center content: pill, headline with clay accent, subline, search, chips, buttons, trust row
- Theme toggle: switch dark/light — particles change color live, background flips

- [ ] **Step 4: Commit**

```bash
git add src/components/home/hero.tsx
git commit -m "feat(hero): cinematic orb hero with canvas particles and SVG lines"
```

---

## Task 5: Build check + mobile verification

**Files:**
- No new files

- [ ] **Step 1: Run build**

```bash
cd d:/seekvana && npm run build 2>&1 | tail -30
```

Expected: ✓ Compiled successfully, 0 errors. If build fails, fix errors before continuing.

- [ ] **Step 2: Verify mobile layout**

In browser DevTools, switch to mobile viewport (375px). Verify:
- Orbs are hidden (`hidden lg:block` hides them below 1024px)
- SVG lines are hidden (`hidden lg:block`)
- Center content is fully readable with no overflow
- Canvas particles visible (full width)
- Robot hidden (same `hidden lg:block` class)

- [ ] **Step 3: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(hero): build and mobile layout fixes"
```

---

## Task 6: Light mode verification

**Files:**
- No changes — verify existing CSS vars work correctly

- [ ] **Step 1: Check light mode visually**

Toggle to light mode in browser. Verify:
- Background: warm cream `#FAF8F3` (bg-canvas)
- Headline: dark `#1C1B19` (text-primary)
- Accent words: clay `#C9633F` (text-accent)
- Canvas particles: lighter warm dots (hook reads `isDark` each frame, uses `'150,100,70'` RGB for light mode)
- Orb PNGs: transparent background so they blend with cream bg
- Robot PNG: same transparency
- SVG lines: `rgba(201,99,63,0.20)` — works on both themes

- [ ] **Step 2: Push to GitHub**

```bash
git push
```

---

## Self-Review Checklist

- [x] **Canvas particles** — Task 2, theme-aware via `isDark` check each RAF frame
- [x] **Full viewport height** — `min-h-svh` on `<section>`
- [x] **8 orb PNGs** — Tasks 1+4, `next/image` with correct paths
- [x] **Orbs hidden on mobile** — `hidden lg:block` on all orb containers
- [x] **Left column: Tools, Database, Knowledge** — Task 4
- [x] **Right column: Memory, Agent, Evaluation** — Task 4
- [x] **Bottom-left: Orchestration** — Task 4
- [x] **Bottom-right: Deployment** — Task 4
- [x] **Robot.png bottom-center with radial glow** — Task 4
- [x] **SVG connection lines with travelling dots** — Tasks 3+4
- [x] **Lines recompute on resize** — ResizeObserver in `useOrbLines`
- [x] **Eyebrow pill** — Task 4 center content
- [x] **Fraunces headline** — Task 4, `font-fraunces`
- [x] **Search input** — Task 4, wired to existing `openSearch` context
- [x] **4 quick-search chips** — Task 4
- [x] **Start Learning + Library buttons** — Task 4
- [x] **Trust row** — Task 4
- [x] **Light mode: cream bg, dark text** — CSS vars, verified Task 6
- [x] **Dark mode: #1A1714 bg, white text** — CSS vars (dark class on html)
- [x] **No orb text labels** — confirmed in design, not implemented
- [x] **Build passes** — Task 5

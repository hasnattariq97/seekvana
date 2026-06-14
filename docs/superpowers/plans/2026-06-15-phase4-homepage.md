# Phase 4 — Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Seekvana homepage with Hero, Learning Paths, Pillars, Recent Articles, and Footer sections, assembled in `src/app/page.tsx`.

**Architecture:** Five isolated section components live under `src/components/home/`; the footer lives under `src/components/layout/` alongside the existing Navbar. Each component is a client component (Framer Motion requires it). `page.tsx` is a server component that imports and composes all five.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4 (CSS-variable tokens), Framer Motion 12 (`motion.div`, `whileHover`, `whileInView`), Lucide React icons, shadcn/ui Tabs, SearchContext already wired in layout.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| CREATE | `src/components/home/hero.tsx` | Hero section — badge, H1, subheading, search bar + chips, CTA buttons |
| CREATE | `src/components/home/learning-paths.tsx` | 5 path cards in a responsive grid |
| CREATE | `src/components/home/pillars.tsx` | 3×3 pillar grid with Lucide icons |
| CREATE | `src/components/home/recent-articles.tsx` | Shadcn Tabs filter + 3 article cards |
| CREATE | `src/components/layout/footer.tsx` | 4-col footer with brand, Learn, Library, Tools columns |
| MODIFY | `src/app/page.tsx` | Assemble all sections in order |

---

## Task 1: Hero Section

**Files:**
- Create: `src/components/home/hero.tsx`

### Context

The Hero uses `useSearch()` from `src/context/search-context.tsx` so clicking the search bar / chips calls `openSearch()` — the modal is built in Phase 6 but the context is already wired. All animations are staggered `motion.div` with increasing `delay` values (mount animations, not scroll-triggered).

- [ ] **Step 1: Create `src/components/home/hero.tsx`**

```tsx
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
            className="flex items-center gap-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-secondary hover:ring-2 hover:ring-accent/30 transition-all"
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors. If you see "Cannot find module '@/context/search-context'" the import alias is wrong — check `tsconfig.json` for the `@/*` path mapping.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/hero.tsx
git commit -m "feat: add Hero section for homepage"
```

---

## Task 2: Learning Paths Section

**Files:**
- Create: `src/components/home/learning-paths.tsx`

### Context

5 path cards in a `1 / sm:2 / lg:3` grid. Each card has a 2px top colour strip. Paths 1–3 use design-system tokens (`bg-accent`, `bg-info`, `bg-success`). Paths 4–5 use Tailwind built-in classes (`bg-amber-700`, `bg-purple-700`) — these are utility classes, not hardcoded hex. Difficulty badge colours use Tailwind semantic colours (green/amber/red), NOT Seekvana tokens — this is intentional; the tokens don't define "difficulty" semantics.

- [ ] **Step 1: Create `src/components/home/learning-paths.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Path {
  title: string;
  description: string;
  difficulty: Difficulty;
  lessons: number;
  href: string;
  stripClass: string;
}

const PATHS: Path[] = [
  {
    title: "AI for Absolute Beginners",
    description: "Start with zero assumptions.",
    difficulty: "Beginner",
    lessons: 8,
    href: "/paths/ai-for-beginners",
    stripClass: "bg-accent",
  },
  {
    title: "Master Agentic AI",
    description: "Go deep on agents, tool use, memory, and planning.",
    difficulty: "Intermediate",
    lessons: 14,
    href: "/paths/master-agentic-ai",
    stripClass: "bg-info",
  },
  {
    title: "Build Your First AI Agent",
    description: "Go from one tool call to a working autonomous agent.",
    difficulty: "Beginner",
    lessons: 10,
    href: "/paths/build-first-agent",
    stripClass: "bg-success",
  },
  {
    title: "Prompt Engineering Essentials",
    description: "Write prompts that actually work.",
    difficulty: "Beginner",
    lessons: 6,
    href: "/paths/prompt-engineering",
    stripClass: "bg-amber-700",
  },
  {
    title: "Beginner to AI Engineer",
    description: "The full journey from AI basics to shipping apps.",
    difficulty: "Advanced",
    lessons: 24,
    href: "/paths/beginner-to-engineer",
    stripClass: "bg-purple-700",
  },
];

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  Beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Advanced:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function LearningPaths() {
  return (
    <section className="bg-canvas py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-fraunces text-2xl text-primary">
            Learning paths
          </h2>
          <Link
            href="/paths"
            className="text-sm text-accent hover:text-accent-deep transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PATHS.map((path, i) => (
            <motion.div
              key={path.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Top colour strip */}
              <div className={`h-2 ${path.stripClass}`} />

              <div className="px-6 py-5 flex flex-col gap-2">
                <span
                  className={`self-start text-xs rounded-full px-2.5 py-0.5 font-medium ${DIFFICULTY_BADGE[path.difficulty]}`}
                >
                  {path.difficulty}
                </span>
                <h3 className="font-fraunces text-lg text-primary">
                  {path.title}
                </h3>
                <p className="font-inter text-sm text-secondary">
                  {path.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-secondary">
                    {path.lessons} lessons
                  </span>
                  <Link
                    href={path.href}
                    className="text-sm text-accent font-medium hover:text-accent-deep transition-colors"
                  >
                    Start path →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/learning-paths.tsx
git commit -m "feat: add LearningPaths section for homepage"
```

---

## Task 3: Pillars Section

**Files:**
- Create: `src/components/home/pillars.tsx`

### Context

3×3 grid of pillar cards. The "Agentic AI" card (flagship) gets `border-accent border-2` instead of `border-border`. Each card is a full `<Link>` so the entire card is clickable. Icons are imported from `lucide-react`.

- [ ] **Step 1: Create `src/components/home/pillars.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Bot,
  Code2,
  Wrench,
  Briefcase,
  FlaskConical,
  Shield,
  GraduationCap,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pillar {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  flagship: boolean;
}

const PILLARS: Pillar[] = [
  {
    title: "AI Foundations",
    description: "What AI is, how it works, and why it matters",
    href: "/library/ai-foundations",
    icon: Brain,
    flagship: false,
  },
  {
    title: "Large Language Models",
    description: "Tokens, context, RAG, fine-tuning, and how LLMs think",
    href: "/library/large-language-models",
    icon: MessageSquare,
    flagship: false,
  },
  {
    title: "Agentic AI",
    description: "Agents, tool use, memory, planning, multi-agent systems",
    href: "/library/agentic-ai",
    icon: Bot,
    flagship: true,
  },
  {
    title: "Building with AI",
    description: "APIs, SDKs, evals, deployment, and cost management",
    href: "/library/building-with-ai",
    icon: Code2,
    flagship: false,
  },
  {
    title: "AI Tools",
    description: "Reviews and comparisons of the best AI tools",
    href: "/library/ai-tools",
    icon: Wrench,
    flagship: false,
  },
  {
    title: "Use Cases",
    description: "Real workflows: writing, coding, research, automation",
    href: "/library/use-cases",
    icon: Briefcase,
    flagship: false,
  },
  {
    title: "Concepts & Theory",
    description: "Transformers, embeddings, RL — the mechanics under the hood",
    href: "/library/concepts-theory",
    icon: FlaskConical,
    flagship: false,
  },
  {
    title: "Ethics & Safety",
    description: "Responsible AI, alignment, risks, and governance",
    href: "/library/ethics-safety",
    icon: Shield,
    flagship: false,
  },
  {
    title: "Careers",
    description: "How to learn AI, roles, and building your portfolio",
    href: "/library/careers",
    icon: GraduationCap,
    flagship: false,
  },
];

export function Pillars() {
  return (
    <section className="bg-surface-subtle py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary mb-8">
          Everything AI, in one place
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: i * 0.04,
                }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={pillar.href}
                  className={cn(
                    "block bg-surface rounded-xl border p-5 hover:shadow-md transition-shadow h-full",
                    pillar.flagship
                      ? "border-accent border-2"
                      : "border-border"
                  )}
                >
                  <Icon size={24} className="text-accent" />
                  <h3 className="font-fraunces text-base text-primary mt-3">
                    {pillar.title}
                  </h3>
                  <p className="font-inter text-sm text-secondary mt-1">
                    {pillar.description}
                  </p>
                  <span className="block text-accent text-xs mt-3">
                    Explore →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors. If `LucideIcon` type is not found, replace the import with `import { type FC } from "react"` and type icon as `FC<{ size?: number; className?: string }>`.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/pillars.tsx
git commit -m "feat: add Pillars section for homepage"
```

---

## Task 4: Recent Articles Section

**Files:**
- Create: `src/components/home/recent-articles.tsx`

### Context

Uses shadcn `Tabs` with `TabsContent` — one content pane per filter tab. The grid is extracted to `ArticleGrid` (a local function) so the same rendering logic is reused across all five tabs without duplication. The article data is a single array filtered via `useMemo`-equivalent object computed at module level — no `useState` needed for the filter (Tabs manages it internally via `defaultValue`).

- [ ] **Step 1: Create `src/components/home/recent-articles.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category = "Agentic AI" | "RAG" | "Prompting" | "Fine-tuning";

interface Article {
  title: string;
  excerpt: string;
  category: Category;
  difficulty: Difficulty;
  author: string;
  readTime: number;
  href: string;
  bgClass: string;
}

const ARTICLES: Article[] = [
  {
    title: "What makes an AI agent actually agentic?",
    excerpt:
      "The line between a chatbot and an agent comes down to one thing — whether the model decides what happens next.",
    category: "Agentic AI",
    difficulty: "Beginner",
    author: "Seekvana",
    readTime: 8,
    href: "/library/agentic-ai/what-is-an-agent",
    bgClass: "bg-accent-soft",
  },
  {
    title: "Tool use: giving models hands, not just a mouth",
    excerpt:
      "Function calling turns a language model from a talker into a doer — here's how it actually works.",
    category: "Agentic AI",
    difficulty: "Intermediate",
    author: "Seekvana",
    readTime: 12,
    href: "/library/agentic-ai/tool-use-explained",
    bgClass: "bg-info/20",
  },
  {
    title: "RAG without the hype: retrieval that actually helps",
    excerpt:
      "Retrieval-augmented generation is simple in principle and finicky in practice — let's fix that.",
    category: "RAG",
    difficulty: "Beginner",
    author: "Seekvana",
    readTime: 10,
    href: "/library/large-language-models/rag-explained",
    bgClass: "bg-surface-subtle",
  },
];

const TABS = ["All", "Agentic AI", "RAG", "Prompting", "Fine-tuning"] as const;

const ARTICLES_BY_TAB: Record<string, Article[]> = {
  All: ARTICLES,
  "Agentic AI": ARTICLES.filter((a) => a.category === "Agentic AI"),
  RAG: ARTICLES.filter((a) => a.category === "RAG"),
  Prompting: ARTICLES.filter((a) => a.category === "Prompting"),
  "Fine-tuning": ARTICLES.filter((a) => a.category === "Fine-tuning"),
};

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  Beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Advanced:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function ArticleGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <p className="text-secondary text-sm py-12 text-center">
        No articles yet in this category — check back soon.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article, i) => (
        <motion.article
          key={article.href}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.08 }}
          whileHover={{ y: -2 }}
          className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Placeholder image */}
          <div className={`h-40 ${article.bgClass}`} />

          <div className="p-5">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-accent-soft text-accent text-xs rounded-full px-2.5 py-0.5 font-medium">
                {article.category}
              </span>
              <span
                className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${DIFFICULTY_BADGE[article.difficulty]}`}
              >
                {article.difficulty}
              </span>
            </div>

            <h3 className="font-fraunces text-base text-primary mt-2 leading-snug">
              {article.title}
            </h3>
            <p className="font-inter text-sm text-secondary mt-1 line-clamp-2">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-secondary">{article.author}</span>
              <span className="text-xs text-secondary">
                {article.readTime} min read
              </span>
            </div>

            <Link
              href={article.href}
              className="block mt-3 text-sm text-accent font-medium hover:text-accent-deep transition-colors"
            >
              Read article →
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function RecentArticles() {
  return (
    <section className="bg-canvas py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary mb-8">
          Fresh from the library
        </h2>

        <Tabs defaultValue="All">
          <TabsList className="bg-surface-subtle mb-8 h-auto flex-wrap gap-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-sm data-[state=active]:text-accent data-[state=active]:bg-surface"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab}>
              <ArticleGrid articles={ARTICLES_BY_TAB[tab]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors. If shadcn's Tabs exports are missing `TabsContent`, check that the component was added during Phase 1 setup (`src/components/ui/tabs.tsx` must exist).

- [ ] **Step 3: Commit**

```bash
git add src/components/home/recent-articles.tsx
git commit -m "feat: add RecentArticles section with tab filter"
```

---

## Task 5: Footer

**Files:**
- Create: `src/components/layout/footer.tsx`

### Context

Static server component — no `"use client"` needed. The Logo SVG is duplicated from `navbar.tsx` intentionally; extracting it to a shared file is out of scope for Phase 4. 4-column grid collapses to 2-column on mobile; the brand column spans 2 on mobile (`col-span-2 md:col-span-1`) so it sits on its own row.

- [ ] **Step 1: Create `src/components/layout/footer.tsx`**

```tsx
import Link from "next/link";

const FOOTER_LINKS = {
  learn: [
    { label: "AI for Beginners", href: "/paths/ai-for-beginners" },
    { label: "Master Agentic AI", href: "/paths/master-agentic-ai" },
    { label: "Build Your First Agent", href: "/paths/build-first-agent" },
    { label: "All Paths", href: "/paths" },
  ],
  library: [
    { label: "AI Foundations", href: "/library/ai-foundations" },
    { label: "Agentic AI", href: "/library/agentic-ai" },
    { label: "LLMs", href: "/library/large-language-models" },
    { label: "Building with AI", href: "/library/building-with-ai" },
    { label: "All Topics", href: "/library" },
  ],
  tools: [
    { label: "AI Tool Reviews", href: "/tools" },
    { label: "Best AI Coding Tools", href: "/tools/coding" },
    { label: "Best LLM APIs", href: "/tools/llm-apis" },
    { label: "Comparisons", href: "/tools/compare" },
  ],
} as const;

function FooterLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="text-accent"
      >
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 5 L12.5 9.5 L10 11.5 L7.5 9.5 Z" fill="currentColor" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      </svg>
      <span className="font-fraunces font-medium text-lg text-primary leading-none">
        Seekvana
      </span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-subtle border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <FooterLogo />
            <p className="mt-3 text-sm text-secondary">Learn AI, clearly.</p>
            <p className="mt-6 text-xs text-secondary">© 2026 Seekvana</p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-fraunces text-sm text-primary font-medium mb-4">
              Learn
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Library */}
          <div>
            <h4 className="font-fraunces text-sm text-primary font-medium mb-4">
              Library
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.library.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-fraunces text-sm text-primary font-medium mb-4">
              Tools
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/privacy"
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-secondary text-xs hidden sm:block">·</span>
          <Link
            href="/terms"
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            Terms of Use
          </Link>
          <span className="text-secondary text-xs hidden sm:block">·</span>
          <Link
            href="/contact"
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/footer.tsx
git commit -m "feat: add Footer component"
```

---

## Task 6: Assemble Homepage + Build Verification

**Files:**
- Modify: `src/app/page.tsx`

### Context

`page.tsx` is a **server component** (no `"use client"`) — it just imports and composes client components. Next.js renders each client boundary independently. Replace the entire existing file; the current content is the default Next.js boilerplate and has no keeper code.

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticles } from "@/components/home/recent-articles";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LearningPaths />
      <Pillars />
      <RecentArticles />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Full type-check**

```bash
npx tsc --noEmit
```

Expected: 0 errors across all new files.

- [ ] **Step 3: Production build**

```bash
npm run build
```

Expected output ends with:
```
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                   ...
```

Fix any errors before moving on. Common issues:
- `"use client"` missing on a component that uses hooks/motion → add it at the top
- Missing shadcn export (e.g. `TabsContent`) → check `src/components/ui/tabs.tsx`
- `bg-info/20` opacity not resolving → replace with `bg-[color:var(--color-info)]/20`

- [ ] **Step 4: Smoke-test in dev server**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Cream (`#FAF8F3`) background visible immediately (no white flash)
- Hero badge, H1, search bar, CTAs render in correct order with stagger animation
- Learning Paths grid: 1 col on narrow viewport, 3 col at ≥1024px, colour strips visible
- Pillars grid: 2 col on mobile, 3 col at ≥768px, Agentic AI card has clay border
- Recent Articles: "All" tab shows 3 cards; switching to "RAG" shows 1 card, "Prompting" shows empty state
- Footer: 4-col on desktop, 2-col on mobile, bottom bar links present
- Dark mode toggle (top-right): all sections switch correctly, no hardcoded colours

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble Phase 4 homepage (Hero, LearningPaths, Pillars, RecentArticles, Footer)"
```

---

## Self-Review Checklist

**Spec coverage:**

| Spec requirement | Implemented in |
|---|---|
| Pill badge "218 articles · 9 learning paths" | Task 1 — `Hero` |
| H1 `font-fraunces text-5xl md:text-6xl` | Task 1 — `Hero` |
| Subheading Inter text-lg text-secondary | Task 1 — `Hero` |
| Search bar rounded-xl border bg-surface, Search icon left | Task 1 — `Hero` |
| 4 chip buttons below search | Task 1 — `Hero` |
| "Start Learning →" + "Explore Topics" CTA buttons | Task 1 — `Hero` |
| Staggered Framer Motion fade-up on mount | Task 1 — `Hero` (fadeUp helper) |
| py-24 md:py-32, max-w-3xl mx-auto centered | Task 1 — `Hero` |
| Section header "Learning paths" + "View all →" right-aligned | Task 2 — `LearningPaths` |
| 1/2/3 col responsive grid, gap-6 | Task 2 — `LearningPaths` |
| h-2 top colour strip per path | Task 2 — `LearningPaths` |
| Difficulty badge (green/amber/red) | Task 2 — `LearningPaths` |
| Lesson count + "Start path →" text-accent | Task 2 — `LearningPaths` |
| whileHover y:-2 shadow-md | Tasks 2, 3, 4 — all cards |
| "Everything AI, in one place" header | Task 3 — `Pillars` |
| 2 col mobile / 3 col desktop grid | Task 3 — `Pillars` |
| All 9 pillars with correct Lucide icons | Task 3 — `Pillars` |
| Agentic AI flagship: border-accent border-2 | Task 3 — `Pillars` |
| "Explore →" text-accent text-xs | Task 3 — `Pillars` |
| "Fresh from the library" header | Task 4 — `RecentArticles` |
| Filter tabs: All · Agentic AI · RAG · Prompting · Fine-tuning | Task 4 — `RecentArticles` |
| 3 article cards 3-col grid | Task 4 — `RecentArticles` |
| h-40 placeholder image area with coloured backgrounds | Task 4 — `RecentArticles` |
| Category + difficulty badges | Task 4 — `RecentArticles` |
| Fraunces title + Inter excerpt line-clamp-2 | Task 4 — `RecentArticles` |
| Author + readTime bottom row | Task 4 — `RecentArticles` |
| All 3 sample articles with correct data | Task 4 — `RecentArticles` |
| Footer bg-surface-subtle border-t py-16 | Task 5 — `Footer` |
| 2 col mobile / 4 col desktop, brand col spans 2 mobile | Task 5 — `Footer` |
| Logo + tagline + © 2026 Seekvana | Task 5 — `Footer` |
| Learn / Library / Tools link columns | Task 5 — `Footer` |
| Privacy · Terms · Contact bottom bar | Task 5 — `Footer` |
| Assembly in correct order (Hero→Paths→Pillars→Articles→Footer) | Task 6 — `page.tsx` |
| npm run build passes with 0 errors | Task 6 — build step |

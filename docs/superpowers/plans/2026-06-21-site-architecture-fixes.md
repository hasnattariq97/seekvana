# Site Architecture Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all broken routes, hardcoded data, design-token violations, and data-sync issues identified in the site audit.

**Architecture:** Create missing pages (`/library`, `/paths`, placeholder pages for `/tools`, `/glossary`, `/privacy`, `/terms`, `/contact`); extract a single `PILLAR_NAMES` source of truth; make hero stats dynamic by passing server-fetched counts as props; make recent-articles read from MDX files; fix hardcoded hex/rgba color violations in path-hero.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, `src/lib/mdx.ts` (getAllArticles, getAllPaths)

---

## Files overview

| Action | File |
|---|---|
| Create | `src/lib/pillars.ts` |
| Create | `src/app/library/page.tsx` |
| Create | `src/app/paths/page.tsx` |
| Create | `src/app/tools/page.tsx` |
| Create | `src/app/glossary/page.tsx` |
| Create | `src/app/privacy/page.tsx` |
| Create | `src/app/terms/page.tsx` |
| Create | `src/app/contact/page.tsx` |
| Modify | `src/app/page.tsx` (pass stats to Hero) |
| Modify | `src/components/home/hero.tsx` (accept props) |
| Modify | `src/components/home/recent-articles.tsx` (read from MDX) |
| Modify | `src/app/library/[pillar]/page.tsx` (import from pillars.ts) |
| Modify | `src/app/library/[pillar]/[slug]/page.tsx` (import from pillars.ts) |
| Modify | `src/components/paths/path-hero.tsx` (fix hardcoded colors) |
| Modify | `src/app/sitemap.ts` (fix /paths entry) |

---

### Task 1: Create `src/lib/pillars.ts` — single source of truth for pillar metadata

**Files:**
- Create: `src/lib/pillars.ts`

- [ ] **Step 1: Create the file**

```ts
// src/lib/pillars.ts

export interface PillarMeta {
  slug: string
  name: string
  description: string
}

export const PILLARS: PillarMeta[] = [
  {
    slug: 'agentic-ai',
    name: 'Agentic AI',
    description: 'Agents, tool use, memory, planning, and multi-agent systems — the flagship pillar.',
  },
  {
    slug: 'ai-foundations',
    name: 'AI Foundations',
    description: "What AI is, how it works, and why it matters. Start here if you're new.",
  },
  {
    slug: 'large-language-models',
    name: 'Large Language Models',
    description: 'Tokens, context windows, RAG, fine-tuning, and how LLMs actually think.',
  },
  {
    slug: 'building-with-ai',
    name: 'Building with AI',
    description: 'APIs, SDKs, evals, deployment, and cost management for builders.',
  },
  {
    slug: 'ai-tools',
    name: 'AI Tools',
    description: 'Reviews and comparisons of the best AI tools and platforms.',
  },
  {
    slug: 'ai-in-practice',
    name: 'AI in Practice',
    description: 'Real workflows for writing, research, coding, and automation — no deep technical knowledge required.',
  },
  {
    slug: 'prompt-engineering',
    name: 'Prompt Engineering',
    description: 'Write prompts that get results. Techniques, patterns, and frameworks that actually work.',
  },
  {
    slug: 'ethics-safety',
    name: 'Ethics & Safety',
    description: 'Responsible AI, alignment, risks, and governance.',
  },
  {
    slug: 'careers',
    name: 'Careers',
    description: 'How to learn AI, career paths, roles, and building your portfolio.',
  },
]

export const PILLAR_MAP: Record<string, PillarMeta> = Object.fromEntries(
  PILLARS.map((p) => [p.slug, p])
)

export function getPillarName(slug: string): string {
  return PILLAR_MAP[slug]?.name ?? slug
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/pillars.ts
git commit -m "feat: add pillars.ts as single source of truth for pillar metadata"
```

---

### Task 2: Update both pillar page files to use `pillars.ts`

**Files:**
- Modify: `src/app/library/[pillar]/page.tsx`
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

- [ ] **Step 1: Update `[pillar]/page.tsx`**

Replace the local `PILLAR_NAMES` and `PILLAR_DESCRIPTIONS` constants and update `generateStaticParams` to use the shared list:

```ts
// At the top of src/app/library/[pillar]/page.tsx — replace the PILLAR_NAMES and PILLAR_DESCRIPTIONS blocks with:
import { PILLARS, PILLAR_MAP } from '@/lib/pillars'
```

Replace `generateStaticParams`:
```ts
export function generateStaticParams() {
  return PILLARS.map((p) => ({ pillar: p.slug }))
}
```

Replace the usage of `PILLAR_NAMES[pillar]` → `PILLAR_MAP[pillar]?.name`
Replace the usage of `PILLAR_DESCRIPTIONS[pillar]` → `PILLAR_MAP[pillar]?.description`
Replace the `notFound()` check:
```ts
const pillarMeta = PILLAR_MAP[pillar]
if (!pillarMeta) notFound()
```

Then use `pillarMeta.name` and `pillarMeta.description` throughout.

- [ ] **Step 2: Update `[pillar]/[slug]/page.tsx`**

Replace the local `PILLAR_NAMES` block:
```ts
import { getPillarName } from '@/lib/pillars'
```

Replace every use of `PILLAR_NAMES[pillar]` with `getPillarName(pillar)`.

- [ ] **Step 3: Commit**

```bash
git add src/app/library/[pillar]/page.tsx src/app/library/[pillar]/[slug]/page.tsx
git commit -m "refactor: use shared pillars.ts in both pillar page files"
```

---

### Task 3: Create `src/app/library/page.tsx` — library index

**Files:**
- Create: `src/app/library/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/app/library/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { PILLARS } from '@/lib/pillars'
import { getAllArticles } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Library — Seekvana',
  description: 'Every AI topic in one place — from foundations to agentic systems. Browse all 9 content pillars.',
  alternates: { canonical: 'https://seekvana.com/library' },
  openGraph: {
    title: 'Library — Seekvana',
    description: 'Every AI topic in one place — from foundations to agentic systems.',
    url: 'https://seekvana.com/library',
  },
}

export default function LibraryPage() {
  const allArticles = getAllArticles()
  const countByPillar = Object.fromEntries(
    PILLARS.map((p) => [p.slug, allArticles.filter((a) => a.pillar === p.slug).length])
  )

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <header className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
          <span className="text-primary">Library</span>
        </nav>
        <h1 className="font-fraunces text-4xl text-primary mb-3">The Library</h1>
        <p className="text-lg text-secondary max-w-2xl">
          Every AI topic — clearly explained. Browse by subject area or search for what you need.
        </p>
        <p className="text-sm text-secondary mt-2">
          {allArticles.length} article{allArticles.length !== 1 ? 's' : ''} across {PILLARS.length} topics
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PILLARS.map((pillar) => {
          const count = countByPillar[pillar.slug] ?? 0
          return (
            <Link
              key={pillar.slug}
              href={`/library/${pillar.slug}`}
              className="bg-surface border border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-sm transition-all group"
            >
              <h2 className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors mb-2">
                {pillar.name}
              </h2>
              <p className="text-sm text-secondary line-clamp-2 mb-4">{pillar.description}</p>
              <span className="text-xs text-secondary">
                {count > 0 ? `${count} article${count !== 1 ? 's' : ''}` : 'Coming soon'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/library/page.tsx
git commit -m "feat: add /library index page showing all 9 pillars"
```

---

### Task 4: Create `src/app/paths/page.tsx` — paths index

**Files:**
- Create: `src/app/paths/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/app/paths/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPaths } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Learning Paths — Seekvana',
  description: 'Structured learning journeys from AI beginner to advanced builder. Pick a path and start today.',
  alternates: { canonical: 'https://seekvana.com/paths' },
  openGraph: {
    title: 'Learning Paths — Seekvana',
    description: 'Structured learning journeys from AI beginner to advanced builder.',
    url: 'https://seekvana.com/paths',
  },
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default function PathsPage() {
  const paths = getAllPaths()

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <header className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
          <span className="text-primary">Learning Paths</span>
        </nav>
        <h1 className="font-fraunces text-4xl text-primary mb-3">Learning Paths</h1>
        <p className="text-lg text-secondary max-w-2xl">
          Structured journeys that take you from zero to confident. Each path is a curated sequence of topics with clear milestones.
        </p>
      </header>

      {paths.length === 0 ? (
        <p className="text-secondary text-center py-16">No paths available yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((path) => (
            <Link
              key={path.slug}
              href={`/paths/${path.slug}`}
              className="bg-surface border border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-sm transition-all group flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-fraunces text-xl text-primary group-hover:text-accent transition-colors leading-snug">
                  {path.title}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize shrink-0 mt-0.5 ${
                    DIFFICULTY_COLORS[path.difficulty] ?? DIFFICULTY_COLORS.beginner
                  }`}
                >
                  {path.difficulty}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">{path.description}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-xs text-secondary">{path.lessonCount} topics</span>
                <span className="text-accent text-sm font-medium">Start path →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/paths/page.tsx
git commit -m "feat: add /paths index page"
```

---

### Task 5: Fix hero stat badge — make it dynamic

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/hero.tsx`

The hero is a `"use client"` component (uses `useSearch` and framer-motion). It cannot call `getAllArticles()` directly. Solution: pass `articleCount` and `pathCount` as props from the server component `page.tsx`.

- [ ] **Step 1: Update `Hero` to accept props**

In `src/components/home/hero.tsx`, change the function signature and the badge text:

```tsx
// Change the Hero function signature from:
export function Hero() {

// To:
interface HeroProps {
  articleCount: number
  pathCount: number
}

export function Hero({ articleCount, pathCount }: HeroProps) {
```

Replace the hardcoded badge span (line ~45):
```tsx
// Replace:
218 articles · 9 learning paths
// With:
{articleCount} article{articleCount !== 1 ? 's' : ''} · {pathCount} learning path{pathCount !== 1 ? 's' : ''}
```

- [ ] **Step 2: Pass counts from `src/app/page.tsx`**

Read the current `src/app/page.tsx`, then add the imports and prop passing:

```tsx
// Add at top of src/app/page.tsx:
import { getAllArticles, getAllPaths } from '@/lib/mdx'

// In the default export (server component), fetch counts before returning JSX:
export default function HomePage() {
  const articleCount = getAllArticles().length
  const pathCount = getAllPaths().length
  return (
    // ... existing JSX but pass props to Hero:
    <Hero articleCount={articleCount} pathCount={pathCount} />
    // ... rest unchanged
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/components/home/hero.tsx
git commit -m "fix: make hero stat badge dynamic from actual article/path counts"
```

---

### Task 6: Fix `recent-articles.tsx` — read from MDX instead of hardcoded array

**Files:**
- Modify: `src/components/home/recent-articles.tsx`
- Modify: `src/app/page.tsx` (pass articles as prop)

`recent-articles.tsx` is `"use client"` so it can't call `getAllArticles()`. Same pattern: fetch in the server component and pass down.

- [ ] **Step 1: Create a server wrapper component**

Create `src/components/home/recent-articles-server.tsx`:

```tsx
// src/components/home/recent-articles-server.tsx
import { getAllArticles, type ArticleMeta } from '@/lib/mdx'
import { RecentArticles } from './recent-articles'

export function RecentArticlesServer() {
  const articles = getAllArticles()
    .sort((a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
    )
    .slice(0, 6)
  return <RecentArticles articles={articles} />
}
```

- [ ] **Step 2: Update `recent-articles.tsx` to accept articles as props**

Replace the hardcoded `ARTICLES` array and `Article` interface — the component now receives articles from MDX:

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import type { ArticleMeta } from "@/lib/mdx";

interface RecentArticlesProps {
  articles: ArticleMeta[];
}

type Difficulty = "beginner" | "intermediate" | "advanced";

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const CARD_BG = ["bg-accent-soft", "bg-info/20", "bg-surface-subtle"] as const;

const TABS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

function ArticleGrid({ articles }: { articles: ArticleMeta[] }) {
  const shouldReduceMotion = useReducedMotion();

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
          key={`${article.pillar}/${article.slug}`}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: "easeOut",
            delay: shouldReduceMotion ? 0 : (i % 3) * 0.08,
          }}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow relative"
        >
          <Link
            href={`/library/${article.pillar}/${article.slug}`}
            className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-xl"
            aria-label={`Read: ${article.frontmatter.title}`}
          />
          <div className={`relative h-48 ${CARD_BG[i % CARD_BG.length]}`} aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 bg-accent-soft text-accent text-xs rounded-full px-2.5 py-0.5 font-medium backdrop-blur-sm capitalize">
              {article.pillar.replace(/-/g, ' ')}
            </span>
          </div>
          <div className="p-5 relative z-10">
            <span
              className={`inline-block text-xs rounded-full px-2.5 py-0.5 font-medium capitalize ${
                DIFFICULTY_BADGE[article.frontmatter.difficulty as Difficulty] ?? DIFFICULTY_BADGE.beginner
              }`}
            >
              {article.frontmatter.difficulty}
            </span>
            <h3 className="font-fraunces text-lg text-primary mt-2 leading-snug">
              {article.frontmatter.title}
            </h3>
            <p className="font-inter text-sm text-secondary mt-1 line-clamp-2">
              {article.frontmatter.description}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-secondary">{article.frontmatter.readTime} min read</span>
              <span className="text-secondary text-xs">·</span>
              <span className="text-xs text-secondary">{article.frontmatter.author}</span>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <section className="bg-canvas py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary">
          Fresh from the library
        </h2>
        <p className="font-inter text-sm text-secondary mt-1 mb-6">
          Recent articles across AI topics — updated regularly.
        </p>

        <Tabs defaultValue="All">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border mb-8 h-auto flex-wrap gap-0"
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-sm text-secondary rounded-none hover:text-primary bg-transparent px-3 py-2 data-active:!text-accent data-active:after:!bg-accent"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab}>
              <ArticleGrid
                articles={
                  tab === "All"
                    ? articles
                    : articles.filter(
                        (a) => a.frontmatter.difficulty === tab.toLowerCase()
                      )
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `src/app/page.tsx` to use the server wrapper**

```tsx
// Replace the RecentArticles import with:
import { RecentArticlesServer } from '@/components/home/recent-articles-server'

// Replace <RecentArticles /> with:
<RecentArticlesServer />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/home/recent-articles.tsx src/components/home/recent-articles-server.tsx src/app/page.tsx
git commit -m "fix: recent-articles now reads from MDX files dynamically"
```

---

### Task 7: Fix hardcoded hex/rgba colors in `path-hero.tsx`

**Files:**
- Modify: `src/components/paths/path-hero.tsx`

- [ ] **Step 1: Replace hardcoded color values**

In `src/components/paths/path-hero.tsx`, find and replace these violations:

```tsx
// Line ~30 — replace hardcoded border/bg in beginner badge:
// FROM:
className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1 rounded-full border border-[#c3e6cd] bg-[#f0faf4] text-success"
// TO:
className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success"
```

Search for any `bg-[rgba(...)` or `bg-[#...]` or `hover:bg-[#...]` patterns in the file and replace each:
- `bg-[rgba(201,99,63,0.12)]` → `bg-accent-soft`
- `border-[rgba(201,99,63,0.25)]` → `border-accent/25`
- `hover:bg-[#f1d5c8]` → `hover:bg-accent-soft`

- [ ] **Step 2: Commit**

```bash
git add src/components/paths/path-hero.tsx
git commit -m "fix: replace hardcoded hex/rgba colors with design token classes in path-hero"
```

---

### Task 8: Create placeholder pages for `/tools`, `/glossary`, `/privacy`, `/terms`, `/contact`

**Files:**
- Create: `src/app/tools/page.tsx`
- Create: `src/app/glossary/page.tsx`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: Create `src/app/tools/page.tsx`**

```tsx
// src/app/tools/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tools — Seekvana',
  description: 'Reviews and comparisons of the best AI tools, models, and platforms.',
  alternates: { canonical: 'https://seekvana.com/tools' },
}

export default function ToolsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Tools</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-4">AI Tools</h1>
      <p className="text-lg text-secondary max-w-2xl mb-12">
        Honest reviews and comparisons of AI tools, models, and platforms — so you can choose what actually fits your needs.
      </p>
      <div className="bg-surface border border-border rounded-xl p-10 text-center max-w-lg mx-auto">
        <p className="font-fraunces text-xl text-primary mb-2">Coming soon</p>
        <p className="text-sm text-secondary">
          Tool reviews and comparisons are in the works. In the meantime, explore our{' '}
          <Link href="/library/ai-tools" className="text-accent hover:underline">AI Tools articles</Link>.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/glossary/page.tsx`**

```tsx
// src/app/glossary/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Glossary — Seekvana',
  description: 'Plain-language definitions for AI terms — from tokens and embeddings to agentic workflows.',
  alternates: { canonical: 'https://seekvana.com/glossary' },
}

export default function GlossaryPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Glossary</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-4">AI Glossary</h1>
      <p className="text-lg text-secondary max-w-2xl mb-12">
        Plain-language definitions for the terms that matter — no jargon, no assumptions.
      </p>
      <div className="bg-surface border border-border rounded-xl p-10 text-center max-w-lg mx-auto">
        <p className="font-fraunces text-xl text-primary mb-2">Coming soon</p>
        <p className="text-sm text-secondary">
          The full glossary is being built. Start with our{' '}
          <Link href="/library/ai-foundations" className="text-accent hover:underline">AI Foundations</Link> articles while you wait.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/app/privacy/page.tsx`**

```tsx
// src/app/privacy/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Seekvana',
  description: 'How Seekvana collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Privacy Policy</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-6">Privacy Policy</h1>
      <div className="prose-sm text-secondary space-y-4">
        <p className="text-sm text-secondary">Last updated: June 2026</p>
        <p>Seekvana (<strong className="text-primary">seekvana.com</strong>) is a free AI learning resource. We take privacy seriously and collect minimal data.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">What we collect</h2>
        <p>We use analytics (Google Analytics) to understand how visitors use the site — page views, device type, and referring sources. No personally identifiable information is collected without your explicit consent.</p>
        <p>If you subscribe to our newsletter, we store your email address to send you updates. You can unsubscribe at any time.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Advertising</h2>
        <p>We display ads via Google AdSense. Google may use cookies to personalize ads based on your browsing history. You can opt out via <a href="https://adssettings.google.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Contact</h2>
        <p>Questions? Email us at <Link href="/contact" className="text-accent hover:underline">our contact page</Link>.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/app/terms/page.tsx`**

```tsx
// src/app/terms/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — Seekvana',
  description: 'Terms and conditions for using Seekvana.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Terms of Use</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-6">Terms of Use</h1>
      <div className="space-y-4 text-secondary">
        <p className="text-sm text-secondary">Last updated: June 2026</p>
        <p>By accessing Seekvana, you agree to these terms. If you disagree, please do not use the site.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Content</h2>
        <p>All content on Seekvana is for educational purposes. We aim for accuracy but make no guarantees. The AI field moves fast — always verify important information from primary sources.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Intellectual property</h2>
        <p>All original content is © 2026 Seekvana. You may share excerpts with attribution. You may not reproduce full articles without permission.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Affiliate links</h2>
        <p>Some links on Seekvana are affiliate links. We may earn a commission if you purchase through them, at no cost to you. We only recommend tools we believe in.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Contact</h2>
        <p>Questions? <Link href="/contact" className="text-accent hover:underline">Get in touch</Link>.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `src/app/contact/page.tsx`**

```tsx
// src/app/contact/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Seekvana',
  description: 'Get in touch with the Seekvana team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Contact</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-4">Get in touch</h1>
      <p className="text-secondary mb-8">
        Found an error? Have a suggestion? Want to collaborate? We'd love to hear from you.
      </p>
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Email</p>
          <a href="mailto:hello@seekvana.com" className="text-accent hover:underline text-sm">
            hello@seekvana.com
          </a>
        </div>
        <div>
          <p className="text-sm font-medium text-primary mb-1">Twitter / X</p>
          <a
            href="https://twitter.com/seekvana"
            className="text-accent hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            @seekvana
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/tools/page.tsx src/app/glossary/page.tsx src/app/privacy/page.tsx src/app/terms/page.tsx src/app/contact/page.tsx
git commit -m "feat: add placeholder pages for /tools, /glossary, /privacy, /terms, /contact"
```

---

### Task 9: Fix sitemap — add real missing routes, remove phantom `/paths` static entry

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Update sitemap to use dynamic path entries and add new pages**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllArticles, getAllPaths } from "@/lib/mdx";
import { PILLARS } from "@/lib/pillars";

export const revalidate = 3600;

const BASE_URL = "https://seekvana.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const paths = getAllPaths();

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/library/${a.pillar}/${a.slug}`,
    lastModified: new Date(a.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pillarEntries: MetadataRoute.Sitemap = PILLARS.map((p) => ({
    url: `${BASE_URL}/library/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const pathEntries: MetadataRoute.Sitemap = paths.map((p) => ({
    url: `${BASE_URL}/paths/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/library`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/paths`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...pillarEntries,
    ...pathEntries,
    ...articleEntries,
  ];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "fix: sitemap now uses dynamic paths/articles, adds new pages, removes phantom entries"
```

---

### Task 10: Handle unwritten articles in path topic list

**Files:**
- Modify: `src/components/paths/module-list.tsx`

The `getting-started.json` has 101 topics but only 8 have real articles. Topics without a linked article should show as "coming soon" rather than render a broken link.

- [ ] **Step 1: Read `module-list.tsx`**

Read `src/components/paths/module-list.tsx` to see how topics render.

- [ ] **Step 2: Add "coming soon" state for topics without articles**

In the topic rendering, check if `topic.articleSlug` exists. If not, render a non-linked item styled as `text-secondary opacity-60` with a "Coming soon" label instead of a clickable `<Link>`:

```tsx
// In the topic render block, wrap with a conditional:
{topic.articleSlug ? (
  <Link
    href={`/library/${topic.articlePillar}/${topic.articleSlug}`}
    className="... existing classes ..."
  >
    {topic.title}
  </Link>
) : (
  <div className="flex items-center justify-between px-4 py-2.5 rounded-lg opacity-60 cursor-default">
    <span className="text-sm text-secondary">{topic.title}</span>
    <span className="text-xs text-secondary border border-border rounded-full px-2 py-0.5">Soon</span>
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/paths/module-list.tsx
git commit -m "fix: path topics without articles show as coming-soon instead of broken link"
```

---

### Task 11: Build check and final fix pass

- [ ] **Step 1: Run build**

```bash
cd d:/seekvana && npm run build
```

- [ ] **Step 2: Fix any TypeScript or build errors** (address each error as it appears)

- [ ] **Step 3: Final commit and push**

```bash
git add -A
git commit -m "fix: site architecture — missing pages, dynamic data, design tokens, sitemap"
git push
```

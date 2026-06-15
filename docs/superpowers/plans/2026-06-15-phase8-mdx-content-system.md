# Phase 8 — MDX Content System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the MDX content pipeline so new articles can be added as `.mdx` files with no code changes, replace all hardcoded mock data in `PillarSidebar` and `ArticleNav` with real filesystem-driven data, add static generation to all article routes, and build the pillar index page.

**Architecture:** All content lives in `src/content/articles/[pillar]/[slug].mdx`. Server components read directly from the filesystem using `src/lib/mdx.ts` (synchronous `fs` reads — no async needed). Client components that display article lists (`PillarSidebar`) receive data as props from their server-side parents. `generateStaticParams()` pre-renders all routes at build time from the real content files. Path definitions live in `src/content/paths/*.json`.

**Tech Stack:** Next.js 15 App Router (RSC), `gray-matter` (already installed), `next-mdx-remote/rsc` (already installed), Node.js `fs` (built-in). No new dependencies.

---

## File Map

| File | Action | Reason |
|---|---|---|
| `src/lib/mdx.ts` | Modify — add `getFeaturedArticles()`, `PathDefinition` interface, `getAllPaths()` | Task 1 |
| `src/content/paths/ai-for-beginners.json` | Create | Task 2 |
| `src/content/paths/master-agentic-ai.json` | Create | Task 2 |
| `src/content/paths/build-first-agent.json` | Create | Task 2 |
| `src/content/paths/prompt-engineering.json` | Create | Task 2 |
| `src/content/paths/beginner-to-engineer.json` | Create | Task 2 |
| `src/app/library/[pillar]/[slug]/page.tsx` | Modify — add `generateStaticParams()`, pass real articles to `PillarSidebar` | Task 3 + 4 |
| `src/components/article/pillar-sidebar.tsx` | Modify — replace `MOCK_PILLAR_ARTICLES` with `articles` prop | Task 4 |
| `src/components/article/article-nav.tsx` | Modify — replace mock constants with `getArticlesByPillar()` | Task 5 |
| `src/app/library/[pillar]/page.tsx` | Create — pillar index page | Task 6 |
| `src/content/articles/agentic-ai/tool-use-explained.mdx` | Create | Task 7 |
| `src/content/articles/large-language-models/how-llms-work.mdx` | Create | Task 7 |
| `src/content/articles/ai-foundations/what-is-ai.mdx` | Create | Task 7 |
| `src/content/articles/agentic-ai/rag-explained.mdx` | Create | Task 7 |

> **No test framework is set up.** Verification for every task = TypeScript compilation passing (`npm run build`). Run `npm run dev` and visit the relevant URL after Tasks 4–6 for visual confirmation.

---

## Task 1: Extend `src/lib/mdx.ts` — add `getFeaturedArticles()` and `getAllPaths()`

**Files:**
- Modify: `src/lib/mdx.ts`

- [ ] **Step 1: Add `getFeaturedArticles()` to the bottom of `src/lib/mdx.ts`**

Append after the existing `getArticlesByPillar` function:

```typescript
export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles().filter((a) => a.frontmatter.featured)
}
```

- [ ] **Step 2: Add `PathDefinition` interface and `getAllPaths()` to `src/lib/mdx.ts`**

Append after `getFeaturedArticles`:

```typescript
export interface PathDefinition {
  slug: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lessonCount: number
  href: string
  colorClass: string
}

export function getAllPaths(): PathDefinition[] {
  const pathsDir = path.join(process.cwd(), 'src', 'content', 'paths')
  if (!fs.existsSync(pathsDir)) return []
  return fs
    .readdirSync(pathsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(pathsDir, f), 'utf-8')
      return JSON.parse(raw) as PathDefinition
    })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: no type errors in `src/lib/mdx.ts`. Build may fail on other things — that's OK at this stage.

- [ ] **Step 4: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat(mdx): add getFeaturedArticles and getAllPaths utilities"
```

---

## Task 2: Create path JSON files in `src/content/paths/`

**Files:**
- Create: `src/content/paths/ai-for-beginners.json`
- Create: `src/content/paths/master-agentic-ai.json`
- Create: `src/content/paths/build-first-agent.json`
- Create: `src/content/paths/prompt-engineering.json`
- Create: `src/content/paths/beginner-to-engineer.json`

- [ ] **Step 1: Create `src/content/paths/ai-for-beginners.json`**

```json
{
  "slug": "ai-for-beginners",
  "title": "AI for Absolute Beginners",
  "description": "Start with zero assumptions.",
  "difficulty": "beginner",
  "lessonCount": 8,
  "href": "/paths/ai-for-beginners",
  "colorClass": "bg-accent"
}
```

- [ ] **Step 2: Create `src/content/paths/master-agentic-ai.json`**

```json
{
  "slug": "master-agentic-ai",
  "title": "Master Agentic AI",
  "description": "Go deep on agents, tool use, memory, and planning.",
  "difficulty": "intermediate",
  "lessonCount": 14,
  "href": "/paths/master-agentic-ai",
  "colorClass": "bg-info"
}
```

- [ ] **Step 3: Create `src/content/paths/build-first-agent.json`**

```json
{
  "slug": "build-first-agent",
  "title": "Build Your First AI Agent",
  "description": "Go from one tool call to a working autonomous agent.",
  "difficulty": "beginner",
  "lessonCount": 10,
  "href": "/paths/build-first-agent",
  "colorClass": "bg-success"
}
```

- [ ] **Step 4: Create `src/content/paths/prompt-engineering.json`**

```json
{
  "slug": "prompt-engineering",
  "title": "Prompt Engineering Essentials",
  "description": "Write prompts that actually work.",
  "difficulty": "beginner",
  "lessonCount": 6,
  "href": "/paths/prompt-engineering",
  "colorClass": "bg-amber-600"
}
```

- [ ] **Step 5: Create `src/content/paths/beginner-to-engineer.json`**

```json
{
  "slug": "beginner-to-engineer",
  "title": "Beginner to AI Engineer",
  "description": "The full journey from AI basics to shipping apps.",
  "difficulty": "advanced",
  "lessonCount": 24,
  "href": "/paths/beginner-to-engineer",
  "colorClass": "bg-purple-600"
}
```

- [ ] **Step 6: Commit**

```bash
git add src/content/paths/
git commit -m "feat(content): add learning path JSON definitions"
```

---

## Task 3: Add `generateStaticParams()` to the article page

**Files:**
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

The article page has `generateMetadata` and `ArticlePage` but no `generateStaticParams`. Without it, Next.js renders article routes dynamically at request time — with it, all routes are pre-built at compile time.

- [ ] **Step 1: Add the import for `getAllArticles` at the top of the file**

The file currently imports: `import { getArticleSource, type ArticleFrontmatter } from '@/lib/mdx'`

Change it to:

```typescript
import { getArticleSource, getAllArticles, getArticlesByPillar, type ArticleFrontmatter } from '@/lib/mdx'
```

- [ ] **Step 2: Add `generateStaticParams()` after the `DIFFICULTY_COLORS` constant (around line 34)**

Insert this block between `DIFFICULTY_COLORS` and `generateMetadata`:

```typescript
export function generateStaticParams() {
  return getAllArticles().map((a) => ({
    pillar: a.pillar,
    slug: a.slug,
  }))
}
```

- [ ] **Step 3: Pass real pillar articles to `PillarSidebar`**

In `ArticlePage`, after `const pillarName = PILLAR_NAMES[pillar] ?? pillar`, add:

```typescript
const pillarArticles = getArticlesByPillar(pillar).map((a) => ({
  title: a.frontmatter.title,
  slug: a.slug,
}))
```

Then update the JSX to pass `articles` to `PillarSidebar`:

```tsx
<PillarSidebar pillar={pillar} currentSlug={slug} articles={pillarArticles} />
```

- [ ] **Step 4: Run build to check for TypeScript errors**

Run: `npm run build`
Expected: may fail because `PillarSidebar` doesn't accept `articles` prop yet — that's fixed in Task 4.

- [ ] **Step 5: Commit (even if build is broken — the next task fixes the type error)**

```bash
git add src/app/library/\[pillar\]/\[slug\]/page.tsx
git commit -m "feat(article): add generateStaticParams and pass real pillar articles to sidebar"
```

---

## Task 4: Wire `PillarSidebar` to real data

**Files:**
- Modify: `src/components/article/pillar-sidebar.tsx`

The component currently uses a hardcoded `MOCK_PILLAR_ARTICLES` record. We replace it with an `articles` prop that the server page passes in.

- [ ] **Step 1: Replace the entire file content of `src/components/article/pillar-sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const PILLAR_NAMES: Record<string, string> = {
  'agentic-ai': 'Agentic AI',
  'ai-foundations': 'AI Foundations',
  'large-language-models': 'Large Language Models',
  'building-with-ai': 'Building with AI',
  'ai-tools': 'AI Tools',
  'use-cases': 'Use Cases',
  'concepts-theory': 'Concepts & Theory',
  'ethics-safety': 'Ethics & Safety',
  careers: 'Careers',
}

interface PillarSidebarProps {
  pillar: string
  currentSlug: string
  articles: { title: string; slug: string }[]
}

function SidebarContent({ pillar, currentSlug, articles }: PillarSidebarProps) {
  const pillarName = PILLAR_NAMES[pillar] ?? pillar

  return (
    <div className="flex flex-col gap-1">
      <Link
        href="/library"
        className="text-accent text-sm hover:underline mb-3 inline-flex items-center gap-1"
      >
        ← Library
      </Link>
      <p className="font-fraunces text-base text-primary mb-4">{pillarName}</p>
      <nav className="flex flex-col gap-0.5" aria-label={`${pillarName} articles`}>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/library/${pillar}/${article.slug}`}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              article.slug === currentSlug
                ? 'bg-accent-soft text-accent font-medium'
                : 'text-secondary hover:text-primary hover:bg-surface-subtle'
            }`}
          >
            {article.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function PillarSidebar({ pillar, currentSlug, articles }: PillarSidebarProps) {
  return (
    <>
      {/* Desktop sticky sidebar — hidden below lg */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2">
          <SidebarContent pillar={pillar} currentSlug={currentSlug} articles={articles} />
        </div>
      </aside>

      {/* Mobile: Contents button that opens a Sheet — visible below lg */}
      <div className="lg:hidden mb-6">
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 text-sm text-secondary border border-border rounded-lg px-4 py-2 hover:bg-surface-subtle transition-colors">
            <BookOpen className="h-4 w-4" />
            Contents
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-surface p-6">
            <SheetHeader>
              <SheetTitle className="text-left font-fraunces">Contents</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <SidebarContent pillar={pillar} currentSlug={currentSlug} articles={articles} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: the type error from Task 3 Step 4 is now resolved. Build should pass (or fail only on missing articles — Task 7 fixes that).

- [ ] **Step 3: Commit**

```bash
git add src/components/article/pillar-sidebar.tsx
git commit -m "feat(sidebar): replace mock article data with real props from server"
```

---

## Task 5: Wire `ArticleNav` to real filesystem data

**Files:**
- Modify: `src/components/article/article-nav.tsx`

`ArticleNav` has no `'use client'` directive — it is a React Server Component. It can import from `src/lib/mdx.ts` directly. We replace the `MOCK_ADJACENT` and `MOCK_RELATED` constants with a live call to `getArticlesByPillar()`.

- [ ] **Step 1: Replace the entire file content of `src/components/article/article-nav.tsx`**

```tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getArticlesByPillar } from '@/lib/mdx'

interface NavArticle {
  title: string
  slug: string
  pillar: string
}

interface RelatedArticle extends NavArticle {
  readTime: number
}

interface ArticleNavProps {
  pillar: string
  slug: string
}

export function ArticleNav({ pillar, slug }: ArticleNavProps) {
  const all = getArticlesByPillar(pillar).sort(
    (a, b) =>
      new Date(a.frontmatter.publishedAt).getTime() -
      new Date(b.frontmatter.publishedAt).getTime()
  )

  const idx = all.findIndex((a) => a.slug === slug)
  const prevArticle = idx > 0 ? all[idx - 1] : null
  const nextArticle = idx < all.length - 1 ? all[idx + 1] : null

  const prev: NavArticle | null = prevArticle
    ? { title: prevArticle.frontmatter.title, slug: prevArticle.slug, pillar }
    : null

  const next: NavArticle | null = nextArticle
    ? { title: nextArticle.frontmatter.title, slug: nextArticle.slug, pillar }
    : null

  const related: RelatedArticle[] = all
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map((a) => ({
      title: a.frontmatter.title,
      slug: a.slug,
      pillar,
      readTime: a.frontmatter.readTime,
    }))

  return (
    <div className="mt-12 space-y-10">
      {/* Prev / Next */}
      <div className="grid grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/library/${prev.pillar}/${prev.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-colors"
          >
            <span className="flex items-center gap-1 text-xs font-medium text-secondary">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Previous
            </span>
            <span className="font-fraunces text-base text-primary">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/library/${next.pillar}/${next.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-colors text-right col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-xs font-medium text-secondary">
              Next <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="font-fraunces text-base text-primary">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <h3 className="font-fraunces text-xl text-primary mb-5">
            Keep reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((article) => (
              <Link
                key={article.slug}
                href={`/library/${article.pillar}/${article.slug}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-all"
              >
                <span className="font-fraunces text-base text-primary leading-snug">
                  {article.title}
                </span>
                <span className="text-xs text-secondary">
                  {article.readTime} min read
                </span>
                <span className="text-xs text-accent font-medium mt-auto pt-2 transition-colors group-hover:underline underline-offset-2">
                  Read &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: compiles cleanly. The mock constants are gone; real data flows from the filesystem.

- [ ] **Step 3: Commit**

```bash
git add src/components/article/article-nav.tsx
git commit -m "feat(article-nav): replace mock prev/next/related with real pillar data"
```

---

## Task 6: Create the pillar index page

**Files:**
- Create: `src/app/library/[pillar]/page.tsx`

This page lists all articles for a given pillar. It is a Server Component, uses `generateStaticParams()` so all pillar URLs are pre-rendered, and shows a breadcrumb, header, and article card list.

- [ ] **Step 1: Create `src/app/library/[pillar]/page.tsx` with this full content**

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles, getArticlesByPillar } from '@/lib/mdx'

const PILLAR_NAMES: Record<string, string> = {
  'agentic-ai': 'Agentic AI',
  'ai-foundations': 'AI Foundations',
  'large-language-models': 'Large Language Models',
  'building-with-ai': 'Building with AI',
  'ai-tools': 'AI Tools & Comparisons',
  'use-cases': 'Use Cases & Workflows',
  'concepts-theory': 'Concepts & Theory',
  'ethics-safety': 'Ethics, Safety & Governance',
  careers: 'Careers & Learning',
}

const PILLAR_DESCRIPTIONS: Record<string, string> = {
  'agentic-ai': 'Agents, tool use, memory, planning, and multi-agent systems.',
  'ai-foundations': 'What AI is, how it works, and why it matters.',
  'large-language-models': 'Tokens, context windows, RAG, fine-tuning, and how LLMs think.',
  'building-with-ai': 'APIs, SDKs, evals, deployment, and cost management.',
  'ai-tools': 'Reviews and comparisons of the best AI tools and APIs.',
  'use-cases': 'Real workflows: writing, coding, research, and automation.',
  'concepts-theory': 'Transformers, embeddings, and the mechanics under the hood.',
  'ethics-safety': 'Responsible AI, alignment, risks, and governance.',
  careers: 'How to learn AI, roles to aim for, and building your portfolio.',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

interface PageProps {
  params: Promise<{ pillar: string }>
}

export function generateStaticParams() {
  const articles = getAllArticles()
  const pillars = [...new Set(articles.map((a) => a.pillar))]
  return pillars.map((pillar) => ({ pillar }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar } = await params
  const name = PILLAR_NAMES[pillar] ?? pillar
  const description = PILLAR_DESCRIPTIONS[pillar] ?? `Articles about ${name} on Seekvana.`
  return {
    title: `${name} — Seekvana`,
    description,
    openGraph: {
      title: `${name} — Seekvana`,
      description,
      url: `https://seekvana.com/library/${pillar}`,
    },
  }
}

export default async function PillarPage({ params }: PageProps) {
  const { pillar } = await params
  const articles = getArticlesByPillar(pillar)

  if (articles.length === 0) notFound()

  const pillarName = PILLAR_NAMES[pillar] ?? pillar
  const description = PILLAR_DESCRIPTIONS[pillar] ?? ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm text-secondary mb-8"
        aria-label="Breadcrumb"
      >
        <Link href="/library" className="hover:text-accent transition-colors">
          Library
        </Link>
        <svg
          className="w-3 h-3 text-border"
          viewBox="0 0 6 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M1 1l4 4-4 4" />
        </svg>
        <span className="text-primary">{pillarName}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="font-fraunces text-4xl text-primary leading-tight">
          {pillarName}
        </h1>
        <p className="text-lg text-secondary mt-3 max-w-2xl">{description}</p>
        <p className="text-sm text-secondary mt-3">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Article list */}
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/library/${pillar}/${article.slug}`}
            className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-all"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors leading-snug">
                {article.frontmatter.title}
              </h2>
              <p className="text-sm text-secondary mt-1 line-clamp-2">
                {article.frontmatter.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                  DIFFICULTY_COLORS[article.frontmatter.difficulty] ??
                  DIFFICULTY_COLORS.beginner
                }`}
              >
                {article.frontmatter.difficulty}
              </span>
              <span className="text-xs text-secondary whitespace-nowrap">
                {article.frontmatter.readTime} min
              </span>
              <span className="text-xs text-accent font-medium whitespace-nowrap">
                Read →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: all pillar index routes pre-render successfully. The `notFound()` branch is safe — it only triggers at runtime for unknown pillars.

- [ ] **Step 3: Start dev server and verify visually**

Run: `npm run dev`
Visit: `http://localhost:3000/library/agentic-ai`
Expected: pillar page shows the 1 existing article ("What is an AI Agent?") with its difficulty badge and read time.

- [ ] **Step 4: Commit**

```bash
git add src/app/library/\[pillar\]/page.tsx
git commit -m "feat(pillar): add pillar index page with static generation and article list"
```

---

## Task 7: Create 4 starter articles

**Files:**
- Create: `src/content/articles/agentic-ai/tool-use-explained.mdx`
- Create: `src/content/articles/large-language-models/how-llms-work.mdx`
- Create: `src/content/articles/ai-foundations/what-is-ai.mdx`
- Create: `src/content/articles/agentic-ai/rag-explained.mdx`

> These are content files. Each must have valid frontmatter matching the exact schema from CLAUDE.md. The MDX body must use real educational content — no lorem ipsum.

- [ ] **Step 1: Create `src/content/articles/agentic-ai/tool-use-explained.mdx`**

```mdx
---
title: "Tool Use: Giving Models Hands, Not Just a Mouth"
description: "How function calling works, why it matters, and a working Python example showing a model calling a real tool."
pillar: "agentic-ai"
slug: "tool-use-explained"
difficulty: "intermediate"
readTime: 10
author: "Seekvana"
publishedAt: "2026-01-22"
tags: ["tool use", "function calling", "agents", "agentic AI"]
featured: false
---

A language model with no tools is like a consultant locked in a room with only a notepad. It can reason, plan, and write — but it can't actually *do* anything in the world. Tool use changes that. It gives the model a set of capabilities it can call on demand: search the web, query a database, run code, send an email.

This is also called **function calling** — the protocol that lets a model request that a specific function be executed and then reason about the result.

<AdSlot />

## How Function Calling Works

The protocol has four steps that repeat in a loop:

1. You send the model a list of **tool definitions** — each one has a name, a description, and a JSON Schema describing its inputs.
2. The model reads your message and decides whether to answer directly or call a tool. If it needs a tool, it responds with a structured `tool_use` block instead of prose.
3. Your application sees the `tool_use` block, runs the actual function, and sends the **tool result** back to the model.
4. The model reads the result and either calls another tool or gives a final answer.

The model never actually runs code. It just produces a structured request, and your application decides what to do with it. This means you stay in control of which tools exist and what they can do.

## A Working Example

Here is a complete loop using the Anthropic SDK. The model has access to a weather tool:

```python
import anthropic
import json

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a given city.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city name, e.g. 'London'"
                }
            },
            "required": ["city"]
        }
    }
]

def get_weather(city: str) -> str:
    # In production this would call a real weather API
    return json.dumps({"city": city, "temp_c": 14, "condition": "cloudy"})

messages = [{"role": "user", "content": "What's the weather like in London right now?"}]

while True:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=512,
        tools=tools,
        messages=messages
    )

    if response.stop_reason == "end_turn":
        print(response.content[0].text)
        break

    tool_use = next(b for b in response.content if b.type == "tool_use")
    result = get_weather(tool_use.input["city"])

    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [{"type": "tool_result", "tool_use_id": tool_use.id, "content": result}]
    })
```

<Tip>
The `stop_reason` field is your exit condition. `"end_turn"` means the model has finished and given a final answer. `"tool_use"` means it wants to call a function before continuing. These are the only two states you need to handle in a basic agent loop.
</Tip>

## Writing Good Tool Descriptions

The description field is what the model reads to decide *when* to use a tool. Vague descriptions produce wrong choices. Specific descriptions produce reliable ones.

| Weak | Strong |
|---|---|
| "Search for things" | "Search the web for current information. Use when the user asks about recent events, prices, or anything that may have changed." |
| "Run code" | "Execute Python code and return stdout. Use for calculations, data processing, or when the user asks to 'run' or 'compute' something." |
| "Get data" | "Query the product database by SKU and return price, stock level, and description." |

The model reads your description the same way a new employee reads documentation. Write for clarity, not brevity.

## When to Add Tools

Tools are worth adding when:
- The task requires up-to-date information (web search, live APIs)
- The task requires computation the model is unreliable at (maths, code execution)
- The task requires side effects (send email, write file, update database)
- The answer lives in a data source the model doesn't have (your database, internal docs)

Start with one or two tools and add more only when you hit a concrete limitation. A focused tool set is easier to debug than a sprawling one.

The next step after tool use is **memory** — giving agents a way to store and retrieve information across runs. That is explored in the Agentic AI pillar.
```

- [ ] **Step 2: Create `src/content/articles/large-language-models/how-llms-work.mdx`**

```mdx
---
title: "How LLMs Actually Work"
description: "Tokens, transformers, and the prediction loop — a clear technical explanation without the hand-waving."
pillar: "large-language-models"
slug: "how-llms-work"
difficulty: "beginner"
readTime: 9
author: "Seekvana"
publishedAt: "2026-02-05"
tags: ["LLMs", "transformers", "tokens", "AI basics"]
featured: false
---

Every large language model — GPT-4, Claude, Gemini — is doing one thing: predicting the next token. That's it. The remarkable thing is how much intelligence emerges from doing that one thing at enormous scale.

Understanding how that prediction works explains why LLMs are brilliant at some things, unreliable at others, and why prompting them well is a skill worth developing.

<AdSlot />

## Tokens, Not Words

LLMs don't read text the way humans do. They read **tokens** — chunks of characters that sit somewhere between letters and words. The word "understanding" might be a single token. "Seekvana" might be split into three: "Se", "ek", "vana". Common English words are usually one token; rare words, names, and code get broken into smaller pieces.

Why does this matter? Three reasons:

- **Cost** — API pricing is per token, so understanding token counts helps you estimate costs
- **Context limits** — models have a maximum number of tokens they can process at once (their "context window")
- **Surprising behaviour** — because "9.11" and "9.9" tokenise differently to how you'd expect, arithmetic that looks trivial can trip up a model

A useful rule of thumb: 1 token ≈ 0.75 words in English. A 1,000-word article is roughly 1,300 tokens.

## The Transformer Architecture

Modern LLMs are all built on the **transformer**, introduced by Google in 2017. You don't need to know the maths to use LLMs effectively, but three ideas are worth understanding:

**Attention** — for every token the model reads, attention lets it look across the entire context and decide which other tokens are most relevant to interpreting it. The word "it" in a long paragraph could refer to many things; attention figures out which one.

**Layers** — transformers stack many attention layers on top of each other. Earlier layers capture simple patterns (grammar, named entities); deeper layers capture abstract relationships (tone, argument structure, intent). Most large models have 80–100+ layers.

**Parameters** — each layer has millions of learned weights, adjusted during training to minimise prediction errors. A "70 billion parameter" model has 70 billion of these numbers. More parameters generally means more capacity to store patterns — but also more memory, slower inference, and higher cost.

## Training vs Inference

**Training** is when the model learns. It reads trillions of tokens of text from the internet, books, and code, and updates its parameters billions of times to get better at predicting each next token. Training a frontier model takes months and costs tens of millions of dollars in compute. You never pay for this — it happens once, at the lab.

**Inference** is when you use the model. You send a prompt; the model generates one token at a time, each prediction conditioned on all previous tokens. This is what you're paying for with API usage. It's much cheaper than training, but can still add up at scale.

<Note>
"Fine-tuning" sits between the two: you take a pre-trained model and continue training it on a smaller, task-specific dataset. It adjusts the existing weights rather than learning from scratch — much cheaper than full training, but still not something you do casually.
</Note>

## Why Prediction Produces Intelligence

It seems like predicting the next word should be trivial. But to predict the next token well across all of human text — fiction, code, legal documents, scientific papers, casual conversation — a model has to implicitly learn grammar, facts, reasoning patterns, writing styles, and cause-and-effect relationships.

The model has never been explicitly taught any of these things. It learned them because they are useful for prediction.

This is why LLMs can explain concepts, write code, translate languages, and summarise documents without any of those tasks being directly in their training objective. They are side effects of doing prediction well.

## What This Means for How You Use Them

Three practical takeaways:

1. **They predict plausible next tokens, not true statements.** This is why they hallucinate — sometimes the most plausible continuation is a confident-sounding falsehood. Always verify factual claims against primary sources.
2. **More context usually helps.** Because attention can see the whole context, adding relevant background to your prompt usually improves output quality.
3. **They are not databases.** They don't look things up; they recall patterns from training. For up-to-date or private information, use retrieval-augmented generation (RAG) instead.
```

- [ ] **Step 3: Create `src/content/articles/ai-foundations/what-is-ai.mdx`**

```mdx
---
title: "What is AI? A Clear, Honest Explainer"
description: "No hype, no sci-fi. A grounded explanation of what artificial intelligence actually is, where it came from, and where it stands today."
pillar: "ai-foundations"
slug: "what-is-ai"
difficulty: "beginner"
readTime: 7
author: "Seekvana"
publishedAt: "2026-01-08"
tags: ["AI basics", "AI foundations", "machine learning", "beginners"]
featured: false
---

Artificial intelligence is software that can do things we previously thought required human intelligence — understanding language, recognising images, writing code, making decisions. That is the whole definition. No consciousness, no feelings, no robots. Just software that is unusually good at pattern-matching.

The reason AI feels significant right now is not that the definition changed. It is that what the software can *actually do* changed — sharply, in a short time.

<AdSlot />

## A Brief, Useful History

AI as a research field started in the 1950s. Early systems used hand-crafted rules: "if the sentence contains 'weather', ask about the city." These worked in narrow, predictable domains and broke immediately outside them.

The **machine learning** era shifted the approach: instead of writing rules, you show the software thousands of examples and let it learn the rules itself. This improved things considerably, but still required a lot of manual work — selecting features, cleaning data, tuning models.

**Deep learning**, which took off around 2012, removed most of that manual work. Deep neural networks — layered mathematical structures loosely inspired by the brain — could learn representations directly from raw data. Image recognition, speech transcription, and translation all jumped dramatically in quality.

The current era is defined by **large language models** (LLMs): deep learning applied to text, at massive scale. Models trained on trillions of words can now write, reason, code, and converse in ways that feel genuinely new. GPT-3 arrived in 2020, ChatGPT in late 2022, and the pace has not slowed.

## Narrow AI vs General AI

Every AI system that exists today is **narrow AI** — it is good at one thing, or a family of related things. A language model is good with text. An image classifier is good with images. The best Go-playing AI in the world cannot read an email.

**Artificial general intelligence (AGI)** — a system that can do anything a human can do — does not exist yet. It is an active research direction and a subject of genuine debate: researchers disagree about when or whether it will arrive, and what it would mean if it did.

<Tip>
When you hear claims like "AI will do everything" or "AI is just autocomplete," both are missing something. Current AI is genuinely capable and genuinely limited. The useful question is always: *for this specific task, how reliable is it, and what does it cost to verify?*
</Tip>

## What "Machine Learning" Actually Means

Machine learning is the branch of AI that learns from data rather than explicit rules. Almost all modern AI is machine learning. The basic idea:

1. You collect examples (images + labels, text + responses, inputs + outputs)
2. You train a model by adjusting millions of internal numbers until the model's outputs match the expected outputs across your examples
3. The trained model generalises — it gives reasonable answers on inputs it has never seen

The "learning" is mathematical optimisation, not anything like how a human learns. But the result — a model that improves with more data and generalises across inputs — is practically powerful.

## Why Now?

Three things converged to produce the current moment:

- **Data** — the internet created an unprecedented quantity of human text, images, and code to train on
- **Compute** — GPUs, originally designed for gaming, turned out to be ideal for the matrix multiplications at the core of neural network training
- **Scale** — researchers discovered that making models bigger and training them on more data kept improving performance in predictable ways, which justified enormous investment

The result is that the best AI systems today are qualitatively different from what existed five years ago — not because the ideas are fundamentally new, but because they are running at a scale that was previously impractical.
```

- [ ] **Step 4: Create `src/content/articles/agentic-ai/rag-explained.mdx`**

```mdx
---
title: "RAG Without the Hype: Retrieval That Actually Helps"
description: "What retrieval-augmented generation is, why it exists, and a concrete example showing how to wire it up."
pillar: "agentic-ai"
slug: "rag-explained"
difficulty: "beginner"
readTime: 10
author: "Seekvana"
publishedAt: "2026-01-29"
tags: ["RAG", "retrieval", "embeddings", "agentic AI", "LLMs"]
featured: false
---

Language models have a knowledge problem. They know a lot — but only what was in their training data, only up to their training cutoff, and nothing about your private documents, your company's internal wiki, or last week's news.

Retrieval-augmented generation (RAG) solves this by adding a retrieval step before generation: look up the most relevant documents, inject them into the context, then ask the model to answer using what it just read. The model stops relying on memorised facts and starts reasoning over provided evidence.

<AdSlot />

## Why RAG Exists

Three problems push people toward RAG:

**Knowledge cutoff** — LLMs are trained on data with a fixed end date. Anything that happened after that date is invisible to them. RAG lets you provide fresh information at query time instead of waiting for the next model release.

**Private data** — your company's documentation, customer records, or internal knowledge base was not in the model's training data. RAG is the standard way to make a model useful over data it has never seen.

**Hallucination reduction** — models sometimes confabulate facts they do not know. When you provide the source document, the model can answer from evidence rather than memory, which significantly improves factual reliability. Not perfectly — models can still misread documents — but meaningfully.

## The Two-Step Process

RAG has two phases that happen before the model generates a response:

**1. Indexing (done once, or when documents change)**
- Split your documents into chunks (typically 200–500 words each)
- Convert each chunk to an **embedding** — a vector of numbers that represents its meaning
- Store the chunks and their embeddings in a vector database

**2. Retrieval (done at query time)**
- Convert the user's query into an embedding using the same model
- Find the chunks whose embeddings are closest to the query embedding (semantic similarity search)
- Insert those chunks into the model's context window
- Ask the model to answer the question based on the provided context

```python
import anthropic
from some_vector_db import VectorDB  # e.g. Pinecone, Supabase, Chroma

client = anthropic.Anthropic()
db = VectorDB()

def answer_with_rag(user_question: str) -> str:
    # Step 1: retrieve the most relevant chunks
    relevant_chunks = db.search(user_question, top_k=5)
    context = "\n\n".join(chunk.text for chunk in relevant_chunks)

    # Step 2: generate an answer using the retrieved context
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Answer the question using only the provided context. 
If the context does not contain the answer, say so.

Context:
{context}

Question: {user_question}"""
        }]
    )
    return response.content[0].text
```

<Note>
The instruction "answer using only the provided context" is important. Without it, the model will blend retrieved content with its own training knowledge, making it harder to verify where answers came from.
</Note>

## RAG vs Fine-tuning

Both RAG and fine-tuning can make a model more useful for a specific domain. They solve different problems:

| | RAG | Fine-tuning |
|---|---|---|
| Best for | Factual Q&A over documents | Style, tone, task format |
| Updates when data changes | Instantly | Requires retraining |
| Cost | Low (retrieval + inference) | High (compute for training) |
| Handles new documents | Yes | No |
| Verifiable sources | Yes | No |

The rule of thumb: if you want the model to *know* specific facts or answer from a document corpus, use RAG. If you want the model to *behave* differently — write in a particular style, follow a specific output format, stay in a certain persona — fine-tuning is the better tool.

Many production systems use both: fine-tune for behaviour, RAG for knowledge.

## Common Failure Modes

RAG is not magic. The most common ways it goes wrong:

- **Poor chunking** — chunks that are too short lose context; chunks that are too long dilute relevance signals. Experiment with chunk size per document type.
- **Wrong embedding model** — the model used to embed chunks must be the same one used to embed queries. Mixing models produces nonsense similarity scores.
- **Top-k too low** — retrieving only 1–2 chunks means the model often misses the answer. Start with 5 and tune from there.
- **No source citation** — without asking the model to cite which chunk it used, you cannot verify its answers. Always ask for sources in production.

RAG is the foundation most AI assistants, copilots, and document Q&A products are built on. Once you understand the basic loop, you can tune each part independently to improve quality.
```

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: all 5 articles are found by `generateStaticParams()` and pre-rendered. Build should succeed with 0 errors.

- [ ] **Step 6: Verify articles in browser**

Run: `npm run dev`

Visit these URLs and confirm each renders correctly:
- `http://localhost:3000/library/agentic-ai/tool-use-explained`
- `http://localhost:3000/library/large-language-models/how-llms-work`
- `http://localhost:3000/library/ai-foundations/what-is-ai`
- `http://localhost:3000/library/agentic-ai/rag-explained`

Check: left sidebar shows all agentic-ai articles for the agentic-ai pillar pages. Prev/Next shows adjacent articles. Pillar page at `http://localhost:3000/library/agentic-ai` shows 3 articles.

- [ ] **Step 7: Commit**

```bash
git add src/content/articles/
git commit -m "feat(content): add 4 starter articles — tool use, LLMs, AI basics, RAG"
```

---

## Task 8: Final build verification

- [ ] **Step 1: Run full production build**

Run: `npm run build`
Expected output includes:
```
Route (app)                                         Size
├ ○ /                                               ...
├ ● /library/[pillar]                               ...
│   ├ /library/agentic-ai
│   ├ /library/ai-foundations
│   └ /library/large-language-models
├ ● /library/[pillar]/[slug]                        ...
│   ├ /library/agentic-ai/what-is-an-agent
│   ├ /library/agentic-ai/tool-use-explained
│   ├ /library/agentic-ai/rag-explained
│   ├ /library/large-language-models/how-llms-work
│   └ /library/ai-foundations/what-is-ai
```
The `●` symbol means statically pre-rendered. All article and pillar routes must show `●`.

- [ ] **Step 2: Fix any remaining errors**

If the build fails, paste the error and fix it before proceeding. Common issues:
- Missing `export` on `generateStaticParams` → add `export`
- Type error on `PillarSidebar` props → ensure `articles` prop is passed from page.tsx
- MDX parse error → check frontmatter YAML formatting (no tabs, correct quoting)

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(phase8): complete MDX content pipeline — static generation, real data, 5 articles"
```

---

## Self-Review

**Spec coverage check against SEEKVANA-BUILD-GUIDE.md Phase 8:**

| Spec requirement | Task |
|---|---|
| `getAllArticles()` | Already existed — no change needed |
| `getArticleBySlug()` | Already existed as `getArticleSource()` — no change needed |
| `getArticlesByPillar()` | Already existed — no change needed |
| `getFeaturedArticles()` | Task 1 |
| `getAllPaths()` | Task 1 + 2 |
| 5 starter articles (real content) | Task 7 (4 new + 1 existing = 5) |
| `generateStaticParams()` on article page | Task 3 |
| Pillar index page with article count + cards | Task 6 |
| Breadcrumb on pillar page | Task 6 |

**Placeholder scan:** No TBD, TODO, or "implement later" markers present.

**Type consistency:** `PathDefinition` defined in Task 1 and used only by `getAllPaths()` — no downstream callers yet (homepage still uses static data — out of scope for Phase 8). `ArticleMeta` from existing `mdx.ts` is used consistently in Tasks 3–6.

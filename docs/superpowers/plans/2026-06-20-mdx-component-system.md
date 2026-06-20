# MDX Component System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all missing MDX components and infrastructure so seomachine-generated articles render correctly in the Seekvana article page.

**Architecture:** Each MDX component lives in `src/components/mdx/` and is registered in `getMDXComponents()` in `src/components/mdx/mdx-components.tsx`. Client-side components (Mermaid, Quiz, Chart, CodePlayground) use the `'use client'` directive and are dynamically imported to avoid SSR issues. The data layer (`src/lib/mdx.ts`) and article page (`src/app/library/[pillar]/[slug]/page.tsx`) receive targeted additions only.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, next-mdx-remote/rsc, next-themes (dark mode), lucide-react (icons). Additional packages installed per tier: `mermaid`, `recharts`, `katex`, `@codesandbox/sandpack-react`.

**Codebase context to read before starting:**
- `src/components/mdx/mdx-components.tsx` — where all components are registered
- `src/components/mdx/callout.tsx` — existing pattern for MDX components
- `src/lib/mdx.ts` — `ArticleFrontmatter` type and data functions
- `src/app/library/[pillar]/[slug]/page.tsx` — article page, metadata generation

---

## File Map

**Create:**
- `src/components/mdx/article-image.tsx`
- `src/components/mdx/kbd.tsx`
- `src/components/mdx/steps.tsx`
- `src/components/mdx/mermaid.tsx`
- `src/components/mdx/file-tree.tsx`
- `src/components/mdx/youtube-embed.tsx`
- `src/components/mdx/comparison-table.tsx`
- `src/components/mdx/quiz.tsx`
- `src/components/mdx/chart.tsx`
- `src/components/mdx/math.tsx`
- `src/components/mdx/code-playground.tsx`
- `src/components/mdx/download-button.tsx`
- `src/content/paths/launchpad.json`
- `src/app/library/[pillar]/page.tsx`
- `src/content/articles/test-components/all-components.mdx` ← test article, delete after

**Modify:**
- `src/components/mdx/mdx-components.tsx` — register all new components
- `src/lib/mdx.ts` — add `lessonModule`, `lessonNumber`, `coverImage` to `ArticleFrontmatter`
- `src/app/library/[pillar]/[slug]/page.tsx` — OG image from `frontmatter.coverImage`

---

## TIER 1 — Build before first article publish

---

### Task 1: `<ArticleImage>` component

**Files:**
- Create: `src/components/mdx/article-image.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/article-image.tsx
import Image from 'next/image'

interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
  priority?: boolean
  isCover?: boolean
}

export function ArticleImage({ src, alt, caption, priority, isCover }: ArticleImageProps) {
  return (
    <figure className={isCover ? 'my-0 mb-10' : 'my-8'}>
      <Image
        src={src}
        alt={alt}
        width={isCover ? 1200 : 800}
        height={isCover ? 630 : 450}
        className="rounded-xl w-full h-auto"
        priority={priority}
      />
      {caption && (
        <figcaption className="text-sm text-secondary text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd d:/seekvana && npx tsc --noEmit
```

Expected: no errors related to `article-image.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/mdx/article-image.tsx
git commit -m "feat(mdx): add ArticleImage component"
```

---

### Task 2: `<Kbd>` component

**Files:**
- Create: `src/components/mdx/kbd.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/kbd.tsx
interface KbdProps {
  children: React.ReactNode
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-surface-subtle font-mono text-xs text-primary shadow-sm">
      {children}
    </kbd>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/mdx/kbd.tsx
git commit -m "feat(mdx): add Kbd keyboard shortcut component"
```

---

### Task 3: `<Steps>` and `<Step>` components

**Files:**
- Create: `src/components/mdx/steps.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/steps.tsx
interface StepsProps {
  children: React.ReactNode
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
}

export function Steps({ children }: StepsProps) {
  return <div className="my-8 space-y-0">{children}</div>
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-5 pb-8 last:pb-0">
      <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {number}
      </div>
      <div className="flex-1 border-b border-border pb-8 last:border-0 last:pb-0">
        <p className="font-fraunces text-lg font-medium text-primary mb-2">{title}</p>
        <div className="text-primary">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/mdx/steps.tsx
git commit -m "feat(mdx): add Steps and Step components for tutorials"
```

---

### Task 4: `<Mermaid>` component

**Files:**
- Create: `src/components/mdx/mermaid.tsx`

- [ ] **Step 1: Install mermaid**

```bash
cd d:/seekvana && npm install mermaid
```

Expected: mermaid appears in `package.json` dependencies.

- [ ] **Step 2: Create the component**

```tsx
// src/components/mdx/mermaid.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  children: string
}

export function Mermaid({ children }: MermaidProps) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string | null>(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    let active = true
    setSvg(null)
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
        themeVariables: {
          primaryColor: '#C9633F',
          primaryTextColor: resolvedTheme === 'dark' ? '#EFEBE1' : '#1C1B19',
          background: resolvedTheme === 'dark' ? '#181712' : '#FAF8F3',
          mainBkg: resolvedTheme === 'dark' ? '#2A2823' : '#F4F1EA',
          nodeBorder: '#E6E1D7',
          lineColor: '#6F6B62',
        },
      })
      mermaid.render(idRef.current, children.trim()).then(({ svg: out }) => {
        if (active) setSvg(out)
      }).catch(() => {
        if (active) setSvg('<p style="color:red">Diagram error — check Mermaid syntax</p>')
      })
    })
    return () => { active = false }
  }, [children, resolvedTheme])

  if (!svg) {
    return (
      <div className="my-8 bg-surface-subtle rounded-xl border border-border p-8 text-center text-secondary text-sm animate-pulse">
        Loading diagram…
      </div>
    )
  }

  return (
    <div
      className="my-8 overflow-x-auto bg-surface-subtle rounded-xl border border-border p-6 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/mermaid.tsx package.json package-lock.json
git commit -m "feat(mdx): add Mermaid diagram component with dark mode support"
```

---

### Task 5: Wire shadcn `<Tabs>` into MDX

The shadcn Tabs package is already installed. This task re-exports it under the names MDX articles use.

**Files:**
- Create: `src/components/mdx/tabs.tsx`

- [ ] **Step 1: Create the re-export wrapper**

```tsx
// src/components/mdx/tabs.tsx
'use client'
export { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
```

- [ ] **Step 2: Verify shadcn tabs component exists**

```bash
ls d:/seekvana/src/components/ui/tabs.tsx
```

Expected: file exists. If missing, run `npx shadcn@latest add tabs` first.

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/tabs.tsx
git commit -m "feat(mdx): expose shadcn Tabs components for MDX articles"
```

---

### Task 6: Register all Tier 1 components in `getMDXComponents()`

**Files:**
- Modify: `src/components/mdx/mdx-components.tsx`

- [ ] **Step 1: Read the current file**

Read `src/components/mdx/mdx-components.tsx` in full before editing.

- [ ] **Step 2: Add imports and registrations**

Replace the imports block at the top with:

```tsx
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import { Tip, Note, Warning } from './callout'
import { CodeBlock } from './code-block'
import { AdSlot } from '@/components/article/ad-slot'
import { ArticleImage } from './article-image'
import { Kbd } from './kbd'
import { Steps, Step } from './steps'
import { Mermaid } from './mermaid'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
```

Add to the return object inside `getMDXComponents()`, after the existing `AdSlot` line:

```tsx
    ArticleImage,
    Kbd,
    Steps,
    Step,
    Mermaid,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
```

- [ ] **Step 3: Run build to verify**

```bash
npm run build
```

Expected: build completes with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): register Tier 1 MDX components"
```

---

### Task 7: Add `lessonModule`, `lessonNumber`, `coverImage` to `ArticleFrontmatter`

**Files:**
- Modify: `src/lib/mdx.ts`

- [ ] **Step 1: Read the current ArticleFrontmatter interface**

Read `src/lib/mdx.ts` lines 1–20.

- [ ] **Step 2: Add the optional fields**

Replace the `ArticleFrontmatter` interface with:

```typescript
export interface ArticleFrontmatter {
  title: string
  description: string
  pillar: string
  slug: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: number
  author: string
  publishedAt: string
  tags: string[]
  featured: boolean
  coverImage?: string
  lessonModule?: string
  lessonNumber?: string
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat(mdx): add lessonModule, lessonNumber, coverImage to ArticleFrontmatter"
```

---

### Task 8: OG image from `frontmatter.coverImage`

**Files:**
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

- [ ] **Step 1: Read the generateMetadata function**

Read `src/app/library/[pillar]/[slug]/page.tsx` lines 43–72.

- [ ] **Step 2: Update the images array in generateMetadata**

Find this line in `generateMetadata`:

```typescript
images: [{ url: '/og-image.png', width: 1200, height: 630, alt: frontmatter.title }],
```

Replace with:

```typescript
images: [{
  url: frontmatter.coverImage
    ? `https://seekvana.com${frontmatter.coverImage}`
    : 'https://seekvana.com/og-image.png',
  width: 1200,
  height: 630,
  alt: frontmatter.title,
}],
```

Do the same for the `twitter` metadata images array:

```typescript
images: [frontmatter.coverImage
  ? `https://seekvana.com${frontmatter.coverImage}`
  : 'https://seekvana.com/og-image.png'],
```

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: build completes with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/library/[pillar]/[slug]/page.tsx
git commit -m "feat(article): use coverImage from frontmatter for OG/Twitter meta"
```

---

### Task 9: `launchpad.json` path definition

**Files:**
- Create: `src/content/paths/launchpad.json`

- [ ] **Step 1: Create the file**

```json
{
  "slug": "launchpad",
  "title": "Seekvana Launchpad",
  "description": "From zero to AI-ready — terminal, Python, Git, APIs, and deployment from scratch. No experience needed.",
  "difficulty": "beginner",
  "lessonCount": 93,
  "href": "/paths/launchpad",
  "colorClass": "bg-purple-500"
}
```

- [ ] **Step 2: Verify it loads**

```bash
npm run build
```

Expected: no errors. The `getAllPaths()` function in `src/lib/mdx.ts` reads all `.json` files in `src/content/paths/` — this file is picked up automatically.

- [ ] **Step 3: Commit**

```bash
git add src/content/paths/launchpad.json
git commit -m "feat(content): add Launchpad path definition"
```

---

### Task 10: Test article for Tier 1 components

Create a test MDX file to visually verify all Tier 1 components render correctly.

**Files:**
- Create: `src/content/articles/ai-foundations/test-components.mdx`

- [ ] **Step 1: Create the test article**

```mdx
---
title: "Component Test Page"
description: "Visual test for all Tier 1 MDX components."
pillar: "ai-foundations"
slug: "test-components"
difficulty: "beginner"
readTime: 1
author: "Seekvana"
publishedAt: "2026-06-20"
tags: ["test"]
featured: false
---

This page tests all Tier 1 MDX components. Delete before launch.

## Callouts

<Tip>This is a Tip callout.</Tip>

<Note>This is a Note callout.</Note>

<Warning>This is a Warning callout.</Warning>

## Keyboard Shortcuts

Press <Kbd>Ctrl</Kbd>+<Kbd>C</Kbd> to copy. Open the terminal with <Kbd>Ctrl</Kbd>+<Kbd>`</Kbd>.

## Steps

<Steps>
  <Step number={1} title="Install Python">
    Run the following command in your terminal:
    ```bash
    python --version
    ```
  </Step>
  <Step number={2} title="Create a virtual environment">
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
  </Step>
  <Step number={3} title="Install dependencies">
    ```bash
    pip install anthropic
    ```
  </Step>
</Steps>

## Mermaid Diagram

<Mermaid>
{`graph LR
  A[Perceive] --> B[Plan]
  B --> C[Act]
  C --> D[Observe]
  D --> A`}
</Mermaid>

## Tabs

<Tabs defaultValue="python">
  <TabsList>
    <TabsTrigger value="python">Python</TabsTrigger>
    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
  </TabsList>
  <TabsContent value="python">
    ```python
    print("Hello from Python")
    ```
  </TabsContent>
  <TabsContent value="javascript">
    ```javascript
    console.log("Hello from JavaScript")
    ```
  </TabsContent>
</Tabs>
```

- [ ] **Step 2: Start dev server and visit the page**

```bash
npm run dev
```

Visit: `http://localhost:3000/library/ai-foundations/test-components`

Verify:
- [ ] Callouts render with correct colors (clay, teal, amber)
- [ ] `<Kbd>` renders as a small pill badge
- [ ] `<Steps>` renders numbered steps with Fraunces titles
- [ ] `<Mermaid>` renders the flowchart (may take 1–2 seconds to load)
- [ ] `<Tabs>` switches between Python and JavaScript tabs
- [ ] Dark mode toggle switches Mermaid theme

- [ ] **Step 3: Delete the test article and commit**

```bash
rm src/content/articles/ai-foundations/test-components.mdx
git add -A
git commit -m "test(mdx): verify Tier 1 components render — test article deleted"
```

---

## TIER 2 — Build before Module 01–04 articles

---

### Task 11: `<FileTree>` component

**Files:**
- Create: `src/components/mdx/file-tree.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/file-tree.tsx
interface FileTreeProps {
  children: string
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <div className="my-8 bg-surface-subtle border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-surface">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-secondary font-mono">File tree</span>
      </div>
      <pre className="p-4 font-mono text-sm text-primary overflow-x-auto leading-relaxed m-0">
        <code>{children.trim()}</code>
      </pre>
    </div>
  )
}
```

- [ ] **Step 2: Register in getMDXComponents()**

In `src/components/mdx/mdx-components.tsx`, add:

```tsx
import { FileTree } from './file-tree'
```

And in the return object:

```tsx
FileTree,
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/file-tree.tsx src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): add FileTree component"
```

---

### Task 12: `<YouTubeEmbed>` component

**Files:**
- Create: `src/components/mdx/youtube-embed.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/youtube-embed.tsx
interface YouTubeEmbedProps {
  id: string
  title: string
  caption?: string
}

export function YouTubeEmbed({ id, title, caption }: YouTubeEmbedProps) {
  return (
    <figure className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-surface-subtle">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-secondary text-center mt-2">{caption}</figcaption>
      )}
    </figure>
  )
}
```

- [ ] **Step 2: Register in getMDXComponents()**

In `src/components/mdx/mdx-components.tsx`, add:

```tsx
import { YouTubeEmbed } from './youtube-embed'
```

And in the return object:

```tsx
YouTubeEmbed,
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/youtube-embed.tsx src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): add YouTubeEmbed component with lazy loading"
```

---

### Task 13: `<ComparisonTable>` component

**Files:**
- Create: `src/components/mdx/comparison-table.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/comparison-table.tsx
interface ComparisonTableProps {
  columns: string[]
  rows: string[][]
  highlight?: string
}

export function ComparisonTable({ columns, rows, highlight }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`border border-border px-4 py-3 text-left font-semibold ${
                  highlight && col === highlight
                    ? 'bg-accent-soft text-accent'
                    : 'bg-surface-subtle text-primary'
                }`}
              >
                {col}
                {highlight && col === highlight && (
                  <span className="ml-2 text-xs font-normal bg-accent text-white px-1.5 py-0.5 rounded-full align-middle">
                    Recommended
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="even:bg-surface-subtle">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-border px-4 py-3 text-primary ${
                    highlight && columns[ci] === highlight ? 'bg-accent-soft/40' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Register in getMDXComponents()**

```tsx
import { ComparisonTable } from './comparison-table'
// in return object:
ComparisonTable,
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/comparison-table.tsx src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): add ComparisonTable component with optional highlight column"
```

---

### Task 14: Pillar index page `/library/[pillar]`

**Files:**
- Create: `src/app/library/[pillar]/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// src/app/library/[pillar]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticlesByPillar } from '@/lib/mdx'

interface PageProps {
  params: Promise<{ pillar: string }>
}

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
  'agentic-ai': 'Agents, tool use, memory, planning, and multi-agent systems — the flagship pillar.',
  'ai-foundations': 'What AI is, how it works, and why it matters. Start here if you\'re new.',
  'large-language-models': 'Tokens, context windows, RAG, fine-tuning, and how LLMs actually think.',
  'building-with-ai': 'APIs, SDKs, evals, deployment, and cost management for builders.',
  'ai-tools': 'Reviews and comparisons of the best AI tools and platforms.',
  'use-cases': 'Real workflows: writing, coding, research, and automation with AI.',
  'concepts-theory': 'Transformers, embeddings, reinforcement learning — the mechanics under the hood.',
  'ethics-safety': 'Responsible AI, alignment, risks, and governance.',
  careers: 'How to learn AI, career paths, roles, and building your portfolio.',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function generateStaticParams() {
  return Object.keys(PILLAR_NAMES).map((pillar) => ({ pillar }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar } = await params
  const name = PILLAR_NAMES[pillar]
  if (!name) return { title: 'Seekvana' }
  return {
    title: `${name} — Seekvana`,
    description: PILLAR_DESCRIPTIONS[pillar],
    alternates: { canonical: `https://seekvana.com/library/${pillar}` },
    openGraph: {
      title: `${name} — Seekvana`,
      description: PILLAR_DESCRIPTIONS[pillar],
      url: `https://seekvana.com/library/${pillar}`,
    },
  }
}

export default async function PillarPage({ params }: PageProps) {
  const { pillar } = await params
  const pillarName = PILLAR_NAMES[pillar]
  if (!pillarName) notFound()

  const articles = getArticlesByPillar(pillar)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/library" className="hover:text-accent transition-colors">
          Library
        </Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">{pillarName}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-fraunces text-4xl text-primary mb-3">{pillarName}</h1>
        <p className="text-lg text-secondary max-w-2xl">{PILLAR_DESCRIPTIONS[pillar]}</p>
        <p className="text-sm text-secondary mt-3">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      <div className="space-y-3">
        {articles.map(({ frontmatter, slug }) => (
          <Link
            key={slug}
            href={`/library/${pillar}/${slug}`}
            className="flex items-start justify-between gap-4 bg-surface border border-border rounded-xl p-5 hover:border-accent/40 hover:shadow-sm transition-all group"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors mb-1">
                {frontmatter.title}
              </h2>
              <p className="text-sm text-secondary line-clamp-2">{frontmatter.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                  DIFFICULTY_COLORS[frontmatter.difficulty] ?? DIFFICULTY_COLORS.beginner
                }`}
              >
                {frontmatter.difficulty}
              </span>
              <span className="text-xs text-secondary">{frontmatter.readTime} min</span>
            </div>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-secondary text-center py-16">No articles yet — check back soon.</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: 0 errors. The route `/library/agentic-ai` now renders.

- [ ] **Step 3: Start dev and verify**

```bash
npm run dev
```

Visit `http://localhost:3000/library/agentic-ai` — should show the article list.
Visit `http://localhost:3000/library/ai-foundations` — should show articles.
Visit `http://localhost:3000/library/careers` — should show empty state.

- [ ] **Step 4: Commit**

```bash
git add src/app/library/[pillar]/page.tsx
git commit -m "feat(pages): add pillar index page /library/[pillar]"
```

---

## TIER 3 — Build before specific pillar articles

---

### Task 15: `<Quiz>` component

**Files:**
- Create: `src/components/mdx/quiz.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/quiz.tsx
'use client'
import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface QuizProps {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export function Quiz({ question, options, correct, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="my-8 bg-surface border border-border rounded-xl p-6">
      <p className="font-fraunces text-lg text-primary mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((option, i) => {
          let cls =
            'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center gap-2 '
          if (!answered) {
            cls +=
              'border-border bg-surface-subtle hover:border-accent hover:bg-accent-soft cursor-pointer text-primary'
          } else if (i === correct) {
            cls +=
              'border-green-500 bg-green-50 dark:bg-green-950/30 text-primary cursor-default'
          } else if (i === selected) {
            cls +=
              'border-red-400 bg-red-50 dark:bg-red-950/30 text-primary cursor-default'
          } else {
            cls += 'border-border bg-surface-subtle text-secondary cursor-default'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
            >
              {answered && i === correct && (
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              )}
              {answered && i === selected && i !== correct && (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              {option}
            </button>
          )
        })}
      </div>
      {answered && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${
            selected === correct
              ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
              : 'bg-accent-soft text-primary'
          }`}
        >
          <strong>{selected === correct ? 'Correct! ' : 'Not quite — '}</strong>
          {explanation}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Register in getMDXComponents()**

```tsx
import { Quiz } from './quiz'
// in return object:
Quiz,
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/quiz.tsx src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): add Quiz component for learning path articles"
```

---

### Task 16: `<Chart>` component

**Files:**
- Create: `src/components/mdx/chart.tsx`

- [ ] **Step 1: Install recharts**

```bash
npm install recharts
```

Expected: recharts in `package.json`.

- [ ] **Step 2: Create the component**

```tsx
// src/components/mdx/chart.tsx
'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartDataPoint {
  label: string
  value: number
}

interface ChartProps {
  type: 'bar'
  title: string
  data: ChartDataPoint[]
  unit?: string
  caption?: string
}

export function Chart({ title, data, unit, caption }: ChartProps) {
  const formatted = data.map((d) => ({ ...d, name: d.label }))

  return (
    <figure className="my-8 bg-surface-subtle border border-border rounded-xl p-6">
      <p className="font-fraunces text-base font-medium text-primary mb-5">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ left: 8, right: 40, top: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            tickFormatter={(v) => `${v}${unit ?? ''}`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            width={140}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: number) => [`${v}${unit ?? ''}`, '']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill="#C9633F"
                fillOpacity={Math.max(0.5, 1 - i * 0.08)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {caption && (
        <figcaption className="text-xs text-secondary mt-4">{caption}</figcaption>
      )}
    </figure>
  )
}
```

- [ ] **Step 3: Register in getMDXComponents()**

```tsx
import { Chart } from './chart'
// in return object:
Chart,
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/mdx/chart.tsx src/components/mdx/mdx-components.tsx package.json package-lock.json
git commit -m "feat(mdx): add Chart component using Recharts"
```

---

### Task 17: `<Math>` and `<MathBlock>` components

**Files:**
- Create: `src/components/mdx/math.tsx`

- [ ] **Step 1: Install KaTeX**

```bash
npm install katex @types/katex
```

Expected: both packages in `package.json`.

- [ ] **Step 2: Add KaTeX CSS to global layout**

Read `src/app/layout.tsx`. Add this import at the top of the file (after existing imports):

```tsx
import 'katex/dist/katex.min.css'
```

- [ ] **Step 3: Create the component**

```tsx
// src/components/mdx/math.tsx
import katex from 'katex'

interface MathProps {
  children: string
}

export function Math({ children }: MathProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: false,
  })
  return (
    <span
      className="katex-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function MathBlock({ children }: MathProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: true,
  })
  return (
    <div
      className="my-6 overflow-x-auto text-center py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **Step 4: Register in getMDXComponents()**

```tsx
import { Math, MathBlock } from './math'
// in return object:
Math,
MathBlock,
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/mdx/math.tsx src/app/layout.tsx src/components/mdx/mdx-components.tsx package.json package-lock.json
git commit -m "feat(mdx): add Math and MathBlock components using KaTeX"
```

---

### Task 18: `<CodePlayground>` component

Note: Sandpack (from CodeSandbox) supports JavaScript/TypeScript natively. Python is not supported in Sandpack — Python articles use standard code blocks with a copy button instead. This component is for JS/TS only.

**Files:**
- Create: `src/components/mdx/code-playground.tsx`

- [ ] **Step 1: Install Sandpack**

```bash
npm install @codesandbox/sandpack-react
```

Expected: package in `package.json`.

- [ ] **Step 2: Create the component**

```tsx
// src/components/mdx/code-playground.tsx
'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Sandpack = dynamic(
  () => import('@codesandbox/sandpack-react').then((m) => m.Sandpack),
  { ssr: false, loading: () => (
    <div className="my-8 bg-surface-subtle border border-border rounded-xl p-8 text-center text-secondary text-sm">
      Loading playground…
    </div>
  )}
)

interface CodePlaygroundProps {
  files: Record<string, string>
  title?: string
}

export function CodePlayground({ files, title }: CodePlaygroundProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className="my-8">
      {title && (
        <p className="text-sm font-medium text-secondary mb-2">{title}</p>
      )}
      <Sandpack
        files={files}
        template="vanilla"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        options={{
          showLineNumbers: true,
          showConsole: true,
          editorHeight: 320,
        }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Register in getMDXComponents()**

```tsx
import { CodePlayground } from './code-playground'
// in return object:
CodePlayground,
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: 0 errors. Sandpack is dynamically imported so no SSR issues.

- [ ] **Step 5: Commit**

```bash
git add src/components/mdx/code-playground.tsx src/components/mdx/mdx-components.tsx package.json package-lock.json
git commit -m "feat(mdx): add CodePlayground component using Sandpack (JS/TS only)"
```

---

### Task 19: `<DownloadButton>` component

**Files:**
- Create: `src/components/mdx/download-button.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/mdx/download-button.tsx
import { Download } from 'lucide-react'

interface DownloadButtonProps {
  href: string
  label: string
  size?: string
}

export function DownloadButton({ href, label, size }: DownloadButtonProps) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-deep transition-colors my-4"
    >
      <Download className="w-4 h-4 shrink-0" />
      {label}
      {size && <span className="opacity-70 text-xs font-normal">({size})</span>}
    </a>
  )
}
```

- [ ] **Step 2: Register in getMDXComponents()**

```tsx
import { DownloadButton } from './download-button'
// in return object:
DownloadButton,
```

- [ ] **Step 3: Verify final build**

```bash
npm run build
```

Expected: 0 errors. This is the final build check — all 19 tasks complete.

- [ ] **Step 4: Final commit**

```bash
git add src/components/mdx/download-button.tsx src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): add DownloadButton component — completes MDX component system"
```

---

## Self-Review Checklist

- [x] **ArticleImage** — Task 1 ✓
- [x] **Kbd** — Task 2 ✓
- [x] **Steps / Step** — Task 3 ✓
- [x] **Mermaid** — Task 4 ✓
- [x] **Tabs** — Task 5 ✓
- [x] **getMDXComponents registration** — Task 6 ✓ (Tier 1), updated in each Tier 2/3 task
- [x] **lessonModule / lessonNumber / coverImage** — Task 7 ✓
- [x] **OG image from frontmatter** — Task 8 ✓
- [x] **launchpad.json** — Task 9 ✓
- [x] **Tier 1 visual test** — Task 10 ✓
- [x] **FileTree** — Task 11 ✓
- [x] **YouTubeEmbed** — Task 12 ✓
- [x] **ComparisonTable** — Task 13 ✓
- [x] **Pillar index page** — Task 14 ✓
- [x] **Quiz** — Task 15 ✓
- [x] **Chart** — Task 16 ✓
- [x] **Math / MathBlock** — Task 17 ✓
- [x] **CodePlayground** — Task 18 ✓
- [x] **DownloadButton** — Task 19 ✓

**Package installs required in order:** `mermaid` (Task 4), `recharts` (Task 16), `katex @types/katex` (Task 17), `@codesandbox/sandpack-react` (Task 18).

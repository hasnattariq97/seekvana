# Phase 5 — Article Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build the 3-column article page with styled MDX rendering, interactive TOC, reading progress bar, ad slots, and a real sample article.

**Architecture:** A Next.js 15 App Router dynamic route (`src/app/library/[pillar]/[slug]/page.tsx`) is a Server Component — it reads the `.mdx` file with `gray-matter`, extracts headings via regex, then renders a 3-column layout. `next-mdx-remote/rsc` compiles and renders the MDX server-side with a custom component map. Interactive concerns (scroll progress, TOC active state, copy-to-clipboard, feedback vote, mobile sheet) live in `'use client'` components that receive data as props.

**Tech Stack:** `next-mdx-remote` v5 (RSC MDX renderer), `gray-matter` (frontmatter), `reading-time` (install for Phase 8 use), Framer Motion (scroll progress), shadcn Sheet (mobile sidebar), Lucide React, Tailwind CSS.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/content/articles/agentic-ai/what-is-an-agent.mdx` | Sample article content |
| Create | `src/lib/mdx.ts` | Read MDX from disk, parse frontmatter, extract headings |
| Create | `src/components/mdx/callout.tsx` | Tip / Note / Warning callout boxes |
| Create | `src/components/mdx/code-block.tsx` | `pre` override with copy-to-clipboard (client) |
| Create | `src/components/mdx/mdx-components.tsx` | Full MDX component map passed to MDXRemote |
| Create | `src/components/article/ad-slot.tsx` | Dashed ad placeholder (300×250 or 728×90) |
| Create | `src/components/article/reading-progress.tsx` | Fixed top bar, Framer Motion useScroll (client) |
| Create | `src/components/article/pillar-sidebar.tsx` | Left sticky sidebar + mobile Sheet (client) |
| Create | `src/components/article/table-of-contents.tsx` | Right TOC, Intersection Observer active state (client) |
| Create | `src/components/article/article-feedback.tsx` | "Was this helpful?" thumbs (client) |
| Create | `src/components/article/article-nav.tsx` | Prev/Next cards + Related articles |
| Create | `src/app/library/[pillar]/[slug]/page.tsx` | Main article page (server, 3-column layout) |

---

## Task 1: Install Dependencies

**Files:** none (package.json updated automatically)

- [x] **Step 1: Install packages**

```bash
cd d:/seekvana
npm install next-mdx-remote gray-matter reading-time
npm install --save-dev @types/reading-time
```

- [x] **Step 2: Verify install succeeded**

```bash
node -e "require('gray-matter'); require('reading-time'); console.log('OK')"
```

Expected: `OK`

- [x] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install next-mdx-remote, gray-matter, reading-time"
```

---

## Task 2: Create Sample MDX Article

**Files:**
- Create: `src/content/articles/agentic-ai/what-is-an-agent.mdx`

- [x] **Step 1: Create the content directory and MDX file**

Create `src/content/articles/agentic-ai/what-is-an-agent.mdx` with this exact content:

```mdx
---
title: "What is an AI Agent?"
description: "A clear explanation of what makes an AI agent agentic, with real examples and a minimal code walkthrough."
pillar: "agentic-ai"
slug: "what-is-an-agent"
difficulty: "beginner"
readTime: 8
author: "Seekvana"
publishedAt: "2026-01-15"
tags: ["agents", "agentic AI", "AI basics"]
featured: false
---

An AI agent is a system that uses a language model as its reasoning engine to **perceive inputs, make decisions, and take actions** — all without a human directing each step. The key word is *action*: an agent doesn't just reply, it does things.

Most people encounter AI as a chatbot — you ask, it answers, conversation ends. An agent is different. It reads your request, figures out a plan, calls tools (search the web, run code, read a file), checks the results, and keeps going until the job is done.

Understanding agents starts with understanding the three ingredients every agent shares.

<AdSlot />

## What Makes Something an Agent?

Every agent, no matter how complex, is built from the same three parts:

- **Perception** — reading the user's request, tool outputs, conversation history, or memory retrieved from a database
- **Reasoning** — passing that context to an LLM and getting back a decision: reply, call a tool, or stop
- **Action** — executing the decision: calling a function, writing a file, querying an API, or delegating to another agent

A standard chatbot only does the first two. The agent loop adds the third, and then feeds the result back into the top so the cycle can repeat.

<Tip>
Not all agents are equally autonomous. A "level 1" agent might call a single tool and stop. A "level 5" agent plans, delegates to specialist sub-agents, and runs unsupervised for hours. Start simple — a one-tool loop is already a real agent.
</Tip>

## Chatbot vs Agent — A Clear Comparison

The difference is easier to see in a table:

| Feature | Chatbot | Agent |
|---|---|---|
| Takes multi-step action | ✗ | ✓ |
| Calls external tools | ✗ | ✓ |
| Has persistent memory | ✗ | Optional |
| Loops until task is done | ✗ | ✓ |
| Requires human at each step | ✓ | ✗ |
| Can spawn sub-agents | ✗ | ✓ |

The key row is **loops until task is done**. A chatbot generates one response and waits. An agent generates a response, acts on it, gets a result, generates another response — and only stops when it decides the task is complete.

## A Minimal Agent in Python

The simplest agent is just a loop. Call the model, check if it wants to use a tool, call the tool, feed the result back, repeat. Here is a complete working example using the Anthropic SDK:

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "search_web",
        "description": "Search the web for up-to-date information on any topic.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
    }
]

messages = [{"role": "user", "content": "What are the most capable AI agents available today?"}]

while True:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )

    if response.stop_reason == "end_turn":
        # The model decided it's done — no more tool calls needed
        print(response.content[0].text)
        break

    # The model wants to call a tool
    tool_use = next(b for b in response.content if b.type == "tool_use")
    tool_result = search_web(tool_use.input["query"])  # your implementation

    # Feed the tool result back into the conversation
    messages.append({"role": "assistant", "content": response.content})
    messages.append({"role": "user", "content": [
        {
            "type": "tool_result",
            "tool_use_id": tool_use.id,
            "content": tool_result
        }
    ]})
```

The `while True` loop is the agent. The model controls when it exits — by returning `"end_turn"` instead of a tool call. This is the pattern every modern agent framework builds on.

## What Comes Next

Knowing what an agent is gets you through the door. The next questions are more interesting: how does an agent remember things between runs? How does it break a huge task into steps? How do multiple agents coordinate?

Explore those questions in the [Agentic AI pillar](/library/agentic-ai) — each topic builds directly on this foundation.
```

- [x] **Step 2: Verify the file exists and has frontmatter**

```bash
node -e "const m = require('gray-matter'); const fs = require('fs'); const f = m(fs.readFileSync('src/content/articles/agentic-ai/what-is-an-agent.mdx','utf-8')); console.log(f.data.title, '-', f.data.difficulty)"
```

Expected: `What is an AI Agent? - beginner`

- [x] **Step 3: Commit**

```bash
git add src/content/
git commit -m "feat: add sample article — What is an AI Agent?"
```

---

## Task 3: MDX File Reading Utility

**Files:**
- Create: `src/lib/mdx.ts`

- [x] **Step 1: Create the utility**

Create `src/lib/mdx.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
}

export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractHeadings(content: string): ArticleHeading[] {
  const regex = /^(#{2,3})\s+(.+)$/gm
  const headings: ArticleHeading[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].trim()
    headings.push({ id: slugify(text), text, level })
  }
  return headings
}

export function getArticleSource(pillar: string, slug: string): {
  source: string
  frontmatter: ArticleFrontmatter
  headings: ArticleHeading[]
} {
  const filePath = path.join(
    process.cwd(),
    'src',
    'content',
    'articles',
    pillar,
    `${slug}.mdx`
  )
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    source: content,
    frontmatter: data as ArticleFrontmatter,
    headings: extractHeadings(content),
  }
}
```

- [x] **Step 2: Verify it parses the sample article**

```bash
node -e "
const path = require('path');
// Quick smoke test with gray-matter directly
const matter = require('gray-matter');
const fs = require('fs');
const raw = fs.readFileSync('src/content/articles/agentic-ai/what-is-an-agent.mdx','utf-8');
const { data } = matter(raw);
console.log('title:', data.title);
console.log('pillar:', data.pillar);
console.log('OK');
"
```

Expected: prints title and pillar, then `OK`.

- [x] **Step 3: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat: add MDX file reading utility with heading extraction"
```

---

## Task 4: Callout Component

**Files:**
- Create: `src/components/mdx/callout.tsx`

- [x] **Step 1: Create the component**

Create `src/components/mdx/callout.tsx`:

```typescript
import { Lightbulb, Info, AlertTriangle } from 'lucide-react'

type CalloutVariant = 'tip' | 'note' | 'warning'

interface CalloutProps {
  variant: CalloutVariant
  children: React.ReactNode
}

const CONFIG = {
  tip: {
    Icon: Lightbulb,
    wrapper: 'bg-accent-soft border-accent',
    icon: 'text-accent',
  },
  note: {
    Icon: Info,
    wrapper: 'bg-info/10 border-info',
    icon: 'text-info',
  },
  warning: {
    Icon: AlertTriangle,
    wrapper: 'bg-amber-50 dark:bg-amber-950/30 border-amber-500',
    icon: 'text-amber-600 dark:text-amber-400',
  },
}

function Callout({ variant, children }: CalloutProps) {
  const { Icon, wrapper, icon } = CONFIG[variant]
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-6 flex gap-3 ${wrapper}`}>
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${icon}`} aria-hidden="true" />
      <div className="text-sm text-primary leading-relaxed">{children}</div>
    </div>
  )
}

export function Tip({ children }: { children: React.ReactNode }) {
  return <Callout variant="tip">{children}</Callout>
}

export function Note({ children }: { children: React.ReactNode }) {
  return <Callout variant="note">{children}</Callout>
}

export function Warning({ children }: { children: React.ReactNode }) {
  return <Callout variant="warning">{children}</Callout>
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/mdx/callout.tsx
git commit -m "feat: add Tip/Note/Warning callout MDX components"
```

---

## Task 5: CodeBlock Component (Client)

**Files:**
- Create: `src/components/mdx/code-block.tsx`

- [x] **Step 1: Create the component**

Create `src/components/mdx/code-block.tsx`:

```typescript
'use client'

import { useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  children: React.ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      <pre
        ref={preRef}
        className="bg-surface-subtle border border-border rounded-xl p-4 overflow-x-auto font-mono text-sm leading-relaxed"
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-surface border border-border text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/mdx/code-block.tsx
git commit -m "feat: add CodeBlock with copy-to-clipboard"
```

---

## Task 6: MDX Components Map

**Files:**
- Create: `src/components/mdx/mdx-components.tsx`

- [x] **Step 1: Create the components map**

Create `src/components/mdx/mdx-components.tsx`:

```typescript
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import { Tip, Note, Warning } from './callout'
import { CodeBlock } from './code-block'
import { AdSlot } from '@/components/article/ad-slot'

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getMDXComponents(): MDXComponents {
  return {
    // Headings — IDs must match extractHeadings() in src/lib/mdx.ts
    h2: ({ children }) => (
      <h2
        id={slugify(String(children))}
        className="font-fraunces text-2xl text-primary mt-10 mb-4 scroll-mt-20"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(String(children))}
        className="font-fraunces text-xl text-primary mt-8 mb-3 scroll-mt-20"
      >
        {children}
      </h3>
    ),

    // Body text
    p: ({ children }) => (
      <p className="text-base md:text-lg text-primary leading-relaxed mb-6 max-w-prose">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-accent underline underline-offset-2 hover:text-accent-deep transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,

    // Code
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    code: ({ children, className }) => {
      if (className) {
        // Inside a fenced code block — CodeBlock wraps the pre, this renders the inner code
        return <code className={`font-mono text-sm ${className}`}>{children}</code>
      }
      // Inline code
      return (
        <code className="bg-surface-subtle border border-border rounded px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      )
    },

    // Block elements
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic text-secondary my-6">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-10" />,
    ul: ({ children }) => (
      <ul className="ml-6 mb-6 space-y-2 text-primary list-disc">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="ml-6 mb-6 space-y-2 text-primary list-decimal">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-base md:text-lg text-primary leading-relaxed">{children}</li>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-surface-subtle">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="even:bg-surface-subtle">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-semibold text-primary">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2 text-primary">{children}</td>
    ),

    // Images — always next/image per CLAUDE.md
    img: ({ src, alt, width, height }) => (
      <figure className="my-8">
        <Image
          src={src ?? ''}
          alt={alt ?? ''}
          width={Number(width) || 800}
          height={Number(height) || 450}
          className="rounded-xl w-full h-auto"
        />
        {alt && (
          <figcaption className="text-sm text-secondary text-center mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // Custom components available inside .mdx files
    Tip,
    Note,
    Warning,
    AdSlot,
  }
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/mdx/mdx-components.tsx
git commit -m "feat: add full MDX component map with styled overrides"
```

---

## Task 7: Ad Slot Component

**Files:**
- Create: `src/components/article/ad-slot.tsx`

- [x] **Step 1: Create the component**

Create `src/components/article/ad-slot.tsx`:

```typescript
interface AdSlotProps {
  size?: '300x250' | '728x90'
}

export function AdSlot({ size = '300x250' }: AdSlotProps) {
  const isLeaderboard = size === '728x90'
  return (
    <div
      className={`border border-dashed border-border rounded-lg bg-surface-subtle flex items-center justify-center text-secondary text-xs my-6 mx-auto shrink-0 ${
        isLeaderboard
          ? 'h-[90px] w-full max-w-[728px]'
          : 'h-[250px] w-[300px]'
      }`}
      aria-hidden="true"
    >
      Advertisement
    </div>
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/article/ad-slot.tsx
git commit -m "feat: add AdSlot placeholder component"
```

---

## Task 8: Reading Progress Bar

**Files:**
- Create: `src/components/article/reading-progress.tsx`

- [x] **Step 1: Create the component**

Create `src/components/article/reading-progress.tsx`:

```typescript
'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/article/reading-progress.tsx
git commit -m "feat: add reading progress bar with Framer Motion"
```

---

## Task 9: Pillar Sidebar (Left Column)

**Files:**
- Create: `src/components/article/pillar-sidebar.tsx`

- [x] **Step 1: Create the component**

Create `src/components/article/pillar-sidebar.tsx`:

```typescript
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

const MOCK_PILLAR_ARTICLES: Record<string, { title: string; slug: string }[]> = {
  'agentic-ai': [
    { title: 'What is an AI Agent?', slug: 'what-is-an-agent' },
    { title: 'Tool Use: Giving Models Hands', slug: 'tool-use-explained' },
    { title: 'Memory in AI Agents', slug: 'agent-memory' },
    { title: 'Planning and Reasoning', slug: 'agent-planning' },
    { title: 'Multi-Agent Systems', slug: 'multi-agent-systems' },
  ],
}

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
}

function SidebarContent({ pillar, currentSlug }: PillarSidebarProps) {
  const articles = MOCK_PILLAR_ARTICLES[pillar] ?? []
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

export function PillarSidebar({ pillar, currentSlug }: PillarSidebarProps) {
  return (
    <>
      {/* Desktop sticky sidebar — hidden below lg */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2">
          <SidebarContent pillar={pillar} currentSlug={currentSlug} />
        </div>
      </aside>

      {/* Mobile: Contents button that opens a Sheet — visible below lg */}
      <div className="lg:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 text-sm text-secondary border border-border rounded-lg px-4 py-2 hover:bg-surface-subtle transition-colors">
              <BookOpen className="h-4 w-4" />
              Contents
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-surface p-6">
            <SheetHeader>
              <SheetTitle className="text-left font-fraunces">Contents</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <SidebarContent pillar={pillar} currentSlug={currentSlug} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/article/pillar-sidebar.tsx
git commit -m "feat: add PillarSidebar with desktop sticky + mobile Sheet"
```

---

## Task 10: Table of Contents (Right Column)

**Files:**
- Create: `src/components/article/table-of-contents.tsx`

- [x] **Step 1: Create the component**

Create `src/components/article/table-of-contents.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import type { ArticleHeading } from '@/lib/mdx'
import { AdSlot } from '@/components/article/ad-slot'

interface TableOfContentsProps {
  headings: ArticleHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      // Trigger when heading enters the top 20% of the viewport
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20 flex flex-col gap-6">
        <nav aria-label="Table of contents">
          <p className="font-fraunces text-xs text-secondary uppercase tracking-widest mb-3">
            On this page
          </p>
          <ul className="flex flex-col gap-1">
            {headings.map(({ id, text, level }) => (
              <li key={id} className={level === 3 ? 'ml-3' : ''}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`text-sm block py-1 transition-colors ${
                    activeId === id
                      ? 'text-accent font-medium'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <AdSlot size="300x250" />
      </div>
    </aside>
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/article/table-of-contents.tsx
git commit -m "feat: add TableOfContents with Intersection Observer active tracking"
```

---

## Task 11: Article Feedback

**Files:**
- Create: `src/components/article/article-feedback.tsx`

- [x] **Step 1: Create the component**

Create `src/components/article/article-feedback.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export function ArticleFeedback() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  return (
    <div className="flex flex-wrap items-center gap-4 py-6">
      <span className="text-sm text-secondary font-medium">Was this helpful?</span>
      <div className="flex gap-2">
        <button
          onClick={() => setVote('up')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            vote === 'up'
              ? 'bg-accent text-white'
              : 'bg-surface-subtle text-secondary hover:bg-accent-soft hover:text-accent'
          }`}
          aria-pressed={vote === 'up'}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </button>
        <button
          onClick={() => setVote('down')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            vote === 'down'
              ? 'bg-accent text-white'
              : 'bg-surface-subtle text-secondary hover:bg-accent-soft hover:text-accent'
          }`}
          aria-pressed={vote === 'down'}
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </button>
      </div>
      {vote && (
        <span className="text-sm text-secondary">Thanks for your feedback!</span>
      )}
    </div>
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/components/article/article-feedback.tsx
git commit -m "feat: add ArticleFeedback thumbs up/down component"
```

---

## Task 12: Article Navigation (Prev/Next + Related)

**Files:**
- Create: `src/components/article/article-nav.tsx`

- [x] **Step 1: Create the component**

Create `src/components/article/article-nav.tsx`:

```typescript
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

const MOCK_ADJACENT: Record<
  string,
  { prev: NavArticle | null; next: NavArticle | null }
> = {
  'what-is-an-agent': {
    prev: null,
    next: {
      title: 'Tool Use: Giving Models Hands',
      slug: 'tool-use-explained',
      pillar: 'agentic-ai',
    },
  },
}

const MOCK_RELATED: Record<string, RelatedArticle[]> = {
  'what-is-an-agent': [
    {
      title: 'Tool Use: Giving Models Hands',
      slug: 'tool-use-explained',
      pillar: 'agentic-ai',
      readTime: 12,
    },
    {
      title: 'Memory in AI Agents',
      slug: 'agent-memory',
      pillar: 'agentic-ai',
      readTime: 9,
    },
    {
      title: 'RAG Without the Hype',
      slug: 'rag-explained',
      pillar: 'agentic-ai',
      readTime: 10,
    },
  ],
}

export function ArticleNav({ pillar: _pillar, slug }: ArticleNavProps) {
  const adjacent = MOCK_ADJACENT[slug] ?? { prev: null, next: null }
  const related = MOCK_RELATED[slug] ?? []

  return (
    <div className="mt-12 space-y-10">
      {/* Prev / Next */}
      <div className="grid grid-cols-2 gap-4">
        {adjacent.prev ? (
          <Link
            href={`/library/${adjacent.prev.pillar}/${adjacent.prev.slug}`}
            className="flex flex-col gap-1 p-4 rounded-xl border border-border hover:bg-surface-subtle transition-colors"
          >
            <span className="flex items-center gap-1 text-xs text-secondary">
              <ChevronLeft className="h-4 w-4" /> Previous
            </span>
            <span className="font-fraunces text-sm text-primary">
              {adjacent.prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            href={`/library/${adjacent.next.pillar}/${adjacent.next.slug}`}
            className="flex flex-col gap-1 p-4 rounded-xl border border-border hover:bg-surface-subtle transition-colors text-right col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-secondary">
              Next <ChevronRight className="h-4 w-4" />
            </span>
            <span className="font-fraunces text-sm text-primary">
              {adjacent.next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <h3 className="font-fraunces text-lg text-primary mb-4">
            Keep reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((article) => (
              <Link
                key={article.slug}
                href={`/library/${article.pillar}/${article.slug}`}
                className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:bg-surface-subtle transition-colors"
              >
                <span className="font-fraunces text-sm text-primary leading-snug">
                  {article.title}
                </span>
                <span className="text-xs text-secondary">
                  {article.readTime} min read
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

- [x] **Step 2: Commit**

```bash
git add src/components/article/article-nav.tsx
git commit -m "feat: add ArticleNav with prev/next and related articles"
```

---

## Task 13: Assemble the Article Page

**Files:**
- Create: `src/app/library/[pillar]/[slug]/page.tsx`

- [x] **Step 1: Create the page**

Create `src/app/library/[pillar]/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleSource } from '@/lib/mdx'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import { ReadingProgress } from '@/components/article/reading-progress'
import { PillarSidebar } from '@/components/article/pillar-sidebar'
import { TableOfContents } from '@/components/article/table-of-contents'
import { ArticleFeedback } from '@/components/article/article-feedback'
import { ArticleNav } from '@/components/article/article-nav'

interface PageProps {
  params: Promise<{ pillar: string; slug: string }>
}

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

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate:
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar, slug } = await params
  try {
    const { frontmatter } = getArticleSource(pillar, slug)
    return {
      title: `${frontmatter.title} — Seekvana`,
      description: frontmatter.description,
    }
  } catch {
    return { title: 'Article — Seekvana' }
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { pillar, slug } = await params

  let articleData
  try {
    articleData = getArticleSource(pillar, slug)
  } catch {
    notFound()
  }

  const { source, frontmatter, headings } = articleData
  const pillarName = PILLAR_NAMES[pillar] ?? pillar
  const difficultyClass =
    DIFFICULTY_COLORS[frontmatter.difficulty] ?? DIFFICULTY_COLORS.beginner

  return (
    <>
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8 items-start">
        {/* Left sidebar */}
        <PillarSidebar pillar={pillar} currentSlug={slug} />

        {/* Center — article content */}
        <article className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto px-0 md:px-8">
            {/* Mobile contents button rendered by PillarSidebar above the article */}

            {/* Breadcrumbs */}
            <nav
              className="flex items-center gap-2 text-sm text-secondary mb-8 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/library" className="hover:text-accent transition-colors">
                Library
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href={`/library/${pillar}`}
                className="hover:text-accent transition-colors"
              >
                {pillarName}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-primary truncate max-w-[200px]">
                {frontmatter.title}
              </span>
            </nav>

            {/* Article header */}
            <header className="mb-10">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-accent-soft text-accent text-xs px-3 py-1 rounded-full font-medium">
                  {pillarName}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${difficultyClass}`}
                >
                  {frontmatter.difficulty}
                </span>
              </div>
              <h1 className="font-fraunces text-4xl text-primary leading-tight">
                {frontmatter.title}
              </h1>
              <p className="text-lg text-secondary mt-3 leading-relaxed">
                {frontmatter.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-secondary">
                <span>{frontmatter.author}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span aria-hidden="true">·</span>
                <span>{frontmatter.readTime} min read</span>
              </div>
            </header>

            {/* Article body */}
            <div>
              <MDXRemote source={source} components={getMDXComponents()} />
            </div>

            {/* Feedback */}
            <hr className="border-border my-8" />
            <ArticleFeedback />

            {/* Prev/Next + Related */}
            <ArticleNav pillar={pillar} slug={slug} />
          </div>
        </article>

        {/* Right sidebar — TOC */}
        <TableOfContents headings={headings} />
      </div>
    </>
  )
}
```

- [x] **Step 2: Commit**

```bash
git add src/app/library/
git commit -m "feat: add dynamic article page with 3-column layout"
```

---

## Task 14: Build Verification

**Files:** none

- [x] **Step 1: Run the build**

```bash
cd d:/seekvana
npm run build
```

- [x] **Step 2: Fix any TypeScript / ESLint errors**

Common errors to watch for and their fixes:

| Error | Fix |
|---|---|
| `Cannot find module 'mdx/types'` | Run `npm install @types/mdx` |
| `Type 'Promise<{pillar,slug}>' not assignable` | Ensure `params` type is `Promise<{pillar:string;slug:string}>` and you `await params` |
| `'reading-time' has no exported member` | Change to `import readingTime from 'reading-time'` (default export) |
| ESLint `no-explicit-any` on frontmatter cast | Use `data as ArticleFrontmatter` (already in the plan) |
| `next/image` `src` prop error | Wrap `src ?? ''` in AdSlot or image component |

- [x] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

Visit `http://localhost:3000/library/agentic-ai/what-is-an-agent` and confirm:

- [x] 3-column layout visible on wide screen (left sidebar + article + TOC on right)
- [x] Left sidebar shows pillar articles with "What is an AI Agent?" highlighted
- [x] Breadcrumb trail: Library / Agentic AI / What is an AI Agent?
- [x] Article header: title in Fraunces, badges for pillar + difficulty, meta row with date and read time
- [x] Body text renders with correct font and spacing
- [x] Comparison table renders with bordered cells and alternating rows
- [x] `<Tip>` callout renders with clay left border and Lightbulb icon
- [x] Python code block renders with copy button visible on hover
- [x] `<AdSlot />` renders as 300×250 dashed placeholder labeled "Advertisement"
- [x] TOC on right lists the 3 h2 headings; active section highlights as you scroll
- [x] Thin clay progress bar animates at the very top as you scroll
- [x] Thumbs up/down feedback buttons work and show "Thanks for your feedback!" after click
- [x] Next article card shows "Tool Use: Giving Models Hands"
- [x] "Keep reading" section shows 3 related article cards
- [x] On mobile (< lg): desktop sidebar is hidden, Contents button appears and opens a Sheet
- [x] On mobile (< xl): right TOC is hidden
- [x] Dark mode: switch theme and verify no hardcoded colors appear

- [x] **Step 4: Commit final build**

```bash
git add .
git commit -m "feat: Phase 5 complete — article page with MDX, TOC, and ad slots"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by task |
|---|---|
| 3-column layout (left + center + right) | Task 13 |
| Left sidebar sticky, w-64, hidden < lg | Task 9 |
| Left sidebar mobile Sheet | Task 9 |
| Reading progress bar (Framer Motion useScroll) | Task 8 |
| Breadcrumbs Library → Pillar → Article | Task 13 |
| Article header: badges, h1, description, meta row | Task 13 |
| Styled h2/h3 (Fraunces) | Task 6 |
| Styled p, a, strong, blockquote, hr, ul/ol, li | Task 6 |
| Tip/Note/Warning callout boxes | Task 4 |
| Code block with copy button | Task 5 |
| Inline code | Task 6 |
| Table with alternating rows | Task 6 |
| next/image for images | Task 6 |
| In-content ad slot 300×250 (via `<AdSlot />` in MDX) | Tasks 7 + 2 |
| Right sidebar ad slot 300×250 | Task 10 |
| Feedback row "Was this helpful?" | Task 11 |
| Prev/Next navigation | Task 12 |
| Related articles "Keep reading" | Task 12 |
| TOC with Intersection Observer active state | Task 10 |
| TOC smooth scroll | Task 10 |
| Sample article ~600 words with 3 h2, 1 tip, 1 code, 1 table | Task 2 |
| `generateMetadata` for SEO | Task 13 |
| `notFound()` when article file missing | Task 13 |
| `npm run build` passes | Task 14 |

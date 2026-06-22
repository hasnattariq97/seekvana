# Getting Started Path Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/paths/getting-started` — a full path page with an animated journey milestone hero, expandable module accordion, and sticky sidebar, wired to a JSON curriculum data file.

**Architecture:** Server component page reads `getting-started.json` via `getPathBySlug()` (added to `src/lib/mdx.ts`) and passes typed data down to client components. The accordion uses a pure CSS `grid-template-rows` animation — no JS for expand/collapse. Framer Motion (already installed) animates the journey milestone bar on mount.

**Tech Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · Framer Motion · Lucide React · next/link

**Design reference:** Visual mockup at `C:\Users\User\AppData\Local\Temp\claude\d--seekvana\b8b7ce4a-058b-48db-a7f8-e3477d2b4a52\scratchpad\getting-started-v2.html` — the topic titles, module structure, and animation behaviour in that file are the target.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/lib/mdx.ts` | Modify | Add `PathTopic`, `PathModule`, `PathData` types + `getPathBySlug()` |
| `src/content/paths/getting-started.json` | Modify | Add 10 modules with full topic list (101 topics) |
| `src/components/paths/path-hero.tsx` | Create | Animated journey milestone bar, title, CTAs |
| `src/components/paths/module-item.tsx` | Create | Single accordion row — CSS grid-rows expand |
| `src/components/paths/module-list.tsx` | Create | Accordion container, passes modules to `ModuleItem` |
| `src/components/paths/topic-row.tsx` | Create | Single topic row with optional article chip |
| `src/components/paths/path-sidebar.tsx` | Create | Sticky progress card + info rows + "after this" |
| `src/app/paths/[slug]/page.tsx` | Create | Server component page — reads JSON, renders layout |

---

## Task 1: Add types and `getPathBySlug` to `src/lib/mdx.ts`

**Files:**
- Modify: `src/lib/mdx.ts`

The existing `PathDefinition` type and `getAllPaths()` are already there — append below them. Do not change existing code.

- [ ] **Step 1: Add the new types at the bottom of `src/lib/mdx.ts`**

Open `src/lib/mdx.ts` and append after the closing brace of `getAllPaths()`:

```ts
export interface PathTopic {
  id: string
  title: string
  articlePillar?: string
  articleSlug?: string
}

export interface PathModule {
  id: string
  title: string
  description: string
  topics: PathTopic[]
}

export interface PathData extends PathDefinition {
  modules: PathModule[]
  nextPath?: {
    title: string
    slug: string
    lessonCount: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }
}

export function getPathBySlug(slug: string): PathData | null {
  const filePath = path.join(process.cwd(), 'src', 'content', 'paths', `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as PathData
}

export function generatePathStaticParams(): { slug: string }[] {
  const pathsDir = path.join(process.cwd(), 'src', 'content', 'paths')
  if (!fs.existsSync(pathsDir)) return []
  return fs
    .readdirSync(pathsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.replace(/\.json$/, '') }))
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors relating to the new types.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/lib/mdx.ts
git commit -m "feat(paths): add PathData types and getPathBySlug utility"
```

---

## Task 2: Extend `getting-started.json` with full curriculum

**Files:**
- Modify: `src/content/paths/getting-started.json`

Replace the entire file content with the following JSON. This contains all 10 modules and 101 topics (the `lessonCount` field is updated to reflect this). Topic `00.01` links to the existing article at `/library/ai-foundations/what-is-ai`.

- [ ] **Step 1: Replace `src/content/paths/getting-started.json` entirely**

```json
{
  "slug": "getting-started",
  "title": "Getting Started",
  "description": "From zero to AI-ready — terminal, Python, Git, APIs, and deployment from scratch. No experience needed.",
  "difficulty": "beginner",
  "lessonCount": 101,
  "href": "/paths/getting-started",
  "colorClass": "bg-purple-500",
  "nextPath": {
    "title": "Master Agentic AI",
    "slug": "master-agentic-ai",
    "lessonCount": 14,
    "difficulty": "intermediate"
  },
  "modules": [
    {
      "id": "00",
      "title": "The AI Landscape",
      "description": "Orientation — understanding the world you're stepping into",
      "topics": [
        { "id": "00.01", "title": "What AI actually is — and what it is not", "articlePillar": "ai-foundations", "articleSlug": "what-is-ai" },
        { "id": "00.02", "title": "ML → Deep Learning → LLMs → Generative AI → Agentic AI" },
        { "id": "00.03", "title": "How large language models work — tokens, training, inference, no math" },
        { "id": "00.04", "title": "The difference between a chatbot and an agent" },
        { "id": "00.05", "title": "Key players: ChatGPT, Claude, Gemini, Grok — what makes each different" },
        { "id": "00.06", "title": "Paid vs free tiers — what you actually need to get started" },
        { "id": "00.07", "title": "AI applications you already use without knowing it" },
        { "id": "00.08", "title": "How to think about AI as a collaborator, not a magic box" }
      ]
    },
    {
      "id": "01",
      "title": "Terminal & Command Line",
      "description": "The black box explained — commands that make everything work",
      "topics": [
        { "id": "01.01", "title": "What the terminal actually is and why developers use it" },
        { "id": "01.02", "title": "PowerShell (Windows) vs Terminal (Mac/Linux) — setup and first look" },
        { "id": "01.03", "title": "The 15 commands you'll use 90% of the time: cd, ls, mkdir, cp, mv, rm" },
        { "id": "01.04", "title": "File paths: absolute vs relative — why this trips everyone up" },
        { "id": "01.05", "title": "Package managers — what npm install and pip install actually do" },
        { "id": "01.06", "title": "Environment variables — setting, reading, and understanding them" },
        { "id": "01.07", "title": "Reading error messages — how to decode what went wrong" }
      ]
    },
    {
      "id": "02",
      "title": "Your Developer Environment",
      "description": "VS Code, Cursor, Node, Python, Git — every tool installed and verified",
      "topics": [
        { "id": "02.01", "title": "Installing VS Code and Cursor — your two editors" },
        { "id": "02.02", "title": "Node.js and npm — installing and verifying" },
        { "id": "02.03", "title": "Python 3 — installing and running your first script" },
        { "id": "02.04", "title": "Git — installing and basic config" },
        { "id": "02.05", "title": "API keys — what they are and how to keep them safe" },
        { "id": "02.06", "title": ".env files — storing secrets the right way" },
        { "id": "02.07", "title": "Setting up your Anthropic account and first API key" },
        { "id": "02.08", "title": "Your first Claude API call in Python" },
        { "id": "02.09", "title": "Claude Code — installing and first run" },
        { "id": "02.10", "title": "Virtual environments — why they exist and how to use them" },
        { "id": "02.11", "title": "Checklist — confirming everything is ready" }
      ]
    },
    {
      "id": "03",
      "title": "GitHub & Version Control",
      "description": "Save, share, and never lose your work again",
      "topics": [
        { "id": "03.01", "title": "What Git is and why it matters for AI projects" },
        { "id": "03.02", "title": "The Git workflow: add, commit, push" },
        { "id": "03.03", "title": "Branches — what they are and why you need them" },
        { "id": "03.04", "title": "Pull requests — reviewing and merging changes" },
        { "id": "03.05", "title": ".gitignore — keeping secrets and junk out of your repo" },
        { "id": "03.06", "title": "Cloning an existing project" },
        { "id": "03.07", "title": "Reading a codebase you didn't write" },
        { "id": "03.08", "title": "Resolving merge conflicts without panic" },
        { "id": "03.09", "title": "GitHub profile as a portfolio — what to show" },
        { "id": "03.10", "title": "Pinning and describing your repos" },
        { "id": "03.11", "title": "README files — writing one that actually helps" }
      ]
    },
    {
      "id": "04",
      "title": "Python Without Fear",
      "description": "Just enough Python to read and write real AI code",
      "topics": [
        { "id": "04.01", "title": "Variables, strings, numbers, and booleans" },
        { "id": "04.02", "title": "Lists and dictionaries — the data structures you'll use most" },
        { "id": "04.03", "title": "Functions — writing and calling them" },
        { "id": "04.04", "title": "Loops and conditions" },
        { "id": "04.05", "title": "Reading and writing files" },
        { "id": "04.06", "title": "Making HTTP requests with the requests library" },
        { "id": "04.07", "title": "Working with JSON — parsing API responses" },
        { "id": "04.08", "title": "Using dotenv to load .env files" },
        { "id": "04.09", "title": "pip and requirements.txt — managing dependencies" },
        { "id": "04.10", "title": "Error handling — try/except without the drama" },
        { "id": "04.11", "title": "Calling the Claude API — a working script" },
        { "id": "04.12", "title": "Reading other people's Python — a practical approach" }
      ]
    },
    {
      "id": "05",
      "title": "Web Basics",
      "description": "HTML, CSS, JS, REST APIs — how the web works under the hood",
      "topics": [
        { "id": "05.01", "title": "What HTML actually does — structure vs presentation" },
        { "id": "05.02", "title": "CSS in 10 minutes — what you need to know" },
        { "id": "05.03", "title": "JavaScript basics — variables, functions, DOM" },
        { "id": "05.04", "title": "What an API is and how REST works" },
        { "id": "05.05", "title": "HTTP methods: GET, POST, PUT, DELETE" },
        { "id": "05.06", "title": "Headers, status codes, and error handling" },
        { "id": "05.07", "title": "Using DevTools to inspect network requests" },
        { "id": "05.08", "title": "Calling an API from JavaScript with fetch()" },
        { "id": "05.09", "title": "Frontend vs backend — what runs where" },
        { "id": "05.10", "title": "Building a tiny webpage that calls an API" }
      ]
    },
    {
      "id": "06",
      "title": "Backend, Databases & AI Architecture",
      "description": "FastAPI, SQL, Supabase — where agents actually live",
      "topics": [
        { "id": "06.01", "title": "What a backend actually is — and why AI needs one" },
        { "id": "06.02", "title": "FastAPI — your first Python API in 10 lines" },
        { "id": "06.03", "title": "SQL basics — tables, rows, queries" },
        { "id": "06.04", "title": "Supabase — setting up a free hosted Postgres database" },
        { "id": "06.05", "title": "Connecting your Python script to Supabase" },
        { "id": "06.06", "title": "The 3-layer AI app architecture — frontend, backend, model" },
        { "id": "06.07", "title": "Storing conversation history in a database" },
        { "id": "06.08", "title": "Authentication basics — users, tokens, sessions" }
      ]
    },
    {
      "id": "07",
      "title": "AI Coding Tools Ecosystem",
      "description": "Claude Code, Cursor, Windsurf, Copilot, Gemini CLI — your toolkit",
      "topics": [
        { "id": "07.01", "title": "The landscape of AI coding assistants in 2026" },
        { "id": "07.02", "title": "Claude Code — agentic coding from your terminal" },
        { "id": "07.03", "title": "Cursor — AI-native code editor deep dive" },
        { "id": "07.04", "title": "Windsurf — Codeium's agentic editor" },
        { "id": "07.05", "title": "GitHub Copilot — inline autocomplete and chat" },
        { "id": "07.06", "title": "Gemini CLI — Google's terminal agent" },
        { "id": "07.07", "title": "Cline and Aider — open-source agentic tools" },
        { "id": "07.08", "title": "Bolt.new and Replit — browser-based builders" },
        { "id": "07.09", "title": "Choosing the right tool for the job" },
        { "id": "07.10", "title": "Prompt patterns that work across all tools" },
        { "id": "07.11", "title": "Building your personal AI-assisted workflow" }
      ]
    },
    {
      "id": "08",
      "title": "Deployment: Taking Your Work Live",
      "description": "Vercel, Render, Supabase, DNS, domains, logs — ship it",
      "topics": [
        { "id": "08.01", "title": "What deployment means and why it matters" },
        { "id": "08.02", "title": "Vercel — deploying a Next.js app in 2 minutes" },
        { "id": "08.03", "title": "Render — deploying a Python FastAPI backend" },
        { "id": "08.04", "title": "Environment variables in production — the right way" },
        { "id": "08.05", "title": "Supabase in production — connection strings and limits" },
        { "id": "08.06", "title": "Custom domains — buying, pointing, and verifying" },
        { "id": "08.07", "title": "DNS explained — A records, CNAMEs, and TTL" },
        { "id": "08.08", "title": "HTTPS — why it matters and how to get it free" },
        { "id": "08.09", "title": "Logs — reading deployment and runtime logs" },
        { "id": "08.10", "title": "Debugging production errors — the systematic approach" },
        { "id": "08.11", "title": "Monitoring — knowing when something breaks" },
        { "id": "08.12", "title": "Costs — keeping your cloud bill at $0" },
        { "id": "08.13", "title": "CI/CD basics — auto-deploying on push" },
        { "id": "08.14", "title": "Your deployment checklist before going live" }
      ]
    },
    {
      "id": "09",
      "title": "Mini Projects",
      "description": "Capstone: build and deploy a live Claude chat app with Supabase logging",
      "topics": [
        { "id": "09.01", "title": "Reviewing what you've built — the full picture" },
        { "id": "09.02", "title": "Project 1: CLI tool that summarises a webpage using Claude" },
        { "id": "09.03", "title": "Project 2: FastAPI endpoint that wraps the Claude API" },
        { "id": "09.04", "title": "Project 3: A web UI that calls your FastAPI backend" },
        { "id": "09.05", "title": "Adding Supabase to log every conversation" },
        { "id": "09.06", "title": "Deploying the whole stack: frontend + backend + database" },
        { "id": "09.07", "title": "Adding a custom domain to your live app" },
        { "id": "09.08", "title": "Sharing your project — portfolio entry template" },
        { "id": "09.09", "title": "What's next — your path into Agentic AI" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
cd d:/seekvana && node -e "const d = require('./src/content/paths/getting-started.json'); console.log('modules:', d.modules.length, '| topics:', d.modules.reduce((n, m) => n + m.topics.length, 0))"
```

Expected output: `modules: 10 | topics: 101`

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/content/paths/getting-started.json
git commit -m "feat(paths): add full 10-module curriculum to getting-started.json"
```

---

## Task 3: `TopicRow` component

**Files:**
- Create: `src/components/paths/topic-row.tsx`

Renders one topic row. When `articlePillar` and `articleSlug` are both present it renders a linked chip; otherwise just the title.

- [ ] **Step 1: Create `src/components/paths/topic-row.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { PathTopic } from '@/lib/mdx'

interface TopicRowProps {
  topic: PathTopic
}

export function TopicRow({ topic }: TopicRowProps) {
  const hasArticle = Boolean(topic.articlePillar && topic.articleSlug)

  return (
    <li className="flex items-center gap-3 px-6 py-2.5 pl-12 text-sm text-primary hover:bg-surface-subtle transition-colors duration-100 cursor-default">
      <span className="font-mono text-[10.5px] text-secondary shrink-0 min-w-[34px]">
        {topic.id}
      </span>
      <span className="flex-1 leading-snug">{topic.title}</span>
      {hasArticle && (
        <Link
          href={`/library/${topic.articlePillar}/${topic.articleSlug}`}
          className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-accent bg-accent-soft rounded-md px-2 py-1 shrink-0 hover:bg-[#eec9b5] transition-colors duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={9} strokeWidth={2.2} />
          Article
        </Link>
      )}
    </li>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/components/paths/topic-row.tsx
git commit -m "feat(paths): add TopicRow component"
```

---

## Task 4: `ModuleItem` component (accordion with CSS grid-rows animation)

**Files:**
- Create: `src/components/paths/module-item.tsx`

The expand/collapse uses `grid-template-rows: 0fr → 1fr` — a pure CSS height animation with no layout thrash. Module `id === '00'` starts open by default (the first module is the entry point).

- [ ] **Step 1: Create `src/components/paths/module-item.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TopicRow } from './topic-row'
import type { PathModule } from '@/lib/mdx'

interface ModuleItemProps {
  module: PathModule
  defaultOpen?: boolean
}

export function ModuleItem({ module, defaultOpen = false }: ModuleItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Header */}
      <button
        type="button"
        className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors duration-150 ${
          open ? 'bg-accent-soft hover:bg-[#f1d5c8]' : 'hover:bg-surface-subtle'
        }`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`font-mono text-[11px] font-bold tracking-wide shrink-0 min-w-[24px] transition-colors duration-200 ${
            open ? 'text-accent' : 'text-border'
          }`}
        >
          {module.id}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-fraunces text-[15.5px] font-semibold text-primary leading-tight">
            {module.title}
          </p>
          <p className="text-xs text-secondary mt-0.5 truncate max-w-[45ch]">
            {module.description}
          </p>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <span
            className={`text-[11.5px] rounded-md px-2 py-1 border transition-colors duration-200 ${
              open
                ? 'bg-[rgba(201,99,63,0.12)] border-[rgba(201,99,63,0.25)] text-accent-deep'
                : 'bg-surface-subtle border-border text-secondary'
            }`}
          >
            {module.topics.length} topics
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className={`text-secondary transition-transform duration-250 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Topics panel — grid-rows animation */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out bg-canvas border-t border-border"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          borderTopWidth: open ? '1px' : '0px',
        }}
      >
        <div className="overflow-hidden">
          <ul className="py-1.5">
            {module.topics.map((topic) => (
              <TopicRow key={topic.id} topic={topic} />
            ))}
          </ul>
          <div className="flex justify-between items-center px-6 py-2.5 pl-12 border-t border-border text-xs text-secondary">
            <span>Each topic includes a 5-min task</span>
            <span className="font-semibold text-primary">{module.topics.length} tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/components/paths/module-item.tsx
git commit -m "feat(paths): add ModuleItem accordion with CSS grid-rows animation"
```

---

## Task 5: `ModuleList` component

**Files:**
- Create: `src/components/paths/module-list.tsx`

Thin wrapper — a `<section>` with heading + description + the bordered list of `ModuleItem`s. Opens module `00` by default.

- [ ] **Step 1: Create `src/components/paths/module-list.tsx`**

```tsx
import { ModuleItem } from './module-item'
import type { PathModule } from '@/lib/mdx'

interface ModuleListProps {
  modules: PathModule[]
  totalTopics: number
}

export function ModuleList({ modules, totalTopics }: ModuleListProps) {
  return (
    <section id="modules">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-fraunces text-xl font-semibold text-primary">Curriculum</h2>
        <span className="text-xs text-secondary">
          {modules.length} modules · {totalTopics} topics
        </span>
      </div>
      <p className="text-[13px] text-secondary mb-6 leading-relaxed">
        <strong className="text-primary font-semibold">Every topic takes under 5 minutes.</strong>{' '}
        Each ends with a hands-on task you can complete right now — no setup required to begin Module 00.
      </p>
      <div className="border border-border rounded-2xl overflow-hidden bg-surface">
        {modules.map((module) => (
          <ModuleItem
            key={module.id}
            module={module}
            defaultOpen={module.id === '00'}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/components/paths/module-list.tsx
git commit -m "feat(paths): add ModuleList container component"
```

---

## Task 6: `PathSidebar` component

**Files:**
- Create: `src/components/paths/path-sidebar.tsx`

Sticky card with progress bar (at 0% — static for now), info rows, and a "next path" teaser. Uses Seekvana tokens only — no hardcoded hex.

- [ ] **Step 1: Create `src/components/paths/path-sidebar.tsx`**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PathData } from '@/lib/mdx'

interface PathSidebarProps {
  path: PathData
}

export function PathSidebar({ path }: PathSidebarProps) {
  const difficultyLabel =
    path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)

  return (
    <aside className="sticky top-[76px] flex flex-col gap-3.5">
      {/* Progress card */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-3.5">
          Your progress
        </p>

        {/* Progress bar — 0% (static; hook into user state later) */}
        <div className="h-[5px] bg-border rounded-full mb-1.5 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
        <p className="text-xs text-secondary mb-5">0 of {path.lessonCount} topics complete</p>

        <Link
          href="#modules"
          className="flex items-center justify-between w-full bg-accent hover:bg-accent-deep text-white rounded-[10px] px-4 py-3.5 text-[13.5px] font-semibold transition-colors duration-150 mb-5"
        >
          <span>Start Module 00</span>
          <ArrowRight size={15} strokeWidth={2} />
        </Link>

        <div className="divide-y divide-border text-[12.5px]">
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">Difficulty</span>
            <span className="font-medium text-primary">{difficultyLabel}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">Total time</span>
            <span className="font-medium text-primary">3–5 hours</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">Prerequisites</span>
            <span className="font-medium text-primary">None</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">You'll build</span>
            <span className="font-medium text-primary">Live AI app</span>
          </div>
        </div>
      </div>

      {/* After this path */}
      {path.nextPath && (
        <div className="bg-surface-subtle border border-border rounded-2xl p-4">
          <p className="text-[10.5px] font-bold text-secondary uppercase tracking-widest mb-2">
            After this path
          </p>
          <p className="font-fraunces text-[15px] font-semibold text-primary leading-tight mb-1">
            {path.nextPath.title}
          </p>
          <p className="text-xs text-secondary">
            {path.nextPath.lessonCount} lessons ·{' '}
            {path.nextPath.difficulty.charAt(0).toUpperCase() +
              path.nextPath.difficulty.slice(1)}
          </p>
          <Link
            href={`/paths/${path.nextPath.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mt-2.5 hover:gap-2.5 transition-all duration-150"
          >
            View path
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      )}
    </aside>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/components/paths/path-sidebar.tsx
git commit -m "feat(paths): add PathSidebar component"
```

---

## Task 7: `PathHero` component (animated journey milestone bar)

**Files:**
- Create: `src/components/paths/path-hero.tsx`

This is a client component because it uses Framer Motion. The journey bar shows 10 nodes (one per module). The connecting line behind all nodes animates to `scaleX(0.04)` on mount — representing the start of the journey. Each node fades up with a stagger delay. Module `00` node is filled in clay. Module `09` node is green (the destination).

- [ ] **Step 1: Create `src/components/paths/path-hero.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PathData } from '@/lib/mdx'

interface PathHeroProps {
  path: PathData
}

const NODE_LABELS: Record<string, string> = {
  '00': 'AI Landscape',
  '01': 'Terminal',
  '02': 'Dev Setup',
  '03': 'GitHub',
  '04': 'Python',
  '05': 'Web Basics',
  '06': 'Backend',
  '07': 'AI Tools',
  '08': 'Deploy',
  '09': 'Live App',
}

export function PathHero({ path }: PathHeroProps) {
  return (
    <header className="pb-14 border-b border-border mb-14">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1 rounded-full border border-[#c3e6cd] bg-[#f0faf4] text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Beginner
        </span>
        <span className="inline-flex text-[11.5px] font-medium px-3 py-1 rounded-full border border-border bg-surface text-secondary">
          No experience needed
        </span>
        <span className="inline-flex text-[11.5px] font-medium px-3 py-1 rounded-full border border-border bg-surface text-secondary">
          Free
        </span>
      </div>

      {/* Title */}
      <h1 className="font-fraunces text-[clamp(2.4rem,5.5vw,3.5rem)] font-bold text-primary leading-[1.08] tracking-tight mb-3.5 text-balance">
        {path.title}
      </h1>
      <p className="text-[17px] text-secondary max-w-[52ch] leading-relaxed mb-10">
        {path.description}
      </p>

      {/* Journey milestone bar */}
      <div className="mb-9" role="img" aria-label={`Journey: ${path.modules.length} modules from ${path.modules[0]?.title} to ${path.modules[path.modules.length - 1]?.title}`}>
        <div className="relative flex items-start px-3.5">
          {/* Background line */}
          <div className="absolute top-[14px] left-[28px] right-[28px] h-[1.5px] bg-border z-0" />

          {/* Accent line — animates to show start */}
          <motion.div
            className="absolute top-[14px] left-[28px] right-[28px] h-[1.5px] bg-accent z-0 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.04 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />

          {/* Nodes */}
          {path.modules.map((module, i) => {
            const isFirst = i === 0
            const isLast = i === path.modules.length - 1
            return (
              <motion.div
                key={module.id}
                className="flex-1 flex flex-col items-center gap-1.5 relative z-10 min-w-0"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 + 0.3 }}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0 transition-colors ${
                    isFirst
                      ? 'bg-accent border-accent text-white shadow-[0_0_0_4px_var(--color-accent-soft)]'
                      : isLast
                      ? 'bg-success border-success text-white'
                      : 'bg-surface border-[1.5px] border-border text-secondary'
                  }`}
                >
                  {isLast ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    module.id
                  )}
                </div>
                <span
                  className={`text-[9.5px] text-center max-w-[64px] leading-tight overflow-hidden whitespace-nowrap text-ellipsis ${
                    isFirst ? 'text-accent font-semibold' : isLast ? 'text-success font-semibold' : 'text-secondary'
                  }`}
                >
                  {NODE_LABELS[module.id] ?? module.title}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-3.5 px-3.5 flex-wrap">
          {[
            { color: 'bg-accent', label: 'You are here' },
            { color: 'bg-border', label: 'Upcoming' },
            { color: 'bg-success', label: 'Destination' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[11px] text-secondary">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Meta line */}
      <p className="text-[13px] text-secondary mb-7 flex flex-wrap items-center gap-2">
        <span>{path.modules.length} modules</span>
        <span className="text-border">·</span>
        <span>{path.lessonCount} topics</span>
        <span className="text-border">·</span>
        <span>{path.lessonCount} hands-on tasks</span>
        <span className="text-border">·</span>
        <span>3–5 hours total</span>
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="#modules"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-deep text-white rounded-[10px] px-6 py-3.5 text-[15px] font-semibold transition-all duration-150 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(201,99,63,0.3)]"
        >
          Start Module 00
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
        <Link
          href="/paths"
          className="inline-flex items-center gap-1.5 bg-transparent hover:bg-surface-subtle text-secondary border border-border rounded-[10px] px-5 py-3.5 text-[14px] font-medium transition-colors duration-150"
        >
          View all paths
        </Link>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/components/paths/path-hero.tsx
git commit -m "feat(paths): add PathHero with animated journey milestone bar"
```

---

## Task 8: Path page — `src/app/paths/[slug]/page.tsx`

**Files:**
- Create: `src/app/paths/[slug]/page.tsx`

Server component. Reads the JSON via `getPathBySlug()`, 404s if not found, generates dynamic metadata from path frontmatter. Two-column layout: `ModuleList` left, `PathSidebar` right. Breadcrumb with `Library > Paths > [title]`.

- [ ] **Step 1: Create `src/app/paths/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPathBySlug, generatePathStaticParams } from '@/lib/mdx'
import { PathHero } from '@/components/paths/path-hero'
import { ModuleList } from '@/components/paths/module-list'
import { PathSidebar } from '@/components/paths/path-sidebar'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return generatePathStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const path = getPathBySlug(slug)
  if (!path) return {}
  return {
    title: `${path.title} — Seekvana`,
    description: path.description,
  }
}

export default async function PathPage({ params }: Props) {
  const { slug } = await params
  const path = getPathBySlug(slug)
  if (!path) notFound()

  const totalTopics = path.modules.reduce((n, m) => n + m.topics.length, 0)

  return (
    <div className="max-w-[1080px] mx-auto px-7">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 pt-7 pb-0 text-[12.5px] text-secondary" aria-label="Breadcrumb">
        <Link href="/paths" className="hover:text-accent transition-colors duration-150">
          Paths
        </Link>
        <span className="text-border">›</span>
        <span className="text-primary font-medium">{path.title}</span>
      </nav>

      {/* Hero */}
      <PathHero path={path} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_276px] gap-14 pb-24">
        <ModuleList modules={path.modules} totalTopics={totalTopics} />
        <PathSidebar path={path} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd d:/seekvana && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd d:/seekvana && git add src/app/paths/[slug]/page.tsx
git commit -m "feat(paths): add dynamic path page with hero, curriculum, and sidebar"
```

---

## Task 9: Visual verification and build

**Files:** none (verification only)

- [ ] **Step 1: Start dev server and open the page**

```bash
cd d:/seekvana && npm run dev
```

Open http://localhost:3000/paths/getting-started in a browser.

Verify:
- Journey bar hero renders with 10 nodes; node `00` has clay fill, node `09` has green fill
- The connecting line animates from left on page load
- Module `00` starts expanded showing all 8 topics
- Topic `00.01` shows the `Article ↗` chip
- Clicking another module opens it (and closes `00`)
- Sidebar is sticky on desktop
- "After this path" shows Master Agentic AI
- Page is responsive: sidebar goes above module list below the `xl` breakpoint

- [ ] **Step 2: Production build**

```bash
cd d:/seekvana && npm run build 2>&1 | tail -30
```

Expected: build completes with no errors. The `/paths/getting-started` route appears in the static pages list.

- [ ] **Step 3: Final commit**

```bash
cd d:/seekvana && git add -A
git commit -m "feat(paths): getting-started path page complete — hero, curriculum, sidebar"
```

---

## Self-Review

**Spec coverage:**
- ✅ Journey milestone bar hero (user-chosen design C)
- ✅ Editorial module list accordion (user-chosen design A)
- ✅ All 10 modules + 101 topics in JSON
- ✅ Topic `00.01` linked to `/library/ai-foundations/what-is-ai`
- ✅ Sticky sidebar with progress + "after this path"
- ✅ `getPathBySlug` utility (server-only)
- ✅ Static generation via `generateStaticParams`
- ✅ Dynamic metadata
- ✅ CSS variable tokens only — no hardcoded hex
- ✅ Framer Motion for journey bar animation only; accordion is pure CSS
- ✅ Responsive breakpoints (xl for sidebar switch)

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `PathTopic`, `PathModule`, `PathData` defined in Task 1, referenced in Tasks 3–8
- `getPathBySlug` defined in Task 1, called in Task 8
- `generatePathStaticParams` defined in Task 1, called in Task 8
- `TopicRow` receives `PathTopic`, exported in Task 3, imported in Task 4
- `ModuleItem` receives `PathModule`, exported in Task 4, imported in Task 5
- `ModuleList` receives `PathModule[]`, exported in Task 5, imported in Task 8
- `PathSidebar` receives `PathData`, exported in Task 6, imported in Task 8
- `PathHero` receives `PathData`, exported in Task 7, imported in Task 8

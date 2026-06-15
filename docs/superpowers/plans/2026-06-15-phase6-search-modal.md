# Phase 6: Search Modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a global keyboard-navigable search modal with grouped results, debounced filtering over static mock data, and all required UX states (empty, searching, results, no-results).

**Architecture:** The modal is self-contained — it owns all query/debounce/results/keyboard-nav state. The existing `SearchContext` (`src/context/search-context.tsx`) already provides `isSearchOpen`, `openSearch`, `closeSearch` and is already wired into the navbar and layout; no changes to it are needed. Mock data lives in a dedicated file so it can later be swapped for Supabase full-text search.

**Tech Stack:** Next.js 15 App Router, TypeScript, Framer Motion (AnimatePresence, motion.div), Lucide React icons, Tailwind CSS design tokens (no hex values).

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/lib/search-types.ts` | `SearchItem` and `SearchResults` interfaces — single source of truth |
| Create | `src/lib/search-data.ts` | 10 articles, 5 paths, 5 glossary terms as a flat `SearchItem[]` |
| Create | `src/components/search/search-modal.tsx` | Full modal: overlay, input, debounce, results, keyboard nav, all states |
| Modify | `src/app/layout.tsx` | Add `<SearchModal />` inside the existing `<SearchProvider>` |
| Modify | `src/components/home/hero.tsx` | Wire hero search bar + chips to call `openSearch()` |

---

## Task 1: Define Search Types

**Files:**
- Create: `src/lib/search-types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// src/lib/search-types.ts
export interface SearchItem {
  id: string
  type: 'article' | 'path' | 'glossary'
  title: string
  excerpt: string
  category: string
  href: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface SearchResults {
  paths: SearchItem[]
  articles: SearchItem[]
  glossary: SearchItem[]
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run from `d:\seekvana`:
```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/search-types.ts
git commit -m "feat: add search type definitions"
```

---

## Task 2: Create Mock Search Data

**Files:**
- Create: `src/lib/search-data.ts`

- [ ] **Step 1: Create the mock data file**

```typescript
// src/lib/search-data.ts
import type { SearchItem } from './search-types'

export const SEARCH_DATA: SearchItem[] = [
  // --- Learning Paths (5) ---
  {
    id: 'path-1',
    type: 'path',
    title: 'AI for Absolute Beginners',
    excerpt: 'Start with zero assumptions. 8 lessons from what AI is to using it daily.',
    category: 'Learning Path',
    href: '/paths/ai-for-beginners',
    difficulty: 'beginner',
  },
  {
    id: 'path-2',
    type: 'path',
    title: 'Master Agentic AI',
    excerpt: 'Go deep on agents, tool use, memory, and planning. 14 lessons.',
    category: 'Learning Path',
    href: '/paths/master-agentic-ai',
    difficulty: 'intermediate',
  },
  {
    id: 'path-3',
    type: 'path',
    title: 'Build Your First AI Agent',
    excerpt: 'Go from one tool call to a working autonomous agent. 10 lessons.',
    category: 'Learning Path',
    href: '/paths/build-first-agent',
    difficulty: 'beginner',
  },
  {
    id: 'path-4',
    type: 'path',
    title: 'Prompt Engineering Essentials',
    excerpt: 'Write prompts that actually work. 6 lessons covering the core techniques.',
    category: 'Learning Path',
    href: '/paths/prompt-engineering',
    difficulty: 'beginner',
  },
  {
    id: 'path-5',
    type: 'path',
    title: 'Beginner to AI Engineer',
    excerpt: 'The full journey from AI basics to shipping production-grade AI apps. 24 lessons.',
    category: 'Learning Path',
    href: '/paths/beginner-to-engineer',
    difficulty: 'advanced',
  },

  // --- Articles (10) ---
  {
    id: 'article-1',
    type: 'article',
    title: 'What is an AI Agent?',
    excerpt: 'The line between a chatbot and an agent comes down to one thing: the ability to take actions.',
    category: 'Agentic AI',
    href: '/library/agentic-ai/what-is-an-agent',
    difficulty: 'beginner',
  },
  {
    id: 'article-2',
    type: 'article',
    title: 'Tool Use: Giving Models Hands',
    excerpt: 'Function calling turns a language model from a talker into a doer. Here is how it works.',
    category: 'Agentic AI',
    href: '/library/agentic-ai/tool-use-explained',
    difficulty: 'intermediate',
  },
  {
    id: 'article-3',
    type: 'article',
    title: 'How LLMs Actually Work',
    excerpt: 'Tokens, attention, and the transformer architecture explained without the jargon.',
    category: 'Large Language Models',
    href: '/library/large-language-models/how-llms-work',
    difficulty: 'beginner',
  },
  {
    id: 'article-4',
    type: 'article',
    title: 'What is AI? A Clear, Honest Explainer',
    excerpt: 'AI is not magic or a robot uprising. Here is what it actually is and why it matters now.',
    category: 'AI Foundations',
    href: '/library/ai-foundations/what-is-ai',
    difficulty: 'beginner',
  },
  {
    id: 'article-5',
    type: 'article',
    title: 'RAG Without the Hype',
    excerpt: 'Retrieval-augmented generation is simple in principle and finicky in practice. A clear guide.',
    category: 'Agentic AI',
    href: '/library/agentic-ai/rag-explained',
    difficulty: 'beginner',
  },
  {
    id: 'article-6',
    type: 'article',
    title: 'Prompt Engineering Fundamentals',
    excerpt: 'The core techniques behind writing prompts that reliably get the output you want.',
    category: 'Building with AI',
    href: '/library/building-with-ai/prompt-engineering',
    difficulty: 'beginner',
  },
  {
    id: 'article-7',
    type: 'article',
    title: 'Memory in AI Agents: Types and Trade-offs',
    excerpt: 'In-context, external, and procedural memory — when to use each and what it costs.',
    category: 'Agentic AI',
    href: '/library/agentic-ai/agent-memory',
    difficulty: 'intermediate',
  },
  {
    id: 'article-8',
    type: 'article',
    title: 'Understanding Embeddings',
    excerpt: 'Embeddings turn words and documents into numbers that capture meaning. Here is the intuition.',
    category: 'Large Language Models',
    href: '/library/large-language-models/embeddings',
    difficulty: 'intermediate',
  },
  {
    id: 'article-9',
    type: 'article',
    title: 'AI Ethics: Key Principles',
    excerpt: 'Fairness, accountability, transparency, and safety — the principles that should guide AI development.',
    category: 'Ethics & Safety',
    href: '/library/ethics-safety/ai-ethics-principles',
    difficulty: 'beginner',
  },
  {
    id: 'article-10',
    type: 'article',
    title: 'Fine-tuning vs Prompting',
    excerpt: 'When to fine-tune a model and when a well-crafted prompt is all you need.',
    category: 'Large Language Models',
    href: '/library/large-language-models/fine-tuning-vs-prompting',
    difficulty: 'intermediate',
  },

  // --- Glossary (5) ---
  {
    id: 'glossary-1',
    type: 'glossary',
    title: 'LLM',
    excerpt: 'Large Language Model — a neural network trained on text to predict and generate language.',
    category: 'Glossary',
    href: '/glossary/llm',
  },
  {
    id: 'glossary-2',
    type: 'glossary',
    title: 'RAG',
    excerpt: 'Retrieval-Augmented Generation — grounding model outputs with retrieved external documents.',
    category: 'Glossary',
    href: '/glossary/rag',
  },
  {
    id: 'glossary-3',
    type: 'glossary',
    title: 'Agent',
    excerpt: 'An AI system that perceives its environment and takes actions to achieve a goal autonomously.',
    category: 'Glossary',
    href: '/glossary/agent',
  },
  {
    id: 'glossary-4',
    type: 'glossary',
    title: 'Embedding',
    excerpt: 'A dense numerical vector that represents the semantic meaning of a piece of text.',
    category: 'Glossary',
    href: '/glossary/embedding',
  },
  {
    id: 'glossary-5',
    type: 'glossary',
    title: 'Fine-tuning',
    excerpt: 'Further training a pre-trained model on a domain-specific dataset to improve task performance.',
    category: 'Glossary',
    href: '/glossary/fine-tuning',
  },
]
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/search-data.ts
git commit -m "feat: add static mock data for search (10 articles, 5 paths, 5 glossary)"
```

---

## Task 3: Build the Search Modal Component

**Files:**
- Create: `src/components/search/search-modal.tsx`

This component is self-contained. It reads `isSearchOpen`/`closeSearch` from context, manages its own query/debounce/results/keyboard-nav state, and renders nothing when the modal is closed.

- [ ] **Step 1: Create the file with the filter utility function**

The filter runs synchronously over `SEARCH_DATA`. Case-insensitive match against `title`, `excerpt`, and `category`. Returns a `SearchResults` object sliced to spec limits (paths ≤ 2, articles ≤ 5, glossary ≤ 3).

```typescript
// src/components/search/search-modal.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import { useSearch } from '@/context/search-context'
import { SEARCH_DATA } from '@/lib/search-data'
import type { SearchItem, SearchResults } from '@/lib/search-types'

function filterData(query: string): SearchResults {
  const q = query.toLowerCase().trim()
  if (!q) return { paths: [], articles: [], glossary: [] }

  const match = (item: SearchItem) =>
    item.title.toLowerCase().includes(q) ||
    item.excerpt.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)

  return {
    paths: SEARCH_DATA.filter((i) => i.type === 'path' && match(i)).slice(0, 2),
    articles: SEARCH_DATA.filter((i) => i.type === 'article' && match(i)).slice(0, 5),
    glossary: SEARCH_DATA.filter((i) => i.type === 'glossary' && match(i)).slice(0, 3),
  }
}
```

- [ ] **Step 2: Add the ResultGroup sub-component below the filter function**

`ResultGroup` renders a labeled group of `SearchItem` rows. Each row highlights when its flat global index matches `selectedIndex`.

```typescript
function ResultGroup({
  label,
  items,
  selectedIndex,
  startIndex,
  onSelect,
}: {
  label: string
  items: SearchItem[]
  selectedIndex: number
  startIndex: number
  onSelect: (href: string) => void
}) {
  return (
    <div className="mb-1">
      <p className="text-secondary text-xs uppercase tracking-wide px-3 py-2">
        {label}
      </p>
      {items.map((item, i) => {
        const globalIdx = startIndex + i
        const isSelected = selectedIndex === globalIdx
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.href)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
              isSelected ? 'bg-accent-soft' : 'hover:bg-surface-subtle'
            }`}
          >
            <span className="shrink-0 bg-accent-soft text-accent text-xs px-2 py-0.5 rounded font-medium mt-0.5">
              {item.category}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-primary text-sm font-medium">{item.title}</p>
              <p className="text-secondary text-xs line-clamp-1 mt-0.5">
                {item.excerpt}
              </p>
            </div>
            <ArrowRight className="text-secondary shrink-0 mt-0.5" size={16} />
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Add the main SearchModal component export below ResultGroup**

```typescript
export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Debounce: show skeleton for 200ms then commit the query
  useEffect(() => {
    if (query) setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  // Reset selection when debounced query changes
  useEffect(() => {
    setSelectedIndex(-1)
  }, [debouncedQuery])

  // Auto-focus input and reset state on open
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('')
      setDebouncedQuery('')
      setSelectedIndex(-1)
      setIsSearching(false)
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isSearchOpen])

  const results = filterData(debouncedQuery)
  const flatItems = [
    ...results.paths,
    ...results.articles,
    ...results.glossary,
  ]
  const totalResults = flatItems.length

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      closeSearch()
    },
    [router, closeSearch],
  )

  const clearQuery = () => {
    setQuery('')
    setDebouncedQuery('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, totalResults - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, -1))
        break
      case 'Enter':
        if (selectedIndex >= 0 && flatItems[selectedIndex]) {
          navigate(flatItems[selectedIndex].href)
        }
        break
      case 'Escape':
        closeSearch()
        break
    }
  }

  const isEmpty = !debouncedQuery.trim() && !isSearching
  const hasResults = !isSearching && totalResults > 0
  const noResults = !isSearching && !isEmpty && totalResults === 0

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 px-4"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto mt-20 bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="text-secondary shrink-0" size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search articles, paths, and topics..."
                className="flex-1 text-lg bg-transparent text-primary placeholder:text-secondary outline-none font-inter"
              />
              {query && (
                <button
                  onClick={clearQuery}
                  className="text-secondary hover:text-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Results body */}
            <div className="max-h-96 overflow-y-auto">
              {/* Empty state: popular search chips */}
              {isEmpty && (
                <div className="p-5">
                  <p className="text-secondary text-xs mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Agentic AI', 'RAG', 'Prompting', 'Fine-tuning', 'LLM'].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="bg-surface-subtle border border-border rounded-full px-3 py-1.5 text-sm text-secondary hover:text-accent hover:border-accent transition-colors"
                        >
                          {term}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {isSearching && (
                <div className="p-5 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3 items-start">
                      <div className="h-5 w-16 bg-surface-subtle rounded shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-subtle rounded w-3/4" />
                        <div className="h-3 bg-surface-subtle rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {noResults && (
                <div className="p-5">
                  <p className="text-primary text-sm mb-1">
                    No results for &quot;{debouncedQuery}&quot;
                  </p>
                  <p className="text-secondary text-xs">
                    Try: agents, RAG, prompting
                  </p>
                </div>
              )}

              {/* Grouped results */}
              {hasResults && (
                <div className="p-2">
                  {results.paths.length > 0 && (
                    <ResultGroup
                      label="Learning Paths"
                      items={results.paths}
                      selectedIndex={selectedIndex}
                      startIndex={0}
                      onSelect={navigate}
                    />
                  )}
                  {results.articles.length > 0 && (
                    <ResultGroup
                      label="Articles"
                      items={results.articles}
                      selectedIndex={selectedIndex}
                      startIndex={results.paths.length}
                      onSelect={navigate}
                    />
                  )}
                  {results.glossary.length > 0 && (
                    <ResultGroup
                      label="Glossary"
                      items={results.glossary}
                      selectedIndex={selectedIndex}
                      startIndex={results.paths.length + results.articles.length}
                      onSelect={navigate}
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: 0 errors. If you see `Module '"framer-motion"' has no exported member 'AnimatePresence'`, framer-motion is already installed (v12.x) — double-check the import is named correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/search/search-modal.tsx
git commit -m "feat: build SearchModal with debounce, grouped results, keyboard nav"
```

---

## Task 4: Wire SearchModal into Layout

**Files:**
- Modify: `src/app/layout.tsx`

The `SearchProvider` is already present. We just need to render `<SearchModal />` inside it so it can read the context.

- [ ] **Step 1: Add the SearchModal import and render it in layout.tsx**

Open `src/app/layout.tsx`. Add the import at the top with other component imports:

```typescript
import { SearchModal } from '@/components/search/search-modal'
```

Inside the JSX, place `<SearchModal />` as a sibling of `{children}`, inside `<SearchProvider>`. The final structure should look like:

```tsx
<SearchProvider>
  <Navbar />
  {children}
  <SearchModal />
</SearchProvider>
```

(The exact surrounding elements may differ — just ensure `<SearchModal />` is a direct child of `<SearchProvider>`, not outside it.)

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 3: Start dev server and manually verify the modal opens**

```bash
npm run dev
```

1. Open http://localhost:3000
2. Click the search icon (magnifying glass) in the navbar
3. Expected: modal animates in with overlay, input auto-focused, popular search chips visible
4. Type "agent" → expected: results appear after ~200ms with "Agentic AI" articles and paths
5. Press `↓` arrow → expected: first result row highlights with `bg-accent-soft`
6. Press `Escape` → expected: modal closes with fade-out animation
7. Click outside the modal panel → expected: modal closes

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire SearchModal into root layout"
```

---

## Task 5: Wire Hero Search Bar

**Files:**
- Modify: `src/components/home/hero.tsx`

The hero has a decorative search input and 4 chip buttons. These should open the search modal rather than doing their own search (the modal is the search UX). The hero input becomes a read-only trigger.

- [ ] **Step 1: Import useSearch in hero.tsx**

At the top of `src/components/home/hero.tsx`, add:

```typescript
import { useSearch } from '@/context/search-context'
```

At the top of the component function, destructure:

```typescript
const { openSearch } = useSearch()
```

- [ ] **Step 2: Wire the hero search input to open the modal**

Find the hero search `<input>` element. Replace it with a `<button>` styled as an input so it's semantically correct (it doesn't accept typed input — it triggers the modal):

```tsx
<button
  onClick={openSearch}
  className="flex-1 text-left text-secondary bg-transparent outline-none cursor-text"
  aria-label="Open search"
>
  What do you want to understand?
</button>
```

The parent container (the div wrapping the search icon + input) should also call `openSearch` on click, or just leave the button inside it. Keep the `Search` icon and surrounding styles unchanged.

- [ ] **Step 3: Wire the chip buttons to open the modal**

Find the 4 chip buttons below the search bar ("Agentic AI", "RAG", "Prompting", "Evals"). Add `onClick={openSearch}` to each:

```tsx
{['Agentic AI', 'RAG', 'Prompting', 'Evals'].map((chip) => (
  <button
    key={chip}
    onClick={openSearch}
    className="bg-surface-subtle border border-border rounded-full text-sm text-secondary hover:text-accent hover:border-accent transition px-3 py-1"
  >
    {chip}
  </button>
))}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 5: Manual verification**

With `npm run dev` running:
1. Visit http://localhost:3000
2. Click anywhere on the hero search bar → modal should open
3. Click any chip ("RAG", "Prompting", etc.) → modal should open (user can type in it)
4. Confirm no regression: homepage still renders correctly, navbar search icon still works

- [ ] **Step 6: Commit**

```bash
git add src/components/home/hero.tsx
git commit -m "feat: wire hero search bar and chips to open search modal"
```

---

## Task 6: Build Verification

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: build completes with 0 errors and 0 TypeScript errors. The output should show the search modal page is included in the bundle.

- [ ] **Step 2: Fix any build errors**

Common issues to watch for:
- `'use client'` missing on any component that uses hooks (`useSearch`, `useState`, `useEffect`, `useRouter`) — add `'use client'` at the top of the file
- `AnimatePresence` or `motion` import issues — verify framer-motion is in `package.json` dependencies
- `useRouter` from `next/navigation` (App Router) not `next/router` (Pages Router) — check the import path

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: Phase 6 complete — global search modal with keyboard nav and mock data"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Full-screen overlay with `bg-black/50 backdrop-blur-sm z-50` ✓
- [x] Framer Motion animate in/out: opacity 0→1, scale 0.97→1, duration 200ms ✓
- [x] Close on Escape key ✓
- [x] Close on backdrop click ✓
- [x] Inner panel: `max-w-2xl mx-auto mt-20 bg-surface rounded-2xl border shadow-2xl` ✓
- [x] Large input with Search icon left, Clear × button right when text exists ✓
- [x] Auto-focused on open ✓
- [x] Debounced 200ms ✓
- [x] Grouped results: Learning Paths (max 2), Articles (max 5), Glossary (max 3) ✓
- [x] Group label: uppercase text-secondary text-xs ✓
- [x] Result row: category badge + title + excerpt (line-clamp-1) + arrow icon ✓
- [x] Keyboard nav: up/down arrows, Enter navigates, Escape closes ✓
- [x] Selected row: `bg-accent-soft` ✓
- [x] Empty state: popular search chips (Agentic AI, RAG, Prompting, Fine-tuning, LLM) ✓
- [x] Loading state: pulse skeleton rows ✓
- [x] No-results state: message + suggestions ✓
- [x] 10 articles, 5 paths, 5 glossary terms — all real AI topics ✓
- [x] Navbar search icon already wired (`openSearch()` in Task 4/layout) ✓
- [x] Hero search bar wired (Task 5) ✓

**No placeholders:** All steps contain complete code. No TBDs.

**Type consistency:** `SearchItem`/`SearchResults` defined in Task 1, imported in Task 2 and Task 3. `startIndex` prop on `ResultGroup` matches usage in Task 3. `useSearch` returns `{ isSearchOpen, openSearch, closeSearch }` — matches existing `search-context.tsx`.

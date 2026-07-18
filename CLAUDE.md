# Seekvana

AI learning website (seekvana.com) — freeCodeCamp-style for AI topics. Full specs and phase prompts: @SEEKVANA-BUILD-GUIDE.md

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # ALWAYS run this before reporting a phase complete
npm run lint     # ESLint
```

## Non-obvious rules

**Never hardcode hex values.** Use CSS variable tokens only (`bg-canvas`, `text-accent`, `bg-surface-subtle`, etc.). The full token list is in globals.css after Phase 2.

**Fonts are assigned by role** — not by taste:
- Headings (h1–h4): `font-fraunces`
- Body, UI, labels: `font-inter`
- Code blocks: `font-mono`

**Always `next/image`**, never `<img>`.

**Always Tailwind classes**, never inline styles.

**Article pages have a fixed 3-column layout**: left pillar sidebar + center content + right TOC. Never collapse or remove columns — only hide them at breakpoints.

**MDX client components must use only named string props — no children, no arrays, no numbers.** `next-mdx-remote/rsc` silently drops everything except string props when serializing across the RSC boundary. Works fine in dev, breaks in production builds. Rules:
- Arrays → delimited string: `options="A|||B|||C"` (split on `|||` in component)
- Numbers → string: `correct="1"` (parseInt in component)
- Children → named prop: `<Mermaid chart="graph LR ..." />` not `<Mermaid>{...}</Mermaid>`

**Cache Components (PPR) is ON sitewide (`cacheComponents: true`).** It is not per-route — one non-compliant route **breaks the whole build**. Every new route must keep its shell static and isolate dynamic work, so it builds as `◐` Partial Prerender, not `ƒ Dynamic`. Rules:
- **Page/layout body = static shell only.** Never call `createClient` (from `@/lib/supabase-server`), `await cookies()`, `headers()`, or `auth.getUser()` directly in `page.tsx`/`layout.tsx`. Put cookie/auth/personalized DB reads in an async **island** component wrapped in `<Suspense fallback={<Skeleton/>}>`. Pattern: `src/lib/profile-data.ts`, `src/lib/article-data.ts`, `src/components/profile/*-island.tsx`.
- **Don't read `params`/`searchParams` outside a Suspense boundary** — access them inside a Suspense'd child (see `src/app/u/[username]/page.tsx`).
- **Shared/public/non-personalized data:** cache with `'use cache'` + `cacheLife()` + `cacheTag()`, cookie-free anon client. No cookies/headers/params/`Math.random`/`Date.now`/`new Date()` inside a `use cache` function. Invalidate on writes with `revalidateTag`/`updateTag` if freshness matters.
- **Layout-tree client components using `usePathname`/`useSearchParams`** must be wrapped in `<Suspense>`.
- **No `Math.random()`/`Date.now()` in prerendered client-component render** — use `useId()` for ids.
- **Zero-CLS skeletons:** fallback must match the island footprint (inner-only if the page shell provides the wrapper).
- Flag-on local build of ~200+ pages OOMs at default heap — build with `NODE_OPTIONS=--max-old-space-size=8192` (Vercel unaffected).

## MDX frontmatter (exact format required)

```yaml
---
title: "Article Title"
description: "One sentence."
pillar: "agentic-ai"
slug: "article-slug"
difficulty: "beginner"        # beginner | intermediate | advanced
readTime: 8
author: "Seekvana"
publishedAt: "2026-01-15"
tags: ["agents"]
featured: false
---
```

**Images: cover has no caption; all inline images must have one.**
- Cover image: `<ArticleImage src="..." alt="..." />` — no `caption` prop
- Every other `<ArticleImage>`: must include `caption="One sentence describing what it shows."` — no exceptions

**Tables must always have a bold title on the line above them.**
```mdx
**Table title here**

| Col 1 | Col 2 |
|---|---|
```
Never leave a table untitled.

## Ad slots (article pages)

Three fixed-size placeholders — dimensions must never change (prevents layout shift):
- In-content: 300×250, after 3rd paragraph
- Right sidebar: 300×250, sticky
- Footer banner: 728×90

Placeholder style: `dashed border border-border bg-surface-subtle`, label "Advertisement" in `text-secondary text-xs`.

## Workflow

Work one phase at a time. After each phase run `npm run build` and fix all errors before saying done. Never add scope beyond what the current phase asks for.

## Superpowers skills (active globally)

Superpowers v5.1.0 is installed. Skills auto-trigger — use the `Skill` tool before starting any task:

| Task type | Skill to invoke first |
|---|---|
| New feature / new phase | `brainstorming` → `writing-plans` |
| Executing a written plan | `subagent-driven-development` or `executing-plans` |
| Any bug or test failure | `systematic-debugging` |
| Before calling a phase done | `verification-before-completion` |
| Code review | `requesting-code-review` |
| TDD implementation | `test-driven-development` |

# Seekvana — Complete Cursor + Claude Code Build Guide

> HOW TO USE THIS FILE:
> 1. Save this file inside your seekvana project folder once created
> 2. At the start of EVERY Cursor Composer session, say:
>    "Read the file SEEKVANA-BUILD-GUIDE.md in this project for full context before doing anything."
> 3. Then paste the relevant phase prompt. Claude Code will have full context every time.
> 4. Work Phase by Phase. Never skip ahead.

---

## ═══════════════════════════════════════
## PROJECT CONTEXT — READ THIS FIRST
## ═══════════════════════════════════════

### What is Seekvana?

Seekvana (seekvana.com) is a free AI learning website that teaches Agentic AI and all things AI to everyone — complete beginners through advanced developers. It is a content-rich, SEO-focused platform modelled on the freeCodeCamp / W3Schools / MDN playbook: free content, monetized through display ads (Google AdSense → Mediavine) and affiliate recommendations of AI tools.

The site will scale to 200+ pages organized as a hybrid of:
- **Guided learning paths** (structured beginner → advanced journeys)
- **Searchable wiki/library** (standalone pages people land on from Google)

### Brand personality

Warm and approachable as the base, with a premium authoritative edge.
Think: the warmth and whitespace of Notion, crossed with the editorial polish of a quality publication.
NOT cold, neon, sci-fi, or "AI lab" aesthetic.
The name comes from "seek" (curiosity, finding answers) + "-vana" (calm, premium ending).
Tagline: "Learn AI, clearly."

### Target audience

Everyone — complete beginners (no code), students and career-switchers, developers and technical builders, business and product professionals. Content should be accessible to a non-technical beginner while having depth for advanced readers.

### Monetization plan

- Display ads (AdSense initially, Mediavine/Raptive once traffic thresholds are met)
- Affiliate recommendations woven into "best tools" and comparison pages
- Possibly paid courses/memberships later — not in initial build

---

## ═══════════════════════════════════════
## DESIGN SYSTEM — THE SINGLE SOURCE OF TRUTH
## ═══════════════════════════════════════

> Every component, every page, every prompt must follow this exactly.
> Never use hardcoded hex values in components — always use the CSS variable tokens below.

### Color tokens

#### Light theme (:root)
```
--color-canvas:        #FAF8F3   ← warm cream — page background
--color-surface:       #FFFFFF   ← cards, panels, navbar
--color-surface-subtle:#F4F1EA   ← alternating sections, code bg
--color-border:        #E6E1D7   ← all dividers and card borders
--color-text-primary:  #1C1B19   ← all headings and body text
--color-text-secondary:#6F6B62   ← captions, meta, muted labels
--color-accent:        #C9633F   ← clay — primary CTA, links, active states
--color-accent-deep:   #A84E2E   ← hover and pressed states for accent
--color-accent-soft:   #F6E4DB   ← tip/callout box backgrounds, highlights
--color-info:          #2F7D6B   ← info/note callout accent (teal)
--color-success:       #4E8A5B   ← success states
```

#### Dark theme (.dark)
```
--color-canvas:        #181712   ← warm near-black — page background
--color-surface:       #211F1A   ← cards, panels, navbar
--color-surface-subtle:#2A2823   ← alternating sections, code bg
--color-border:        #38352E   ← all dividers and card borders
--color-text-primary:  #EFEBE1   ← all headings and body text
--color-text-secondary:#A39E92   ← captions, meta, muted labels
--color-accent:        #E0875F   ← clay lightened for dark bg contrast
--color-accent-deep:   #C96B45   ← hover and pressed states
--color-accent-soft:   #3A2A22   ← tip/callout box backgrounds
--color-info:          #5FB39B   ← info/note callout accent (teal)
--color-success:       #6BA876   ← success states
```

### Tailwind class mapping
These custom classes must be in tailwind.config.ts:
```
bg-canvas        → var(--color-canvas)
bg-surface       → var(--color-surface)
bg-surface-subtle→ var(--color-surface-subtle)
border-border    → var(--color-border)
text-primary     → var(--color-text-primary)
text-secondary   → var(--color-text-secondary)
bg-accent        → var(--color-accent)
text-accent      → var(--color-accent)
bg-accent-soft   → var(--color-accent-soft)
bg-info          → var(--color-info)
```

### Typography

| Use | Font | Weights | Notes |
|---|---|---|---|
| All headings (h1–h4) | **Fraunces** | 400, 500, 600 | Warm serif, editorial feel |
| Body, UI, labels | **Inter** | 400, 500, 600 | Clean, most readable sans |
| Code blocks | **JetBrains Mono** | 400, 500 | All code snippets |

Type scale:
- h1: 40px desktop / 30px mobile, Fraunces 500
- h2: 30px, Fraunces 500
- h3: 22px, Fraunces 500
- Body: 17px, Inter 400, line-height 1.75, max ~68ch per line
- Small/meta: 14px, Inter 400
- Code: 15px, JetBrains Mono

### Logo
A small compass/aperture SVG icon in clay (#C9633F) — a simple geometric arc suggesting discovery and light — paired with the wordmark "Seekvana" in Fraunces medium. Can be simplified to just the wordmark at small sizes.

### Motion & animation rules
- Theme toggle: smooth crossfade ~200ms
- Page section fade-ins: staggered slide-up on scroll enter, ~300ms, ease-out
- Card hovers: subtle lift (translateY -2px, shadow), ~150ms
- Dropdowns: fade + slide-down, ~150ms
- Reading progress bar: Framer Motion width animation
- Always respect prefers-reduced-motion
- Never use animations just for decoration — only where they aid UX

### Component style rules
- Rounded corners: rounded-xl for cards, rounded-lg for buttons and inputs
- Card shadows: none by default, subtle on hover only
- Borders: always 1px, color-border
- Buttons: primary = bg-accent text-white; secondary = border border-border text-primary bg-transparent; ghost = no border text-accent
- Callout boxes: Tip (bg-accent-soft, left border accent), Note (bg-info/10, left border info), Warning (bg-amber-50 dark:bg-amber-950, left border amber)
- Ad slots: dashed border, bg-surface-subtle, labeled "Advertisement" in text-secondary text-xs — blend in without causing layout shift

---

## ═══════════════════════════════════════
## INFORMATION ARCHITECTURE
## ═══════════════════════════════════════

### URL structure
```
/                          ← Homepage
/library                   ← All 9 pillars overview
/library/[pillar]          ← Pillar category page (e.g. /library/agentic-ai)
/library/[pillar]/[slug]   ← Individual article page
/paths                     ← All learning paths
/paths/[slug]              ← Individual learning path
/tools                     ← AI tools comparisons
/tools/[slug]              ← Individual tool review/comparison
/glossary                  ← Glossary index
/glossary/[term]           ← Individual glossary entry
```

### The 9 content pillars
```
1. ai-foundations          AI Foundations
2. large-language-models   Large Language Models
3. agentic-ai              Agentic AI  ← FLAGSHIP — deepest content
4. building-with-ai        Building with AI
5. ai-tools                AI Tools & Comparisons  ← affiliate revenue lives here
6. use-cases               Use Cases & Workflows
7. concepts-theory         Concepts & Theory
8. ethics-safety           Ethics, Safety & Governance
9. careers                 Careers & Learning
```

### The 5 learning paths
```
1. ai-for-beginners        AI for Absolute Beginners (8 lessons, Beginner)
2. master-agentic-ai       Master Agentic AI (14 lessons, Intermediate) ← flagship
3. build-first-agent       Build Your First AI Agent (10 lessons, Beginner-Intermediate)
4. prompt-engineering      Prompt Engineering Essentials (6 lessons, Beginner)
5. beginner-to-engineer    Beginner to AI Engineer (24 lessons, Advanced)
```

### Page types (reusable templates)
- Explainer/concept article
- Step-by-step tutorial (with code)
- Glossary/reference entry
- Tool review & comparison (with affiliate links)
- Learning path overview
- Cheat sheet
- FAQ page

---

## ═══════════════════════════════════════
## TECH STACK
## ═══════════════════════════════════════

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 15 App Router | SEO, fast static pages, scales to 200+ articles |
| Language | TypeScript | Fewer bugs, better Claude Code suggestions |
| Styling | Tailwind CSS + shadcn/ui | Design system components, fully customizable |
| Animations | Framer Motion | Theme toggle, fade-ins, progress bar, hovers |
| Dark mode | next-themes | System-aware, class-based, zero flash |
| Database | Supabase (PostgreSQL) | Search index, newsletter, future user features |
| Deployment | Vercel | Free tier, one-click deploy, auto previews |
| Content | MDX files | Write articles as .mdx, no database needed |
| Fonts | next/font/google | Zero layout shift, self-hosted automatically |
| Icons | Lucide React | Clean, consistent, tree-shakeable |
| Security | Helmet.js + CSP headers | Secure by default |

---

## ═══════════════════════════════════════
## SEO REQUIREMENTS (baked into every page)
## ═══════════════════════════════════════

Every page must have:
- One h1 (the article/page title)
- Logical h2/h3 hierarchy
- Meta title and description (dynamic from frontmatter)
- Breadcrumbs with schema markup
- Table of contents (for articles)
- Internal links to related articles and the parent pillar
- Reading time displayed
- Author and publish date
- Article schema (JSON-LD) on article pages
- Open Graph tags (og:title, og:description, og:image)
- Canonical URL
- Fast load — lazy images, variable fonts, no layout shift

The MDX frontmatter standard for every article:
```yaml
---
title: "What is an AI Agent?"
description: "A clear explanation of what makes an AI agent agentic, with examples."
pillar: "agentic-ai"
slug: "what-is-an-agent"
difficulty: "beginner"        # beginner | intermediate | advanced
readTime: 8                   # minutes
author: "Seekvana"
publishedAt: "2026-01-15"
tags: ["agents", "agentic AI", "AI basics"]
featured: false
---
```

---

## ═══════════════════════════════════════
## MONETIZATION — AD SLOT SPECS
## ═══════════════════════════════════════

Reserve these slots on every article page (use placeholder divs for now, real ads later):
- **In-content rectangle**: 336×280 or 300×250, after 3rd paragraph, centered
- **Right sidebar**: 300×250, sticky beside article content on desktop
- **Footer banner**: 728×90 leaderboard, above footer on desktop

All ad slots must:
- Have fixed dimensions so there is zero layout shift
- Show a dashed border placeholder labeled "Advertisement" in text-secondary
- Be clearly separated from editorial content
- Never overlap or cover content on any screen size

---

## ═══════════════════════════════════════
## PHASE 1 — PROJECT SETUP
## ═══════════════════════════════════════

> Do these terminal steps yourself — no Composer needed for Phase 1.

### Pre-flight checklist (one time)
- [ ] supabase.com account created, project named `seekvana` created
- [ ] vercel.com account created (use GitHub login)
- [ ] GitHub account exists
- [ ] `node --version` shows v18 or higher

### Terminal commands — run in order

**Step 1 — Create project**
```bash
cd Desktop
npx create-next-app@latest seekvana --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
When asked: Turbopack → Yes. All others → Enter.

**Step 2 — Enter project and install dependencies**
```bash
cd seekvana
npm install @supabase/supabase-js @supabase/ssr framer-motion next-themes lucide-react
npx shadcn@latest init
```
shadcn answers: Style → Default, Base color → Neutral, CSS variables → Yes

**Step 3 — Install shadcn components**
```bash
npx shadcn@latest add button card badge input separator sheet navigation-menu dropdown-menu scroll-area tabs tooltip
```

**Step 4 — Create .env.local**
Create file `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=get_this_from_supabase_dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=get_this_from_supabase_dashboard
```
Get values: supabase.com → your project → Settings → API

**Step 5 — Open in Cursor and test**
```bash
cursor .
npm run dev
```
Visit http://localhost:3000 — default Next.js page should appear. ✅

**Step 6 — Save this guide file into the project**
Copy this entire file into your project root as `SEEKVANA-BUILD-GUIDE.md`
Now Claude Code can read it as context in every session.

---

## ═══════════════════════════════════════
## PHASE 2 — DESIGN SYSTEM
## ═══════════════════════════════════════

Open Cursor Composer (Ctrl+I / Cmd+I) and paste:

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Set up the complete Seekvana design system. This is the foundation — every other component depends on it being correct.

TASK 1 — Supabase client
Create src/lib/supabase.ts:
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

TASK 2 — Google Fonts
In src/app/layout.tsx, import and configure using next/font/google:
- Fraunces: subsets ['latin'], weights ['400','500','600'], variable '--font-fraunces'
- Inter: subsets ['latin'], weights ['400','500','600'], variable '--font-inter'
- JetBrains_Mono: subsets ['latin'], weights ['400','500'], variable '--font-mono'
Apply all three as className on the <html> element.

TASK 3 — Color tokens in globals.css
Replace src/app/globals.css entirely with:
- Tailwind base/components/utilities directives
- :root with ALL light theme tokens from the design system in this guide
- .dark with ALL dark theme tokens from the design system in this guide
- Base styles: body uses bg-canvas, text-primary, font-inter, antialiased
- Heading styles: h1-h4 use font-fraunces
- Code styles: code and pre use font-mono

TASK 4 — Tailwind config
Update tailwind.config.ts to add ALL color tokens as custom Tailwind colors mapped to CSS variables (canvas, surface, surface-subtle, border, accent, accent-deep, accent-soft, info) and add fontFamily entries for fraunces, inter, and mono mapped to the CSS variables.

TASK 5 — Dark mode + ThemeProvider
Create src/components/providers/theme-provider.tsx wrapping next-themes ThemeProvider with attribute="class" defaultTheme="system" enableSystem.
Create src/components/ui/theme-toggle.tsx — a button that cycles light/dark with animated sun/moon icons using Framer Motion (rotate + scale transition, duration 0.2s).

TASK 6 — Root layout
Update src/app/layout.tsx to:
- Apply the three font variables to <html>
- Wrap everything in ThemeProvider
- Set metadata: title "Seekvana — Learn AI, clearly", description "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders."
- Apply bg-canvas min-h-screen to <body>

After completing, confirm with: npm run dev — warm cream background should appear at localhost:3000.
```

---

## ═══════════════════════════════════════
## PHASE 3 — NAVIGATION
## ═══════════════════════════════════════

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Build the Seekvana top navigation bar at src/components/layout/navbar.tsx.

SPECS:
- Sticky top-0 z-50, full width, height 56px
- Background: bg-surface/90 with backdrop-blur-sm
- Bottom border: border-b border-border, only visible after scrolling (use Framer Motion useScroll)
- Smooth transition on scroll with Framer Motion

LEFT — Logo
An inline SVG compass/aperture mark (simple geometric arc, ~20×20px, fill color-accent) followed by the wordmark "Seekvana" in font-fraunces font-medium text-lg text-primary. Wrap in a Next.js Link to "/".

CENTER — Desktop nav links (hidden on mobile)
- Home → /
- Learning Paths → dropdown (see below)
- Library → dropdown (see below)  
- Tools → /tools

Learning Paths dropdown items:
  AI for Beginners → /paths/ai-for-beginners
  Master Agentic AI → /paths/master-agentic-ai
  Build Your First Agent → /paths/build-first-agent
  Prompt Engineering → /paths/prompt-engineering
  Beginner to AI Engineer → /paths/beginner-to-engineer

Library dropdown — show 9 pillars in a 2-column mega-menu:
  AI Foundations → /library/ai-foundations
  Large Language Models → /library/large-language-models
  Agentic AI → /library/agentic-ai  ← show with accent color (flagship)
  Building with AI → /library/building-with-ai
  AI Tools & Comparisons → /library/ai-tools
  Use Cases → /library/use-cases
  Concepts & Theory → /library/concepts-theory
  Ethics & Safety → /library/ethics-safety
  Careers → /library/careers

Dropdowns: animate open/close with Framer Motion (opacity 0→1, y 4→0, duration 150ms). Use shadcn NavigationMenu as base.

RIGHT — Actions
- Search button (magnifying glass icon) — clicking triggers a search modal state (emit via a Zustand or Context state, we'll build the modal in Phase 6)
- ThemeToggle component
- "Get started" button → /paths/ai-for-beginners (bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent-deep transition)

MOBILE — below md breakpoint:
- Hide center nav
- Show hamburger menu icon (Lucide Menu icon)
- Opens a shadcn Sheet from the left with all nav links listed vertically
- Sheet has the logo at top, all links, and the Get started button at bottom

Add Navbar to src/app/layout.tsx so it appears on every page.
Use CSS variables for all colors. TypeScript throughout.
```

---

## ═══════════════════════════════════════
## PHASE 4 — HOMEPAGE
## ═══════════════════════════════════════

### Prompt 4a — Hero + paths

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Build two homepage sections:

SECTION 1 — Hero (src/components/home/hero.tsx)
Full-width, bg-canvas, generous padding py-24 md:py-32, centered content, max-w-3xl mx-auto.

Elements (top to bottom, staggered Framer Motion fade-up on mount):
1. Pill badge: "218 articles · 9 learning paths" — bg-accent-soft text-accent text-sm rounded-full px-4 py-1
2. H1: "Learn AI, clearly — from zero to agentic" — font-fraunces text-5xl md:text-6xl font-medium text-primary leading-tight
3. Subheading: "From your first prompt to production-grade agents — clear, well-sourced writing for beginners and builders alike." — Inter text-lg text-secondary max-w-xl mx-auto
4. Search bar: max-w-lg w-full mx-auto, rounded-xl border border-border bg-surface px-4 py-3, Lucide Search icon left, placeholder "What do you want to understand?", on focus ring-2 ring-accent/30. Below it: 4 chip buttons — "Agentic AI" "RAG" "Prompting" "Evals" — bg-surface-subtle border border-border rounded-full text-sm text-secondary hover:text-accent hover:border-accent transition
5. Two CTA buttons side by side: 
   - "Start Learning →" bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent-deep
   - "Explore Topics" border border-border text-primary rounded-lg px-6 py-3 font-medium hover:bg-surface-subtle

SECTION 2 — Learning paths (src/components/home/learning-paths.tsx)
Section header: "Learning paths" in font-fraunces text-2xl text-primary, with "View all →" link right-aligned in text-accent.
Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop, gap-6.

5 path cards (bg-surface rounded-xl border border-border overflow-hidden, hover: -translate-y-1 shadow-md transition Framer Motion):
- Top color strip (h-2): path 1=clay, 2=teal (#2F7D6B), 3=green (#4E8A5B), 4=amber (#B45309), 5=purple (#7C3AED)
- Card body px-6 py-5:
  - Difficulty badge: Beginner=green, Intermediate=amber, Advanced=red — small rounded pill
  - Title in font-fraunces text-lg text-primary
  - Description in Inter text-sm text-secondary mt-1
  - Bottom row: lesson count text-xs text-secondary | "Start path →" text-accent text-sm font-medium

Path data:
1. "AI for Absolute Beginners" — "Start with zero assumptions." — Beginner — 8 lessons — /paths/ai-for-beginners
2. "Master Agentic AI" — "Go deep on agents, tool use, memory, and planning." — Intermediate — 14 lessons — /paths/master-agentic-ai
3. "Build Your First AI Agent" — "Go from one tool call to a working autonomous agent." — Beginner — 10 lessons — /paths/build-first-agent
4. "Prompt Engineering Essentials" — "Write prompts that actually work." — Beginner — 6 lessons — /paths/prompt-engineering
5. "Beginner to AI Engineer" — "The full journey from AI basics to shipping apps." — Advanced — 24 lessons — /paths/beginner-to-engineer
```

### Prompt 4b — Pillars + articles + footer + page assembly

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Build three more sections and assemble the homepage:

SECTION 3 — Topic pillars (src/components/home/pillars.tsx)
Section header: "Everything AI, in one place" font-fraunces text-2xl.
3×3 grid (2 col mobile, 3 col desktop), gap-4.

9 pillar cards (bg-surface rounded-xl border border-border p-5 hover:-translate-y-1 transition):
- Lucide icon (24px, text-accent)
- Title font-fraunces text-base text-primary mt-3
- One-line description Inter text-sm text-secondary mt-1
- "Explore →" text-accent text-xs mt-3

Pillars with icons and descriptions:
1. AI Foundations — Brain icon — "What AI is, how it works, and why it matters"
2. Large Language Models — MessageSquare — "Tokens, context, RAG, fine-tuning, and how LLMs think"
3. Agentic AI — Bot icon — "Agents, tool use, memory, planning, multi-agent systems" ← border-accent border-2
4. Building with AI — Code2 — "APIs, SDKs, evals, deployment, and cost management"
5. AI Tools — Wrench — "Reviews and comparisons of the best AI tools"
6. Use Cases — Briefcase — "Real workflows: writing, coding, research, automation"
7. Concepts & Theory — FlaskConical — "Transformers, embeddings, RL — the mechanics under the hood"
8. Ethics & Safety — Shield — "Responsible AI, alignment, risks, and governance"
9. Careers — GraduationCap — "How to learn AI, roles, and building your portfolio"

SECTION 4 — Recent articles (src/components/home/recent-articles.tsx)
Section header: "Fresh from the library" with filter tabs: All · Agentic AI · RAG · Prompting · Fine-tuning (shadcn Tabs, active tab has text-accent border-b-2 border-accent)

3 article cards in a 3-col grid (1 col mobile):
Card structure: rounded-xl border border-border overflow-hidden bg-surface hover:-translate-y-1 transition
- Top image area h-40 (use bg-accent-soft for card 1, bg-info/20 for card 2, bg-surface-subtle for card 3 — placeholder until real images)
- Body p-5:
  - Two badges: category (bg-accent-soft text-accent) + difficulty (bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200)
  - Title font-fraunces text-base text-primary mt-2
  - Excerpt Inter text-sm text-secondary mt-1 line-clamp-2
  - Author + read time text-xs text-secondary mt-3 flex justify-between

Sample data:
1. "What makes an AI agent actually agentic?" — Agentic AI · Beginner · 8 min · "The line between a chatbot and an agent comes down to one thing..."
2. "Tool use: giving models hands, not just a mouth" — Agentic AI · Intermediate · 12 min · "Function calling turns a language model from a talker into a doer..."
3. "RAG without the hype: retrieval that actually helps" — RAG · Beginner · 10 min · "Retrieval-augmented generation is simple in principle and finicky in practice..."

SECTION 5 — Footer (src/components/layout/footer.tsx)
bg-surface-subtle border-t border-border, py-16.
4-column grid (2 col mobile, 4 col desktop):
- Col 1: Logo + tagline "Learn AI, clearly." + "© 2026 Seekvana"
- Col 2: Learn — AI for Beginners, Master Agentic AI, Build Your First Agent, All Paths
- Col 3: Library — AI Foundations, Agentic AI, LLMs, Building with AI, All Topics
- Col 4: Tools — AI Tool Reviews, Best AI Coding Tools, Best LLM APIs, Comparisons
Bottom bar: Privacy Policy · Terms of Use · Contact

ASSEMBLY — src/app/page.tsx
Import and render in order: Hero, LearningPaths, Pillars, RecentArticles, Footer.
```

---

## ═══════════════════════════════════════
## PHASE 5 — ARTICLE PAGE (most important)
## ═══════════════════════════════════════

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Build the article page layout. This is the most critical page — most reader time is spent here.

FILE: src/app/library/[pillar]/[slug]/page.tsx

LAYOUT — 3 columns on desktop, single column on mobile:

LEFT SIDEBAR (w-64, sticky top-16, hidden below lg):
- "← Library" back link text-accent text-sm
- Current pillar name font-fraunces text-base text-primary mb-4
- Scrollable list of articles in this pillar (mock data for now)
- Active article highlighted with bg-accent-soft text-accent rounded-lg
- On mobile: becomes a shadcn Sheet drawer triggered by a "Contents" button

CENTER COLUMN (flex-1 max-w-2xl mx-auto px-4 md:px-8):
Reading progress bar: fixed top-0 left-0 h-1 bg-accent, width driven by Framer Motion useScroll (scaleX from 0 to 1, transformOrigin left).

Breadcrumbs: Library → [Pillar] → [Article title] — Inter text-sm text-secondary, separator "/"

Article header:
- Two badges: pillar category (bg-accent-soft text-accent) + difficulty
- H1 font-fraunces text-4xl text-primary mt-4 leading-tight
- Intro paragraph Inter text-lg text-secondary mt-2
- Meta row: author · date · read time — Inter text-sm text-secondary mt-4 flex gap-4

Article body — style all MDX elements:
- h2: font-fraunces text-2xl text-primary mt-10 mb-4
- h3: font-fraunces text-xl text-primary mt-8 mb-3
- p: Inter text-base md:text-lg text-primary leading-relaxed mb-6 max-w-prose
- a: text-accent underline underline-offset-2 hover:text-accent-deep
- strong: font-semibold text-primary
- Callout boxes:
  * Tip: bg-accent-soft border-l-4 border-accent rounded-r-lg p-4 my-6 — with Lucide Lightbulb icon
  * Note: bg-info/10 border-l-4 border-info rounded-r-lg p-4 my-6 — with Lucide Info icon
  * Warning: bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-lg p-4 my-6 — with Lucide AlertTriangle icon
- Code blocks: bg-surface-subtle border border-border rounded-xl p-4 my-6 overflow-x-auto font-mono text-sm — with a Copy button top-right (Lucide Copy icon, copies to clipboard, shows "Copied!" for 2s)
- Inline code: bg-surface-subtle border border-border rounded px-1.5 py-0.5 font-mono text-sm
- Blockquote: border-l-4 border-border pl-4 italic text-secondary my-6
- Table: full-width, border-collapse, thead bg-surface-subtle, alternating row stripes, all cells border-border px-4 py-2
- img: rounded-xl w-full my-8 + caption text-sm text-secondary text-center mt-2
- hr: border-border my-10
- ul/ol: ml-6 mb-6 space-y-2 text-primary Inter

Ad slot (in-content): After 3rd paragraph, insert a 300×250 placeholder div — dashed border border-border rounded-lg flex items-center justify-center h-64 bg-surface-subtle text-secondary text-xs. Label "Advertisement".

Bottom of article:
- Feedback row: "Was this helpful?" with 👍 👎 buttons (bg-surface-subtle rounded-lg px-3 py-2 hover:bg-accent-soft)
- Divider
- Prev/Next navigation: two cards side by side — "← Previous" and "Next →" showing the adjacent article titles in font-fraunces
- Related articles: 3 small cards in a row labeled "Keep reading"

RIGHT SIDEBAR (w-56, sticky top-20, hidden below xl):
Table of contents:
- "On this page" label font-fraunces text-sm text-secondary uppercase tracking-wide
- Lists all h2 and h3 in the article, indented for h3
- Active section highlighted text-accent font-medium (Intersection Observer)
- Smooth scroll on click
- Below TOC: 300×250 ad slot placeholder (same style as in-content)

CREATE SAMPLE ARTICLE:
src/content/articles/agentic-ai/what-is-an-agent.mdx with proper frontmatter and ~600 words of real educational content about "What is an AI Agent?" Include: 3 h2 sections, 1 tip callout box, 1 code example showing a simple agent tool call in Python, and 1 comparison table.

Also create src/app/library/agentic-ai/what-is-an-agent/page.tsx that imports and renders this MDX file using next-mdx-remote.
Install: npm install next-mdx-remote gray-matter reading-time
```

---

## ═══════════════════════════════════════
## PHASE 6 — SEARCH
## ═══════════════════════════════════════

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Build the global search modal at src/components/search/search-modal.tsx.

Trigger: clicking the search icon in the navbar opens the modal. Use React Context or Zustand for the open/close state shared between Navbar and Modal.

MODAL DESIGN:
- Full-screen overlay: fixed inset-0 bg-black/50 backdrop-blur-sm z-50
- Animate in/out with Framer Motion: opacity 0→1, scale 0.97→1, duration 200ms
- Close on Escape key or clicking the backdrop
- Inner panel: max-w-2xl mx-auto mt-20 bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden

SEARCH INPUT (top of panel):
- Large input: text-lg px-5 py-4, Lucide Search icon left, "Clear" × button right when text exists
- Auto-focused on open
- Placeholder: "Search articles, paths, and topics..."
- No submit button — results update as you type (debounced 200ms)

RESULTS (below input, max-h-96 overflow-y-auto):
Grouped sections:
- "Learning Paths" (show max 2)
- "Articles" (show max 5)
- "Glossary" (show max 3)
Each group has a small uppercase label text-secondary text-xs mb-2.
Each result row: flex items-start gap-3 p-3 rounded-lg hover:bg-surface-subtle cursor-pointer
- Left: small badge with category
- Middle: title text-primary text-sm font-medium + excerpt text-secondary text-xs line-clamp-1
- Right: arrow icon →

Keyboard navigation: up/down arrows move selection (highlighted with bg-accent-soft), Enter navigates to the result, Escape closes.

STATES:
- Empty (no query): show "Popular searches: Agentic AI, RAG, Prompting, Fine-tuning, LLM" as chips
- Typing with results: show grouped results
- No results: "No results for '[query]'" + "Try: agents, RAG, prompting"
- Loading: subtle pulse skeleton rows

Use static mock data for now (we'll wire to Supabase full-text search later).
Mock data: 10 articles across different pillars, 5 paths, 5 glossary terms — all real AI topics.
```

---

## ═══════════════════════════════════════
## PHASE 7 — DEPLOY TO VERCEL
## ═══════════════════════════════════════

### Prompt 7 — Pre-deploy hardening

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Prepare Seekvana for production deployment.

TASK 1 — Security headers in next.config.ts
Add these headers to all routes:
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

TASK 2 — SEO files
- src/app/sitemap.ts: generates sitemap with homepage, all pillar pages, all article pages
- src/app/robots.ts: allow all crawlers, point to sitemap URL
- src/app/manifest.ts: PWA manifest with Seekvana name, short_name, theme_color #C9633F

TASK 3 — Metadata
Ensure every page has complete metadata:
- Homepage: full title, description, og:title, og:description, og:image (placeholder /og-image.png), twitter:card
- Article pages: dynamic metadata from MDX frontmatter
- Add JSON-LD Article schema on article pages

TASK 4 — Performance
- Ensure all <img> tags use next/image
- Add loading="lazy" to below-fold images
- Add next/font to eliminate FOUT
- Add <link rel="preconnect"> for Google Fonts in layout

TASK 5 — Build check
Run: npm run build
Show me every error and fix them one by one until build succeeds with 0 errors.
```

### Deploy steps (do yourself — 5 minutes)

```bash
# Push to GitHub
git init
git add .
git commit -m "feat: initial Seekvana build"
```
Create repo at github.com named `seekvana`, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/seekvana.git
git branch -M main
git push -u origin main
```

Then:
1. Go to vercel.com → Add New Project → Import your `seekvana` repo
2. In Environment Variables add: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click Deploy — live URL in ~2 minutes ✅

---

## ═══════════════════════════════════════
## PHASE 8 — MDX CONTENT SYSTEM
## ═══════════════════════════════════════

```
Read SEEKVANA-BUILD-GUIDE.md first for full project context.

Build the complete MDX content pipeline so new articles can be added by creating .mdx files — no code changes needed.

TASK 1 — Content utilities (src/lib/mdx.ts)
Functions to:
- getAllArticles(): reads all .mdx files from src/content/articles/, returns array of frontmatter + slug
- getArticleBySlug(pillar, slug): returns the full MDX content + frontmatter for one article
- getArticlesByPillar(pillar): returns all articles for a given pillar
- getFeaturedArticles(): returns articles where featured: true
- getAllPaths(): reads src/content/paths/*.json and returns path definitions

TASK 2 — Article template (src/content/articles/)
Create 5 real starter articles (real educational content, not Lorem ipsum):
1. agentic-ai/what-is-an-agent.mdx — "What is an AI Agent?" (600 words)
2. agentic-ai/tool-use-explained.mdx — "Tool Use: Giving Models Hands" (500 words)
3. large-language-models/how-llms-work.mdx — "How LLMs Actually Work" (600 words)
4. ai-foundations/what-is-ai.mdx — "What is AI? A Clear, Honest Explainer" (500 words)
5. agentic-ai/rag-explained.mdx — "RAG Without the Hype" (500 words)

All must use the standard frontmatter from the design system section of this guide.

TASK 3 — Dynamic routes
Update src/app/library/[pillar]/[slug]/page.tsx to:
- Use generateStaticParams() to pre-render all articles at build time
- Read article data using getArticleBySlug()
- Pass content to MDXRemote with custom components (our styled h2, callout boxes, code blocks etc.)

TASK 4 — Pillar index pages
Create src/app/library/[pillar]/page.tsx that:
- Shows pillar title, description, article count
- Lists all articles for that pillar as cards with difficulty/readtime
- Breadcrumb: Library → [Pillar]
```

---

## ═══════════════════════════════════════
## BUILD ORDER & STATUS TRACKER
## ═══════════════════════════════════════

Update this as you complete each phase:

| Phase | What | Status |
|---|---|---|
| 1 | Project setup + dependencies | ✅ Done |
| 2 | Design system (colors, fonts, dark mode) | ✅ Done |
| 3 | Navigation bar | ✅ Done |
| 4 | Homepage | ✅ Done |
| 5 | Article/lesson page | ✅ Done |
| 6 | Search modal | ⬜ Todo |
| 7 | Deploy to Vercel | ⬜ Todo |
| 8 | MDX content system | ⬜ Todo |

---

## ═══════════════════════════════════════
## CURSOR TIPS FOR BEGINNERS
## ═══════════════════════════════════════

- **Always start Composer sessions with:** "Read SEEKVANA-BUILD-GUIDE.md first for full context."
- **One phase at a time** — never paste two phase prompts together
- **After every phase:** run `npm run dev` in terminal, check localhost:3000 in browser
- **If you get a red error** in terminal, paste it into Composer: "Fix this error: [paste error]"
- **Never manually delete or edit code** — always ask Composer to change it
- **Save progress after each phase:**
  ```bash
  git add .
  git commit -m "phase X complete: [what you built]"
  git push
  ```
- **Composer vs Chat:** Use Composer (Ctrl+I) for code changes. Use Chat (Ctrl+L) to ask questions.

---

## ═══════════════════════════════════════
## AFTER LAUNCH — TRAFFIC GROWTH PLAN
## ═══════════════════════════════════════

Month 1–2: Foundation
- [ ] Publish 20 articles (use Claude to write each one — ask by topic)
- [ ] Submit sitemap to Google Search Console (search.google.com/search-console)
- [ ] Set up Google Analytics 4
- [ ] Put domain behind Cloudflare free plan (free DDoS protection + CDN)

Month 3–4: Content momentum
- [ ] Publish 3–5 articles per week targeting specific search queries
- [ ] Research keywords with Ahrefs Webmaster Tools (free)
- [ ] Build 3 "best tools" comparison pages for affiliate revenue
- [ ] Apply for Google AdSense (need 20+ quality articles)

Month 5–6: Authority building
- [ ] Reach for Mediavine/Raptive (need ~50k monthly sessions — pays 5–10× more than AdSense)
- [ ] Build email newsletter signup (Supabase already set up for this)
- [ ] Create 2–3 "ultimate guide" pillar pages (3000+ words each)
- [ ] Submit to AI newsletters and communities for backlinks

Traffic compounds — consistency over 12 months beats intensity over 1 month.

# Beyond the Prompt — Course Infrastructure & Production Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the "Beyond the Prompt" learning path (31-article prompt engineering course) end to end: fix two real rendering bugs the path-detail components have today, ship the path skeleton, and produce the article-brief/QA doc that drives article production through the separate `seomachine` workspace's `/produce` → `/deploy` pipeline.

**Architecture:** No new pages or data model — reuses the existing single-path-per-JSON-file convention (`src/content/paths/*.json` + `getAllPaths()`/`getPathBySlug()`). Two presentational components (`PathHero`, `PathSidebar`, `ModuleList`, `ModuleItem`) currently hardcode `getting-started`-specific copy; this plan parametrizes them via new optional `PathData` fields so a second path renders truthfully without touching `getting-started.json`'s behavior. Article writing itself happens outside this repo/session (`seomachine`); this plan's job is the infra + the brief/QA doc that makes that external production correct on the first pass.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind, JSON content files, MDX articles (`next-mdx-remote/rsc`).

**Reference:** Full article specs (word counts, exercises, prereqs, assessments) live in `docs/prompt-craft-combined-curriculum.md` §6. Design decisions live in `docs/superpowers/specs/2026-07-07-beyond-the-prompt-course-design.md`.

---

### Task 1: Parametrize path components — fix difficulty badge, total-time, outcome, and curriculum-copy hardcoding

**Why this task exists:** `PathHero`, `PathSidebar`, `ModuleList`, and `ModuleItem` were built for `getting-started` only and hardcode several strings that would be **factually wrong** for Beyond the Prompt: the difficulty badge always renders "Beginner" regardless of `path.difficulty`, and "3–5 hrs" / "5-min task" wording assumes getting-started's micro-lesson format (Beyond the Prompt's 31 articles run 1,500–2,300 words each with real exercises, not 5-minute tasks). Getting-started's own rendering must stay pixel-identical after this change — every new field is optional and falls back to the current hardcoded string when absent.

**Files:**
- Modify: `src/lib/mdx.ts:126-171` (`PathDefinition`, `PathData` interfaces)
- Modify: `src/components/paths/path-hero.tsx`
- Modify: `src/components/paths/path-sidebar.tsx`
- Modify: `src/components/paths/module-list.tsx`
- Modify: `src/components/paths/module-item.tsx`
- Modify: `src/app/paths/[slug]/page.tsx:120-125`

- [ ] **Step 1: Add optional fields to `PathData`**

In `src/lib/mdx.ts`, the `PathData` interface currently reads (line 162-171):

```typescript
export interface PathData extends PathDefinition {
  subtitle?: string
  modules: PathModule[]
  nextPath?: {
    title: string
    slug: string
    lessonCount: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }
}
```

Replace it with:

```typescript
export interface PathData extends PathDefinition {
  subtitle?: string
  totalTimeLabel?: string
  outcomeLabel?: string
  curriculumHint?: string
  topicFooterLabel?: string
  modules: PathModule[]
  nextPath?: {
    title: string
    slug: string
    lessonCount: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  }
}
```

- [ ] **Step 2: Fix the hardcoded difficulty badge in `PathHero`**

In `src/components/paths/path-hero.tsx`, add this map above the component (after the existing `NODE_LABELS` const, line 23):

```typescript
const DIFFICULTY_META: Record<'beginner' | 'intermediate' | 'advanced', { label: string; className: string }> = {
  beginner: { label: 'Beginner', className: 'border-success/30 bg-success/10 text-success' },
  intermediate: { label: 'Intermediate', className: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  advanced: { label: 'Advanced', className: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400' },
}
```

Then replace the hardcoded badge (currently lines 30-33):

```tsx
<span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success">
  <span className="w-1.5 h-1.5 rounded-full bg-current" />
  Beginner
</span>
```

with:

```tsx
<span className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1 rounded-full border ${DIFFICULTY_META[path.difficulty].className}`}>
  <span className="w-1.5 h-1.5 rounded-full bg-current" />
  {DIFFICULTY_META[path.difficulty].label}
</span>
```

- [ ] **Step 3: Fix the hardcoded "3–5 hrs" total-time meta stat in `PathHero`**

Currently (line 126-139), the meta stats array hardcodes `'3–5 hrs'`:

```tsx
<div className="flex flex-wrap gap-3 mb-8">
  {[
    { icon: Layers,        value: path.modules.length, label: 'modules' },
    { icon: BookOpen,      value: path.lessonCount,    label: 'topics' },
    { icon: CheckCircle2,  value: path.lessonCount,    label: 'tasks' },
    { icon: Clock3,        value: '3–5 hrs',           label: 'total' },
  ].map(({ icon: Icon, value, label }) => (
```

Change the `Clock3` row's `value` to:

```tsx
    { icon: Clock3,        value: path.totalTimeLabel ?? '3–5 hrs', label: 'total' },
```

- [ ] **Step 4: Fix the hardcoded "3–5 hours" and "Live AI app" strings in `PathSidebar`**

In `src/components/paths/path-sidebar.tsx`, line 121 currently reads:

```tsx
            <span className="text-[12px] font-semibold text-primary">3–5 hours</span>
```

Change to:

```tsx
            <span className="text-[12px] font-semibold text-primary">{path.totalTimeLabel ?? '3–5 hours'}</span>
```

Line 141 currently reads:

```tsx
            <span className="text-[12px] font-semibold text-accent">Live AI app</span>
```

Change to:

```tsx
            <span className="text-[12px] font-semibold text-accent">{path.outcomeLabel ?? 'Live AI app'}</span>
```

- [ ] **Step 5: Parametrize the curriculum blurb and topic-footer label in `ModuleList`**

In `src/components/paths/module-list.tsx`, the full current file is:

```tsx
import { ModuleItem } from './module-item'
import type { PathModule } from '@/lib/mdx'

interface ModuleListProps {
  modules: PathModule[]
  totalTopics: number
  readSet?: string[]
}

export function ModuleList({ modules, totalTopics, readSet = [] }: ModuleListProps) {
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
            defaultOpen={module.id === '01'}
            readSet={readSet}
          />
        ))}
      </div>
    </section>
  )
}
```

Replace it entirely with:

```tsx
import { ModuleItem } from './module-item'
import type { PathModule } from '@/lib/mdx'

interface ModuleListProps {
  modules: PathModule[]
  totalTopics: number
  readSet?: string[]
  curriculumHint?: string
  topicFooterLabel?: string
}

export function ModuleList({ modules, totalTopics, readSet = [], curriculumHint, topicFooterLabel }: ModuleListProps) {
  return (
    <section id="modules">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-fraunces text-xl font-semibold text-primary">Curriculum</h2>
        <span className="text-xs text-secondary">
          {modules.length} modules · {totalTopics} topics
        </span>
      </div>
      {curriculumHint ? (
        <p className="text-[13px] text-secondary mb-6 leading-relaxed">{curriculumHint}</p>
      ) : (
        <p className="text-[13px] text-secondary mb-6 leading-relaxed">
          <strong className="text-primary font-semibold">Every topic takes under 5 minutes.</strong>{' '}
          Each ends with a hands-on task you can complete right now — no setup required to begin Module 00.
        </p>
      )}
      <div className="border border-border rounded-2xl overflow-hidden bg-surface">
        {modules.map((module, idx) => (
          <ModuleItem
            key={module.id}
            module={module}
            defaultOpen={idx === 0}
            readSet={readSet}
            topicFooterLabel={topicFooterLabel}
          />
        ))}
      </div>
    </section>
  )
}
```

(Note: `defaultOpen={module.id === '01'}` became `defaultOpen={idx === 0}` — opens the first module in the array regardless of its id, which is a strict generalization: getting-started's first module is still id `'01'` at index 0, so this is not a behavior change for it.)

- [ ] **Step 6: Add `topicFooterLabel` prop to `ModuleItem`**

In `src/components/paths/module-item.tsx`, the `ModuleItemProps` interface (lines 8-12) currently reads:

```tsx
interface ModuleItemProps {
  module: PathModule
  defaultOpen?: boolean
  readSet?: string[]
}
```

Change to:

```tsx
interface ModuleItemProps {
  module: PathModule
  defaultOpen?: boolean
  readSet?: string[]
  topicFooterLabel?: string
}
```

And the function signature (line 14):

```tsx
export function ModuleItem({ module, defaultOpen = false, readSet = [] }: ModuleItemProps) {
```

becomes:

```tsx
export function ModuleItem({ module, defaultOpen = false, readSet = [], topicFooterLabel }: ModuleItemProps) {
```

Then the hardcoded footer line (line 124):

```tsx
            <span className="text-[11px] text-secondary"><span className="text-primary font-medium">Each topic</span> includes a 5-min task</span>
```

becomes:

```tsx
            <span className="text-[11px] text-secondary"><span className="text-primary font-medium">Each topic</span> includes a {topicFooterLabel ?? '5-min task'}</span>
```

- [ ] **Step 7: Thread the new fields through the path detail page**

In `src/app/paths/[slug]/page.tsx`, line 125 currently reads:

```tsx
        <ModuleList modules={enrichedModules} totalTopics={totalTopics} readSet={readSet} />
```

Change to:

```tsx
        <ModuleList
          modules={enrichedModules}
          totalTopics={totalTopics}
          readSet={readSet}
          curriculumHint={path.curriculumHint}
          topicFooterLabel={path.topicFooterLabel}
        />
```

- [ ] **Step 8: Type-check**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors. `getting-started.json` has none of the new optional fields set, so every fallback (`?? '3–5 hrs'`, `?? '3–5 hours'`, `?? 'Live AI app'`, the `curriculumHint`/`topicFooterLabel` ternaries) takes the original hardcoded value — confirm by visually diffing `/paths/getting-started` before/after in the next step.

- [ ] **Step 9: Manual regression check on `/paths/getting-started`**

Run: `npm run dev`, open `http://localhost:3000/paths/getting-started`.
Expected: identical to before this task — "Beginner" badge, "3–5 hrs" / "3–5 hours", "Live AI app", "Every topic takes under 5 minutes...", "5-min task", Module 01 expanded by default. Nothing here should visibly change.

- [ ] **Step 10: Commit**

```bash
git add src/lib/mdx.ts src/components/paths/path-hero.tsx src/components/paths/path-sidebar.tsx src/components/paths/module-list.tsx src/components/paths/module-item.tsx src/app/paths/[slug]/page.tsx
git commit -m "feat: parametrize path-detail copy so a second path can render truthfully"
```

---

### Task 2: Create the `beyond-the-prompt` path skeleton

**Files:**
- Create: `src/content/paths/beyond-the-prompt.json`

- [ ] **Step 1: Write the path file**

Create `src/content/paths/beyond-the-prompt.json` with this exact content:

```json
{
  "slug": "beyond-the-prompt",
  "title": "Beyond the Prompt",
  "subtitle": "from first prompt to production system",
  "description": "31 dense articles across three tiers — Foundations, Builder, and Production & Frontier — covering modern prompting from the ground up: patterns, reasoning models, context engineering, RAG, agents, evals, and shipping prompt systems that hold up in real products.",
  "difficulty": "advanced",
  "lessonCount": 31,
  "href": "/paths/beyond-the-prompt",
  "colorClass": "bg-teal-500",
  "totalTimeLabel": "10–14 hrs",
  "outcomeLabel": "Production-grade prompt system",
  "curriculumHint": "Every article runs principle → pattern → production — the idea, the pattern, and how it plays out in a real system, on one page.",
  "topicFooterLabel": "written exercise",
  "modules": [
    {
      "id": "01",
      "title": "Foundations",
      "description": "The mental model, the anatomy of a prompt, and the core skills — clarity, roles, examples, formatting, and iteration.",
      "topics": [
        { "id": "01.01", "title": "What Prompting Actually Is — and Why It Still Matters in 2026" },
        { "id": "01.02", "title": "The Anatomy of a Prompt" },
        { "id": "01.03", "title": "Clear and Direct: The Core Skill" },
        { "id": "01.04", "title": "Giving the Model a Role and an Audience" },
        { "id": "01.05", "title": "Showing vs Telling: Examples and Few-Shot" },
        { "id": "01.06", "title": "Controlling the Output" },
        { "id": "01.07", "title": "Giving the Model Room to Think" },
        { "id": "01.08", "title": "The Iteration Loop" }
      ]
    },
    {
      "id": "02",
      "title": "Builder",
      "description": "Patterns, reasoning techniques, context engineering, RAG-aware prompting, structured outputs, and prompt security.",
      "topics": [
        { "id": "02.01", "title": "A Working Catalog of Prompt Patterns" },
        { "id": "02.02", "title": "Decomposition and Prompt Chaining" },
        { "id": "02.03", "title": "Self-Consistency and Verification" },
        { "id": "02.04", "title": "Reducing Hallucinations" },
        { "id": "02.05", "title": "Prompting Reasoning Models" },
        { "id": "02.06", "title": "Context Engineering, Part 1 — Foundations" },
        { "id": "02.07", "title": "Prompting Over Documents and Data (RAG-Aware Prompting)" },
        { "id": "02.08", "title": "Structured Outputs and Schema-Driven Prompting" },
        { "id": "02.09", "title": "Multimodal Prompting" },
        { "id": "02.10", "title": "System Prompts That Scale" },
        { "id": "02.11", "title": "Meta-Prompting and Prompt Generation" },
        { "id": "02.12", "title": "Prompt Security Basics" }
      ]
    },
    {
      "id": "03",
      "title": "Production & Frontier",
      "description": "Agentic and multi-agent prompting, advanced reasoning frameworks, automatic optimization, evals, and shipping prompt systems in production.",
      "topics": [
        { "id": "03.01", "title": "Context Engineering, Part 2 — Production Systems" },
        { "id": "03.02", "title": "Agentic Prompting" },
        { "id": "03.03", "title": "Multi-Agent Prompting and Orchestration" },
        { "id": "03.04", "title": "Advanced Reasoning Frameworks" },
        { "id": "03.05", "title": "Automatic Prompt Optimization" },
        { "id": "03.06", "title": "Evaluating Prompts" },
        { "id": "03.07", "title": "Prompt Engineering for Production" },
        { "id": "03.08", "title": "Model-Specific Prompting" },
        { "id": "03.09", "title": "Adversarial and Red-Team Prompting (Advanced)" },
        { "id": "03.10", "title": "Domain Playbooks" },
        { "id": "03.11", "title": "Prompting as It Evolves (Capstone)" }
      ]
    }
  ]
}
```

No topic has `articlePillar`/`articleSlug` yet — Task 5 (repeated per article) adds those once each article actually exists, so nothing links to a 404.

- [ ] **Step 2: Commit**

```bash
git add src/content/paths/beyond-the-prompt.json
git commit -m "feat: add Beyond the Prompt path skeleton (31 topics, no articles yet)"
```

---

### Task 3: Verify the skeleton renders correctly

**Files:** none (verification only)

- [ ] **Step 1: Build check**

Run: `npm run build`
Expected: succeeds. `generatePathStaticParams()` (`src/lib/mdx.ts:196`) will pick up the new JSON file automatically — no code change needed for `/paths` or `/paths/[slug]` to discover it.

- [ ] **Step 2: Visual check — `/paths` hub**

Run: `npm run dev`, open `http://localhost:3000/paths`.
Expected: a second card appears, "Beyond the Prompt", "Advanced" badge, "31 topics", description text from Task 2.

- [ ] **Step 3: Visual check — `/paths/beyond-the-prompt`**

Open `http://localhost:3000/paths/beyond-the-prompt`.
Expected:
- Hero shows "Advanced" badge (red-tinted, not the green "Beginner" badge)
- Meta stats show "10–14 hrs" under "total"
- Sidebar shows "10–14 hrs" under "Total time" and "Production-grade prompt system" under "You'll build"
- Curriculum section shows the custom `curriculumHint` sentence, not "Every topic takes under 5 minutes..."
- 3 modules listed (Foundations / Builder / Production & Frontier), Foundations expanded by default
- Every topic row shows an empty circle (unread) with no "Article" pill and is **not** a clickable link (no `href` — confirms `TopicRow`'s `hasArticle` check correctly treats missing `articlePillar`/`articleSlug` as "not yet published")
- Footer of each module reads "Each topic includes a written exercise"

- [ ] **Step 4: Visual check — `/library/prompt-engineering`**

Open `http://localhost:3000/library/prompt-engineering`.
Expected: still shows the "No articles yet — check back soon" empty state (`src/app/library/[pillar]/page.tsx:69`) — this is correct and expected until Task 5 lands the first article. No change needed here.

---

### Task 4: Write the article production guide (briefs + QA checklist)

**Why this task exists:** Article prose is produced outside this repo, in the separate `seomachine` workspace, one article per `/produce [topic]` → `/deploy [slug] [images-folder]` run. This doc is the shared reference both sides work from — the exact topic string/slug/word-count/exercise per article to feed `/produce`, and the checklist to run here after each `/deploy` (seomachine doesn't know Seekvana's path-linking convention and has shipped real frontmatter bugs before — wrong `faqs` key names on 5 existing articles).

**Files:**
- Create: `docs/beyond-the-prompt-production-guide.md`

- [ ] **Step 1: Write the guide**

Create `docs/beyond-the-prompt-production-guide.md`:

````markdown
# Beyond the Prompt — Production Guide

Working reference for producing the 31 articles via the `seomachine` workspace's `/produce` → `/deploy` pipeline, and for wiring each one into Seekvana once it lands.

Full per-article specs (objective, why it matters) live in `docs/prompt-craft-combined-curriculum.md` §6 — this doc adds the exact slugs/ids needed for wiring, and doesn't duplicate what's already there.

## Post-deploy QA checklist

Run this after **every** `/deploy [slug] [images-folder]`, before moving to the next article. seomachine has shipped these exact bugs before on real Seekvana articles.

1. **Check `faqs` frontmatter keys.** Open the deployed `.mdx` and confirm each FAQ entry uses `q`/`a` keys, not `question`/`answer`:
   ```yaml
   faqs:
     - q: "..."
       a: "..."
   ```
   Wrong keys silently break the FAQPage JSON-LD schema — no build error, no visible bug, just missing SEO markup.

2. **Confirm frontmatter matches the schema exactly** — `title, description, pillar: "prompt-engineering", slug, difficulty, readTime, author: "Seekvana", publishedAt, tags, featured`. Do **not** add `lessonModule`/`lessonNumber` — this path links articles by hardcoding `articlePillar`/`articleSlug` directly into `beyond-the-prompt.json` (step 5 below), not via the site-wide `lessonNumber` map. Setting `lessonNumber` on a prompt-engineering article risks colliding with an unrelated `getting-started` topic that happens to share the same id string, since `buildLessonArticleMap()` (`src/lib/mdx.ts:180-194`) keys articles by `lessonNumber` in one flat, site-wide map.

3. **Scan the MDX body for prop violations.** Any custom component (`Tip`, `Note`, `Warning`, `Steps`/`Step`, `FAQ`/`FAQItem`, etc.) must receive only string props — no arrays, numbers, or `{children}`. This breaks silently in `next-mdx-remote/rsc` in production while working fine in `npm run dev`, so it won't show up until `npm run build`.

4. **Confirm the difficulty tag matches the article's tier** — `beginner` for module 01, `intermediate` for module 02, `advanced` for module 03 (see table below).

5. **Confirm the "does this still apply to reasoning models?" note is present** on the six ★-flagged articles (table below) — this is the course's core differentiator; it must not get dropped in the generic seomachine template.

6. **Confirm the hand-off "go deeper" link is present and points to the correct pillar** for the 8 articles that have one (table below).

7. **Wire the article into the path.** In `src/content/paths/beyond-the-prompt.json`, find the topic with the matching `id` and add:
   ```json
   { "id": "01.01", "title": "...", "articlePillar": "prompt-engineering", "articleSlug": "what-prompting-actually-is" }
   ```

8. **Build check.** Run `npm run build`. Fix anything it flags before moving to the next article.

## Article table

Batches match the plan's Tier 1 → 2 → 3 review checkpoints — deploy and QA a full batch before starting the next.

### Batch 1 — Module 01, Foundations (`difficulty: "beginner"`)

| Topic id | Slug | `/produce` topic | Words | Exercise | Assessment |
|---|---|---|---:|---|---|
| 01.01 | `what-prompting-actually-is` | What Prompting Actually Is — and Why It Still Matters in 2026 | 1,600 | Label 5 failure cases as prompt/context/retrieval/eval issues | 8-question quiz |
| 01.02 | `the-anatomy-of-a-prompt` | The Anatomy of a Prompt | 1,800 | Build one template, apply to 3 different tasks | Template submission |
| 01.03 | `clear-and-direct-the-core-skill` | Clear and Direct: The Core Skill | 1,700 | Rewrite 5 vague prompts into clear/direct versions | Rewrite drill, rubric-scored |
| 01.04 | `giving-the-model-a-role-and-an-audience` | Giving the Model a Role and an Audience | 1,500 | A/B a task with and without persona, compare | Reflection quiz |
| 01.05 | `showing-vs-telling` | Showing vs Telling: Examples and Few-Shot | 1,900 | Build a 3-shot set for a formatting task, test edge cases | Auto-checked output test |
| 01.06 | `controlling-the-output` | Controlling the Output | 1,800 | Build a schema-constrained extraction prompt | Auto-checked output test |
| 01.07 | `giving-the-model-room-to-think` | Giving the Model Room to Think | 1,900 | Compare zero-shot vs. CoT-scaffolded on one task | Mini lab with rubric |
| 01.08 | `the-iteration-loop` | The Iteration Loop | 1,700 | Run 3 iteration cycles on a failing prompt, log changes | Iteration log + Tier 1 quiz |

### Batch 2 — Module 02, Builder (`difficulty: "intermediate"`)

★ = needs the "does this still apply to reasoning models?" note. Hand-off = the pillar its closing "go deeper" link points to.

| Topic id | Slug | `/produce` topic | Words | Exercise | Assessment | ★ | Hand-off |
|---|---|---|---:|---|---|---|---|
| 02.01 | `a-working-catalog-of-prompt-patterns` | A Working Catalog of Prompt Patterns | 2,000 | Match 6 real tasks to the correct pattern | Scenario-matching quiz | | |
| 02.02 | `decomposition-and-prompt-chaining` | Decomposition and Prompt Chaining | 2,000 | Build a 3-step chain for a multi-part task | Chain design review | | |
| 02.03 | `self-consistency-and-verification` | Self-Consistency and Verification | 1,900 | Run self-consistency sampling, compare outputs | Lab writeup | | |
| 02.04 | `reducing-hallucinations` | Reducing Hallucinations | 2,000 | Ground a factual prompt in a source doc, test for fabrication | Graded hallucination check | | `large-language-models` |
| 02.05 | `prompting-reasoning-models` | Prompting Reasoning Models | 2,100 | Run one task on a chat model and a reasoning model, compare | Comparison lab report | ★ | |
| 02.06 | `context-engineering-part-1` | Context Engineering, Part 1 — Foundations | 2,200 | Audit a real system-prompt + context stack for waste | Audit worksheet | ★ | |
| 02.07 | `rag-aware-prompting` | Prompting Over Documents and Data (RAG-Aware Prompting) | 2,000 | Diagnose retrieval noise in a sample transcript | Diagnostic lab | | `large-language-models` |
| 02.08 | `structured-outputs-and-schema-driven-prompting` | Structured Outputs and Schema-Driven Prompting | 1,900 | Build a schema-constrained extraction, test edge cases | Auto-checked test suite | ★ | `building-with-ai` |
| 02.09 | `multimodal-prompting` | Multimodal Prompting | 1,900 | Analyze a full image/PDF workflow | Practical lab | | |
| 02.10 | `system-prompts-that-scale` | System Prompts That Scale | 1,800 | Write a production system prompt with hierarchy + guardrails | Rubric review | | |
| 02.11 | `meta-prompting-and-prompt-generation` | Meta-Prompting and Prompt Generation | 1,700 | Optimize one of your own earlier prompts, compare before/after | Before/after submission | | |
| 02.12 | `prompt-security-basics` | Prompt Security Basics | 2,100 | Red-team a sample assistant prompt and patch it | Red-team report + Tier 2 quiz | ★ | |

### Batch 3 — Module 03, Production & Frontier (`difficulty: "advanced"`)

| Topic id | Slug | `/produce` topic | Words | Exercise | Assessment | ★ | Hand-off |
|---|---|---|---:|---|---|---|---|
| 03.01 | `context-engineering-part-2` | Context Engineering, Part 2 — Production Systems | 2,300 | Design a compaction strategy for a 50-turn agent transcript | Design doc review | ★ | `agentic-ai` |
| 03.02 | `agentic-prompting` | Agentic Prompting | 2,200 | Write system + tool prompts for a web-research agent | Scenario assignment | | `agentic-ai` |
| 03.03 | `multi-agent-prompting-and-orchestration` | Multi-Agent Prompting and Orchestration | 2,200 | Design a 3-agent hand-off spec for a research-and-write flow | Architecture review | | `agentic-ai` |
| 03.04 | `advanced-reasoning-frameworks` | Advanced Reasoning Frameworks | 2,100 | Benchmark ToT vs. single-pass CoT on one hard task | Benchmark scorecard | | |
| 03.05 | `automatic-prompt-optimization` | Automatic Prompt Optimization | 2,000 | Run one auto-optimization pass using a small eval set | Before/after eval comparison | ★ | |
| 03.06 | `evaluating-prompts` | Evaluating Prompts | 2,300 | Build a 20-case regression sheet, score two prompt versions | Graded eval pack | | `building-with-ai` |
| 03.07 | `prompt-engineering-for-production` | Prompt Engineering for Production | 2,200 | Version and A/B test two variants with cost/latency tracking | Production readiness checklist | | `building-with-ai` |
| 03.08 | `model-specific-prompting` | Model-Specific Prompting | 2,000 | Port one prompt across 3 model families, log deltas | Portability report | | |
| 03.09 | `adversarial-and-red-team-prompting` | Adversarial and Red-Team Prompting (Advanced) | 2,200 | Full red-team + patch cycle on a production-style assistant | Graded red-team brief | | |
| 03.10 | `domain-playbooks` | Domain Playbooks | 2,100 | Adapt the playbook recipes to your own domain use case | Domain adaptation submission | | |
| 03.11 | `prompting-as-it-evolves-capstone` | Prompting as It Evolves (Capstone) | 1,800 + capstone | **Capstone:** Build a Production-Grade Prompt System — chaining + context engineering + evals + guardrails in one shippable deliverable | Graded capstone + certification exam option | | |
````

- [ ] **Step 2: Commit**

```bash
git add docs/beyond-the-prompt-production-guide.md
git commit -m "docs: production guide for Beyond the Prompt's 31 articles"
```

---

### Task 5: Deploy loop (repeats once per article, 31 times, in 3 batches)

This task is not run by the plan's executor — it's the loop the human runs, using Task 4's guide, with the plan's executor doing the QA half each time it's invoked.

- [ ] **Batch 1 (8 articles):** For each row in the Batch 1 table — run `/produce [topic]` then `/deploy [slug] [images-folder]` in the `seomachine` workspace. After all 8 land, run the Post-deploy QA checklist (Task 4) against all 8 at once, then `npm run build`.
- [ ] **Checkpoint:** Review Batch 1 live (`npm run dev`, read the articles, check `/paths/beyond-the-prompt` shows 8 linked topics) before starting Batch 2.
- [ ] **Batch 2 (12 articles):** Same loop for Module 02. Checkpoint before Batch 3.
- [ ] **Batch 3 (11 articles):** Same loop for Module 03.
- [ ] **Final check:** `/library/prompt-engineering` shows all 31 articles; `/paths/beyond-the-prompt` shows every topic linked and clickable; `npm run build` clean.

# Beyond the Prompt — Prompt Engineering Course: Design

## Summary

Build a new flagship learning path, **Beyond the Prompt**, filling Seekvana's currently-empty `prompt-engineering` pillar (0 articles today). The path is the Full Track from `docs/prompt-craft-combined-curriculum.md` §6: 31 dense MDX articles across 3 tiers, written *principle → pattern → production* so beginners and professionals read the same page. Source material: three docs in `docs/` — the combined curriculum blueprint (article list, authoritative), the strategy doc (voice/differentiation), and the deep-research audit (competitive evidence, pedagogy).

## Naming & positioning

- **Course/path name:** Beyond the Prompt
- **Tagline:** *"Everything you need to master prompt engineering, from first principles to production."*
- **Library pillar:** stays **Prompt Engineering** (`prompt-engineering` slug, already defined in `src/lib/pillars.ts`, 7th pillar, currently 0 articles) — discoverability (SEO term) + brand (course name) live separately, same pattern the site already uses.
- **Differentiation thesis** (from strategy doc, drives editorial voice): density over volume (one dense article per concept cluster instead of 5 thin competitor pages), modern-first (reasoning models, context engineering, evals, agentic prompting on the *main path*, not gated as "advanced"), layered depth (beginner stops at the top of the page satisfied, professional reads the production note at the bottom), security taught openly on the free path, current 2026 models with durable model-agnostic principles.
- **Recency guardrail:** every technique article carries a "does this still apply to reasoning models?" note — flagged articles below.

## Technical structure

**Path file** — new `src/content/paths/beyond-the-prompt.json`, same schema as the existing `getting-started.json` (`PathData` in `src/lib/mdx.ts:148-171`):

```json
{
  "slug": "beyond-the-prompt",
  "title": "Beyond the Prompt",
  "subtitle": "Everything you need to master prompt engineering, from first principles to production.",
  "description": "...",
  "difficulty": "advanced",
  "lessonCount": 31,
  // difficulty is a strict 'beginner' | 'intermediate' | 'advanced' enum (src/lib/mdx.ts:130) —
  // set to the path's ceiling, matching the precedent of "Beginner to AI Engineer"
  // (tagged Advanced despite starting at beginner).
  "href": "/paths/beyond-the-prompt",
  "colorClass": "<pick one not already used by getting-started>",
  "modules": [
    { "id": "foundations", "title": "Foundations", "description": "...", "topics": [ /* 8 */ ] },
    { "id": "builder", "title": "Builder", "description": "...", "topics": [ /* 12 */ ] },
    { "id": "production-frontier", "title": "Production & Frontier", "description": "...", "topics": [ /* 11 */ ] }
  ]
}
```

Each topic: `{ "id": "...", "title": "..." }` initially — **no `articlePillar`/`articleSlug` until that article actually ships**, matching the existing convention (`getting-started.json` lines 37-44) so nothing links to a 404.

**Articles** — new folder `src/content/articles/prompt-engineering/`, one `.mdx` per article. Frontmatter matches `ArticleFrontmatter` (`src/lib/mdx.ts:5-20`):

```yaml
---
title: "..."
description: "..."
pillar: "prompt-engineering"
slug: "..."
difficulty: "beginner" # beginner | intermediate | advanced, by tier
readTime: <int>
author: "Seekvana"
publishedAt: "2026-MM-DD"
tags: [...]
featured: false
lessonModule: "foundations" # | "builder" | "production-frontier"
lessonNumber: <1-31>
faqs: [{ q, a }]  # optional
---
```

`lessonModule`/`lessonNumber` let `buildLessonArticleMap()` (`src/lib/mdx.ts:180-194`) wire the article to its path topic automatically once the topic's `articlePillar`/`articleSlug` are added to the JSON.

**Cover images** — user produces `cover.webp` per article by hand, same as Getting Started. `coverImage` stays unset in frontmatter so the existing fallback convention (`mdx.ts:64-73`, auto-generated `cover.jpg` via `scripts/generate-og-covers.mjs`) picks it up once the file exists. Not blocking article writing.

**Pillar hand-offs** — Seekvana has no dedicated RAG or Evals pillar, so hand-off links route to the closest existing one:
- Reducing Hallucinations (12), RAG-Aware Prompting (15) → `large-language-models`
- Agentic Prompting (22), Multi-Agent Prompting (23), Context Engineering Pt. 2 (21) → `agentic-ai`
- Structured Outputs (16), Evaluating Prompts (26), Prompt Engineering for Production (27) → `building-with-ai`

Each hand-off article ends with a "go deeper" link into the target pillar.

**Assessments/exercises** — written into the MDX body using existing components (`Tip`, `Note`, `Warning`, `Steps`/`Step`, `FAQ`/`FAQItem`). No new interactive quiz/grading UI for v1 — deferred (see Non-goals).

## The 31 articles

Word counts, exercises, and prerequisites per article are in `docs/prompt-craft-combined-curriculum.md` §6 — not duplicated here. ★ = flagged for the "does this still apply to reasoning models?" note.

**Tier 1 — Foundations** (`beginner`, `lessonModule: "foundations"`)

| # | Slug | Title |
|---|---|---|
| 1 | `what-prompting-actually-is` | What Prompting Actually Is — and Why It Still Matters in 2026 |
| 2 | `the-anatomy-of-a-prompt` | The Anatomy of a Prompt |
| 3 | `clear-and-direct-the-core-skill` | Clear and Direct: The Core Skill |
| 4 | `giving-the-model-a-role-and-an-audience` | Giving the Model a Role and an Audience |
| 5 | `showing-vs-telling` | Showing vs Telling: Examples and Few-Shot |
| 6 | `controlling-the-output` | Controlling the Output |
| 7 | `giving-the-model-room-to-think` | Giving the Model Room to Think |
| 8 | `the-iteration-loop` | The Iteration Loop |

**Tier 2 — Builder** (`intermediate`, `lessonModule: "builder"`)

| # | Slug | Title |
|---|---|---|
| 9 | `a-working-catalog-of-prompt-patterns` | A Working Catalog of Prompt Patterns |
| 10 | `decomposition-and-prompt-chaining` | Decomposition and Prompt Chaining |
| 11 | `self-consistency-and-verification` | Self-Consistency and Verification |
| 12 | `reducing-hallucinations` | Reducing Hallucinations |
| 13 | `prompting-reasoning-models` ★ | Prompting Reasoning Models |
| 14 | `context-engineering-part-1` ★ | Context Engineering, Part 1 — Foundations |
| 15 | `rag-aware-prompting` | Prompting Over Documents and Data (RAG-Aware Prompting) |
| 16 | `structured-outputs-and-schema-driven-prompting` ★ | Structured Outputs and Schema-Driven Prompting |
| 17 | `multimodal-prompting` | Multimodal Prompting |
| 18 | `system-prompts-that-scale` | System Prompts That Scale |
| 19 | `meta-prompting-and-prompt-generation` | Meta-Prompting and Prompt Generation |
| 20 | `prompt-security-basics` ★ | Prompt Security Basics |

**Tier 3 — Production & Frontier** (`advanced`, `lessonModule: "production-frontier"`)

| # | Slug | Title |
|---|---|---|
| 21 | `context-engineering-part-2` ★ | Context Engineering, Part 2 — Production Systems |
| 22 | `agentic-prompting` | Agentic Prompting |
| 23 | `multi-agent-prompting-and-orchestration` | Multi-Agent Prompting and Orchestration |
| 24 | `advanced-reasoning-frameworks` | Advanced Reasoning Frameworks |
| 25 | `automatic-prompt-optimization` ★ | Automatic Prompt Optimization |
| 26 | `evaluating-prompts` | Evaluating Prompts |
| 27 | `prompt-engineering-for-production` | Prompt Engineering for Production |
| 28 | `model-specific-prompting` | Model-Specific Prompting |
| 29 | `adversarial-and-red-team-prompting` | Adversarial and Red-Team Prompting (Advanced) |
| 30 | `domain-playbooks` | Domain Playbooks |
| 31 | `prompting-as-it-evolves-capstone` | Prompting as It Evolves (Capstone) |

## Production plan & phasing

**Phase A — Infra.** Create `beyond-the-prompt.json` with all 31 topic titles (no article links yet). Add the path card to `/paths`. Confirm `/library/prompt-engineering` and `/paths/beyond-the-prompt` render in their empty/in-progress state. `npm run build`.

**Phase B — Tier 1 (8 articles, hand-written).** Written directly, one at a time, to establish voice, the *principle → pattern → production* structure, and callout/exercise conventions that Tier 2/3 will follow. Each article's topic gets wired into the path JSON (`articlePillar`/`articleSlug` added) as it ships. `npm run build` after the tier completes.

**Phase C — Tier 2 (12) + Tier 3 (11), parallelized.** Subagents draft each article against the Tier 1 template plus that article's brief (objective, word count, exercise, prerequisite) from the combined curriculum doc. A consistency edit pass follows — voice, the ★ reasoning-model notes, and the pillar hand-off links — before each is wired into the path JSON. `npm run build` after each tier.

## Non-goals (v1)

Deferred from the deep-research doc's "beyond articles" product-stack section — explicitly out of scope for this build:
- Interactive quiz/grading UI (auto-checked output tests, multiple choice)
- Downloadable "prompt card" templates/PDFs
- Community prompt library
- Practical certification exam system

These may become their own future sub-projects once the 31 articles exist.

## Open items

- Cover images: user's responsibility, not blocking.
- `colorClass` for the path card: pick a value not already used by `getting-started.json`.
- Exact per-article word counts/exercises/assessments: already fully specified in `docs/prompt-craft-combined-curriculum.md` §6 — writers should pull from there directly rather than duplicating in this spec.

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

2. **Confirm frontmatter matches the schema exactly** — `title, description, pillar: "prompt-engineering", slug, difficulty, readTime, author: "Seekvana", publishedAt, tags, featured`, **plus** `lessonModule` and `lessonNumber` set to match that article's topic id in `beyond-the-prompt.json` exactly (e.g. `lessonModule: "11"`, `lessonNumber: "11.01"` for the first Foundations article). This path's modules are numbered `11`/`12`/`13` — deliberately outside `getting-started.json`'s `00`–`10` range — so `buildLessonArticleMap()` (`src/lib/mdx.ts:180-194`) auto-links the article into the path with no manual JSON edit. Getting the `lessonNumber` wrong (or reusing `01.xx`–`10.xx`) either breaks the link or collides with an unrelated getting-started topic.

3. **Scan the MDX body for prop violations.** Any custom component (`Tip`, `Note`, `Warning`, `Steps`/`Step`, `FAQ`/`FAQItem`, etc.) must receive only string props — no arrays, numbers, or `{children}`. This breaks silently in `next-mdx-remote/rsc` in production while working fine in `npm run dev`, so it won't show up until `npm run build`.

4. **Confirm the difficulty tag matches the article's tier** — `beginner` for module 11, `intermediate` for module 12, `advanced` for module 13 (see table below).

5. **Confirm the "does this still apply to reasoning models?" note is present** on the six ★-flagged articles (table below) — this is the course's core differentiator; it must not get dropped in the generic seomachine template.

6. **Confirm the hand-off "go deeper" link is present and points to the correct pillar** for the 8 articles that have one (table below).

7. **Build check.** Run `npm run build`. Fix anything it flags before moving to the next article. No JSON edit needed — `lessonNumber` (point 2) wires it into the path automatically.

## Article table

Batches match the plan's Tier 1 → 2 → 3 review checkpoints — deploy and QA a full batch before starting the next.

### Batch 1 — Module 11, Foundations (`difficulty: "beginner"`)

| Topic id | Slug | `/produce` topic | Words | Exercise | Assessment |
|---|---|---|---:|---|---|
| 11.01 | `what-prompting-actually-is` | What Prompting Actually Is — and Why It Still Matters in 2026 | 1,600 | Label 5 failure cases as prompt/context/retrieval/eval issues | 8-question quiz |
| 11.02 | `the-anatomy-of-a-prompt` | The Anatomy of a Prompt | 1,800 | Build one template, apply to 3 different tasks | Template submission |
| 11.03 | `clear-and-direct-the-core-skill` | Clear and Direct: The Core Skill | 1,700 | Rewrite 5 vague prompts into clear/direct versions | Rewrite drill, rubric-scored |
| 11.04 | `giving-the-model-a-role-and-an-audience` | Giving the Model a Role and an Audience | 1,500 | A/B a task with and without persona, compare | Reflection quiz |
| 11.05 | `showing-vs-telling` | Showing vs Telling: Examples and Few-Shot | 1,900 | Build a 3-shot set for a formatting task, test edge cases | Auto-checked output test |
| 11.06 | `controlling-the-output` | Controlling the Output | 1,800 | Build a schema-constrained extraction prompt | Auto-checked output test |
| 11.07 | `giving-the-model-room-to-think` | Giving the Model Room to Think | 1,900 | Compare zero-shot vs. CoT-scaffolded on one task | Mini lab with rubric |
| 11.08 | `the-iteration-loop` | The Iteration Loop | 1,700 | Run 3 iteration cycles on a failing prompt, log changes | Iteration log + Tier 1 quiz |

### Batch 2 — Module 12, Builder (`difficulty: "intermediate"`)

★ = needs the "does this still apply to reasoning models?" note. Hand-off = the pillar its closing "go deeper" link points to.

| Topic id | Slug | `/produce` topic | Words | Exercise | Assessment | ★ | Hand-off |
|---|---|---|---:|---|---|---|---|
| 12.01 | `a-working-catalog-of-prompt-patterns` | A Working Catalog of Prompt Patterns | 2,000 | Match 6 real tasks to the correct pattern | Scenario-matching quiz | | |
| 12.02 | `decomposition-and-prompt-chaining` | Decomposition and Prompt Chaining | 2,000 | Build a 3-step chain for a multi-part task | Chain design review | | |
| 12.03 | `self-consistency-and-verification` | Self-Consistency and Verification | 1,900 | Run self-consistency sampling, compare outputs | Lab writeup | | |
| 12.04 | `reducing-hallucinations` | Reducing Hallucinations | 2,000 | Ground a factual prompt in a source doc, test for fabrication | Graded hallucination check | | `large-language-models` |
| 12.05 | `prompting-reasoning-models` | Prompting Reasoning Models | 2,100 | Run one task on a chat model and a reasoning model, compare | Comparison lab report | ★ | |
| 12.06 | `context-engineering-part-1` | Context Engineering, Part 1 — Foundations | 2,200 | Audit a real system-prompt + context stack for waste | Audit worksheet | ★ | |
| 12.07 | `rag-aware-prompting` | Prompting Over Documents and Data (RAG-Aware Prompting) | 2,000 | Diagnose retrieval noise in a sample transcript | Diagnostic lab | | `large-language-models` |
| 12.08 | `structured-outputs-and-schema-driven-prompting` | Structured Outputs and Schema-Driven Prompting | 1,900 | Build a schema-constrained extraction, test edge cases | Auto-checked test suite | ★ | `building-with-ai` |
| 12.09 | `multimodal-prompting` | Multimodal Prompting | 1,900 | Analyze a full image/PDF workflow | Practical lab | | |
| 12.10 | `system-prompts-that-scale` | System Prompts That Scale | 1,800 | Write a production system prompt with hierarchy + guardrails | Rubric review | | |
| 12.11 | `meta-prompting-and-prompt-generation` | Meta-Prompting and Prompt Generation | 1,700 | Optimize one of your own earlier prompts, compare before/after | Before/after submission | | |
| 12.12 | `prompt-security-basics` | Prompt Security Basics | 2,100 | Red-team a sample assistant prompt and patch it | Red-team report + Tier 2 quiz | ★ | |

### Batch 3 — Module 13, Production & Frontier (`difficulty: "advanced"`)

| Topic id | Slug | `/produce` topic | Words | Exercise | Assessment | ★ | Hand-off |
|---|---|---|---:|---|---|---|---|
| 13.01 | `context-engineering-part-2` | Context Engineering, Part 2 — Production Systems | 2,300 | Design a compaction strategy for a 50-turn agent transcript | Design doc review | ★ | `agentic-ai` |
| 13.02 | `agentic-prompting` | Agentic Prompting | 2,200 | Write system + tool prompts for a web-research agent | Scenario assignment | | `agentic-ai` |
| 13.03 | `multi-agent-prompting-and-orchestration` | Multi-Agent Prompting and Orchestration | 2,200 | Design a 3-agent hand-off spec for a research-and-write flow | Architecture review | | `agentic-ai` |
| 13.04 | `advanced-reasoning-frameworks` | Advanced Reasoning Frameworks | 2,100 | Benchmark ToT vs. single-pass CoT on one hard task | Benchmark scorecard | | |
| 13.05 | `automatic-prompt-optimization` | Automatic Prompt Optimization | 2,000 | Run one auto-optimization pass using a small eval set | Before/after eval comparison | ★ | |
| 13.06 | `evaluating-prompts` | Evaluating Prompts | 2,300 | Build a 20-case regression sheet, score two prompt versions | Graded eval pack | | `building-with-ai` |
| 13.07 | `prompt-engineering-for-production` | Prompt Engineering for Production | 2,200 | Version and A/B test two variants with cost/latency tracking | Production readiness checklist | | `building-with-ai` |
| 13.08 | `model-specific-prompting` | Model-Specific Prompting | 2,000 | Port one prompt across 3 model families, log deltas | Portability report | | |
| 13.09 | `adversarial-and-red-team-prompting` | Adversarial and Red-Team Prompting (Advanced) | 2,200 | Full red-team + patch cycle on a production-style assistant | Graded red-team brief | | |
| 13.10 | `domain-playbooks` | Domain Playbooks | 2,100 | Adapt the playbook recipes to your own domain use case | Domain adaptation submission | | |
| 13.11 | `prompting-as-it-evolves-capstone` | Prompting as It Evolves (Capstone) | 1,800 + capstone | **Capstone:** Build a Production-Grade Prompt System — chaining + context engineering + evals + guardrails in one shippable deliverable | Graded capstone + certification exam option | | |

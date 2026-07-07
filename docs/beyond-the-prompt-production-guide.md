# Beyond the Prompt — Production Guide

Working reference for producing the 31 articles via the `seomachine` workspace's `/produce` → `/deploy` pipeline, and for wiring each one into Seekvana once it lands.

The "Objective & Why It Matters" column below is copied verbatim from `docs/prompt-craft-combined-curriculum.md` §6 — that's the actual content brief (what the article needs to teach, what it differentiates against). Feed it to seomachine alongside the `/produce` topic string so Stage 4 (Article Planning) doesn't have to guess the angle from the topic string alone.

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

4. **Confirm the difficulty tag matches the article's tier** — `beginner` for module 11, `intermediate` for module 12, `advanced` for module 13 (see tables below).

5. **Confirm the "does this still apply to reasoning models?" note is present** on the six ★-flagged articles (tables below) — this is the course's core differentiator; it must not get dropped in the generic seomachine template.

6. **Confirm the hand-off "go deeper" link is present and points to the correct pillar** for the 8 articles that have one (tables below).

7. **Build check.** Run `npm run build`. Fix anything it flags before moving to the next article. No JSON edit needed — `lessonNumber` (point 2) wires it into the path automatically.

## Article tables

Batches match the plan's Tier 1 → 2 → 3 review checkpoints — deploy and QA a full batch before starting the next. Prereq ids reference other topic ids in this same table (e.g. `11.02` = Batch 1 row 2).

### Batch 1 — Module 11, Foundations (`difficulty: "beginner"`)

| Id | Slug / `/produce` topic | Objective & Why It Matters | Words | Exercise | Prereq | Assessment |
|---|---|---|---:|---|---|---|
| 11.01 | `what-prompting-actually-is`<br>What Prompting Actually Is — and Why It Still Matters in 2026 | Builds the LLM-as-next-token-predictor mental model; states the prompt-vs-context distinction up front; defuses the "prompt engineering is dead" myth. *Packs: intro + how models read prompts + the 2026 landscape.* | 1,600 | Label 5 failure cases as prompt/context/retrieval/eval issues | None | 8-question quiz |
| 11.02 | `the-anatomy-of-a-prompt`<br>The Anatomy of a Prompt | The six components — role, task, context, examples, format, constraints — as a reusable skeleton. *Packs 4–5 competitor "parts of a prompt" pages.* | 1,800 | Build one template, apply to 3 different tasks | 11.01 | Template submission |
| 11.03 | `clear-and-direct-the-core-skill`<br>Clear and Direct: The Core Skill | Specificity, positive framing, ambiguity removal, why small wording changes shift output quality. | 1,700 | Rewrite 5 vague prompts into clear/direct versions | 11.02 | Rewrite drill, rubric-scored |
| 11.04 | `giving-the-model-a-role-and-an-audience`<br>Giving the Model a Role and an Audience | Persona + audience-persona together; when role genuinely helps vs. cargo-cults on modern models. | 1,500 | A/B a task with and without persona, compare | 11.03 | Reflection quiz |
| 11.05 | `showing-vs-telling`<br>Showing vs Telling: Examples and Few-Shot | Zero-/one-/few-shot; picking and ordering examples; when examples beat instructions. *Packs the entire zero/one/few-shot cluster (5+ competitor pages).* | 1,900 | Build a 3-shot set for a formatting task, test edge cases | 11.02–11.04 | Auto-checked output test |
| 11.06 | `controlling-the-output`<br>Controlling the Output | Format control (markdown/tables/JSON), prefill, length and tone control. | 1,800 | Build a schema-constrained extraction prompt | 11.05 | Auto-checked output test |
| 11.07 | `giving-the-model-room-to-think`<br>Giving the Model Room to Think | Chain-of-thought and scratchpads — and the modern twist: how this flips on reasoning models. *Almost no beginner course covers the flip.* | 1,900 | Compare zero-shot vs. CoT-scaffolded on one task | 11.06 | Mini lab with rubric |
| 11.08 | `the-iteration-loop`<br>The Iteration Loop | Debugging bad output, refining one variable at a time, building a personal prompt library. | 1,700 | Run 3 iteration cycles on a failing prompt, log changes | 11.01–11.07 | Iteration log + Tier 1 quiz |

### Batch 2 — Module 12, Builder (`difficulty: "intermediate"`)

★ = needs the "does this still apply to reasoning models?" note. Hand-off = the pillar its closing "go deeper" link points to.

| Id | Slug / `/produce` topic | Objective & Why It Matters | Words | Exercise | Prereq | Assessment | ★ | Hand-off |
|---|---|---|---:|---|---|---|---|---|
| 12.01 | `a-working-catalog-of-prompt-patterns`<br>A Working Catalog of Prompt Patterns | The ~8 patterns that earn their place, with a decision guide. *Packs Vanderbilt's 22-pattern catalog, curated to what pays off.* | 2,000 | Match 6 real tasks to the correct pattern | Module 11 | Scenario-matching quiz | | |
| 12.02 | `decomposition-and-prompt-chaining`<br>Decomposition and Prompt Chaining | Breaking large tasks into steps, piping outputs, knowing when to chain vs. single-shot. | 2,000 | Build a 3-step chain for a multi-part task | 12.01 | Chain design review | | |
| 12.03 | `self-consistency-and-verification`<br>Self-Consistency and Verification | Sampling multiple reasoning paths, self-critique, a first look at LLM-as-judge. | 1,900 | Run self-consistency sampling, compare outputs | 12.02 | Lab writeup | | |
| 12.04 | `reducing-hallucinations`<br>Reducing Hallucinations | Evidence-first (quote-then-answer) prompting, grounding, citation discipline. *Ties to Seekvana's well-sourced brand.* | 2,000 | Ground a factual prompt in a source doc, test for fabrication | 12.03 | Graded hallucination check | | `large-language-models` |
| 12.05 | `prompting-reasoning-models`<br>Prompting Reasoning Models | What to do differently for o-series/DeepSeek R1/extended thinking; when added CoT actively hurts. *Almost no competitor teaches this.* | 2,100 | Run one task on a chat model and a reasoning model, compare | 11.07, 12.04 | Comparison lab report | ★ | |
| 12.06 | `context-engineering-part-1`<br>Context Engineering, Part 1 — Foundations | The shift from prompt to context: what the model sees each call, system/user/tool context, basic window budgeting. *The single biggest gap in every beginner course.* | 2,200 | Audit a real system-prompt + context stack for waste | 12.05 | Audit worksheet | ★ | |
| 12.07 | `rag-aware-prompting`<br>Prompting Over Documents and Data (RAG-Aware Prompting) | Grounding instructions, long-context handling, the "lost in the middle" problem. *Bridges to the RAG pillar.* | 2,000 | Diagnose retrieval noise in a sample transcript | 12.06 | Diagnostic lab | | `large-language-models` |
| 12.08 | `structured-outputs-and-schema-driven-prompting`<br>Structured Outputs and Schema-Driven Prompting | JSON mode, schemas, function/tool calling as a form of prompting, reliable parsing. | 1,900 | Build a schema-constrained extraction, test edge cases | 11.06, 12.07 | Auto-checked test suite | ★ | `building-with-ai` |
| 12.09 | `multimodal-prompting`<br>Multimodal Prompting | Images, screenshots, documents; vision-model prompting; image-gen essentials in one article. | 1,900 | Analyze a full image/PDF workflow | 12.08 | Practical lab | | |
| 12.10 | `system-prompts-that-scale`<br>System Prompts That Scale | Reusable system prompts, instruction hierarchy, style/tone control, guardrails in the system layer. | 1,800 | Write a production system prompt with hierarchy + guardrails | 12.09 | Rubric review | | |
| 12.11 | `meta-prompting-and-prompt-generation`<br>Meta-Prompting and Prompt Generation | Using models to write/improve prompts; treating a prompt as a reusable function. | 1,700 | Optimize one of your own earlier prompts, compare before/after | 12.10 | Before/after submission | | |
| 12.12 | `prompt-security-basics`<br>Prompt Security Basics | Injection, jailbreaks, data exfiltration, prompt leaking, defensive prompting. *Learn Prompting gates this behind a paid masterclass; here it's on the main path.* | 2,100 | Red-team a sample assistant prompt and patch it | 12.11 | Red-team report + Tier 2 quiz | ★ | |

### Batch 3 — Module 13, Production & Frontier (`difficulty: "advanced"`)

| Id | Slug / `/produce` topic | Objective & Why It Matters | Words | Exercise | Prereq | Assessment | ★ | Hand-off |
|---|---|---|---:|---|---|---|---|---|
| 13.01 | `context-engineering-part-2`<br>Context Engineering, Part 2 — Production Systems | The layered context stack, memory, conversation compaction, tool-output truncation, state across long agent runs. | 2,300 | Design a compaction strategy for a 50-turn agent transcript | 12.06, 12.12 | Design doc review | ★ | `agentic-ai` |
| 13.02 | `agentic-prompting`<br>Agentic Prompting | Agents vs. chatbots, ReAct, plan-and-execute, tool use. *Bridges to the Agentic AI pillar.* | 2,200 | Write system + tool prompts for a web-research agent | 13.01 | Scenario assignment | | `agentic-ai` |
| 13.03 | `multi-agent-prompting-and-orchestration`<br>Multi-Agent Prompting and Orchestration | Role specialization, supervisor/worker prompts, hand-offs, debate/critique patterns. | 2,200 | Design a 3-agent hand-off spec for a research-and-write flow | 13.02 | Architecture review | | `agentic-ai` |
| 13.04 | `advanced-reasoning-frameworks`<br>Advanced Reasoning Frameworks | Tree of Thoughts, Graph of Thoughts, Reflexion, least-to-most — and when the extra cost is worth it. | 2,100 | Benchmark ToT vs. single-pass CoT on one hard task | 13.03 | Benchmark scorecard | | |
| 13.05 | `automatic-prompt-optimization`<br>Automatic Prompt Optimization | APE, DSPy, "program your prompts, don't hand-tune them," eval-driven optimization. *Very few courses teach this.* | 2,000 | Run one auto-optimization pass using a small eval set | 12.03, 13.04 | Before/after eval comparison | ★ | |
| 13.06 | `evaluating-prompts`<br>Evaluating Prompts | Building evals, golden datasets, LLM-as-judge done properly, regression-testing. *Bridges to the Evals pillar.* | 2,300 | Build a 20-case regression sheet, score two prompt versions | 13.05 | Graded eval pack | | `building-with-ai` |
| 13.07 | `prompt-engineering-for-production`<br>Prompt Engineering for Production | Versioning, cost/latency/token budgeting, caching, A/B testing in the wild. | 2,200 | Version and A/B test two variants with cost/latency tracking | 13.06 | Production readiness checklist | | `building-with-ai` |
| 13.08 | `model-specific-prompting`<br>Model-Specific Prompting | How Claude/GPT/Gemini/open models differ; porting a prompt across models without a rewrite. | 2,000 | Port one prompt across 3 model families, log deltas | 13.07 | Portability report | | |
| 13.09 | `adversarial-and-red-team-prompting`<br>Adversarial and Red-Team Prompting (Advanced) | Professional red-teaming, HackAPrompt-style techniques, robust guardrails, safety evals. | 2,200 | Full red-team + patch cycle on a production-style assistant | 12.12, 13.08 | Graded red-team brief | | |
| 13.10 | `domain-playbooks`<br>Domain Playbooks | Applied recipes — coding, writing/marketing, data analysis, research, professional work — replacing scattered "use case" filler. | 2,100 | Adapt the playbook recipes to your own domain use case | 13.09 | Domain adaptation submission | | |
| 13.11 | `prompting-as-it-evolves-capstone`<br>Prompting as It Evolves (Capstone) | Reading model cards and system prompts, adapting as models change, separating durable principles from disposable tricks. | 1,800 + capstone | **Capstone:** Build a Production-Grade Prompt System — chaining + context engineering + evals + guardrails in one shippable deliverable | All prior | Graded capstone + certification exam option | | |

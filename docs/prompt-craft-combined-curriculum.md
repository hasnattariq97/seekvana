# Prompt Craft — Combined Curriculum Blueprint

**For:** Seekvana (seekvana.com) · Prompt Engineering pillar
**Built by merging:** the *Prompt Craft* strategy doc (content voice, differentiation, article briefs) + the *Deep Research* competitive audit (evidence base, pedagogy, assessments, product stack)

---

## 0. What this document is

Two independent analyses of the same opportunity converged on nearly the same modern-prompting spine — context engineering, reasoning-model behavior, evals, RAG-aware prompting, agentic/tool prompting, multimodal, security, production ops. That convergence is the confidence signal. This blueprint keeps:

- **From Prompt Craft:** the course name, the differentiation thesis, and the rich per-article "what it teaches / what it packs" briefs (the writer-facing spec).
- **From the Deep Research audit:** the evidence (Seekvana's actual current inventory, 12-course competitive benchmark, topic-frequency data), the two-track structure (fast + full), and full pedagogical scaffolding — objective, word count, hands-on exercise, prerequisite, assessment — for every single lesson (the learner-facing spec).

---

## 1. Positioning

**Course name: `Prompt Craft`**
Tagline: *From your first prompt to production-grade agents.*

**Positioning statement:** Learn prompt engineering as a production skill, not a bag of tricks. Competitors already teach simple prompt writing well — that part of the market is saturated (basics appear in 10 of 12 benchmarked competitor courses; structure/persona/formatting in 11 of 12). What's scarce is a course that explains how prompts behave inside real systems: with retrieval, tools, evals, multimodal input, cost, and safety constraints. That's exactly where Seekvana's existing pillars (RAG, Evals, Agentic AI, LLMs) already point.

**Keep the library pillar named** "Prompt Engineering" (SEO term people search) and **name the learning path/course** `Prompt Craft`. Discoverability + brand, in one move.

---

## 2. Audit snapshot — why now

| Signal | Current state |
|---|---|
| Prompt Engineering topic page | Exists, but shows **0 articles** — "No articles yet, check back soon" |
| Learning paths live | **1** ("Getting Started" — 10 modules, 101 topics, 3–5 hrs) |
| Prompt content today | Scattered across glossary (35 terms), one LLM explainer, one prompt-adjacent mindset article, one future curriculum stub, one AI-tools article |
| Homepage promise | Already claims "from your first prompt to production-grade agents" and foregrounds Prompting, RAG, and Evals |

**The gap:** the brand promise is already ahead of the syllabus. This is the cleanest, least contested place in the whole site to launch a flagship course.

---

## 3. Why this course wins — the differentiation

1. **Density over volume.** Where competitors spread zero-/one-/few-shot across 5+ pages, one dense article ("Showing vs Telling") teaches the whole cluster with a decision guide. Target equivalent coverage in roughly half the article count.
2. **Modern-first, not modern-appended.** Reasoning models, context engineering, structured outputs, and evals sit on the *main path*, in beginner-readable language — not gated as "advanced." Across the 12-course benchmark, tool-use/agent prompting appears in just 1 course, RAG in 2, LLMOps in 2. That's the white space.
3. **Layered depth — one page, two readers.** Every article runs *principle → pattern → production*. A beginner stops at the top, satisfied; a professional reads the "in production" note at the bottom and gets the token-budget, eval, or model-porting detail they came for.
4. **Security taught openly.** Learn Prompting gates injection/jailbreak content behind a paid masterclass; this course teaches the fundamentals free, on the main path.
5. **Current models, durable principles.** Examples use 2026 models (Claude, GPT-5-class, Gemini, DeepSeek R1, open models); every technique article carries a "does this still apply to reasoning models?" note so the course doesn't date the way 2023-era courses have.

---

## 4. Two tracks, one spine

- **Fast Track** — 10 lessons, for learners who want the full arc quickly (mirrors "Getting Started"'s existing micro-course format).
- **Full Track** — 31 articles across 3 tiers, for learners who want to go deep and build a portfolio capstone.

Both tracks walk the same spine:

`Foundations & anatomy → Patterns & structured output → Reasoning & decomposition → Context engineering & RAG → Tools & agents → Multimodal & safety → Production ops & optimization → Capstone`

---

## 5. Fast Track (10 lessons)

Each fast-track lesson maps to (and can be excerpted from) specific Full Track articles, so the two tracks share one content base rather than forking into separate maintenance work.

| # | Lesson | Objective | Maps to Full Track # | Est. Words | Hands-on Exercise | Assessment |
|---|---|---|---|---:|---|---|
| 1 | Prompt Engineering vs. Context Engineering | Diagnose whether a failure is a prompt, context, retrieval, or eval problem | 1, 14 | 1,800 | Label 5 real failure cases by root cause | 8-question quiz |
| 2 | The Prompt Anatomy Framework | Build a reusable task–context–constraints–output template | 2, 3 | 2,000 | Build one template, reuse it on 3 tasks | Template submission |
| 3 | Reasoning Patterns That Still Matter | Use few-shot, CoT, self-ask — and know when *not* to | 5, 7, 13 | 2,200 | Compare zero-shot vs. scaffolded prompt on one task | Mini lab with rubric |
| 4 | Structured Outputs and Reliable Formatting | Control JSON/tables/schemas; test edge cases | 6, 16 | 1,900 | Build a schema-constrained extraction prompt | Auto-checked output test |
| 5 | Prompt Evals for Humans Who Ship Things | Build a small gold set and score prompt versions | 11, 26 | 2,300 | 15-case eval sheet scoring two prompt versions | Graded eval worksheet |
| 6 | RAG and Long-Context Prompting | Diagnose retrieval noise and "lost in the middle" failures | 15 | 2,200 | Diagnose noise in a sample RAG transcript | Notebook/spreadsheet lab |
| 7 | Tools, Functions, and Agentic Prompts | Design tool-choice, stop conditions, and hand-offs | 22 | 2,100 | Write system + tool prompts for a research agent | Scenario-based assignment |
| 8 | Multimodal and Safety-Critical Prompting | Prompt with images/PDFs; defend against injection | 17, 20 | 2,300 | Red-team a document-QA prompt and patch it | Red-team report |
| 9 | Model-Specific Porting | Move one prompt across model families without a rewrite | 28 | 1,900 | Port a prompt across 3 model families, log deltas | Portability report |
| 10 | Shipping Prompt Systems | Version, cache, and monitor a prompt in production | 27, 31 | 2,400 | Capstone: ship a small evaluated assistant | Graded capstone |

---

## 6. Full Track — 31 Articles

### Tier 1 — Foundations (Beginner) · 8 articles

| # | Article | Objective & Why It Matters | Words | Hands-on Exercise | Prereq | Assessment |
|---|---|---|---:|---|---|---|
| 1 | **What Prompting Actually Is — and Why It Still Matters in 2026** | Builds the LLM-as-next-token-predictor mental model; states the prompt-vs-context distinction up front; defuses the "prompt engineering is dead" myth. *Packs: intro + how models read prompts + the 2026 landscape.* | 1,600 | Label 5 failure cases as prompt/context/retrieval/eval issues | None | 8-question quiz |
| 2 | **The Anatomy of a Prompt** | The six components — role, task, context, examples, format, constraints — as a reusable skeleton. *Packs 4–5 competitor "parts of a prompt" pages.* | 1,800 | Build one template, apply to 3 different tasks | Art. 1 | Template submission |
| 3 | **Clear and Direct: The Core Skill** | Specificity, positive framing, ambiguity removal, why small wording changes shift output quality. | 1,700 | Rewrite 5 vague prompts into clear/direct versions | Art. 2 | Rewrite drill, rubric-scored |
| 4 | **Giving the Model a Role and an Audience** | Persona + audience-persona together; when role genuinely helps vs. cargo-cults on modern models. | 1,500 | A/B a task with and without persona, compare | Art. 3 | Reflection quiz |
| 5 | **Showing vs Telling: Examples and Few-Shot** | Zero-/one-/few-shot; picking and ordering examples; when examples beat instructions. *Packs the entire zero/one/few-shot cluster (5+ competitor pages).* | 1,900 | Build a 3-shot set for a formatting task, test edge cases | Art. 2–4 | Auto-checked output test |
| 6 | **Controlling the Output** | Format control (markdown/tables/JSON), prefill, length and tone control. | 1,800 | Build a schema-constrained extraction prompt | Art. 5 | Auto-checked output test |
| 7 | **Giving the Model Room to Think** | Chain-of-thought and scratchpads — and the modern twist: how this flips on reasoning models. *Almost no beginner course covers the flip.* | 1,900 | Compare zero-shot vs. CoT-scaffolded on one task | Art. 6 | Mini lab with rubric |
| 8 | **The Iteration Loop** | Debugging bad output, refining one variable at a time, building a personal prompt library. | 1,700 | Run 3 iteration cycles on a failing prompt, log changes | Art. 1–7 | Iteration log + Tier 1 quiz |

### Tier 2 — Builder (Intermediate) · 12 articles

| # | Article | Objective & Why It Matters | Words | Hands-on Exercise | Prereq | Assessment |
|---|---|---|---:|---|---|---|
| 9 | **A Working Catalog of Prompt Patterns** | The ~8 patterns that earn their place, with a decision guide. *Packs Vanderbilt's 22-pattern catalog, curated to what pays off.* | 2,000 | Match 6 real tasks to the correct pattern | Tier 1 | Scenario-matching quiz |
| 10 | **Decomposition and Prompt Chaining** | Breaking large tasks into steps, piping outputs, knowing when to chain vs. single-shot. | 2,000 | Build a 3-step chain for a multi-part task | Art. 9 | Chain design review |
| 11 | **Self-Consistency and Verification** | Sampling multiple reasoning paths, self-critique, a first look at LLM-as-judge. | 1,900 | Run self-consistency sampling, compare outputs | Art. 10 | Lab writeup |
| 12 | **Reducing Hallucinations** | Evidence-first (quote-then-answer) prompting, grounding, citation discipline. *Ties to Seekvana's well-sourced brand.* | 2,000 | Ground a factual prompt in a source doc, test for fabrication | Art. 11 | Graded hallucination check |
| 13 | **Prompting Reasoning Models** ★ | What to do differently for o-series/DeepSeek R1/extended thinking; when added CoT actively hurts. *Almost no competitor teaches this.* | 2,100 | Run one task on a chat model and a reasoning model, compare | Art. 7, 12 | Comparison lab report |
| 14 | **Context Engineering, Part 1 — Foundations** ★ | The shift from prompt to context: what the model sees each call, system/user/tool context, basic window budgeting. *The single biggest gap in every beginner course.* | 2,200 | Audit a real system-prompt + context stack for waste | Art. 13 | Audit worksheet |
| 15 | **Prompting Over Documents and Data (RAG-Aware Prompting)** | Grounding instructions, long-context handling, the "lost in the middle" problem. *Bridges to the RAG pillar.* | 2,000 | Diagnose retrieval noise in a sample transcript | Art. 14 | Diagnostic lab |
| 16 | **Structured Outputs and Schema-Driven Prompting** ★ | JSON mode, schemas, function/tool calling as a form of prompting, reliable parsing. | 1,900 | Build a schema-constrained extraction, test edge cases | Art. 6, 15 | Auto-checked test suite |
| 17 | **Multimodal Prompting** | Images, screenshots, documents; vision-model prompting; image-gen essentials in one article. | 1,900 | Analyze a full image/PDF workflow | Art. 16 | Practical lab |
| 18 | **System Prompts That Scale** | Reusable system prompts, instruction hierarchy, style/tone control, guardrails in the system layer. | 1,800 | Write a production system prompt with hierarchy + guardrails | Art. 17 | Rubric review |
| 19 | **Meta-Prompting and Prompt Generation** | Using models to write/improve prompts; treating a prompt as a reusable function. | 1,700 | Optimize one of your own earlier prompts, compare before/after | Art. 18 | Before/after submission |
| 20 | **Prompt Security Basics** ★ (free, not paywalled) | Injection, jailbreaks, data exfiltration, prompt leaking, defensive prompting. *Learn Prompting gates this behind a paid masterclass; here it's on the main path.* | 2,100 | Red-team a sample assistant prompt and patch it | Art. 19 | Red-team report + Tier 2 quiz |

### Tier 3 — Production & Frontier (Advanced) · 11 articles

| # | Article | Objective & Why It Matters | Words | Hands-on Exercise | Prereq | Assessment |
|---|---|---|---:|---|---|---|
| 21 | **Context Engineering, Part 2 — Production Systems** ★ | The layered context stack, memory, conversation compaction, tool-output truncation, state across long agent runs. | 2,300 | Design a compaction strategy for a 50-turn agent transcript | Art. 14, 20 | Design doc review |
| 22 | **Agentic Prompting** | Agents vs. chatbots, ReAct, plan-and-execute, tool use. *Bridges to the Agentic AI pillar.* | 2,200 | Write system + tool prompts for a web-research agent | Art. 21 | Scenario assignment |
| 23 | **Multi-Agent Prompting and Orchestration** | Role specialization, supervisor/worker prompts, hand-offs, debate/critique patterns. | 2,200 | Design a 3-agent hand-off spec for a research-and-write flow | Art. 22 | Architecture review |
| 24 | **Advanced Reasoning Frameworks** | Tree of Thoughts, Graph of Thoughts, Reflexion, least-to-most — and when the extra cost is worth it. | 2,100 | Benchmark ToT vs. single-pass CoT on one hard task | Art. 23 | Benchmark scorecard |
| 25 | **Automatic Prompt Optimization** ★ | APE, DSPy, "program your prompts, don't hand-tune them," eval-driven optimization. *Very few courses teach this.* | 2,000 | Run one auto-optimization pass using a small eval set | Art. 11, 24 | Before/after eval comparison |
| 26 | **Evaluating Prompts** | Building evals, golden datasets, LLM-as-judge done properly, regression-testing. *Bridges to the Evals pillar.* | 2,300 | Build a 20-case regression sheet, score two prompt versions | Art. 25 | Graded eval pack |
| 27 | **Prompt Engineering for Production** | Versioning, cost/latency/token budgeting, caching, A/B testing in the wild. | 2,200 | Version and A/B test two variants with cost/latency tracking | Art. 26 | Production readiness checklist |
| 28 | **Model-Specific Prompting** | How Claude/GPT/Gemini/open models differ; porting a prompt across models without a rewrite. | 2,000 | Port one prompt across 3 model families, log deltas | Art. 27 | Portability report |
| 29 | **Adversarial and Red-Team Prompting (Advanced)** | Professional red-teaming, HackAPrompt-style techniques, robust guardrails, safety evals. | 2,200 | Full red-team + patch cycle on a production-style assistant | Art. 20, 28 | Graded red-team brief |
| 30 | **Domain Playbooks** | Applied recipes — coding, writing/marketing, data analysis, research, professional work — replacing scattered "use case" filler. | 2,100 | Adapt the playbook recipes to your own domain use case | Art. 29 | Domain adaptation submission |
| 31 | **Prompting as It Evolves (Capstone)** | Reading model cards and system prompts, adapting as models change, separating durable principles from disposable tricks. | 1,800 + capstone | **Capstone:** Build a Production-Grade Prompt System — chaining + context engineering + evals + guardrails in one shippable deliverable | All prior | Graded capstone + certification exam option |

---

## 7. Beyond articles — the product stack

Articles alone read like a blog; this layer makes it a course.

| Component | Recommendation | Why it differentiates |
|---|---|---|
| Prompt templates | Downloadable "prompt cards" — task, context, examples, output schema, failure modes | Turns reading into reuse |
| Interactive labs | Lightweight notebook/spreadsheet labs for evals, RAG, model comparison | Moves the course from advice to practice |
| Graded projects | One per tier boundary (formatting, evals, RAG, tool use, safety) plus the final capstone | Gives learners portfolio value |
| Community prompt library | Curated patterns by workflow/model, with ratings and known failure cases | Builds retention and moat |
| Certification exam | Practical: fix a broken prompt system and justify changes with eval evidence | Stronger signal than a recall quiz |

---

## 8. Pillar hand-offs

The course is an on-ramp, not a silo — it should hand off, not duplicate:

- **Reducing Hallucinations (12) + RAG-Aware Prompting (15)** → **RAG** pillar
- **Agentic Prompting (22) + Multi-Agent (23) + Context Engineering Pt. 2 (21)** → **Agentic AI** pillar
- **Evaluating Prompts (26)** → **Evals** pillar
- **Structured Outputs (16) + Production (27)** → **Building with AI** pillar

Each hand-off article should end with a "go deeper" link into the relevant pillar — a growth engine for the rest of the library, not a dead end.

---

## 9. Naming options (ranked)

| Rank | Name | Signals | Risk |
|---|---|---|---|
| 1 | **Prompt Craft** *(recommended)* | Brandable, ages well, pairs with the homepage tagline | Slightly abstract on its own — the tagline carries it |
| 2 | Prompt to Production | Most literal description of the arc; strong SEO | Less brandable |
| 3 | The Prompting Path | Fits existing "Learning Paths" naming exactly | Generic |
| 4 | Prompt Engineering for Agents and Apps | Clear, modern, signals production focus | More technical-sounding for a beginner entry point |
| 5 | Fluent (subtitle: The Prompt Engineering Course) | Implies mastery/communication, distinctive | Abstract without the subtitle |

---

## 10. Execution notes

- **Voice:** clear, well-sourced, jargon-defined-on-first-use; advanced articles open beginner-readable, then deepen.
- **Sourcing:** cite primary research where it strengthens credibility (*The Prompt Report* survey for technique taxonomy; ToT/ReAct papers for reasoning frameworks).
- **Recency guardrail:** every technique article carries a "does this still apply to reasoning models?" note — the single habit that keeps the course ahead of competitors stuck on 2023-era advice.
- **Difficulty tags:** reuse Seekvana's existing Beginner/Intermediate/Advanced tags.
- **Launch sequencing:** publish Tier 1 (1–8) first, plus the two flagship differentiators early — Art. 13 (Reasoning Models) and Art. 14 (Context Engineering Pt. 1). Those two are the most shareable/citable, since almost no one else teaches them to beginners.
- **Fast Track first:** since the Prompt Engineering topic page currently has zero articles, shipping the 10-lesson Fast Track first (built from Tier 1–2 excerpts) gets a complete, coherent path live fastest, with the Full Track filling in behind it.

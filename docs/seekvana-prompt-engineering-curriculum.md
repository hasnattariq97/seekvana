# Prompt Craft — Course Curriculum & Strategy

**For:** Seekvana (seekvana.com) · Prompt Engineering pillar
**Goal:** Fewer, denser articles that teach more — modern and advanced material that serves beginners and professionals from the same pages.

---

## TL;DR

The prompt engineering course market is crowded but stale. The honest state of it in 2026: **most courses still teach 2023-era basics** — zero-shot, personas, chain-of-thought — spread across 40–60 fragmented pages, built around GPT-3.5 / Claude 3-era behaviour. The field has already moved to **reasoning models, context engineering, agentic prompting, and eval-driven optimization**, and almost no course teaches those to beginners.

**That gap is Seekvana's opening.** The differentiation is not "another comprehensive course." It is: *teach the modern discipline in ~30 dense articles instead of 60 thin ones, and put the 2026 material (reasoning models, context engineering, agents, evals) on the main path — not locked behind an "advanced" paywall.*

**Recommended course name: `Prompt Craft`** — tagline *"From your first prompt to production-grade agents."* (Alternates and rationale below.)

---

## 1. Competitor landscape — who teaches what

| Platform | Shape | What they teach | Their weakness |
|---|---|---|---|
| **Learn Prompting** (Schulhoff / HackAPrompt) | 60+ modules, open-source, research-backed | Basics → applications → intermediate research techniques → reliability → image prompting → prompt hacking → tooling → gradient prompt tuning | Sprawling and fragmented; one micro-technique per page. Red-teaming and best material gated behind paid masterclass. |
| **DAIR.AI Prompting Guide** (promptingguide.ai) | Reference wiki | The full research taxonomy: CoT, self-consistency, ToT, ReAct, Reflexion, PAL, ART, APE, active-prompt, RAG, graph prompting; now adding agents, context engineering, reasoning LLMs, function calling | Dense and academic; not a learning path, no progression, intimidating for beginners. |
| **Anthropic Interactive Tutorial** | 9 chapters + appendix | Prompt structure, clear & direct, roles, separating data/instructions, output formatting, step-by-step thinking, few-shot, avoiding hallucinations, complex prompts; appendix: chaining, tool use, retrieval | Claude-specific; still on Claude 3-era framing; no context engineering, agents, or evals as first-class topics. |
| **Vanderbilt / Jules White** (Coursera, 650k+ enrolled) | ~6 modules, pattern-based | A named catalog of 22+ prompt patterns: persona, flipped interaction, question refinement, cognitive verifier, audience persona, template, recipe, meta-language, alternative approaches, semantic filter; advanced course adds in-context learning + RAG | Excellent mental model but non-technical; ends where production begins. No reasoning models, no agents, no evals, no security. |
| **Google Prompting Essentials** | Short, credentialed | TCREI framework (Task, Context, References, Evaluate, Iterate), multimodal, light intro to AI agents & chaining | Shallow; Gemini/Workspace-flavoured; framework-first, thin on technique. |
| **DeepLearning.AI** (Ng / Fulford) | 1-hour, developer | API prompting, zero/few-shot, structured output, summarize/infer/transform/expand, build a chatbot, iterate | Great but tiny; single-prompt mindset; no context engineering, agents, or evals. |
| **Udemy bootcamps** (ZTM, "Complete PE Bootcamp") | 27–32h, project-heavy | Everything model-by-model (GPT/Claude/Gemini/Llama), image + video gen, agents, RAG, meta-prompting, playground hyperparameters | Volume over density; quality varies; "updated for 2026" often means one new video. Long time-to-value. |

**The consistent pattern:** breadth is fragmented (Learn Prompting, DAIR), depth is non-technical (Vanderbilt), technical depth is either vendor-locked (Anthropic) or buried in long bootcamps (Udemy). **Nobody delivers modern + dense + progression + model-agnostic in one clean path.**

---

## 2. The market gap (why 2026 matters)

Three shifts have made most existing curricula obsolete, and each is a topic beginners are *not* being taught:

1. **Reasoning models changed the rules.** With o-series, DeepSeek R1, Claude extended thinking, and Gemini thinking, several classic techniques (heavy chain-of-thought, elaborate step-by-step scaffolds) are now redundant or actively counterproductive. Courses still teach "always say think step by step" — which is now wrong advice for a whole model class.

2. **Context engineering has overtaken prompt wording.** The leverage moved from *how you phrase the instruction* to *what the model sees on every call* — system prompt, retrieved documents, memory, tool definitions, conversation state. Industry surveys in 2026 report the large majority of teams now say prompt wording alone is insufficient at scale. This is the single biggest missing topic across every beginner course.

3. **Agents fail differently than chatbots.** A prompt that works in a single turn breaks over a 50-turn agent run. The skills that matter — state management, context compaction, tool-output handling, evals — are production concerns that pattern-and-persona courses never reach.

Seekvana already has pillars for **Agentic AI, RAG, Evals, and LLMs.** The prompt engineering course should be the *on-ramp* that teaches these shifts in plain language and hands off cleanly to those deeper pillars — not a walled-off silo.

---

## 3. Seekvana's differentiation — the positioning

Four concrete commitments, each provable on the page:

1. **Density over volume — "one article, one concept cluster."** Where Learn Prompting has ten pages (zero-shot, one-shot, few-shot, example selection, example ordering…), Seekvana has one dense article on *Showing vs Telling* that teaches the whole cluster with a clear when-to-use decision. Target the same coverage in roughly half the article count. This directly delivers the "less articles, teach more" mandate.

2. **Modern-first, not modern-appended.** Reasoning models, context engineering, structured outputs, and evals appear on the **main path**, introduced in beginner-friendly language — not bolted on as "advanced extras." A beginner learns *why you no longer force chain-of-thought on a reasoning model* in the same breath they learn what chain-of-thought is.

3. **Layered depth — the same article serves both audiences.** Each article runs *principle → pattern → production*. A beginner reads the top of the article and stops satisfied; a professional reads the "In production" section at the bottom and gets the token-budget, eval, or model-porting note they came for. One page, two readers.

4. **Current models, model-agnostic principles.** Examples use 2026 models (Claude Opus 4.x / Fable, GPT-5-class, Gemini, DeepSeek R1, open models), teach the durable principles, and explicitly cover *porting a prompt across models*. No GPT-3.5 relics.

Brand fit: this reinforces Seekvana's existing promise — *"clear, well-sourced writing for beginners and builders alike," "from your first prompt to production-grade agents."* The course is the literal embodiment of the homepage line.

---

## 4. Course name

**Primary recommendation: `Prompt Craft`**
Tagline: *From your first prompt to production-grade agents.*

Why it wins: two syllables, memorable, brandable; "craft" signals both art and repeatable skill (matches the pattern-based, non-gimmicky tone); pairs with a tagline that reuses your own homepage arc; ages well because it isn't tied to a technique that may date. Reads well in navigation next to your existing plain, calm labels ("Getting Started," "Prompt Engineering").

**Ranked alternates:**

1. **`Prompt to Production`** — most descriptive of the differentiation (the beginner→modern→production arc). Slightly more literal, great for SEO.
2. **`The Prompting Path`** — fits your existing "Learning Paths" structure exactly; calm, on-brand.
3. **`Fluent`** *(subtitle: The Prompt Engineering Course)* — implies mastery/communication; distinctive; risk is it's abstract on its own.
4. **`Clear Prompts`** — echoes "Learn AI, clearly"; friendly but perhaps too soft for the advanced material.

Keep the **library pillar** named "Prompt Engineering" (SEO term people search), and name the **learning path / course** `Prompt Craft`. Best of both: discoverability + brand.

---

## 5. The curriculum

~31 articles across three tiers. Every article is a dense concept cluster, written principle → pattern → production so it serves beginners and pros at once. The "packs" note shows what competitor sprawl each single article absorbs.

### Tier 1 — Foundations (Beginner) · 8 articles

1. **What Prompting Actually Is — and Why It Still Matters in 2026**
   Mental model of an LLM as a next-token predictor; why wording is leverage; the prompt-vs-context-engineering distinction stated up front; directly defuses the "prompt engineering is dead" myth. *Packs: intro + how models read prompts + the 2026 landscape.*

2. **The Anatomy of a Prompt**
   The six components — role, task/directive, context, examples, output format, constraints — with a reusable skeleton. *Packs: what most courses spread across 4–5 "parts of a prompt" pages.*

3. **Clear and Direct: The Core Skill**
   Specificity, positive instructions over negative, removing ambiguity, why tiny details (even typos) shift output quality. *Packs: "be clear," "be specific," instruction prompting.*

4. **Giving the Model a Role and an Audience**
   Persona and audience-persona in one; when a role genuinely helps vs. when it's cargo-culting on modern models. *Packs: Vanderbilt's persona + audience persona patterns.*

5. **Showing vs Telling: Examples and Few-Shot**
   Zero-, one-, few-shot; how to pick and order examples; teaching format by demonstration; when examples beat instructions. *Packs: the entire zero/one/few-shot cluster (5+ competitor pages).*

6. **Controlling the Output**
   Format control (markdown, tables, JSON), structured outputs, prefill / "speaking for the model," length and tone control. *Packs: output formatting + template pattern + structured-output intro.*

7. **Giving the Model Room to Think**
   Chain-of-thought and scratchpads — *and* the modern twist: how this flips for reasoning models (don't over-scaffold an o-series / R1 / thinking model). *Packs: CoT + a topic almost no beginner course covers.*

8. **The Iteration Loop**
   Debugging a bad output, refining one variable at a time, the TCREI-style refine cycle, and how to build a personal prompt library that teaches you rather than turning you into a copy-paster. *Packs: iteration + "prompt library done right."*

### Tier 2 — Builder (Intermediate) · 12 articles

9. **A Working Catalog of Prompt Patterns**
   The ~8 patterns that actually earn their place — flipped interaction, question refinement, cognitive verifier, template, recipe, fact-check list, alternative approaches, semantic filter — with a decision guide. *Packs: Vanderbilt's 22-pattern catalog, curated down to what pays off.*

10. **Decomposition and Prompt Chaining**
    Breaking large tasks into steps, piping outputs between prompts, and knowing when to chain vs. do it in one shot.

11. **Self-Consistency and Verification**
    Sampling multiple reasoning paths, self-critique, cognitive verification, and a first look at LLM-as-judge.

12. **Reducing Hallucinations**
    Evidence-first prompting (quote-then-answer), grounding, giving the model permission to say "I don't know," citation discipline. *Ties to Seekvana's well-sourced brand.*

13. **Prompting Reasoning Models** ★ *modern*
    o-series, DeepSeek R1, Claude extended thinking, Gemini thinking: what to do differently, reasoning-effort control, and when adding CoT actively hurts. *Almost no competitor teaches this.*

14. **Context Engineering, Part 1 — Foundations** ★ *modern flagship*
    The shift from prompt to context; what the model sees on every call; system vs. user vs. tool context; the basics of context-window budgeting. *The single biggest gap in every beginner course.*

15. **Prompting Over Documents and Data (RAG-Aware Prompting)**
    How prompting changes when retrieval is involved: grounding instructions, long-context handling, the "lost in the middle" problem. *Bridges to the RAG pillar.*

16. **Structured Outputs and Schema-Driven Prompting** ★ *modern*
    JSON mode, schemas, function/tool calling as a form of prompting, and parsing reliably in real apps.

17. **Multimodal Prompting**
    Prompting with images, screenshots, and documents; vision-model prompting; the essentials of image-generation prompting (Midjourney / Flux / GPT-image) in one article.

18. **System Prompts That Scale**
    Designing reusable system prompts, instruction hierarchy, style/tone control, and putting guardrails in the system layer.

19. **Meta-Prompting and Prompt Generation**
    Using models to write and improve prompts, prompt templates, and treating a prompt as a reusable function.

20. **Prompt Security Basics** ★ *free early, not paywalled*
    Prompt injection, jailbreaks, data exfiltration, prompt leaking, and defensive prompting. *Learn Prompting gates this behind a paid masterclass; Seekvana teaches the fundamentals openly.*

### Tier 3 — Production & Frontier (Advanced) · 11 articles

21. **Context Engineering, Part 2 — Production Systems** ★ *modern flagship*
    The layered context stack, memory, conversation summarization / compaction, tool-output truncation, and state management across long agent runs.

22. **Agentic Prompting**
    Prompting agents vs. chatbots, ReAct, plan-and-execute, tool use, and recognizing when the agent loop replaces the single prompt. *Bridges to the Agentic AI pillar.*

23. **Multi-Agent Prompting and Orchestration**
    Role specialization, supervisor/worker prompts, handoffs, and debate/critique patterns.

24. **Advanced Reasoning Frameworks**
    Tree of Thoughts, Graph of Thoughts, Reflexion / self-reflection, least-to-most — and an honest take on when the extra cost is worth it.

25. **Automatic Prompt Optimization** ★ *modern*
    APE, DSPy, "program your prompts, don't hand-tune them," and eval-driven optimization. *Very few courses teach this.*

26. **Evaluating Prompts**
    Building evals, golden datasets, LLM-as-judge done properly, regression-testing prompts, measuring instead of vibing. *Bridges to the Evals pillar.*

27. **Prompt Engineering for Production**
    Versioning and prompt management, cost/latency/token budgeting, prompt caching, and A/B testing prompts in the wild.

28. **Model-Specific Prompting**
    How Claude, GPT, Gemini, and open models (Llama, DeepSeek, Qwen) differ; XML for Claude and similar quirks; porting a prompt across models without rewriting from scratch.

29. **Adversarial and Red-Team Prompting (Advanced)**
    Professional red-teaming, HackAPrompt-style techniques, building robust guardrails, and safety evals.

30. **Domain Playbooks**
    One dense article of applied recipes — coding, writing/marketing, data analysis, research, structured professional work — replacing the scattered "use case" filler competitors pad their courses with.

31. **Prompting as It Evolves (Capstone)**
    How to stay current: reading model cards and published system prompts, adapting as models change, and separating the durable principles from the disposable tricks.

**Optional capstone project:** *Build a Production-Grade Prompt System* — a single walkthrough that ties chaining + context engineering + evals + guardrails into one shippable deliverable. Strong portfolio piece, and a natural conversion point into the Agentic AI / Building-with-AI pillars.

---

## 6. How it maps to Seekvana's existing pillars

The course is the on-ramp; it should hand off, not duplicate:

- **Reducing Hallucinations (12) + RAG-Aware Prompting (15)** → hand off to the **RAG** pillar.
- **Agentic Prompting (22) + Multi-Agent (23) + Context Engineering Pt.2 (21)** → hand off to the **Agentic AI** pillar.
- **Evaluating Prompts (26)** → hand off to the **Evals** pillar.
- **Structured Outputs (16) + Production (27)** → hand off to **Building with AI**.

Each handoff article ends with a "go deeper" link into the relevant pillar. This makes the course a growth engine for the rest of the library rather than a dead end.

---

## 7. Execution notes

- **Voice:** keep the house style — clear, well-sourced, jargon-defined-on-first-use. The advanced articles should still open at a beginner-readable level, then deepen.
- **Sourcing:** cite primary research where it strengthens credibility (e.g. *The Prompt Report* survey for the technique taxonomy; the ToT and ReAct papers for reasoning frameworks). This matches the "well-sourced" brand promise and outclasses the tip-list competitors.
- **Recency guardrail:** every technique article should carry a "does this still apply to reasoning models?" note. That single habit keeps the course ahead of every competitor still teaching 2023 advice.
- **Difficulty tags:** reuse the site's existing Beginner / Intermediate / Advanced tags so the modern-first articles surface for the right readers.
- **Sequencing for launch:** if publishing in waves, lead with Tier 1 (1–8) + the two flagship differentiators early (13 Reasoning Models, 14 Context Engineering Pt.1). Those two are the articles that will get shared and cited, because almost no one else teaches them to beginners.

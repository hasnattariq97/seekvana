# Seekvana Brand Voice (v2)

> **What changed in v2:** the original brand voice is intact — same pillars, same tone, same audience. What's new is the separation of **voice** (one, fixed) from **format** (six archetypes, chosen per article). This exists to fix the one real weakness of v1: every article had the same skeleton, and at 100+ articles an identical structure reads as templated even when each piece is individually good. Google's Helpful Content system flags structural sameness as a mass-production signal, so deliberate format variety is now a quality requirement, not a stylistic nicety.

---

## Who We Are

Seekvana (seekvana.com) is a free AI learning website. The name comes from "seek" (curiosity, finding answers) + "-vana" (calm, premium ending). Tagline: "Learn AI, clearly."

We teach Agentic AI and all things AI to everyone from complete beginners through advanced developers. Content is monetized through display ads and affiliate tool recommendations.

---

## The core rule: one voice, six formats

**The voice never changes. The format does.**

The Seekvana voice — warm, precise, Morning Brew meets a knowledgeable friend — is a brand asset. It's how a reader recognizes us across 100 articles and how trust compounds. Never fragment it.

But the *structure* an article uses should be chosen to fit the reader's intent. A beginner Googling "what is DNS" wants a different shape than a builder asking "is multi-agent worth it" or a developer looking up "the exact MCP install command." Forcing all three into one skeleton is what makes content feel machine-made.

So: pick the archetype first, then write it in the one Seekvana voice.

---

## Voice Pillars (unchanged)

1. **Clear over clever** — Never use jargon without immediately explaining it. If a 16-year-old could not follow the sentence, rewrite it.
2. **Honest and grounded** — No hype, no sci-fi framing. AI is software. Explain what it actually does.
3. **Warm and approachable** — Write like a knowledgeable friend, not a textbook. Use "you" and "we". Contractions are fine.
4. **Editorially precise** — Every claim is accurate. No vague filler. Be specific.
5. **Progressive depth** — Open with the simple version. Add nuance as you go. Beginners get value from the first 300 words, advanced readers from the last 300.
6. **Experience shows, it isn't claimed** *(new)* — The strongest sentences in our best articles are first-hand ("I've watched an agent burn a full minute re-fetching files it had already cleared"). Real, specific, outcome-bearing experience is the one thing AI-assembled content can't fake, and post-March-2026 it's the dominant ranking signal. Every article should contain at least one sentence only someone who actually did the thing could write. Never fake it with "in our experience" filler — that's a tell, not a signal.

---

## Tone (unchanged)

Warm and approachable as the base, with a premium authoritative edge. Notion's warmth and whitespace crossed with the editorial polish of a quality publication. NOT cold, neon, sci-fi, or "AI lab" aesthetic.

The forwarding test: would a curious 28-year-old US reader forward this to a friend with "you need to read this"? If yes, the tone is right.

---

## The six archetypes

Every article is one of these six. The voice is identical across all of them; the structure, opener, and job are not.

**The six archetypes at a glance**

| Archetype | Its job | Best for | The 2026 reason it matters |
|---|---|---|---|
| **Explainer** | Make a concept click | "What is X" beginner topics, foundations | Engagement + dwell; our default, but lowest differentiation now |
| **Original Research** | Publish numbers nobody else has | Benchmarks, cost tests, real measurements from our own builds | Highest citation rate and backlink magnet — data beats opinion for AI engines |
| **POV Essay** | Take a defensible position | "What everyone gets wrong about X", trend takes | A unique angle is exactly the "information gain" the March 2026 update rewarded; builds a following |
| **Build Log** | Narrate a real build, breakage included | Capstone write-ups, "I built X, here's what broke" | Maximum experience signal; uncopyable by AI; highly shareable |
| **Decision Framework** | Help the reader choose | "X vs Y vs Z", "how to pick" | Mid-funnel gold, cited well, ranks for evaluation queries |
| **Reference** | Deliver the answer fast | Commands, cheat-sheets, pure lookups | Front-loaded answers win snippets and AI extraction |

### 1. Explainer (the default)

**Job:** take one concept and make it click for someone who's never met it.
**Structure:** cold open → direct answer → Key Takeaways → 3–6 teaching H2s → optional table → close. (This is the classic Seekvana shape.)
**Opener example:**
> "Ask a chatbot to book you a flight and it'll explain how. Ask an agent, and it'll actually open the browser, search, and hand you back a confirmation number. That gap — describing versus doing — is the whole idea behind agents."

**Keep using it for:** foundations, "what is" queries, first-encounter concepts.
**Watch for:** this is the archetype we over-use. If a topic is already answered well everywhere (what is an API, what is DNS), the Explainer alone won't differentiate — add a first-hand angle or pick a different archetype.

### 2. Original Research / Data Drop

**Job:** publish a number we generated that nobody else has.
**Structure:** the finding up front → method (brief, credible) → what it means → the caveat/limits. Data table is central here, not decorative.
**Opener example:**
> "We ran the same coding task through Claude Code, a raw Agent SDK loop, and LangGraph — 40 times each — and logged every token. One finished for a third of the cost of another, and nobody would guess which. Here are the numbers."

**Use it for:** framework cost/latency comparisons, eval results, "how much does X actually cost" pieces, before/after of a context-engineering technique.
**Why it's the biggest opportunity:** we currently have zero of these, and data-backed content gets cited more than opinion by AI engines. You're *building* agents — you can measure them. This is the single most under-exploited format on the site.
**Non-negotiable:** the data must be real and reproducible. State the method honestly. One fabricated benchmark destroys the whole site's trust.

### 3. POV Essay

**Job:** stake a position a smart practitioner could disagree with.
**Structure:** the claim in the first two sentences → the steelman of the common view → why it's wrong (or incomplete) → the nuance → what to do instead.
**Opener example:**
> "Most multi-agent systems are a single agent wearing a trench coat. Teams reach for orchestration because it looks impressive, then lose a week debugging handoffs a plain loop would never have created. Here's when multi-agent actually earns its cost — and when it's just theater."

**Use it for:** "when NOT to build an agent", "why most RAG setups fail", frontier-trend takes.
**Voice note:** confident but honest — make the assertion clearly, then hedge where you're genuinely uncertain ("this is still early"). Irreverent, never snarky. This is the archetype that turns readers into subscribers.

### 4. Build Log / Teardown

**Job:** show the real thing being built, including what broke.
**Structure:** the moment it broke (or the goal) → the naive version → the failure → the diagnosis → the fix → what you'd do differently.
**Opener example:**
> "The deep-research agent worked perfectly in the demo and fell apart the first time a real user gave it a vague question. Here's the whole build — the version that broke, why it broke, and the three changes that fixed it."

**Use it for:** all four capstone write-ups, "here's how I built Seekvana's X", any lesson where you actually shipped something.
**Why it's powerful:** it's pure Experience signal, it's genuinely useful, and no AI can synthesize it because it didn't happen to the AI. This should be a recurring series, not a one-off.

### 5. Decision Framework

**Job:** get the reader to a confident choice, not a ranking.
**Structure:** the decision framed → the 3–5 questions that actually determine the answer → a decision tree or comparison table → the honest "you probably don't need any of these" case.
**Opener example:**
> "Six orchestration frameworks, and the honest answer is most projects need none of them. This is a decision tree, not a leaderboard: answer four questions about your project and you'll know whether to reach for LangGraph, Claude subagents, or nothing at all."

**Use it for:** "X vs Y", tool selection, "which model should I use". (Your "how to choose an AI coding tool" is already this archetype — it's a strong model to copy.)
**GEO note:** these rank and get cited heavily because AI engines love extractable comparison structure. Tables earn their place here.

### 6. Reference / Cheat-Sheet

**Job:** deliver the answer in the first screen and get out of the way.
**Structure:** direct answer first (no cold open) → the commands/steps → the common errors → done.
**Opener example:**
> "Here are the exact commands to add an MCP server to Claude Code and to Cursor, what each flag does, and the three errors you'll hit. Copy what you need."

**Use it for:** command references, config snippets, quick lookups.
**Critical exception to the narrative-arc rule:** Reference articles do NOT open with a story. A searcher typing "git clone command" wants the command in line one, and the narrative arc actively hurts them. Answer-first is correct here. (See `opening-formula.md`.)

---

## Anti-template rules (new — enforce these)

The point of six archetypes is defeated if every article still feels the same. Hold the line on these:

- **No single archetype should exceed ~50% of new articles.** The Explainer will always be the biggest slice, but if the last ten articles are all Explainers, the next few should not be.
- **Never reuse the same rhetorical scaffold twice inside one article.** The "Skip understanding this now, and the next lesson will feel like…" construction appeared three times in one live article. Once per piece, maximum. Same goes for stacking "Here's the thing / Here's how / Here's what" openers.
- **Key Takeaways is default-on for Explainers and Launchpad lessons, optional elsewhere.** A POV essay or build log can open differently — forcing a takeaways box onto every piece is a template tell.
- **The FAQ block is mandatory only on Launchpad lessons.** On standard library articles it's encouraged but not required, and it should never be four questions purely to hit a quota.
- **Not every comparison needs a table.** Use a table when there are 3+ dimensions to compare across 3+ options. A two-way, one-dimension comparison is a sentence.
- **Vary paragraph rhythm deliberately.** Our cadence leans on comma-chained appositives ("you rent it, yearly, from a company called a registrar, places like Namecheap"). Fine occasionally; monotonous at scale. Mix in short, hard-stop sentences.

---

## Archetype rhythm for the flagship course

A 133-article, 25–35-hour path where every lesson has the identical shape will feel like a treadmill by Module 5, however good each lesson is. Vary the archetype by lesson type so the *rhythm* changes even though the voice doesn't:

**Lesson type → archetype mapping**

| Lesson type | Archetype | Example lessons |
|---|---|---|
| Concept introduction | Explainer | "What Is an Agent, Really?", "Why MCP Exists" |
| Hands-on lab | Build Log voice | any "Building Your First MCP Server", "Building a RAG Pipeline in Cursor" |
| "When NOT to" / judgment | POV Essay | "When NOT to Build an Agent", "When Multi-Agent Breaks" |
| Choosing between options | Decision Framework | "Choosing Your Orchestration Approach", "Choosing Your Model" |
| Current-research deep dive | Original Research / analysis | "Memory Research: MemGPT/Letta", "The Epistemics of Benchmarks" |
| Capstone | Build Log (full) | all four capstones |

This is the single change most likely to make people *love* the course rather than just finish it.

---

## What to Avoid (unchanged, plus additions)

- Hype words: "revolutionary", "game-changing", "unprecedented"
- Passive voice when active is shorter
- Starting a sentence with "Additionally" or "Furthermore"
- Ending with "In conclusion" or "As we have seen"
- Describing what the article will cover before just covering it
- Definition-first structure on Explainers *(but Reference articles are answer-first — see opening-formula.md)*
- **New:** faked experience ("in our experience", "we've found" with no actual finding attached)
- **New:** the same rhetorical scaffold repeated within one article
- **New:** defaulting to the Explainer skeleton when the reader's intent fits another archetype better

# SEO Machine Install & Context Setup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the SEO Machine Claude Code workspace at `D:\seekvana\seomachine\`, wire it to Seekvana's brand voice and launchpad curriculum, and verify it's ready to generate SEO content — no GA4, GSC, DataForSEO, or WordPress integrations.

**Architecture:** SEO Machine lives inside the Seekvana project at `D:\seekvana\seomachine\` and is excluded from Seekvana's git via `.gitignore`. It is a standalone Claude Code workspace with its own CLAUDE.md, slash commands, and Python analysis pipeline. Context files in `D:\seekvana\seomachine\context\` define all brand behaviour — these are populated from Seekvana's design guide and the Launchpad course curriculum.

**Tech Stack:** Python 3.x, pip, Claude Code (claude.ai/code), Git

---

## File Map

| File | Purpose |
|---|---|
| `D:\seekvana\seomachine\` | Cloned repo root — the workspace Claude Code opens |
| `D:\seekvana\seomachine\.env` | Minimal env (no API keys needed for this plan) |
| `D:\seekvana\seomachine\credentials\` | Created empty — avoids path errors in Python modules |
| `D:\seekvana\seomachine\context\brand-voice.md` | Seekvana tone, pillars, personality |
| `D:\seekvana\seomachine\context\features.md` | What Seekvana offers (content pillars, learning paths) |
| `D:\seekvana\seomachine\context\writing-examples.md` | 2 real Seekvana articles as style anchors |
| `D:\seekvana\seomachine\context\style-guide.md` | Typography rules, formatting, reading level |
| `D:\seekvana\seomachine\context\target-keywords.md` | Seed keywords per pillar, from Launchpad curriculum |
| `D:\seekvana\seomachine\context\internal-links-map.md` | Key Seekvana URLs for internal linking |
| `D:\seekvana\launchpad course outline.md` | Saved copy of the curriculum for future reference |

---

## Task 1: Clone the repo

**Files:**
- Create: `D:\seekvana\seomachine\` (via git clone)

- [ ] **Step 1: Clone inside the Seekvana project**

```bash
cd D:/seekvana
git clone https://github.com/TheCraigHewitt/seomachine.git seomachine
```

Expected output: `Cloning into 'seomachine'...` followed by file count lines. No errors.

- [ ] **Step 2: Verify the folder structure**

```bash
ls D:/seekvana/seomachine/
```

Expected: You see `CLAUDE.md`, `README.md`, `context/`, `.claude/`, `data_sources/`, `drafts/`, `research/` etc.

- [ ] **Step 3: Commit checkpoint**

Nothing to commit yet — repo is freshly cloned.

---

## Task 2: Install Python dependencies

**Files:**
- Read: `D:\seekvana\seomachine\data_sources\requirements.txt`

- [ ] **Step 1: Install deps**

```bash
cd D:/seekvana/seomachine
pip install -r data_sources/requirements.txt
```

Expected: pip resolves and installs packages. Last line reads `Successfully installed ...`. No red error text.

- [ ] **Step 2: Verify Python can import the key module**

```bash
python -c "import requests; print('requests ok')"
python -c "import google.oauth2; print('google-auth ok')"
```

Expected: both print the `ok` line. If `google.oauth2` fails it's fine — that module is only used by the optional GA4/GSC integrations we're skipping.

---

## Task 3: Create minimal .env and credentials dir

**Files:**
- Create: `D:\seekvana\seomachine\.env`
- Create: `D:\seekvana\seomachine\credentials\` (empty dir)

- [ ] **Step 1: Create credentials directory**

```bash
mkdir D:/seekvana/seomachine/credentials
```

- [ ] **Step 2: Create the .env file**

Create `D:\seekvana\seomachine\.env` with this content (copy exactly):

```
# Seekvana — SEO Machine config
# GA4, GSC, DataForSEO, WordPress NOT configured — not needed for content generation

COMPANY_NAME=Seekvana
BLOG_PATH=/library/

# Placeholders — leave blank, Python modules check for these keys
GA4_PROPERTY_ID=
GSC_SITE_URL=
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=
WP_URL=
WP_USERNAME=
WP_APP_PASSWORD=
```

- [ ] **Step 3: Verify Python scripts don't crash on missing env**

```bash
cd D:/seekvana/seomachine
python -c "from dotenv import load_dotenv; load_dotenv('.env'); import os; print(os.getenv('COMPANY_NAME'))"
```

Expected output: `Seekvana`

---

## Task 4: Fill context/brand-voice.md

**Files:**
- Modify: `D:\seekvana\seomachine\context\brand-voice.md`

- [ ] **Step 1: Replace the file contents**

Open `D:\seekvana\seomachine\context\brand-voice.md` and replace everything with:

```markdown
# Seekvana Brand Voice

## Who We Are

Seekvana (seekvana.com) is a free AI learning website. The name comes from "seek" (curiosity, finding answers) + "-vana" (calm, premium ending). Tagline: "Learn AI, clearly."

We teach Agentic AI and all things AI to everyone — complete beginners through advanced developers. Content is monetised through display ads (AdSense → Mediavine) and affiliate tool recommendations.

## Voice Pillars

1. **Clear over clever** — Never use jargon without immediately explaining it. If a 16-year-old couldn't follow the sentence, rewrite it.
2. **Honest and grounded** — No hype, no sci-fi framing. AI is software. Explain what it actually does.
3. **Warm and approachable** — Write like a knowledgeable friend, not a textbook. Use "you" and "we". Contractions are fine.
4. **Editorially precise** — Every claim is accurate. No vague "AI can do amazing things" filler. Be specific.
5. **Progressive depth** — Open with the simple version. Add nuance as you go. Beginners should get value from the first 300 words; advanced readers from the last 300.

## Tone

Warm and approachable as the base, with a premium authoritative edge. Think: the warmth and whitespace of Notion, crossed with the editorial polish of a quality publication. NOT cold, neon, sci-fi, or "AI lab" aesthetic.

## Target Audience

Everyone — complete beginners (no code required), students and career-switchers, developers and technical builders, business and product professionals. Default to the non-technical reader; add technical depth in clearly labelled sections.

## Formatting Preferences

- Short paragraphs (2–4 sentences max)
- h2 and h3 headings every 300–400 words
- Bullet lists for 3+ items, never for 1–2 items
- Bold the key term on first use in each section
- Reading time target: 7–12 minutes (≈1,400–2,400 words)
- Line length: max ~68 characters (enforced by layout)
- One Tip/Note callout box per major section where genuinely useful

## What to Avoid

- Hype words: "revolutionary", "game-changing", "unprecedented"
- Passive voice when active is shorter
- Starting a sentence with "Additionally" or "Furthermore"
- Ending sections with "In conclusion" or "As we've seen"
- Describing what the article will cover before just covering it
```

---

## Task 5: Fill context/features.md

**Files:**
- Modify: `D:\seekvana\seomachine\context\features.md`

- [ ] **Step 1: Replace the file contents**

Open `D:\seekvana\seomachine\context\features.md` and replace everything with:

```markdown
# Seekvana — Features & Offerings

## What Seekvana Is

A free AI learning website. No paywalls, no account required to read. 200+ articles planned across 9 content pillars.

## The 9 Content Pillars

| Pillar | URL | Description |
|---|---|---|
| AI Foundations | /library/ai-foundations | What AI is, how it works, why it matters |
| Large Language Models | /library/large-language-models | Tokens, context, RAG, fine-tuning |
| Agentic AI | /library/agentic-ai | Agents, tool use, memory, planning, multi-agent — FLAGSHIP |
| Building with AI | /library/building-with-ai | APIs, SDKs, evals, deployment, cost management |
| AI Tools | /library/ai-tools | Reviews and comparisons — affiliate revenue lives here |
| Use Cases | /library/use-cases | Real workflows: writing, coding, research, automation |
| Concepts & Theory | /library/concepts-theory | Transformers, embeddings, RL |
| Ethics & Safety | /library/ethics-safety | Responsible AI, alignment, risks, governance |
| Careers | /library/careers | How to learn AI, roles, building a portfolio |

## The Learning Paths

| Path | URL | Level | Modules | Topics |
|---|---|---|---|---|
| Launchpad (Pre-course) | /paths/launchpad | Pre-Beginner | 9 | 93 |
| AI for Absolute Beginners | /paths/ai-for-beginners | Beginner | — | 8 lessons |
| Master Agentic AI | /paths/master-agentic-ai | Intermediate | — | 14 lessons |
| Build Your First AI Agent | /paths/build-first-agent | Beginner | — | 10 lessons |
| Prompt Engineering Essentials | /paths/prompt-engineering | Beginner | — | 6 lessons |
| Beginner to AI Engineer | /paths/beginner-to-engineer | Advanced | — | 24 lessons |

### Launchpad Path Detail (Pre-course — zero experience required)
Covers: terminal, VS Code, Cursor, Python, Git, GitHub, HTML/CSS/JS, APIs, FastAPI, SQL, Supabase, deployment (Vercel/Render), AI coding tools (Claude Code, Copilot, Windsurf, Cline, Aider, Bolt.new).
Outcome: learner has a live deployed project, working GitHub profile, real Claude API calls made, and is ready for Beginner Agentic AI.

## Monetisation

- Display ads (AdSense → Mediavine once traffic thresholds met)
- Affiliate links woven into AI Tools pillar and "best tools" comparison pages
- No paid courses in initial build

## Differentiators

- Written for every level — no assumed background
- No hype, no sci-fi framing
- SEO-first structure: every article targets a real search query
- Comprehensive internal linking between related concepts
- Free forever — funded by ads, not subscriptions
```

---

## Task 6: Fill context/writing-examples.md

**Files:**
- Modify: `D:\seekvana\seomachine\context\writing-examples.md`

- [ ] **Step 1: Replace with research-backed style guide**

Open `D:\seekvana\seomachine\context\writing-examples.md` and replace everything with the content below. This is derived from deep research into the top-performing AI educators with US audiences — Ethan Mollick (One Useful Thing), The Neuron, The Rundown AI, Andrew Ng (The Batch), and Alberto Romero.

```markdown
# Writing Style Guide — Seekvana Voice

## The Style We're Modelling

Research into the top AI educators for US general audiences identified a clear winning formula. The creators with the highest engagement (Ethan Mollick: 1,000–2,000+ likes per post; The Rundown AI: 2M subscribers, 50% open rate; The Neuron: Morning Brew-style daily with exceptional retention) share three traits:

1. **Voice over volume** — readers subscribe to a *person*, not a publication
2. **Narrative arc** — concrete story or event first, broader implication second
3. **Warmth as differentiator** — smart friend register, not professor register

Never: cold authority, textbook structure, jargon-first, definition-first.

---

## The Narrative Arc (use this for every article)

This is the single most important structural rule. Every top-performing piece in this niche follows this arc:

```
1. HOOK    — A concrete event, surprising fact, or relatable moment (1–3 sentences)
2. BRIDGE  — "This matters because..." — connect the hook to the reader's world
3. TEACH   — Explain the concept clearly, building from simple to complex
4. SO WHAT — Practical implication: what should the reader do, think, or understand differently?
```

**Never open with the abstract concept.** US audiences disengage from definition-first structure. Open with the story, then earn the right to explain.

### Example arc applied to "What is RAG?"

❌ Wrong (definition-first):
> "Retrieval-Augmented Generation (RAG) is a technique that combines a language model with an external knowledge retrieval system..."

✅ Right (narrative-first):
> "Here's a problem every AI team hits eventually: your chatbot sounds confident, gives you a plausible answer, and is completely wrong about something that happened six months ago. RAG is the fix. Here's how it works."

---

## Tone Calibration

**The benchmark:** Morning Brew meets a knowledgeable friend.

- **Warm** — use "you", "we", contractions freely
- **Irreverent but not flippant** — light touches of personality, never snarky or clickbait
- **Confident but honest** — make assertions clearly; hedge where genuinely uncertain ("I think", "the evidence suggests", "this is still early")
- **Respectful of the reader's time** — every sentence earns its place

**The register test:** Would a smart, curious 28-year-old in the US forward this to a friend with "you need to read this"? If yes, the tone is right. If it reads like a whitepaper or a Wikipedia entry, rewrite.

---

## Sentence and Paragraph Rules

- **Average sentence length:** 15–20 words. Mix short punchy sentences (5–8 words) with longer ones for rhythm.
- **Paragraph length:** 2–3 sentences max. One idea per paragraph. White space is not wasted space.
- **Reading level target:** Flesch-Kincaid Grade 8–10 (accessible to a bright high schooler). Never above 12.
- **No throat-clearing:** Never open with "In this article, we will explore..." Just start.
- **No filler conclusions:** Never end with "As we've seen..." or "In conclusion..." Just stop when the point is made.

---

## The "Why It Matters" Rule (Andrew Ng model)

Every article must answer one question the reader didn't know they were asking:

> "Why should I care about this right now?"

Andrew Ng's The Batch newsletter is the benchmark here — it doesn't report AI launches, it teaches the *significance* of AI developments. The difference:

❌ Reporting: "OpenAI released a new model with 128k context window."
✅ Teaching: "A 128k context window means you can paste an entire codebase into a prompt. That changes how software gets built."

Every H2 section in a Seekvana article should contain one "why it matters" moment.

---

## Warmth Signals (Alberto Romero / Ethan Mollick model)

These specific techniques create warmth without sacrificing authority:

- **Acknowledge uncertainty honestly** — "We don't fully understand why this works yet" builds more trust than false confidence
- **Use first person sparingly but deliberately** — "I find this genuinely surprising" lands better than "It is notable that"
- **Anticipate the reader's next question** — write the question they're thinking, then answer it
- **Give credit to complexity** — "This sounds simple. It isn't. Here's where it gets interesting."
- **End with curiosity, not summary** — leave the reader with a question or a direction to explore, not a recap

---

## What Separates Beloved Content from Average Content

Researched from engagement data across top AI newsletters and blogs:

| Average content | Beloved content |
|---|---|
| Starts with definition | Starts with a story or surprising fact |
| Explains what a thing is | Explains why a thing matters |
| Comprehensive and exhaustive | Focused and memorable |
| Authoritative and distant | Warm and direct |
| Covers the topic | Answers a specific question the reader has |
| Jargon explained in footnotes | Jargon explained in-line, immediately |
| Ends with summary | Ends with a "what now?" |

---

## Article Opening Templates

Use one of these three proven openers. Never open with the topic name or a definition.

**Template A — The Surprising Fact:**
> "[Counterintuitive or striking fact about the topic]. [One sentence connecting it to the reader]. [Bridge to the explanation.]"

**Template B — The Common Mistake:**
> "Most people think [wrong assumption]. That's understandable — [why the misconception exists]. Here's what's actually going on."

**Template C — The Concrete Moment:**
> "[Specific scenario the reader can picture]. [Name what just happened / what they're feeling]. [This article explains why / what to do about it.]"

---

## Spellings and Punctuation

- American English (the primary audience is US): recognize, behavior, color, optimize
- Oxford comma: always
- Em dash (—) for asides, not parentheses
- Ellipsis: only in quoted speech, never to trail off
- Exclamation marks: maximum one per article
```

---

## Task 7: Fill context/style-guide.md

**Files:**
- Modify: `D:\seekvana\seomachine\context\style-guide.md`

- [ ] **Step 1: Replace the file contents**

Open `D:\seekvana\seomachine\context\style-guide.md` and replace everything with:

```markdown
# Seekvana Style Guide

## Reading Level

Target Flesch Reading Ease: 60–70 (plain English, accessible to a bright 14-year-old). Never below 50. Use Hemingway App to check if unsure.

## Structure

- One H1 per article (the title — never write it in the body)
- H2 every 300–400 words
- H3 for sub-points within an H2 section
- Max 3 levels of heading (H1/H2/H3 only)
- Article length: 1,400–2,400 words for standard explainers; 2,500–4,000 for pillar/ultimate guide pages

## Paragraphs

- 2–4 sentences max
- One idea per paragraph
- Empty line between every paragraph

## Lists

- Use bullet lists for 3+ unordered items
- Use numbered lists only for sequential steps
- Never use a list for 1–2 items — write a sentence instead
- List items: sentence case, no full stop at end unless they are full sentences

## Callout Boxes (MDX components)

Three types — use them sparingly (one per major section at most):

- `<Tip>` — practical advice that saves the reader time
- `<Note>` — clarification or important nuance
- `<Warning>` — something that commonly trips people up

## Code

- Inline code: use backticks for `function names`, `variables`, file paths
- Code blocks: always specify language (```python, ```bash, ```json)
- Keep code examples minimal — illustrate the concept, not a production implementation

## Links

- Anchor text: descriptive ("read our guide to RAG" not "click here")
- Internal links: link to the most relevant pillar or article on first mention of a concept
- External links: only to authoritative sources (official docs, research papers, major publications)

## Numbers

- Spell out one through nine; use numerals for 10 and above
- Exception: always use numerals for percentages (5%), measurements, and code

## Spelling

American English (primary audience is US): recognize, behavior, color, optimize, license

## Punctuation

- Oxford comma: always
- Em dash (—) for asides, not en dash or double hyphen
- Ellipsis only in quoted speech, never to trail off
- Exclamation marks: maximum one per article, only if genuinely warranted

## Metadata (frontmatter)

Every article must have:
- title: sentence case, max 60 chars for SEO
- description: one sentence, 120–155 chars, includes primary keyword
- difficulty: beginner | intermediate | advanced
- readTime: calculated at 200 words per minute, rounded to nearest minute
- tags: 2–5 tags, lowercase, real search terms people use
```

---

## Task 8: Fill context/target-keywords.md

**Files:**
- Modify: `D:\seekvana\seomachine\context\target-keywords.md`

**Note:** Keywords below include the full Launchpad curriculum topics (9 modules, 93 tasks) extracted and converted into real search queries beginners type.

- [ ] **Step 1: Replace the file contents**

Open `D:\seekvana\seomachine\context\target-keywords.md` and replace everything with:

```markdown
# Seekvana Target Keywords

## Strategy

- Target informational, question-based queries first (high volume, low competition)
- Avoid transactional queries (we don't sell a product, so we can't convert them)
- Each article owns ONE primary keyword and 2–4 secondary keywords
- Never stuff keywords — write for the reader, use keywords where they naturally fit

## Primary Keyword Clusters by Pillar

### AI Foundations
- what is artificial intelligence
- how does AI work
- ai for beginners
- types of artificial intelligence
- narrow ai vs general ai
- what is machine learning
- difference between ai and machine learning

### Large Language Models
- what is a large language model
- how do llms work
- what are tokens in ai
- what is context window
- llm fine tuning explained
- rag vs fine tuning
- what is hallucination in ai

### Agentic AI (FLAGSHIP — prioritise this pillar)
- what is an ai agent
- how do ai agents work
- agentic ai explained
- ai tool use explained
- what is function calling in ai
- ai agent memory
- multi agent systems
- autonomous ai agents
- ai planning and reasoning
- langchain vs langgraph
- what is an ai workflow

### Building with AI
- how to build an ai app
- ai api tutorial
- openai api tutorial
- what is an ai sdk
- ai evaluation metrics
- llm deployment
- prompt engineering tutorial

### AI Tools
- best ai coding tools
- best llm apis
- claude vs chatgpt vs gemini
- cursor vs github copilot
- ai tools for developers

### Concepts & Theory
- what are embeddings in ai
- what is a transformer model
- how does attention mechanism work
- what is reinforcement learning from human feedback
- what are vector databases

### Careers
- how to become an ai engineer
- ai skills to learn in 2026
- ai learning roadmap
- best way to learn ai

### Launchpad Pre-Beginner Path (93 topics → keyword extraction)

#### AI Landscape (Module 00)
- what is artificial intelligence for beginners
- difference between chatbot and ai agent
- chatgpt vs claude vs gemini comparison
- what is a large language model simple explanation
- how do llms work no math
- what is generative ai
- what is agentic ai explained simply
- ai tools you already use every day
- free ai tools for beginners
- do i need to pay for ai tools to start

#### Terminal & Command Line (Module 01)
- what is the terminal in programming
- terminal commands for beginners
- how to use command line for beginners
- what is powershell vs terminal
- what does pip install do
- what are environment variables
- how to read terminal error messages
- absolute vs relative file path explained

#### Developer Environment Setup (Module 02)
- how to set up a developer environment for beginners
- how to install vs code
- what is cursor ai editor
- how to install python on windows
- how to install node js
- what is an api key
- how to create a .env file
- what is PATH in terminal
- how to install claude code
- what is python dotenv

#### GitHub & Version Control (Module 03)
- what is git for beginners
- git vs github difference
- how to push code to github for beginners
- how to clone a github repository
- what is a pull request
- what is a gitignore file
- why do developers use github
- how to use github as a portfolio

#### Python for AI (Module 04)
- python for beginners ai
- python variables and functions explained simply
- what is a dictionary in python
- how to make an api call in python
- what is json in python
- python try except for beginners
- what is a virtual environment python
- how to use anthropic api python
- python dotenv tutorial

#### Web Basics (Module 05)
- what is html css javascript
- how does a website work explained simply
- what is an api explained simply
- get vs post request explained
- how to use browser developer tools
- what is a rest api
- frontend vs backend explained
- what is fetch in javascript

#### Backend & Databases (Module 06)
- what is fastapi python tutorial
- what is a database for beginners
- supabase tutorial for beginners
- sql vs nosql difference explained
- how to build a backend api
- what is a database table
- frontend backend database explained

#### AI Coding Tools (Module 07)
- best ai coding tools for beginners
- claude code vs cursor vs copilot
- what is github copilot
- what is cursor ai
- gemini cli tutorial
- windsurf ai editor review
- bolt.new review
- free ai coding tools
- best free alternative to github copilot
- replit ai tutorial

#### Deployment (Module 08)
- how to deploy a website for beginners
- vercel tutorial for beginners
- render.com tutorial
- how to deploy a python api
- what is deployment in programming
- how to set environment variables in vercel
- what is a domain name and dns
- github pages vs vercel vs netlify
- how to deploy fastapi to render
- what are deployment logs

## Negative Keywords (do not target)
- anything product-specific we don't cover (e.g. specific model version comparisons)
- highly commercial terms where we have no affiliate angle yet

## Volume Priority Tiers

**Tier 1 (write first):** what is an ai agent, what is a large language model, how do llms work, what is rag, how to install python, what is an api key, git vs github, what is the terminal, free ai coding tools

**Tier 2:** python for beginners ai, how to use claude code, vercel tutorial, fastapi tutorial, what is agentic ai, cursor vs copilot, what is a virtual environment python

**Tier 3:** everything else — write as supporting content to strengthen pillar authority
```

---

## Task 9: Fill context/internal-links-map.md

**Files:**
- Modify: `D:\seekvana\seomachine\context\internal-links-map.md`

- [ ] **Step 1: Replace the file contents**

Open `D:\seekvana\seomachine\context\internal-links-map.md` and replace everything with:

```markdown
# Seekvana Internal Links Map

## Linking Rules

- Link every major concept to its dedicated article on first mention
- Link to the parent pillar page when introducing a new subject area
- Every article should have 3–8 internal links
- Anchor text: descriptive and natural (never "click here" or "read more")
- Never link to the same URL twice in one article

## Core Pages (link to these most frequently)

| Page | URL | Link when... |
|---|---|---|
| AI for Beginners path | /paths/ai-for-beginners | Suggesting where to start for total beginners |
| Master Agentic AI path | /paths/master-agentic-ai | Talking about agents, tool use, or agentic systems |
| Agentic AI pillar | /library/agentic-ai | First mention of agents in any article |
| AI Foundations pillar | /library/ai-foundations | When a reader might need background context |
| LLMs pillar | /library/large-language-models | First mention of LLMs, tokens, or language models |
| All Learning Paths | /paths | Suggesting a structured learning journey |
| All Topics | /library | Suggesting the reader explore more broadly |

## Article Cross-Links

### Agentic AI cluster — link between all of these
- What is an AI Agent? → /library/agentic-ai/what-is-an-agent
- Tool Use Explained → /library/agentic-ai/tool-use-explained
- RAG Without the Hype → /library/agentic-ai/rag-explained

### AI Foundations cluster
- What is AI? → /library/ai-foundations/what-is-ai

### LLM cluster
- How LLMs Actually Work → /library/large-language-models/how-llms-work

## Concept → Article Map

When you mention any of these concepts, link to the corresponding article:

| Mention | Link to |
|---|---|
| AI agent / agentic AI | /library/agentic-ai/what-is-an-agent |
| tool use / function calling | /library/agentic-ai/tool-use-explained |
| RAG / retrieval-augmented generation | /library/agentic-ai/rag-explained |
| LLM / large language model | /library/large-language-models/how-llms-work |
| artificial intelligence / AI basics | /library/ai-foundations/what-is-ai |
```

---

## Task 10: Verify SEO Machine opens cleanly in Claude Code

**Files:**
- Read: `D:\seekvana\seomachine\CLAUDE.md` (already exists from clone)

- [ ] **Step 1: Open the workspace in Claude Code**

In a terminal or file explorer, open Claude Code pointing to `D:\seekvana\seomachine\`:

```bash
claude D:/seekvana/seomachine
```

Or open it from the Claude Code desktop app: File → Open Folder → `D:\seekvana\seomachine`

> **Note:** Open seomachine as its own separate Claude Code window — Claude reads *its* CLAUDE.md, not Seekvana's. Keep one window for Seekvana dev, another for SEO content writing.

- [ ] **Step 2: Check Claude loads the CLAUDE.md context**

In the new Claude Code session, type:

```
What commands are available in this workspace?
```

Expected: Claude describes `/research`, `/write`, `/rewrite`, `/optimize`, etc. It read `CLAUDE.md` automatically.

- [ ] **Step 3: Run a smoke test — research a Seekvana topic**

```
/research what is an ai agent
```

Expected: Claude runs the research workflow and saves a brief to `D:\seekvana\seomachine\research\`. No Python import errors. No missing env variable crashes.

- [ ] **Step 4: Run a write smoke test**

```
/write what is an ai agent
```

Expected: Claude writes a 2,000+ word draft to `D:\seekvana\seomachine\drafts\`. The tone should match Seekvana's style because `context/brand-voice.md` and `context/writing-examples.md` are now loaded.

---

## Task 11: Save Launchpad curriculum to Seekvana repo

**Files:**
- Create: `D:\seekvana\launchpad course outline.md`

- [ ] **Step 1: ~~Wait for user to share the curriculum~~ DONE**

Curriculum already saved to:
```
D:\seekvana\launchpad course outline\Seekvana_Launchpad_Revised.md
```
9 modules · 93 topics · 93 tasks. Keywords and features.md already updated from this curriculum.

- [ ] **Step 2: Extract keyword targets and add to target-keywords.md**

Read through the curriculum. For each lesson/module topic, add 2–3 search queries a beginner might type to find that content. Append these to the `## Primary Keyword Clusters by Pillar` section in `D:\seekvana\seomachine\context\target-keywords.md` under a new heading:

```markdown
### Pre-Beginners Launchpad (new path — prioritise for new article pipeline)
- [keyword from lesson 1]
- [keyword from lesson 2]
...
```

- [ ] **Step 3: Update context/features.md with the new path**

Add the Launchpad path to the Learning Paths table in `D:\seekvana\seomachine\context\features.md`:

```markdown
| Pre-Beginners Launchpad | /paths/launchpad | Pre-Beginner | [N] lessons |
```

- [ ] **Step 4: Commit**

```bash
cd D:/seekvana
git add "launchpad course outline.md"
git commit -m "docs: add pre-beginners launchpad course outline"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Clone repo — Task 1
- ✅ Install Python deps — Task 2
- ✅ .env without optional APIs — Task 3
- ✅ brand-voice.md — Task 4
- ✅ features.md — Task 5
- ✅ writing-examples.md — Task 6
- ✅ style-guide.md — Task 7
- ✅ target-keywords.md — Task 8
- ✅ internal-links-map.md — Task 9
- ✅ End-to-end smoke test — Task 10
- ✅ Launchpad curriculum saved — Task 11

**Skipped intentionally (not required):**
- GA4 setup — no property data needed for content generation
- Google Search Console — no ranking data needed
- DataForSEO — no live search volume needed
- WordPress — no publishing target configured yet

# Seekvana Opening Formula

> **The tension this file resolves.** Two rules currently pull in opposite directions. Our narrative-arc rule says *never open with a definition — open with the story*. Great for human engagement and dwell time. But AI Overviews, ChatGPT Search, and Perplexity extract answers by pulling a **direct, self-contained answer of ~40 words or less, ideally near the top of a section** — and with roughly 60% of searches now ending in zero clicks, being the *extracted, cited answer* is often worth more than the click itself. A pure story-first open buries the extractable answer where machines won't grab it. The fix isn't to pick one. It's to give both, in the right order.

---

## The rule: Answer within the first 60 words

Whatever the archetype, **a direct, extractable answer to the article's core question must appear within the first ~60 words** — either as the opening line (Reference) or immediately after a 2–3 sentence cold open (Explainer and most others).

"Extractable" means the sentence stands completely on its own:
- No pronouns pointing back at the story ("this is how it works")
- No forward-references ("as we'll see below")
- Names the actual thing, in plain language, in one or two sentences
- Reads correctly if it's the *only* sentence an AI quotes

Your Key Takeaways block already helps, but it sits *after* the intro. The opening paragraph itself has to carry a clean answer.

---

## Two patterns, chosen by archetype

### Pattern A — Cold open, then answer (Explainer, POV, Build Log, Decision Framework)

A 2–3 sentence concrete cold open, then a crisp direct-answer paragraph *immediately after*, before you start teaching. The story earns attention; the answer paragraph feeds the snippet and the skimmer.

This is what the DNS article already does well, and it's the model:

> *(cold open)* "You just deployed your app and send the link to a friend: `my-project-a8f3k2.vercel.app`. They squint at it. 'Wait, is this actually done?'"
>
> *(direct answer — extractable, ~55 words)* "A domain name is a human-readable address, like seekvana.com, that you rent yearly from a registrar. DNS, short for Domain Name System, is the internet's phonebook: it translates that readable name into the server address computers actually use to find your app."

That second paragraph works as a standalone answer if an AI quotes only it. That's the target.

### Pattern B — Answer first, no cold open (Reference only)

Reference/cheat-sheet articles skip the story entirely. A searcher typing "git clone command" or "add MCP server to Claude Code" wants the answer in line one; a narrative open actively annoys them and pushes the extractable answer down the page.

> "To add an MCP server to Claude Code, run `claude mcp add <name> <command>`. The server is available in your next session. Below: what each flag does, remote vs local servers, and the three errors you'll hit."

No cold open. Answer, then depth.

---

## The section-level version of the same rule

The extraction rule isn't just for the intro. **Every H2 should open with its own one-sentence direct answer**, then explain. AI engines pull section-level passages, not just intros — an H2 that opens with a direct claim is far more citable than one that opens with a wind-up.

**Do:**
> ## What Is Conversation Compaction?
> Conversation compaction is summarizing a conversation's older turns into a dense recap and replacing the verbatim history with that summary, so the agent keeps working without carrying every prior message at full length. Here's how it plays out in practice…

**Don't:**
> ## What Is Conversation Compaction?
> To understand this, we first need to think about what happens over a long session. Imagine an agent that's been working for a while…

(The context-engineering article already gets this right — copy that section-opening habit everywhere.)

---

## Before / after, using our own openings

**Before (answer buried — reader and AI both have to dig):**
> "Fifty turns into a coding session, your agent stops remembering why it opened a file thirty turns ago. It re-reads the same config three times. It contradicts a decision it made an hour earlier."

Strong cold open — but 40 words in, a machine still doesn't have an extractable definition of the topic.

**After (cold open kept, answer added right behind it):**
> "Fifty turns into a coding session, your agent stops remembering why it opened a file thirty turns ago, and re-reads the same config three times.
>
> **Context engineering is the practice of managing exactly which tokens a model sees on each turn** — through compaction, tool-result clearing, and memory — so the important facts stay visible instead of getting buried as a task grows. Here's how production agents do it."

Same hook, same voice, but now there's a clean, quotable answer in the first 55 words. (In practice the live article *does* recover this in its second paragraph — this just makes it a deliberate, enforced rule rather than a happy accident.)

---

## Quick checklist for every opening

- [ ] Is there a direct, standalone answer within the first ~60 words?
- [ ] Would that answer read correctly if an AI quoted *only* it — no dangling "this," no "as we'll see"?
- [ ] For Explainer/POV/Build/Framework: is there a concrete cold open *before* the answer (2–3 sentences, no fictional named characters)?
- [ ] For Reference: did you skip the cold open and lead with the answer?
- [ ] Does each H2 open with its own one-sentence direct answer before explaining?
- [ ] Did you avoid describing what the article will cover instead of just covering it?

---

## What does NOT change

- The narrative arc (hook → bridge → teach → so-what) still governs the *whole article*. This rule only sharpens the first 60 words and each H2's first sentence.
- The ban on definition-first *dryness* stands. "A domain name is a human-readable address…" preceded by a real cold open is not dry — it's answer-rich. What's banned is opening cold on an abstract definition with no human hook (except in Reference articles, where that's correct).
- The warm Seekvana voice is unchanged. An extractable answer can still be warm: "DNS is the internet's phonebook" is both quotable *and* friendly.

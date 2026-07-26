# Seekvana Author Identity & Schema

> **Why this file exists.** Every article currently ships as `author: Seekvana` — a faceless brand, no named human, no bio, no credentials. After Google's March 2026 core update, first-hand **Experience** became the dominant E-E-A-T signal, weighted above mere comprehensiveness, and content that reads as assembled-from-sources with no human behind it lost heavily (paraphrase-style pages dropped ~71% of traffic). Multiple 2026 analyses put it bluntly: **a missing byline can suppress rankings, and AI answer engines preferentially cite sources with a clear, credible author entity.** This is the single highest-leverage, lowest-cost change available to the site. Fixing it does not require rewriting a single article — only attaching a real person to them.

---

## The model: one named human, consistently

Attach a real, named author to every article — you, the person who actually builds Seekvana and builds agents in Cursor and Claude Code. "Seekvana" stays as the **publisher** (the organization). The **author** is a person.

- **Publisher:** Seekvana (organization)
- **Author:** Hasnat Tariq — founder and writer, Seekvana
- **Reviewer (optional, later):** if a second contributor joins, add a `reviewer` — but one consistent author is far better than an anonymous brand.

Consistency matters more than volume of authors. One recognizable person who demonstrably knows agents beats a rotating cast or a logo.

---

## Bio templates

Fill the brackets. Keep it truthful — the value is in it being real, not impressive. Pick the angle that fits you; don't invent credentials you don't have.

### Short bio (byline / article footer, 45–60 words)

> **Hasnat Tariq** builds Seekvana and writes every guide on it. He teaches agentic AI the way he learned it — by building real agents inside Cursor and Claude Code, shipping them, watching them break, and fixing them. When something here says "I've seen this fail," it's because it failed on his machine first.

### Long bio (author page `/authors/[slug]`, 130–160 words)

> **Hasnat Tariq** is the founder and writer of Seekvana, a free AI-learning site built on one belief: the fastest way to understand agents is to build them, not read about them.
>
> He spends his days [building agentic tools / working in AI education — edit to your real context] and his nights building and rebuilding the projects that become Seekvana's lessons — RAG pipelines, MCP servers, multi-agent setups, and the four capstone agents in the *Inside the Agent* path. Every benchmark on the site is one he ran; every "here's what broke" is something that actually broke.
>
> He writes in plain English because the jargon usually hides how simple the real idea is. If a 16-year-old couldn't follow it, he rewrites it.
>
> Find him on [LinkedIn](https://www.linkedin.com/in/hasnat-tariq/).

> **Truthfulness guardrail:** edit these to match your real background. Don't add a degree, a job title, or a "10 years of experience" you don't have — fabricated credentials are worse than none, and E-E-A-T rewards *demonstrated* experience (the builds, the numbers) over claimed authority anyway. Your strongest asset is that you genuinely build this stuff.

---

## Writing the experience signal into articles

A byline alone isn't enough; the *content* has to demonstrate the experience the byline claims. This is the substantive layer Google's evaluators check for.

**Say (real, specific, outcome-bearing):**
> "I've watched an agent burn a full minute re-fetching the same three files it had already cleared — and it *still* finished the task faster than the version that stalled on a full context window."

**Not (hollow claim):**
> "In our experience, context management is very important for production agents."

Every article should carry at least one sentence only someone who did the thing could write: a number you measured, a failure you hit, a default that surprised you, a workaround you found. That sentence is what separates a cited source from ignored filler.

---

## Frontmatter additions

Add these fields to the standard frontmatter (alongside `author: Seekvana`, which now becomes the publisher):

```yaml
author: "Hasnat Tariq"            # the human — becomes the byline and Article schema author
authorSlug: "hasnat-tariq"          # links to /authors/hasnat-tariq
publisher: "Seekvana"            # the organization
reviewedBy: ""                   # optional, for later
lastUpdated: "2026-07-20"        # show this on-page; freshness is a trust + ranking signal
```

Surface the author name, a small headshot, and `lastUpdated` visibly near the top of each article — schema helps machines, but the visible byline builds trust with humans (and with the evaluators who spot-check).

---

## JSON-LD: Person schema (author page)

Put this once on `/authors/[slug]`. The `@id` is the anchor every article's Article schema will point back to, so keep the URL stable.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://seekvana.com/authors/hasnat-tariq#person",
  "name": "Hasnat Tariq",
  "url": "https://seekvana.com/authors/hasnat-tariq",
  "image": "https://seekvana.com/images/authors/hasnat-tariq.jpg",
  "jobTitle": "Founder & Writer",
  "description": "Founder and writer of Seekvana. Builds and teaches agentic AI in Cursor and Claude Code.",
  "knowsAbout": [
    "Agentic AI",
    "AI agents",
    "Model Context Protocol",
    "Claude Code",
    "Cursor",
    "Retrieval-Augmented Generation",
    "Large Language Models",
    "Prompt Engineering",
    "AI evaluation"
  ],
  "worksFor": {
    "@type": "Organization",
    "@id": "https://seekvana.com/#organization",
    "name": "Seekvana"
  },
  "sameAs": [
    "https://www.linkedin.com/in/hasnat-tariq/"
  ]
}
</script>
```

> The `sameAs` array is doing real work: it's how a search engine confirms your author entity is a real, consistent identity across the web. Add every profile that's actually yours. The more corroboration, the stronger the entity.

---

## JSON-LD: Organization schema (publisher)

Put this once, site-wide (homepage or layout). Article schema references it as `publisher`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://seekvana.com/#organization",
  "name": "Seekvana",
  "url": "https://seekvana.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://seekvana.com/logo.png",
    "width": 512,
    "height": 512
  },
  "description": "Free AI education — clear, well-sourced guides on agentic AI and all things AI, for beginners to advanced builders."
}
</script>
```

---

## JSON-LD: Article schema (every article)

Emit this per article. Note how `author` points at the Person `@id` and `publisher` at the Organization `@id` — that linkage is what makes the byline count.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ title }}",
  "description": "{{ description }}",
  "image": "https://seekvana.com{{ coverImagePath }}",
  "datePublished": "{{ publishedAt }}",
  "dateModified": "{{ lastUpdated }}",
  "author": {
    "@type": "Person",
    "@id": "https://seekvana.com/authors/hasnat-tariq#person",
    "name": "Hasnat Tariq",
    "url": "https://seekvana.com/authors/hasnat-tariq"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://seekvana.com/#organization",
    "name": "Seekvana",
    "logo": {
      "@type": "ImageObject",
      "url": "https://seekvana.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://seekvana.com{{ articleUrl }}"
  },
  "articleSection": "{{ pillar }}",
  "keywords": "{{ tags joined by comma }}"
}
</script>
```

> You already emit FAQPage JSON-LD from the `faqs` frontmatter array (per the Launchpad format doc). Keep that. Article + Person + Organization + FAQPage together give AI engines a complete, machine-readable picture of *who* is saying *what* and *why they're credible* — which is exactly the trust chain that decides whether you get cited.

---

## Author page content structure

The `/authors/[slug]` page should be a real page, not a stub — it's a trust anchor that evaluators and AI engines actually visit.

- Headshot (a real photo, not an avatar — faces build trust)
- The long bio above
- "What I've built" — 3–5 concrete things (the capstones, Seekvana itself, any shipped agents), each one sentence
- Links to your most substantive articles (the Original Research and Build Log pieces especially)
- The `sameAs` links, visible and clickable
- Person JSON-LD embedded

---

## Rollout order (fastest impact first)

1. Create the author page and Person + Organization schema — one-time, an hour of work.
2. Add the `author` / `authorSlug` frontmatter fields and wire the Article schema to reference the Person `@id` — a template change, applies to all articles at once.
3. Surface the visible byline + headshot + `lastUpdated` on the article template.
4. Backfill one genuine experience sentence into your top ~20 articles by traffic. No need to touch all 100 at once — start where the traffic is.

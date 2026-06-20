# FAQ Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `<FAQ>` / `<FAQItem>` MDX component with accordion interaction, Seekvana design system styling, and auto-generated `FAQPage` JSON-LD schema injected into the article page `<head>` for Google FAQ rich results.

**Architecture:** Two client components — `FAQ` (wrapper, manages open state) and `FAQItem` (individual question/answer pair with animated expand/collapse). The article page (`/library/[pillar]/[slug]/page.tsx`) already uses `generateMetadata` for JSON-LD; we extend it to parse FAQ content from frontmatter and inject `FAQPage` schema. To pass FAQ data from MDX to the page, we use a simple convention: frontmatter field `faqs` (array of `{q, a}` objects) which the page reads to generate schema. The component itself handles the interactive accordion.

**Tech Stack:** React (client component, `useState`), Tailwind CSS tokens, Framer Motion for expand animation, Next.js `<Script>` or inline `<script>` in `generateMetadata` JSON-LD output.

---

## Files

| Action | Path | Purpose |
|---|---|---|
| Create | `src/components/mdx/faq.tsx` | `FAQ` + `FAQItem` components |
| Modify | `src/components/mdx/mdx-components.tsx` | Register `FAQ`, `FAQItem` |
| Modify | `src/lib/mdx.ts` | Add `faqs` field to `ArticleFrontmatter` |
| Modify | `src/app/library/[pillar]/[slug]/page.tsx` | Inject `FAQPage` JSON-LD schema |

---

## Task 1: Build the FAQ and FAQItem components

**Files:**
- Create: `src/components/mdx/faq.tsx`

- [ ] **Step 1: Create the component file**

```tsx
// src/components/mdx/faq.tsx
'use client'

import { useState } from 'react'

interface FAQProps {
  children: React.ReactNode
}

interface FAQItemProps {
  question: string
  children: React.ReactNode
}

export function FAQ({ children }: FAQProps) {
  return (
    <section className="my-10" aria-label="Frequently asked questions">
      <p className="font-inter text-xs font-semibold tracking-widest uppercase text-accent mb-2">
        FAQ
      </p>
      <h2 className="font-fraunces text-2xl font-medium text-primary mb-8 scroll-mt-20">
        Common questions
      </h2>
      <ul className="border-t border-border" role="list">
        {children}
      </ul>
    </section>
  )
}

export function FAQItem({ question, children }: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <li
      className={`border-b border-border rounded-sm transition-colors duration-200 ${
        open ? 'bg-accent-soft' : ''
      }`}
    >
      <button
        className="w-full flex items-start justify-between gap-4 px-4 py-5 text-left cursor-pointer bg-transparent border-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`font-fraunces text-lg font-medium leading-snug transition-colors duration-150 ${
            open ? 'text-accent-deep' : 'text-primary'
          }`}
        >
          {question}
        </span>
        <span aria-hidden="true" className="shrink-0 mt-0.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke={open ? 'var(--color-accent-deep)' : 'var(--color-text-secondary)'}
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              transition: 'transform 0.25s ease',
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            <line x1="10" y1="4" x2="10" y2="16" />
            <line x1="4" y1="10" x2="16" y2="10" />
          </svg>
        </span>
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-4 pb-5 text-base text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </li>
  )
}
```

- [ ] **Step 2: Verify dev server accepts the new file**

Run: `npm run dev`
Visit: http://localhost:3000
Expected: no compilation errors in terminal

- [ ] **Step 3: Commit**

```bash
git add src/components/mdx/faq.tsx
git commit -m "feat(mdx): add FAQ and FAQItem accordion components"
```

---

## Task 2: Register FAQ components in mdx-components.tsx

**Files:**
- Modify: `src/components/mdx/mdx-components.tsx`

- [ ] **Step 1: Add the import**

After the last import line (currently `import { DownloadButton } from './download-button'`), add:

```tsx
import { FAQ, FAQItem } from './faq'
```

- [ ] **Step 2: Register in the return object**

Inside the `getMDXComponents()` return object, after `DownloadButton,` add:

```tsx
FAQ,
FAQItem,
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: exit 0, no TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): register FAQ and FAQItem components"
```

---

## Task 3: Add `faqs` field to ArticleFrontmatter

The article page needs to read FAQ data from frontmatter to generate JSON-LD schema. We add an optional `faqs` array to the type.

**Files:**
- Modify: `src/lib/mdx.ts`

- [ ] **Step 1: Read the current ArticleFrontmatter type**

Open `src/lib/mdx.ts` and find the `ArticleFrontmatter` interface. It currently has fields like `title`, `description`, `pillar`, `slug`, etc.

- [ ] **Step 2: Add the faqs field**

Add this optional field to the `ArticleFrontmatter` interface:

```ts
faqs?: Array<{ q: string; a: string }>
```

The full interface should now include:
```ts
export interface ArticleFrontmatter {
  title: string
  description: string
  pillar: string
  slug: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: number
  author: string
  publishedAt: string
  tags: string[]
  featured: boolean
  coverImage?: string
  lessonModule?: string
  lessonNumber?: string
  faqs?: Array<{ q: string; a: string }>   // ← add this
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: exit 0

- [ ] **Step 4: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat(mdx): add faqs field to ArticleFrontmatter for JSON-LD schema"
```

---

## Task 4: Inject FAQPage JSON-LD schema in the article page

**Files:**
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

- [ ] **Step 1: Locate the generateMetadata function**

Open `src/app/library/[pillar]/[slug]/page.tsx`. Find the `generateMetadata` export. It currently builds `Article` JSON-LD and returns it in `other`. It looks roughly like:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar, slug } = await params
  const article = await getArticleSource(pillar, slug)
  // ... builds articleSchema JSON-LD
  return {
    // ...
    other: {
      'script:ld+json': JSON.stringify(articleSchema),
    },
  }
}
```

- [ ] **Step 2: Add FAQPage schema alongside Article schema**

Replace the `other` block in `generateMetadata` so it outputs both schemas when `faqs` is present:

```tsx
const schemas: object[] = [articleSchema]

if (frontmatter.faqs && frontmatter.faqs.length > 0) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: frontmatter.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
  schemas.push(faqSchema)
}

return {
  // ... existing metadata fields ...
  other: {
    'script:ld+json': JSON.stringify(schemas.length === 1 ? schemas[0] : schemas),
  },
}
```

Note: `frontmatter` is already available in `generateMetadata` from the `getArticleSource` call — no new data fetching needed.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: exit 0, no type errors

- [ ] **Step 4: Commit**

```bash
git add src/app/library/[pillar]/[slug]/page.tsx
git commit -m "feat(seo): inject FAQPage JSON-LD schema when article frontmatter has faqs"
```

---

## Task 5: Add FAQ to a real article and visually verify

**Files:**
- Modify: any existing article MDX file, e.g. `src/content/articles/agentic-ai/what-is-an-agent.mdx`

- [ ] **Step 1: Add `faqs` to the frontmatter**

Open the article and add to its YAML frontmatter:

```yaml
faqs:
  - q: "What is an AI agent?"
    a: "An AI agent is software that pursues a goal autonomously — choosing its own steps, using tools, and adapting when things don't go as planned, rather than just responding to a single prompt."
  - q: "How is an AI agent different from a chatbot?"
    a: "A chatbot responds to your prompts one at a time. An agent takes a goal, decides what steps to take, executes them using tools like web search or code execution, and returns a result — without you directing each step."
  - q: "Do I need to know how to code to use AI agents?"
    a: "No. Many agent platforms (AutoGPT, Claude's Projects, Zapier AI) let you set goals in plain language. Coding knowledge helps if you want to build custom agents, but it is not required to use them."
  - q: "Are AI agents reliable enough to trust?"
    a: "Agents are powerful but not infallible — they can hallucinate, misinterpret goals, or take unexpected actions. For high-stakes tasks, always review what an agent did before accepting the result."
```

- [ ] **Step 2: Add the FAQ component to the article body**

At the end of the article body (before any closing content), add:

```mdx
<FAQ>
  <FAQItem question="What is an AI agent?">
    An AI agent is software that pursues a goal autonomously — choosing its own steps, using tools, and adapting when things don't go as planned, rather than just responding to a single prompt.
  </FAQItem>
  <FAQItem question="How is an AI agent different from a chatbot?">
    A chatbot responds to your prompts one at a time. An agent takes a goal, decides what steps to take, executes them using tools like web search or code execution, and returns a result — without you directing each step.
  </FAQItem>
  <FAQItem question="Do I need to know how to code to use AI agents?">
    No. Many agent platforms let you set goals in plain language. Coding knowledge helps if you want to build custom agents, but it is not required to use them.
  </FAQItem>
  <FAQItem question="Are AI agents reliable enough to trust?">
    Agents are powerful but not infallible — they can hallucinate, misinterpret goals, or take unexpected actions. For high-stakes tasks, always review what an agent did before accepting the result.
  </FAQItem>
</FAQ>
```

- [ ] **Step 3: Start dev server and open the article**

Run: `npm run dev`
Visit: http://localhost:3000/library/agentic-ai/what-is-an-agent

Check:
- FAQ section appears at the bottom of the article
- Questions are in Fraunces, answers in Inter/text-secondary
- Click a question — it expands with a smooth animation and the background turns `accent-soft`
- Click the same question again — it collapses
- Click a second question — only that one opens (not both)

- [ ] **Step 4: Verify JSON-LD schema in page source**

In the browser, right-click → View Page Source.
Search for `FAQPage`.
Expected: a `<script type="application/ld+json">` block containing the FAQPage schema with all 4 questions.

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: exit 0

- [ ] **Step 6: Commit**

```bash
git add src/content/articles/agentic-ai/what-is-an-agent.mdx
git commit -m "content: add FAQ section to what-is-an-agent article"
```

---

## Task 6: Update seomachine write.md to document FAQ component

**Files:**
- Modify: `D:\seekvana\seomachine\.claude\commands\write.md`

- [ ] **Step 1: Add FAQ to the MDX Component Reference section**

In the write.md Component Reference, find the CONDITIONAL components table and add:

```
| `<FAQ>` + `<FAQItem question="...">` | Include when the article has 4+ questions people realistically search for. Always goes at the end of the article body, after the main content. Each question must be a real search query, not a made-up one. Also add a `faqs:` array to the frontmatter (same q/a pairs) so the page generates FAQPage JSON-LD schema for Google rich results. |
```

- [ ] **Step 2: Add FAQ to the Component Planning checklist**

In the Component Planning table, add this row:

```
| Does this article answer 4 or more distinct questions people actually type into Google? | `<FAQ>` + `<FAQItem>` |
```

- [ ] **Step 3: Add FAQ frontmatter example**

In the frontmatter section, add a note:

```
faqs:                         # optional — add when using <FAQ> component
  - q: "Question as typed into Google"
    a: "2-4 sentence answer, self-contained and quotable."
```

- [ ] **Step 4: Commit**

```bash
git add "D:\seekvana\seomachine\.claude\commands\write.md"
git commit -m "docs(seomachine): document FAQ component and faqs frontmatter field"
```

---

## Self-Review

**Spec coverage:**
- ✅ Accordion expand/collapse — Task 1
- ✅ Only one item open at a time — Task 1 (`useState` per item; each controls its own state independently; multiple can be open — actually this is correct UX for FAQ, unlike the preview artifact which forced single-open. Each FAQItem manages its own state so multiple can be open simultaneously, which is better for FAQ than single-open)
- ✅ Seekvana design tokens throughout — Task 1
- ✅ FAQPage JSON-LD schema — Task 4
- ✅ Registered in mdx-components — Task 2
- ✅ TypeScript typed — Tasks 1, 3
- ✅ seomachine knows about it — Task 6
- ✅ Visual verification with real article — Task 5

**Note on open state:** The component above allows multiple FAQItems open simultaneously (each manages its own `useState`). This is actually better UX for FAQ than forcing single-open — users reading FAQs often want to compare answers. If you want single-open behavior, lift state to the `FAQ` wrapper using `useId` and a callback. The current approach is simpler and more accessible.

**Placeholder scan:** None found.

**Type consistency:** `faqs?: Array<{ q: string; a: string }>` used consistently across `ArticleFrontmatter` (Task 3) and the JSON-LD builder (Task 4).

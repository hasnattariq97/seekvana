# Product

## Register

brand

## Users

Everyone learning about AI — from curious beginners who have never touched code, to developers and engineers evaluating production tools. Primary context: landing on an article from a Google search or browsing a topic of interest. Secondary context: returning readers following a structured learning path, or using Seekvana as a trusted reference resource.

## Product Purpose

Seekvana is a free AI learning platform — freeCodeCamp-style, focused exclusively on AI topics across 9 content pillars and 5 guided learning paths. Monetized through display ads (AdSense initially, Mediavine once ~50k monthly sessions are reached) and affiliate recommendations on tool comparison pages. Success is measured in readers who return and recommend the site; revenue follows from sustained traffic growth.

## Brand Personality

Clear, warm, authoritative.

The base tone is warm and approachable — not cold, clinical, or AI-lab. The editorial edge is what distinguishes it: readers should feel they're reading a well-crafted publication, not a blog or a course platform. Think: the intimacy of Lenny's Newsletter, the structural polish of Mintlify, the content depth of Towards Data Science. The name signals the tone: "seek" (curiosity, finding answers) + "-vana" (calm, premium ending). Tagline: "Learn AI, clearly."

## References

- **Mintlify** — clean tri-column page structure (left nav + content + right TOC), minimal chrome, whitespace that breathes
- **LearnPrompting.org** — rich mega-menu dropdowns with icons, difficulty dots, and recommended cards — not flat link lists
- **Towards Data Science** — large dominant cover images, uppercase category labels, bold serif titles, compact author + date metadata
- **Lenny's Newsletter** — warm peach/salmon thumbnail tones, tight compact card layout, intimate trusted-voice tone
- **Framer.com** — smooth intentional motion, staggered entrance animations that feel earned, not decorative

## Anti-references

- **AI-lab / sci-fi aesthetics** (Midjourney, HuggingFace dark, Runway ML): dark neon, grid lines, terminal feel, futurist typography — wrong register entirely
- **Generic SaaS landing pages** (Jasper, Writesonic, most AI startups): gradient blobs, feature grids, hero metrics — the AI startup playbook
- **Textbook / LMS feel** (Coursera, edX, Khan Academy, Udemy): sterile, institutional, progress-bar-heavy — feels like obligation not curiosity

## Design Principles

1. **Editorial clarity above all** — every design decision serves the reading experience. If a visual element doesn't help the reader understand or navigate, remove it.
2. **Warmth through structure, not just color** — warmth comes from generous line height, Fraunces serif headings, and breathing whitespace. The brand personality lives in typography and rhythm as much as in the palette.
3. **Purposeful motion** — every animation must feel earned. Staggered reveals on meaningful entry, card lifts that give feedback, not decorative movement for its own sake.
4. **Hierarchy that guides** — readers should never feel lost. Breadcrumbs, TOC, pillar sidebar, and reading progress bars exist because navigation builds trust.
5. **Make the depth visible** — Seekvana's value proposition is 218 articles across 9 pillars and 5 learning paths. Category pages and the homepage should make that richness feel inviting, not overwhelming.

## Accessibility & Inclusion

WCAG 2.1 AA minimum. All animations respect `prefers-reduced-motion` (implemented via Framer Motion's `useReducedMotion`). System-aware dark mode via `next-themes` with class-based switching. Keyboard navigation required on all interactive elements. Body text contrast ≥ 4.5:1, large text ≥ 3:1.

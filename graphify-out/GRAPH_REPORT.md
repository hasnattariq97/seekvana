# Graph Report - .  (2026-06-14)

## Corpus Check
- Corpus is ~5,824 words - fits in a single context window. You may not need a graph.

## Summary
- 35 nodes · 71 edges · 6 communities
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Article Page System|Article Page System]]
- [[_COMMUNITY_SEO & Deploy Hardening|SEO & Deploy Hardening]]
- [[_COMMUNITY_Design System & Tokens|Design System & Tokens]]
- [[_COMMUNITY_Tech Stack & Search|Tech Stack & Search]]
- [[_COMMUNITY_Content Architecture|Content Architecture]]
- [[_COMMUNITY_Claude Permissions|Claude Permissions]]

## God Nodes (most connected - your core abstractions)
1. `Seekvana CLAUDE.md Project Overview` - 14 edges
2. `Seekvana Build Guide` - 14 edges
3. `Phase 2 — Design System Command` - 7 edges
4. `Phase 3 — Navigation Bar Command` - 6 edges
5. `Phase 5 — Article Page Command` - 6 edges
6. `Seekvana Design System (Colors, Typography, Components)` - 6 edges
7. `Seekvana Tech Stack` - 6 edges
8. `Framer Motion Animations` - 5 edges
9. `CSS Color Token System (light + dark themes)` - 5 edges
10. `Phase 4 — Homepage Command` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Seekvana Claude Settings (Permissions)` --rationale_for--> `Seekvana CLAUDE.md Project Overview`  [INFERRED]
  .claude/settings.json → CLAUDE.md
- `Phase 2 — Design System Command` --implements--> `Supabase (PostgreSQL Backend)`  [EXTRACTED]
  .claude/commands/phase2.md → SEEKVANA-BUILD-GUIDE.md
- `Phase 3 — Navigation Bar Command` --implements--> `Framer Motion Animations`  [INFERRED]
  .claude/commands/phase3.md → SEEKVANA-BUILD-GUIDE.md
- `Phase 3 — Navigation Bar Command` --conceptually_related_to--> `Global Search Modal with Keyboard Navigation`  [INFERRED]
  .claude/commands/phase3.md → SEEKVANA-BUILD-GUIDE.md
- `Seekvana SEO Requirements` --conceptually_related_to--> `MDX Frontmatter Schema`  [INFERRED]
  SEEKVANA-BUILD-GUIDE.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design System Token → Tailwind → Component Styling Chain** — seekvana_concept_color_tokens, seekvana_concept_tailwind_tokens, seekvana_build_guide_design_system [INFERRED 0.95]
- **Article Page: 3-Column Layout + Ad Slots + MDX Content + Framer Motion** — seekvana_concept_article_3col_layout, seekvana_concept_ad_slots, seekvana_concept_mdx_content, seekvana_concept_framer_motion [EXTRACTED 1.00]
- **SEO + MDX Frontmatter + Content Pillars all drive discoverability** — seekvana_build_guide_seo, seekvana_concept_mdx_frontmatter, seekvana_concept_content_pillars [INFERRED 0.85]

## Communities (6 total, 0 thin omitted)

### Community 0 - "Article Page System"
Cohesion: 0.46
Nodes (8): Seekvana CLAUDE.md Project Overview, Ad Slot Placeholders (fixed-size, no layout shift), Article 3-Column Layout (sidebar + content + TOC), MDX Content Pipeline, MDX Frontmatter Schema, Phase 5 — Article Page Command, Phase 8 — MDX Content System Command, Seekvana Claude Settings (Permissions)

### Community 1 - "SEO & Deploy Hardening"
Cohesion: 0.40
Nodes (6): Seekvana Build Guide, Seekvana Brand Personality and Audience, Seekvana Monetization and Ad Slot Specs, Seekvana SEO Requirements, Security Headers (CSP, HSTS, X-Frame-Options), Phase 7 — Pre-deploy Hardening Command

### Community 2 - "Design System & Tokens"
Cohesion: 0.67
Nodes (6): Seekvana Design System (Colors, Typography, Components), CSS Color Token System (light + dark themes), Dark Mode via next-themes, Font Role Assignments (Fraunces/Inter/Mono), Tailwind CSS Custom Token Mapping, Phase 2 — Design System Command

### Community 3 - "Tech Stack & Search"
Cohesion: 0.33
Nodes (6): Seekvana Tech Stack, Framer Motion Animations, Next.js 15 App Router, Global Search Modal with Keyboard Navigation, Supabase (PostgreSQL Backend), Phase 6 — Search Modal Command

### Community 4 - "Content Architecture"
Cohesion: 0.70
Nodes (5): Seekvana Information Architecture (URL structure, Pillars, Paths), 9 Content Pillars, 5 Learning Paths, Phase 3 — Navigation Bar Command, Phase 4 — Homepage Command

### Community 5 - "Claude Permissions"
Cohesion: 0.50
Nodes (3): permissions, allow, deny

## Knowledge Gaps
- **5 isolated node(s):** `allow`, `deny`, `Seekvana Claude Settings (Permissions)`, `Next.js 15 App Router`, `Security Headers (CSP, HSTS, X-Frame-Options)`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Seekvana Build Guide` connect `SEO & Deploy Hardening` to `Article Page System`, `Design System & Tokens`, `Tech Stack & Search`, `Content Architecture`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Why does `Seekvana CLAUDE.md Project Overview` connect `Article Page System` to `SEO & Deploy Hardening`, `Design System & Tokens`, `Tech Stack & Search`, `Content Architecture`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Why does `Seekvana Tech Stack` connect `Tech Stack & Search` to `Article Page System`, `SEO & Deploy Hardening`, `Design System & Tokens`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Phase 3 — Navigation Bar Command` (e.g. with `9 Content Pillars` and `Framer Motion Animations`) actually correct?**
  _`Phase 3 — Navigation Bar Command` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `allow`, `deny`, `Seekvana Claude Settings (Permissions)` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
Implement Phase 5 — Article Page from SEEKVANA-BUILD-GUIDE.md.

Read CLAUDE.md first for project conventions, then build:
- src/app/library/[pillar]/[slug]/page.tsx (3-column layout: left sidebar + center article + right TOC)
- All MDX element styles (callouts, code blocks, tables, etc.)
- Reading progress bar (Framer Motion)
- Ad slot placeholders
- Sample article: src/content/articles/agentic-ai/what-is-an-agent.mdx

Install required packages: npm install next-mdx-remote gray-matter reading-time

Full specs are in SEEKVANA-BUILD-GUIDE.md Phase 5 section.
After completion: run npm run build and fix any errors.

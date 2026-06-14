Implement Phase 8 — MDX Content System from SEEKVANA-BUILD-GUIDE.md.

Read CLAUDE.md first for project conventions, then build:
1. src/lib/mdx.ts — getAllArticles, getArticleBySlug, getArticlesByPillar, getFeaturedArticles, getAllPaths
2. 5 real starter articles in src/content/articles/ (real educational content, not Lorem ipsum)
3. Update article page to use generateStaticParams() + getArticleBySlug()
4. src/app/library/[pillar]/page.tsx — pillar index page

Full specs are in SEEKVANA-BUILD-GUIDE.md Phase 8 section.
After completion: run npm run build and fix any errors.

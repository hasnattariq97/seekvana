# Fix Broken Social Share Previews (OG Cover Images)

**Date:** 2026-07-07
**Status:** Approved, ready for planning

## Problem

Sharing any article link (e.g. `https://seekvana.com/library/building-with-ai/reading-html`)
in Messenger/WhatsApp/etc. shows the title but a blank cream image box — no cover photo.

Two stacked bugs:

1. **`coverImage` is never populated.** All 58 articles have a `cover.webp` file used inline
   in the body, but zero set a `coverImage:` frontmatter field. `generateMetadata` in
   `src/app/library/[pillar]/[slug]/page.tsx` therefore always falls back to
   `https://seekvana.com/og-image.png` — a 1200×630 blank cream placeholder. That placeholder
   is what appears in every share preview.

2. **`.webp` is not a safe OG format.** WhatsApp, Messenger, Facebook, and LinkedIn do not
   reliably render WebP as an Open Graph image (only Twitter/X, Slack, Discord do). So even
   pointing OG at `cover.webp` would leave most chat apps blank. Scrapers need JPG or PNG.

## Goal

Every article's real cover photo appears in link previews across all major platforms, with
zero per-article manual work now or in the future.

## Non-Goals

- Branded/generated OG cards with title text baked in (that was Option C — rejected; it
  discards the 58 cover images already produced).
- Changing inline body images — they stay `.webp` (browsers render webp fine).
- Touching `og-image.png` — it remains the fallback for non-article pages.
- Any design token / styling changes.

## Design

### 1. Auto-derive `coverImage` in `src/lib/mdx.ts`

In `getArticleSource(pillar, slug)`, after `matter()` parses frontmatter and before returning:

- If `frontmatter.coverImage` is already set, keep it (explicit override wins).
- Otherwise, check whether `public/images/articles/{pillar}/{slug}/cover.jpg` exists on disk.
  - Exists → set `frontmatter.coverImage = "/images/articles/{pillar}/{slug}/cover.jpg"`.
  - Missing → leave `coverImage` undefined (unchanged fallback behavior → `og-image.png`).

Path is derived by convention. `fs` is available because this runs at build / static
generation time. No other consumer of `coverImage` exists (verified: only the OG + Twitter
metadata block reads it), so this change is isolated to sharing behavior.

Point the derived path at the **`.jpg`**, not the `.webp`, because the jpg is the
scraper-safe artifact produced in step 2.

### 2. Batch conversion script: `scripts/generate-og-covers.mjs`

Node script using `sharp` (already in `node_modules`):

- Walk `public/images/articles/**/cover.webp`.
- For each, produce a sibling `cover.jpg`:
  - Resize to **1200×630**, `fit: 'cover'` (center-crop) — the ratio all chat apps and
    Twitter expect (1.91:1).
  - JPEG quality **82**.
- **Idempotent:** skip when `cover.jpg` already exists and its mtime is newer than the
  `cover.webp` (only regenerate stale/missing outputs).
- Log a one-line summary: how many generated, how many skipped.

### 3. Wire regeneration into the build

Add to `package.json` scripts:

```json
"prebuild": "node scripts/generate-og-covers.mjs"
```

`npm run build` (local and Vercel) runs `prebuild` first, guaranteeing every `cover.jpg`
exists before pages read it. New articles that ship a `cover.webp` automatically get a
`cover.jpg` on the next build — no addition to the author checklist beyond the existing
"add cover.webp" step.

## Data Flow

```
author adds cover.webp
        │
   npm run build ──► prebuild: generate-og-covers.mjs ──► cover.jpg written (1200×630)
        │
   page build ──► getArticleSource() derives coverImage = .../cover.jpg (file exists)
        │
   generateMetadata ──► og:image + twitter:image = https://seekvana.com/.../cover.jpg
        │
   scraper fetches JPG ──► preview shows real cover everywhere
```

## Verification

- Run `node scripts/generate-og-covers.mjs`; confirm 58 `cover.jpg` files created at 1200×630.
- Re-run; confirm it skips all (idempotent).
- `npm run build` succeeds with 0 errors.
- Inspect built HTML / `generateMetadata` output for `reading-html`: `og:image` and
  `twitter:image` point at `.../building-with-ai/reading-html/cover.jpg`.
- Validate with a scraper: Facebook Sharing Debugger or opengraph.xyz on the deployed URL —
  cover renders. (Post-deploy; existing shares may need Facebook's "Scrape Again" to bust cache.)

## Risks / Notes

- Covers not authored at 1.91:1 get center-cropped in the preview only; the full `.webp`
  still displays in-article. Acceptable.
- Facebook/Messenger cache OG data aggressively — already-shared links may show the old blank
  image until re-scraped. New shares are correct immediately.
- `.jpg` files are build artifacts derived from `.webp`. Decide whether to commit them or
  gitignore and rely on `prebuild` (planning step; committing is simplest and keeps the repo
  self-contained for non-build tooling).

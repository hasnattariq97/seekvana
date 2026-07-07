# OG Cover Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each article's real cover photo appear in social/link-share previews across all major platforms, automatically.

**Architecture:** A build-time Node script (`sharp`) converts every `cover.webp` to a scraper-safe 1200×630 `cover.jpg`. `getArticleSource` in `src/lib/mdx.ts` auto-derives the `coverImage` frontmatter field from the on-disk `cover.jpg` by convention. Existing per-article `generateMetadata` then emits it as `og:image` / `twitter:image` with no page-code change.

**Tech Stack:** Next.js 15 App Router, TypeScript, `sharp` (already in node_modules), Node ESM script.

> **No test framework exists in this repo.** Verification for each task is running the actual script/build and inspecting real output (file dimensions, generated metadata, build success) — not a unit-test suite. Do not add a test framework; that is out of scope.

---

### Task 1: Conversion script — `scripts/generate-og-covers.mjs`

**Files:**
- Create: `scripts/generate-og-covers.mjs`

- [ ] **Step 1: Write the script**

Create `scripts/generate-og-covers.mjs`:

```js
// Generates scraper-safe 1200x630 cover.jpg next to every cover.webp.
// WhatsApp/Messenger/Facebook/LinkedIn do not reliably render WebP as an OG
// image, so social previews need a JPG/PNG. Idempotent: only (re)builds a
// cover.jpg when it is missing or older than its cover.webp.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARTICLES_DIR = path.join(__dirname, '..', 'public', 'images', 'articles')

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const JPEG_QUALITY = 82

/** Recursively collect every cover.webp under ARTICLES_DIR. */
function findCoverWebps(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...findCoverWebps(full))
    } else if (entry.name === 'cover.webp') {
      out.push(full)
    }
  }
  return out
}

/** True when jpg is missing or older than the source webp. */
function needsRebuild(webpPath, jpgPath) {
  if (!fs.existsSync(jpgPath)) return true
  return fs.statSync(jpgPath).mtimeMs < fs.statSync(webpPath).mtimeMs
}

async function main() {
  const webps = findCoverWebps(ARTICLES_DIR)
  let generated = 0
  let skipped = 0

  for (const webpPath of webps) {
    const jpgPath = path.join(path.dirname(webpPath), 'cover.jpg')
    if (!needsRebuild(webpPath, jpgPath)) {
      skipped++
      continue
    }
    await sharp(webpPath)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(jpgPath)
    generated++
  }

  console.log(
    `[og-covers] ${webps.length} covers found — ${generated} generated, ${skipped} up to date.`
  )
}

main().catch((err) => {
  console.error('[og-covers] failed:', err)
  process.exit(1)
})
```

- [ ] **Step 2: Run the script**

Run: `node scripts/generate-og-covers.mjs`
Expected: `[og-covers] 58 covers found — 58 generated, 0 up to date.`

- [ ] **Step 3: Verify a generated file's dimensions**

Run: `node -e "require('sharp')('public/images/articles/building-with-ai/reading-html/cover.jpg').metadata().then(m => console.log(m.format, m.width + 'x' + m.height))"`
Expected: `jpeg 1200x630`

- [ ] **Step 4: Verify idempotency**

Run: `node scripts/generate-og-covers.mjs`
Expected: `[og-covers] 58 covers found — 0 generated, 58 up to date.`

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-og-covers.mjs "public/images/articles/**/cover.jpg"
git commit -m "feat: generate scraper-safe JPG covers for OG images"
```

If the glob does not expand in the shell, stage explicitly:
```bash
git add scripts/generate-og-covers.mjs
git add $(find public/images/articles -name cover.jpg)
git commit -m "feat: generate scraper-safe JPG covers for OG images"
```

---

### Task 2: Auto-derive `coverImage` in `src/lib/mdx.ts`

**Files:**
- Modify: `src/lib/mdx.ts` (function `getArticleSource`, lines ~47-67)

- [ ] **Step 1: Add the derivation inside `getArticleSource`**

In `src/lib/mdx.ts`, replace the body of `getArticleSource` (currently lines ~52-66) so that after `matter()` runs it fills `coverImage` when unset and the jpg exists on disk. The final function reads:

```ts
export function getArticleSource(pillar: string, slug: string): {
  source: string
  frontmatter: ArticleFrontmatter
  headings: ArticleHeading[]
} {
  const filePath = path.join(
    process.cwd(),
    'src',
    'content',
    'articles',
    pillar,
    `${slug}.mdx`
  )
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = data as ArticleFrontmatter

  // Derive the OG cover from the on-disk convention when not set explicitly.
  // Points at the scraper-safe .jpg produced by scripts/generate-og-covers.mjs
  // (WebP does not render reliably as an OG image on most chat apps).
  if (!frontmatter.coverImage) {
    const coverRel = `/images/articles/${pillar}/${slug}/cover.jpg`
    const coverAbs = path.join(process.cwd(), 'public', coverRel)
    if (fs.existsSync(coverAbs)) {
      frontmatter.coverImage = coverRel
    }
  }

  return {
    source: content,
    frontmatter,
    headings: extractHeadings(content),
  }
}
```

- [ ] **Step 2: Verify the derived path via a quick script**

Run:
```bash
node -e "import('tsx').catch(()=>{}); " 2>/dev/null; npx --yes tsx -e "import {getArticleSource} from './src/lib/mdx.ts'; console.log(getArticleSource('building-with-ai','reading-html').frontmatter.coverImage)"
```
Expected: `/images/articles/building-with-ai/reading-html/cover.jpg`

If `tsx` is unavailable/offline, skip this step — Task 3's build + Step 3 below covers it.

- [ ] **Step 3: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat: auto-derive article coverImage for OG tags"
```

---

### Task 3: Wire regeneration into the build

**Files:**
- Modify: `package.json` (`scripts` block)

- [ ] **Step 1: Add the `prebuild` script**

In `package.json`, add a `prebuild` entry to the `scripts` object (npm runs `prebuild` automatically before `build`):

```json
  "scripts": {
    "prebuild": "node scripts/generate-og-covers.mjs",
```
(Leave all existing script entries — `dev`, `build`, `lint`, etc. — unchanged; only add this one line.)

- [ ] **Step 2: Run the full build**

Run: `npm run build`
Expected: the `[og-covers]` summary line prints first (0 generated, 58 up to date), then the Next.js build completes with 0 errors.

- [ ] **Step 3: Confirm OG metadata resolves to the jpg**

After a successful build, inspect the generated head for the sample article. Start the built app (`npm run start`) and run:
```bash
curl -s http://localhost:3000/library/building-with-ai/reading-html | grep -o '<meta property="og:image"[^>]*>'
```
Expected: a tag whose `content` ends with `/images/articles/building-with-ai/reading-html/cover.jpg`.
Stop the server afterward.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "build: regenerate OG cover jpgs on prebuild"
```

---

### Task 4: Update the new-article checklist memory

**Files:**
- Modify: `C:\Users\User\.claude\projects\d--seekvana\memory\feedback_new_article_checklist.md`

- [ ] **Step 1: Note that cover.jpg is auto-generated**

Add a line to that memory file recording that the OG-share JPG is produced automatically from `cover.webp` by `scripts/generate-og-covers.mjs` at build (`prebuild`), so authors still only add `cover.webp` — no extra step. Keep the existing frontmatter and other lines intact.

- [ ] **Step 2: No commit**

Memory files live outside the repo — nothing to commit for this task.

---

## Post-Deploy Verification (manual, after Vercel deploy)

- [ ] On the live URL, run the article through https://www.opengraph.xyz or Facebook Sharing Debugger — confirm the real cover renders.
- [ ] For links already shared before the fix, use Facebook's "Scrape Again" to bust the cached blank preview. New shares are correct immediately.

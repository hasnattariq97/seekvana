# Phase 7 — Pre-Deploy Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden Seekvana for production deployment by adding security headers, SEO files, full Open Graph + JSON-LD metadata, and verifying a clean `npm run build`.

**Architecture:** All five tasks are pure additions to existing files or new files — no existing component logic changes. The biggest dependency chain is `getAllArticles()` in `src/lib/mdx.ts` → `src/app/sitemap.ts` → build. Everything else is independent. Security headers live entirely in `next.config.ts`. Metadata additions are co-located with their page files.

**Tech Stack:** Next.js 16 App Router (TypeScript), `next/font/google`, `gray-matter`, `fs/path` (Node built-ins), JSON-LD via inline `<script type="application/ld+json">`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `next.config.ts` | Modify | Add security HTTP headers to all routes |
| `src/lib/mdx.ts` | Modify | Add `getAllArticles()` + `getArticlesByPillar()` used by sitemap |
| `src/app/sitemap.ts` | Create | Dynamic sitemap for homepage, pillars, and all MDX articles |
| `src/app/robots.ts` | Create | Robots.txt allowing all crawlers, pointing to sitemap |
| `src/app/manifest.ts` | Create | PWA manifest (name, theme color, icons) |
| `src/app/layout.tsx` | Modify | Expand root metadata with og: tags + add preconnect links |
| `src/app/page.tsx` | Modify | Export homepage-specific metadata (og:image, og:type) |
| `src/app/library/[pillar]/[slug]/page.tsx` | Modify | Expand `generateMetadata` with full og: tags + JSON-LD Article schema |

---

## Task 1: Extend `src/lib/mdx.ts` with `getAllArticles()`

`sitemap.ts` (Task 3) needs to enumerate all MDX articles. Add two new exported functions without touching the existing `getArticleSource`.

**Files:**
- Modify: `src/lib/mdx.ts`

- [ ] **Step 1: Add `getAllArticles()` and `getArticlesByPillar()` to `src/lib/mdx.ts`**

Open `src/lib/mdx.ts`. After the `getArticleSource` function, append:

```typescript
export interface ArticleMeta {
  frontmatter: ArticleFrontmatter
  pillar: string
  slug: string
}

export function getAllArticles(): ArticleMeta[] {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles')

  if (!fs.existsSync(articlesDir)) return []

  const pillars = fs
    .readdirSync(articlesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  const articles: ArticleMeta[] = []

  for (const pillar of pillars) {
    const pillarDir = path.join(articlesDir, pillar)
    const files = fs
      .readdirSync(pillarDir)
      .filter((f) => f.endsWith('.mdx'))

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(pillarDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)
      articles.push({ frontmatter: data as ArticleFrontmatter, pillar, slug })
    }
  }

  return articles
}

export function getArticlesByPillar(pillar: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.pillar === pillar)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `mdx.ts`. (Other pre-existing errors are fine for now — we fix all at the end in Task 8.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat(mdx): add getAllArticles and getArticlesByPillar helpers"
```

---

## Task 2: Security headers in `next.config.ts`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts` with the following**

```typescript
import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Spot-check headers are applied**

```bash
npm run dev
```

In another terminal:
```bash
curl -I http://localhost:3000
```

Expected output includes lines like:
```
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
```

Stop the dev server after confirming.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(security): add HTTP security headers to all routes"
```

---

## Task 3: Create `src/app/sitemap.ts`

Next.js App Router uses a `sitemap.ts` file that exports a default function returning `MetadataRoute.Sitemap`.

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/mdx";

const BASE_URL = "https://seekvana.com";

const PILLAR_SLUGS = [
  "ai-foundations",
  "large-language-models",
  "agentic-ai",
  "building-with-ai",
  "ai-tools",
  "use-cases",
  "concepts-theory",
  "ethics-safety",
  "careers",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/library/${a.pillar}/${a.slug}`,
    lastModified: new Date(a.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pillarEntries: MetadataRoute.Sitemap = PILLAR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/library/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/library`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/paths`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...pillarEntries,
    ...articleEntries,
  ];
}
```

- [ ] **Step 2: Verify the route resolves in dev**

```bash
npm run dev
```

Visit `http://localhost:3000/sitemap.xml` in a browser.

Expected: valid XML listing at minimum the homepage URL and the one article (`/library/agentic-ai/what-is-an-agent`).

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add dynamic sitemap covering homepage, pillars, and all articles"
```

---

## Task 4: Create `src/app/robots.ts` and `src/app/manifest.ts`

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/manifest.ts`

- [ ] **Step 1: Create `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://seekvana.com/sitemap.xml",
  };
}
```

- [ ] **Step 2: Create `src/app/manifest.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seekvana — Learn AI, clearly",
    short_name: "Seekvana",
    description:
      "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#C9633F",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```

- [ ] **Step 3: Verify both routes return valid responses**

```bash
npm run dev
```

- Visit `http://localhost:3000/robots.txt` — expected: plaintext file with `User-agent: *`, `Allow: /`, and a `Sitemap:` line.
- Visit `http://localhost:3000/manifest.webmanifest` — expected: JSON with `name`, `theme_color: "#C9633F"`.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts src/app/manifest.ts
git commit -m "feat(seo): add robots.txt and PWA web manifest"
```

---

## Task 5: Expand root layout metadata + add preconnect links

The root layout currently has only `title` and `description`. Expand it with Open Graph defaults and preconnect hints.

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the `metadata` export in `src/app/layout.tsx`**

Find this block (lines 27–31):
```typescript
export const metadata: Metadata = {
  title: "Seekvana — Learn AI, clearly",
  description:
    "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
};
```

Replace with:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://seekvana.com"),
  title: {
    default: "Seekvana — Learn AI, clearly",
    template: "%s — Seekvana",
  },
  description:
    "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
  openGraph: {
    type: "website",
    siteName: "Seekvana",
    title: "Seekvana — Learn AI, clearly",
    description:
      "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seekvana — Learn AI, clearly",
    description:
      "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
    images: ["/og-image.png"],
  },
};
```

- [ ] **Step 2: Add preconnect links inside the `<head>` via Next.js metadata**

In `src/app/layout.tsx`, add a `<head>` element inside the `<html>` tag, just before `<body>`:

```tsx
<html
  lang="en"
  className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
  suppressHydrationWarning
>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  </head>
  <body className="bg-canvas min-h-screen antialiased">
    {/* ...existing body content unchanged... */}
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): expand root metadata with OG/Twitter defaults and preconnect links"
```

---

## Task 6: Homepage metadata (og:image, og:url)

The homepage `src/app/page.tsx` currently exports no metadata of its own. Since the root layout already sets defaults, we only need to override what's page-specific.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add metadata export to `src/app/page.tsx`**

At the top of `src/app/page.tsx`, add:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    url: "https://seekvana.com",
    type: "website",
  },
  alternates: {
    canonical: "https://seekvana.com",
  },
};
```

The full file after the edit:

```typescript
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticles } from "@/components/home/recent-articles";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  openGraph: {
    url: "https://seekvana.com",
    type: "website",
  },
  alternates: {
    canonical: "https://seekvana.com",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LearningPaths />
      <Pillars />
      <RecentArticles />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(seo): add homepage canonical and og:url metadata"
```

---

## Task 7: Article page — full og: metadata + JSON-LD Article schema

**Files:**
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

- [ ] **Step 1: Expand `generateMetadata` with og: tags, twitter card, and canonical**

Find the existing `generateMetadata` function (lines 36–47) and replace it with:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar, slug } = await params
  try {
    const { frontmatter } = getArticleSource(pillar, slug)
    const url = `https://seekvana.com/library/${pillar}/${slug}`
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        url,
        title: frontmatter.title,
        description: frontmatter.description,
        publishedTime: frontmatter.publishedAt,
        authors: [frontmatter.author],
        tags: frontmatter.tags,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.title,
        description: frontmatter.description,
        images: ["/og-image.png"],
      },
    }
  } catch {
    return { title: "Article — Seekvana" }
  }
}
```

- [ ] **Step 2: Add the JSON-LD Article schema helper function**

After the `generateMetadata` function, add:

```typescript
function buildArticleJsonLd(
  frontmatter: ArticleFrontmatter,
  pillar: string,
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    author: {
      "@type": "Organization",
      name: frontmatter.author,
      url: "https://seekvana.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Seekvana",
      url: "https://seekvana.com",
    },
    datePublished: frontmatter.publishedAt,
    url: `https://seekvana.com/library/${pillar}/${slug}`,
    keywords: frontmatter.tags.join(", "),
  }
}
```

- [ ] **Step 3: Render JSON-LD in the article page JSX**

Inside `ArticlePage`, immediately after the opening `<>` fragment (before `<ReadingProgress />`), add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(buildArticleJsonLd(frontmatter, pillar, slug)),
  }}
/>
```

The top of the return statement becomes:

```tsx
return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildArticleJsonLd(frontmatter, pillar, slug)),
      }}
    />
    <ReadingProgress />
    {/* ...rest of JSX unchanged... */}
  </>
)
```

- [ ] **Step 4: Import `ArticleFrontmatter` if not already imported**

Verify `ArticleFrontmatter` is imported at the top of the file:

```typescript
import { getArticleSource, type ArticleFrontmatter } from '@/lib/mdx'
```

The existing import line is:
```typescript
import { getArticleSource } from '@/lib/mdx'
```

Update it to:
```typescript
import { getArticleSource, type ArticleFrontmatter } from '@/lib/mdx'
```

- [ ] **Step 5: Commit**

```bash
git add src/app/library/[pillar]/[slug]/page.tsx
git commit -m "feat(seo): add full OG metadata and JSON-LD Article schema to article pages"
```

---

## Task 8: Run `npm run build` — fix all errors

This is the validation gate. Run the build, capture all errors, and fix them in one pass before declaring Phase 7 complete.

**Files:**
- Whichever files the TypeScript compiler or Next.js build reports errors in.

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Capture the full output. Common error categories to expect and how to fix each:

**A. "Type 'string | undefined' is not assignable to type 'string'"**  
Add a nullish coalescing fallback: `value ?? ''`

**B. "Property 'X' does not exist on type 'Metadata'"**  
Check the import — ensure `Metadata` is from `"next"`, not from another package.

**C. "'use client' cannot be used with async components"**  
If a server component accidentally imports a client component at the top level without a boundary, add `'use client'` to the component or split it.

**D. Next.js route segment config warnings**  
Follow the message — e.g., add `export const dynamic = 'force-dynamic'` if required.

**E. Missing `og-image.png`**  
The build won't fail for a missing image referenced only in metadata strings, but add a placeholder to prevent 404s in production:

```bash
# Create a minimal placeholder (1200x630 white PNG)
# Place any 1200x630 PNG at:
```
`public/og-image.png` — copy any existing image or generate a placeholder. The build itself will not fail without it, but the og:image tags will 404 in production. Add a note in the commit message to replace before launch.

- [ ] **Step 2: Fix all reported errors, re-run until clean**

After each round of fixes:
```bash
npm run build
```

Expected final output ends with:
```
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                   ...
...
```
Zero error lines. Warnings are acceptable.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix(build): resolve all TypeScript and Next.js build errors for Phase 7"
```

---

## Self-Review

### Spec Coverage

| Spec requirement | Task that covers it |
|---|---|
| Security headers (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS) | Task 2 |
| `src/app/sitemap.ts` with all pages | Task 3 |
| `src/app/robots.ts` | Task 4 |
| `src/app/manifest.ts` with theme_color #C9633F | Task 4 |
| Homepage og:title, og:description, og:image, twitter:card | Task 5 (defaults in layout) + Task 6 |
| Article dynamic metadata from frontmatter | Task 7 |
| JSON-LD Article schema on article pages | Task 7 |
| `<link rel="preconnect">` for Google Fonts | Task 5 |
| next/font already in place (FOUT) | No action — already done in Phase 2 |
| All `<img>` → `next/image` | No action — grep confirms zero bare `<img>` tags exist |
| `npm run build` with 0 errors | Task 8 |

### Gaps / Notes

- **`public/og-image.png`** is referenced in metadata but doesn't exist yet. The build passes without it (it's a string URL, not an import), but add a placeholder before the Vercel deploy in Phase 7's manual steps.
- **Icon files** (`icon-192.png`, `icon-512.png`) referenced in `manifest.ts` don't exist. Same situation — build passes, but add placeholders before deploying.
- **`generateStaticParams`** on the article page is deferred to Phase 8 per the spec. Phase 7 does not require it.

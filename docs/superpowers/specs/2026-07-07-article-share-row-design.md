# Article Share Row

**Date:** 2026-07-07
**Status:** Approved, ready for planning

## Problem

Article pages have no visible social-sharing links. Ahrefs flags this ("Social media —
few social sharing options on the page"), and readers have no one-click way to share.

## Goal

Add an icon-only share row (X, Reddit, LinkedIn, Facebook, Copy link) to article pages, at
the top (under the meta line) and bottom (before the feedback row). Clears the Ahrefs warning
and gives readers real share affordances.

## Non-Goals

- WhatsApp / other networks (not selected).
- Share buttons on paths, glossary, tools, or homepage (article pages only for now).
- Share counts, analytics, or any backend.
- A share library/dependency — plain anchor links + clipboard API only.
- Token, layout-column, or navbar changes.

## Constraints (from project rules)

- No hardcoded hex — CSS variable tokens only (`bg-surface-subtle`, `text-secondary`,
  `text-accent`, `border-border`, etc.).
- Fonts by role (Inter for the "Share" label).
- Lucide v1.18 has NO brand icons — use inline brand SVGs for X/Reddit/LinkedIn/Facebook,
  each drawn with `fill="currentColor"` so they inherit theme color. Use Lucide `Link2` and
  `Check` for the copy button.

## Design

### Component: `src/components/article/share-row.tsx` (client component)

```tsx
'use client'
interface ShareRowProps {
  url: string    // absolute canonical, e.g. https://seekvana.com/library/agentic-ai/what-is-an-agent
  title: string  // article title
  label: string  // "Share" (top) or "Share this article" (bottom)
}
```

Renders: the `label` in Inter `text-sm text-secondary`, followed by five icon-only controls.

**Four network links** — rendered as `<a>` with `target="_blank"` and
`rel="noopener noreferrer"`, each with an `aria-label` (e.g. "Share on X"):

| Target   | href (all interpolated values `encodeURIComponent`'d) |
|----------|--------------------------------------------------------|
| X        | `https://twitter.com/intent/tweet?url={url}&text={title}` |
| Reddit   | `https://www.reddit.com/submit?url={url}&title={title}` |
| LinkedIn | `https://www.linkedin.com/sharing/share-offsite/?url={url}` |
| Facebook | `https://www.facebook.com/sharer/sharer.php?u={url}` |

**Copy-link button** — a `<button>` (not an anchor). On click:
1. Try `await navigator.clipboard.writeText(url)`.
2. If that throws or `navigator.clipboard` is undefined (insecure context), fall back to a
   temporary off-screen `<textarea>` + `document.execCommand('copy')`.
3. On success, set a `copied` state true → swap the `Link2` icon for `Check` and show
   "Copied!"; reset after 2000ms via `setTimeout` (clear timer on unmount).

**Button styling (shared by links and copy button):**
- `inline-flex items-center justify-center` sized ~36px (`h-9 w-9` icon-only), or auto-width
  when the copy button shows its "Copied!" text.
- `bg-surface-subtle border border-border rounded-lg text-secondary`
- `hover:text-accent hover:border-accent transition-colors`
- Icons ~16px (`h-4 w-4`).
- Row: `flex flex-wrap items-center gap-2`.

### Integration: `src/app/library/[pillar]/[slug]/page.tsx`

- Build the canonical URL once in the page body (mirrors `generateMetadata`):
  `const shareUrl = ` `https://seekvana.com/library/${pillar}/${slug}` `` `
- **Top instance:** render `<ShareRow url={shareUrl} title={frontmatter.title} label="Share" />`
  immediately after the meta row (`author · date · readTime`) and before the
  `<div className="mt-6 border-t border-border" />` divider (~line 264).
- **Bottom instance:** render
  `<ShareRow url={shareUrl} title={frontmatter.title} label="Share this article" />`
  in its own block directly before the feedback `<hr>` / `<ArticleFeedback />` (~line 278).

The page is already a Server Component; `ShareRow` is a client component imported and used
directly (not through MDX), so normal props (including non-string values, though here all
props are strings) are fine — the MDX string-only-prop rule does not apply.

## Data Flow

```
page.tsx (server) builds shareUrl + passes title
        │
   <ShareRow url title label />  (client)
        │
   network links → intent URLs (encoded)   copy button → clipboard.writeText(url)
        │                                        │
   new tab to network share dialog          "Copied!" for 2s
```

Anchors render in the initial server HTML (share links present for crawlers/Ahrefs even
before hydration). The copy button's interactivity activates on hydration.

## Error Handling

- Clipboard: primary `navigator.clipboard.writeText`; fallback textarea+`execCommand`;
  if both fail, no crash (button simply does not show "Copied!").
- All network links are static hrefs — no runtime failure surface.

## Verification

- `npm run build` succeeds with 0 errors.
- Serve the built app; `curl` an article page and confirm the HTML contains anchors for
  `twitter.com/intent/tweet`, `reddit.com/submit`, `linkedin.com/sharing`, and
  `facebook.com/sharer`, each with the encoded article URL.
- In-browser: copy button copies the URL and shows "Copied!"; icons render and recolor to
  accent on hover; row looks correct in light and dark themes and wraps on mobile.
- Re-run Ahrefs (post-deploy) — "Social media" warning clears.

## Risks / Notes

- `twitter.com/intent/tweet` still works and redirects to x.com; kept for reliability.
- Inline brand SVGs must be simple, recognizable monochrome marks; the X mark is the current
  logo glyph, not the old bird.
- Reusing one component for both placements keeps the two rows visually identical and DRY.

# Handoff: Cache Components (PPR) migration — cut TTFB, fix crawler response time

Status: **not started** — diagnosed and scoped, ready for fresh-session brainstorming + planning.

**Read this whole file before doing anything.** Then run `/brainstorming` (or invoke the `brainstorming` skill) to turn it into a design, per this repo's CLAUDE.md workflow table (New feature → `brainstorming` → `writing-plans`). Do not start implementing from this doc directly.

## Context: what already shipped (prior session, do not redo)

A prior session found `/library/[pillar]/[slug]` and `/paths/[slug]` were rendering the **entire page** dynamically because live Supabase reads happened inline in the main page Server Component (comments, save/bookmark status, completion status, path reading-progress — all `await supabase...` calls sitting directly in `page.tsx` before any JSX rendered).

Fix applied: split each page into a **static shell** (MDX/JSON parsing, breadcrumbs, headings — zero DB calls) plus small async Server Component **"islands"** wrapped in `<Suspense>`, so the shell streams immediately and personalized/dynamic content streams in behind zero-CLS skeleton placeholders. Commits (already merged to `main`, oldest first):

```
a257d08 refactor: extract pure buildCommentTree with unit tests
a2d02a3 refactor: extract pure computePathProgress with unit tests
5e87c5c feat: add server data-access layer for article/path islands
37fdc68 fix: restore graceful degradation on auth errors in getUserReadSet
4741873 feat: add zero-CLS skeleton fallbacks for streaming islands
0f50428 fix: remove dead aria-label on aria-hidden comments skeleton
575efd3 feat: add article streaming islands (comments, bookmark, completion)
a83b553 perf: stream article DB calls behind Suspense, keep shell static
fcd8f4d feat: add path progress streaming island
5ab7c8d perf: stream path progress behind Suspense, keep shell static
e8f716b docs: note why path fallback re-renders real components instead of skeletons
2c41cfa fix: show loading feedback on Google sign-in click (unrelated UX fix, same session)
42a08c6 perf: prioritize cover image loading on 66 articles missing it (unrelated LCP fix, same session)
```

Key new files from that work (read these to understand the established pattern before designing anything new):
- `src/lib/article-data.ts` — server data-access layer. `getCurrentUser()` is wrapped in React `cache()` so multiple islands in one request share a single `auth.getUser()` call. Has a documented, deliberate asymmetry: `getUserReadSet()` catches auth errors internally (returns `[]` on failure), while `getSavedStatus`/`getCompletedStatus`/`getCurrentUser` do not — read the comment above `getCurrentUser` before assuming this is a bug.
- `src/components/article/article-comments-section.tsx`, `article-bookmark-state.tsx`, `article-completion-state.tsx` — the 3 article islands (thin async Server Components, one fetch + one render each).
- `src/components/article/article-islands-skeletons.tsx` — matching zero-CLS skeleton fallbacks (dedicated mock markup, not the real components).
- `src/components/paths/path-progress.tsx` — the 1 path island. Its Suspense fallback (in `src/app/paths/[slug]/page.tsx`) takes a **different approach**: it re-renders the real `ModuleList`/`PathSidebar` components with zeroed props, rather than a dedicated skeleton mock. This was a deliberate choice (those components have real layout — progress ring, per-topic checkmarks — that's cheaper to keep in sync by reusing the components than hand-mocking), documented in a comment in `page.tsx`. **This inconsistency between the two pages' fallback strategies was flagged in review as a legitimate but non-blocking maintainability note** — worth deciding whether to standardize when touching more pages in this migration.
- `src/lib/comment-tree.ts`, `src/lib/path-progress.ts` — pure, unit-tested extraction of the comment-nesting and progress-computation logic that used to be inline in the pages.

### Results, verified

- Build: both routes still print `ƒ Dynamic (server-rendered on demand)` in `next build` output. **This is expected, not a bug** — see "The actual problem" below.
- Manual browser verification (Fast 3G + 4x CPU throttle, logged-out flow, both routes): static shell renders immediately; comments/save/complete/progress stream in a beat later behind skeletons with zero layout shift. Confirmed via raw HTML inspection (Suspense boundary markers `<!--$?-->`/`$RC(...)` present at the right DOM positions) and live browser screenshots.
- **Logged-in flow was never manually verified** — Google's bot detection blocked automated sign-in from this environment, and the magic-link email flow required credentials that were awkward to obtain mid-session. If this migration touches the same islands, logged-in QA should happen for real this time (ask the user to click-test, or get real test credentials up front).
- Real production Lighthouse trace (this session, live seekvana.com, article page, Fast 4G/no CPU throttle): **LCP 777ms, TTFB 617ms, CLS 0.05**. Big improvement over the pre-fix baseline (FCP 3.15s / LCP 3.09s, real-user aggregate, flagged "Needs Improvement" in Vercel Speed Insights).
- A separate, unrelated LCP bug was found and fixed in the same session: 66 of 123 article cover images were missing `priority`/`isCover` on their `<ArticleImage>` (so the LCP image itself was lazy-loaded, adding ~1.9s of "load delay" before the browser even started fetching it). Fixed by scripted edit across all 66 `.mdx` files, commit `42a08c6`. Not part of this migration's scope, mentioned only so it isn't rediscovered/redone.

## The actual problem this migration solves

The Suspense split fixed **perceived speed** (LCP/FCP) — the shell now streams before the DB resolves. It did **not** fix **TTFB** (time to first byte) — every request to `/library/[pillar]/[slug]` and `/paths/[slug]` is still a live serverless function invocation (MDX parsing, route matching, function cold-start overhead) rather than a static file served instantly from Vercel's edge cache.

The user ran a third-party SEO/crawler tool (Seobility-style) against a live page and got:

> "The page response time of 0.94 seconds is longer than the recommended limit of 0.4 seconds."

Root cause: the route prints `ƒ Dynamic` in the build — Next.js still executes the whole page as a server function per request. On **Next.js 16**, the only way to flip that marker to a prerendered/partial-prerender route (and get near-static TTFB for the shell, with only the truly dynamic islands staying live) is **Cache Components** — the Next 16 successor to PPR, enabled via `cacheComponents: true` in `next.config.ts`. Load the `vercel:next-cache-components` skill for current syntax/behavior before designing — it covers PPR, `use cache`, `cacheLife`, `cacheTag`, `updateTag`, and migration from `unstable_cache`, and this doc's job is to hand off context, not to be the authority on the API.

## Why this is a separate, bigger project (do not rush it)

`cacheComponents: true` is a **sitewide** switch, not a per-route opt-in. Once enabled, Next.js 16 requires that **every** route's uncached dynamic work be explicitly behind `<Suspense>` or marked cacheable (`'use cache'` + `cacheLife`) — anything else **fails the build**, not just that one route. This repo has zero existing adoption of `cacheComponents`, `'use cache'`, or `cacheLife`/`cacheTag` anywhere (verified via repo-wide grep this session).

### Routes that still do inline dynamic reads directly in their page component (not yet Suspense-isolated)

Verified via grep for `await cookies`/`createServerClient`/`supabase-server` imports directly in `src/app/**/page.tsx` (excluding the two already-fixed routes and API routes):

- `src/app/profile/layout.tsx`
- `src/app/profile/page.tsx`
- `src/app/profile/progress/page.tsx`
- `src/app/profile/reading-list/page.tsx` — read in full this session; auth check + `reading_list` query + `getAllArticles()` all inline before any JSX. Same shape as the article page's original bug.
- `src/app/profile/settings/page.tsx`
- `src/app/u/[username]/page.tsx` — read in full this session; **different shape from article/path pages** — this route has almost no static shell at all. Nearly every visible element (streak, badges, stats, member-since date) is derived from the Supabase reads (`user_profiles`, `article_reads`) via `calculateStreak`/`calculateBadges`/`calculatePathProgress` from `src/lib/profile.ts`. A clean "static shell + dynamic island" split may not apply cleanly here — worth deciding during brainstorming whether this route (a) gets a minimal static shell (just the outer page chrome) with one big Suspense island for everything else, (b) is explicitly excluded from Cache Components via a per-route dynamic opt-out if Next 16 supports one, or (c) is left `ƒ Dynamic` deliberately since it's a low-traffic public-profile page, not an SEO-critical content page like articles.

None of these 6 have been touched — they're listed so a design can account for them, not because this doc is prescribing exactly how to fix each one.

### Also unaudited (out of scope to list exhaustively here — the brainstorming session should re-grep at start, since content changes daily)

API routes (`/api/newsletter/*`, `/auth/callback`) are Route Handlers, not page Server Components — different rules apply under Cache Components; don't assume they need the same treatment without checking the current Next 16 docs via the `vercel:next-cache-components` skill.

## Constraints for the design session

- **This is a content site with articles being published ~daily** (confirmed via git log — commits like "Add Lesson 09.07/09.08" land on `main` from a separate, concurrent workflow while this session was active). A sitewide build-breaking config change carries real risk of colliding with in-flight content work. Whatever plan comes out of brainstorming should account for how to land this without blocking daily publishing, and should NOT assume exclusive access to `main` during implementation — check `git log` for new commits before starting and after any long-running step.
- **Test the logged-in flow for real this time.** The previous session's biggest verification gap was never getting a real authenticated session to click-test (Google OAuth blocked by bot detection in the sandboxed browser; magic-link required credentials that were awkward to obtain mid-session). If this migration touches profile pages, plan for real login testing from the start — either get test credentials up front, or plan to hand a manual QA checklist to the user before calling any phase done.
- **Full-site `next build` after enabling the flag will likely surface errors on routes not listed above** — this repo has ~100+ routes and the audit in this doc only covers the ones known to read cookies/Supabase directly in a page component. Treat the six routes above as a starting checklist, not a complete one.
- Follow this repo's established workflow: `brainstorming` → `writing-plans` → (`subagent-driven-development` or `executing-plans`) → `verification-before-completion`. The prior Suspense-splitting session used `subagent-driven-development` (fresh subagent per task, two-stage spec+quality review each) successfully — consider the same approach here given the similar shape of work (many small, similar page migrations).

## Suggested starting point for brainstorming (not a decision — just a prompt)

A reasonable first question for the design session: migrate the 6 known routes to the Suspense-island pattern first (in their own PR/session, verified independently), **then** flip `cacheComponents: true` in one clean pass once the whole known surface is compliant — versus flipping the flag first and fixing whatever the build errors surface. The user was mid-way through choosing between these when this doc was written; re-ask, don't assume the answer carried over.

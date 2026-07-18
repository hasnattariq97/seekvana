# Spec: Cache Components migration — cut TTFB below 0.4s

Date: 2026-07-18
Status: approved design, ready for `writing-plans`
Predecessor context: `docs/perf-cache-components-migration.md` (handoff), the prior Suspense-splitting session (commits `a257d08`..`5ab7c8d`).

## Problem

`/library/[pillar]/[slug]` and `/paths/[slug]` still render as `ƒ Dynamic` (live serverless function per request) even after the prior session's Suspense split. Perceived speed (LCP/FCP) improved, but **TTFB did not**: a third-party crawler reported a 0.94s page response time against the 0.4s recommended limit. On Next.js 16 the only way to flip these routes to partial prerender (static shell from edge cache + dynamic islands streaming) is **Cache Components** (`cacheComponents: true`).

`cacheComponents` is a **sitewide** switch. Once on, every route's uncached dynamic work must be behind `<Suspense>` or marked cacheable (`'use cache'` + `cacheLife`), or the build fails. This repo currently has **zero** adoption of `cacheComponents` / `use cache` / `cacheLife` / `cacheTag` in `src` (verified by grep, 2026-07-18).

## Goal & success criteria

- `/library/[pillar]/[slug]` and `/paths/[slug]` flip from `ƒ Dynamic` to partial prerender: static shell served from edge, DB islands still stream behind zero-CLS skeletons.
- Article/path shell TTFB comfortably under the 0.4s crawler limit (baseline: 0.94s reported).
- `next build` stays green on `main` at every step — never blocks the concurrent daily content-publishing workflow.
- No CLS regression (hold the prior session's ~0.05).
- Logged-in profile flows verified for real via a handed-off manual QA checklist (closes the prior session's biggest verification gap).

## Core insight (shapes the whole plan)

The article and path shells are **already** Suspense-isolated from their DB islands (prior session's work). They print `ƒ Dynamic` only because the flag is off. Flipping `cacheComponents: true` should let their static shells auto-prerender with near-zero code change.

The real work is the **6 routes that still do inline Supabase/cookie reads directly in the page component** — they break the build the instant the flag flips. Fix those first (flag off), flip the flag last.

## Environment (verified 2026-07-18)

- Next.js `16.2.9`.
- 20 `page.tsx` route files (dynamic params expand to 100+ pages at build).
- 6 known non-compliant files (grep for `createServerClient` / `supabase-server` / `await cookies` in `src/app/**/{page,layout}.tsx`, excluding the two already-fixed routes and API routes):
  - `src/app/profile/layout.tsx`
  - `src/app/profile/page.tsx`
  - `src/app/profile/progress/page.tsx`
  - `src/app/profile/reading-list/page.tsx`
  - `src/app/profile/settings/page.tsx`
  - `src/app/u/[username]/page.tsx`

## Approach — three content types applied per route

- **Static** (auto-prerendered): MDX/JSON parse, breadcrumbs, headings, page chrome, layout scaffold.
- **`use cache`**: shared, non-personalized data (e.g. `getAllArticles()` in reading-list; the entire `/u/[username]` public profile).
- **Suspense island**: per-viewer dynamic data (auth-gated profile body, save/complete/comments) — reuse the established island pattern from `src/lib/article-data.ts` + `src/components/article/*` + `src/components/paths/path-progress.tsx`.

## Phases

### Phase 0 — Discovery (throwaway, nothing committed)

Flip `cacheComponents: true` locally, run `next build`, capture the **complete** list of non-compliant routes to a scratch file, then revert the flag. Confirms whether the 6 known routes are the whole surface or there are surprises (the handoff warns there will be, given ~100+ generated pages). Cheap; keeps `main` untouched.

### Phase 1 — Migrate non-compliant routes (flag OFF, build stays green)

Per route (or small group), apply the static-shell + Suspense-island split, or `use cache` where the data is shared/non-personalized.

| Route | Treatment |
|---|---|
| `/profile/page.tsx`, `/profile/layout.tsx`, `/profile/progress`, `/profile/settings` | Static chrome + one Suspense island per auth-gated data region; reuse `getCurrentUser()` (React-`cache()`-wrapped) so islands share one `auth.getUser()`. |
| `/profile/reading-list` | Same shell/island split; `getAllArticles()` (static content data) wrapped in `'use cache'`. |
| `/u/[username]` | `'use cache'` + `cacheLife` with **time-based** staleness (minutes/hours). Public profile → every viewer sees the same data → no per-viewer split needed. Skip `cacheTag`-per-read invalidation; a few minutes' staleness on a public profile is acceptable. |
| Any Phase-0 surprise routes | Case-by-case, same toolkit. |

Each route (or small group) = its own commit/PR, independently verified. Build must stay green after each merge.

**Fallback strategy:** leave the two existing strategies as-is (article = dedicated skeleton mocks; path = re-render real components with zeroed props). Both were deliberate, documented choices. New profile routes pick whichever fits per-route. Documented as accepted divergence — no refactor of already-merged code.

### Phase 2 — Flip the flag (one clean PR)

Set `cacheComponents: true` in `next.config.ts`. Full `next build`. Fix any last stragglers. Verify `/library/[pillar]/[slug]` and `/paths/[slug]` now print partial prerender (not `ƒ Dynamic`). Merge.

### Phase 3 — Verify

- Production Lighthouse/TTFB on an article page and a path page; confirm shell TTFB < 0.4s.
- Logged-in **manual QA checklist** (`docs/superpowers/specs/` or handed inline) covering every profile route + `/u/<self>` logged in: renders, correct data (streak/badges/saved items), no CLS. User ticks each before any phase is called done. No credentials shared with the agent.

## Landing safely alongside daily commits

The repo publishes content ~daily; commits land on `main` from a separate concurrent workflow. Therefore:

- Work in a **git worktree** (isolation from the `main` workspace).
- Check `git log main` before starting and after any long-running step; rebase if content commits landed.
- Small per-route PRs → merge windows stay tiny.
- Never assume exclusive access to `main`.
- Execution via **`subagent-driven-development`** (fresh subagent per route, two-stage spec+quality review each) — the same shape that worked for the prior Suspense session.

## Out of scope

- API routes (`/api/newsletter/*`, `/auth/callback`) — Route Handlers, different Cache Components rules. Touch only if Phase-0 build flags them.
- Cover-image LCP fix (already shipped, commit `42a08c6`).
- Refactoring the already-merged article/path Suspense fallback strategies.
- Any redesign of the profile pages' visual layout — this is a rendering/caching migration only.

## Risks & mitigations

- **Build-breaking flag collides with daily commits** → flag flips last, in one small PR; everything before it keeps the build green.
- **Unknown non-compliant routes beyond the 6** → Phase 0 harvests the full list before any code is written.
- **`use cache` + runtime APIs** → `cookies()`/`headers()` cannot run inside `use cache`; extract outside and pass as serializable args, or keep those regions in Suspense islands (not cached).
- **Logged-in QA gap (prior session)** → explicit manual checklist gate before completion.
- **Content published mid-migration** → rebase checks before/after long steps.

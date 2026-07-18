# Cache Components Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable Next.js 16 `cacheComponents: true` sitewide so `/library/[pillar]/[slug]` and `/paths/[slug]` flip from `ƒ Dynamic` to partial prerender (static shell from edge cache, DB islands still stream), cutting shell TTFB below the 0.4s crawler limit — without ever breaking the `main` build.

**Architecture:** The article/path shells are already Suspense-isolated from their DB islands, so flipping the flag should make them partial-prerender with near-zero change. The real work is the 6 profile/username routes that still read cookies/Supabase directly in the page component — they break the build the instant the flag flips. Fix those first (flag OFF, `main` stays green), then flip the flag last in one clean pass.

**Tech Stack:** Next.js 16.2.9 (App Router, Cache Components / PPR), React Server Components + Suspense, Supabase (`@supabase/ssr` cookie client + `@supabase/supabase-js` anon client), Vitest, TypeScript, Tailwind.

**Spec:** `docs/superpowers/specs/2026-07-18-cache-components-migration-design.md`
**Handoff context:** `docs/perf-cache-components-migration.md`

---

## Critical sequencing constraint (read before starting)

`'use cache'` / `cacheLife` / `cacheTag` **only compile when `cacheComponents: true`**. So caching work (the `/u/[username]` cache, the optional `getAllArticles()` cache) **cannot** land in Phase 1 (flag OFF) — it lands in Phase 2 (flag ON). Phase 1 makes every route cookie-isolated and Suspense-compliant so the flag flips cleanly; Phase 2 flips the flag and adds the `use cache` directives.

**Daily-commit safety:** content commits land on `main` from a concurrent workflow. Before starting and after any long step run `git fetch && git log --oneline origin/main -5`; rebase the working branch if new commits landed. Keep each task's diff small; merge Phase 1 tasks independently. Work in the existing worktree if one is set up, else a feature branch off `main`.

---

## File Structure

**New files:**
- `src/lib/profile-data.ts` — server data-access for profile routes: `requireUser()` (auth gate), pure `slugifyDisplayName()` / `matchPublicProfile()`, and `getPublicProfile()` (public-profile fetch via anon client, gains `use cache` in Phase 2).
- `src/lib/profile-data.test.ts` — unit tests for the pure `slugifyDisplayName` / `matchPublicProfile` logic.
- `src/components/profile/profile-skeletons.tsx` — zero-CLS Suspense fallbacks, one per profile route.
- `src/components/profile/profile-dashboard-island.tsx` — async island: dashboard data + render.
- `src/components/profile/progress-island.tsx` — async island: progress data + render (owns `PathCard`, `PATH_COLORS`, `pathColor`).
- `src/components/profile/reading-list-island.tsx` — async island: reading-list data + render.
- `src/components/profile/settings-island.tsx` — async island: settings data + render.

**Modified files:**
- `src/app/profile/layout.tsx` — becomes a pure passthrough (auth moves into each island).
- `src/app/profile/page.tsx` — static shell + `<Suspense>` island.
- `src/app/profile/progress/page.tsx` — static shell + `<Suspense>` island.
- `src/app/profile/reading-list/page.tsx` — static shell + `<Suspense>` island.
- `src/app/profile/settings/page.tsx` — static shell + `<Suspense>` island.
- `src/app/u/[username]/page.tsx` — render via `getPublicProfile()` (anon, cookie-free).
- `next.config.ts` — `cacheComponents: true` (Phase 2).

---

## PHASE 0 — Discovery (throwaway, nothing committed)

### Task 0.1: Harvest the complete non-compliant surface

**Files:** none committed. Scratch output only.

- [ ] **Step 1: Sync main**

Run: `git fetch && git log --oneline origin/main -5`
Note any new content commits; rebase the working branch if needed.

- [ ] **Step 2: Temporarily enable the flag**

Edit `next.config.ts` — add `cacheComponents: true` to the `nextConfig` object (do NOT commit):

```ts
const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};
```

- [ ] **Step 3: Run the build and capture failures**

Run: `npm run build 2>&1 | tee /tmp/cc-discovery.txt` (Windows: `npm run build > cc-discovery.txt 2>&1`)
Expected: build FAILS. Look for errors like `Route "/..." used \`cookies\`/\`headers\`/uncached data outside a Suspense boundary` or `couldn't be rendered statically`.

- [ ] **Step 4: Record the full route list**

Extract every route path the build flags into a scratch checklist. Compare against the 6 known routes below. Any route NOT in this list is a "Phase-0 surprise" — add a matching migration task to Phase 1 mirroring the closest example (island split for cookie/user reads; `getPublicProfile`-style cached anon fetch for shared data).

Known 6 (from spec):
- `src/app/profile/layout.tsx`
- `src/app/profile/page.tsx`
- `src/app/profile/progress/page.tsx`
- `src/app/profile/reading-list/page.tsx`
- `src/app/profile/settings/page.tsx`
- `src/app/u/[username]/page.tsx`

- [ ] **Step 5: Revert the flag**

Run: `git checkout next.config.ts`
Verify: `git diff next.config.ts` prints nothing. The flag is OFF again for all of Phase 1.

---

## PHASE 1 — Migrate routes (flag OFF, `main` stays green)

### Task 1.1: Create the profile data-access layer + pure matcher (TDD)

**Files:**
- Create: `src/lib/profile-data.ts`
- Test: `src/lib/profile-data.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/profile-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { slugifyDisplayName, matchPublicProfile, type PublicProfileRow } from './profile-data'

const rows: PublicProfileRow[] = [
  { user_id: 'abc123-uuid', display_name: 'Ada Lovelace', is_public: true, created_at: '2026-01-01' },
  { user_id: 'def456-uuid', display_name: 'Grace Hopper!', is_public: true, created_at: '2026-02-01' },
]

describe('slugifyDisplayName', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugifyDisplayName('Ada Lovelace')).toBe('ada-lovelace')
  })
  it('strips non-alphanumeric characters', () => {
    expect(slugifyDisplayName('Grace Hopper!')).toBe('grace-hopper')
  })
  it('returns empty string for null', () => {
    expect(slugifyDisplayName(null)).toBe('')
  })
})

describe('matchPublicProfile', () => {
  it('matches by slugified display name', () => {
    expect(matchPublicProfile(rows, 'ada-lovelace')?.user_id).toBe('abc123-uuid')
  })
  it('matches by user_id prefix fallback', () => {
    expect(matchPublicProfile(rows, 'def456')?.user_id).toBe('def456-uuid')
  })
  it('returns null when nothing matches', () => {
    expect(matchPublicProfile(rows, 'nobody')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/profile-data.test.ts`
Expected: FAIL — `Failed to resolve import "./profile-data"` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/lib/profile-data.ts`:

```ts
import { createClient as createAnonClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/article-data'
import type { ArticleRead } from '@/lib/profile'

/** Anon client — no cookies, so these reads do NOT force dynamic rendering. */
function anon() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Auth gate shared by all /profile/* islands. Redirects logged-out users.
 * Lives inside a Suspense island (not the layout) so the flag-on build can
 * keep the profile shells static while this dynamic read streams behind it.
 */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/?auth=required')
  return user
}

export type PublicProfileRow = {
  user_id: string
  display_name: string | null
  is_public: boolean
  created_at: string
}

/** Slugify a display name the same way the public profile URL is generated. */
export function slugifyDisplayName(name: string | null): string {
  return (name ?? '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

/** Find a public profile by slugified display name, falling back to user_id prefix. */
export function matchPublicProfile(
  profiles: PublicProfileRow[],
  username: string
): PublicProfileRow | null {
  return (
    profiles.find(
      (p) => slugifyDisplayName(p.display_name) === username || p.user_id.startsWith(username)
    ) ?? null
  )
}

/**
 * Public profile + that user's reads, fetched via the anon client (no cookies).
 * Cookie-free so it can be cached in Phase 2 (add 'use cache' then — the
 * directive does not compile until cacheComponents is enabled).
 * Returns null when no matching public profile exists.
 */
export async function getPublicProfile(
  username: string
): Promise<{ profile: PublicProfileRow; reads: ArticleRead[] } | null> {
  const supabase = anon()

  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, display_name, is_public, created_at')
    .eq('is_public', true)

  const profile = matchPublicProfile((profiles ?? []) as PublicProfileRow[], username)
  if (!profile) return null

  const { data: readsData } = await supabase
    .from('article_reads')
    .select('pillar, article_slug, read_at')
    .eq('user_id', profile.user_id)

  const reads: ArticleRead[] = (readsData ?? []).map((r) => ({
    pillar: r.pillar,
    articleSlug: r.article_slug,
    readAt: r.read_at,
  }))

  return { profile, reads }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/profile-data.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/profile-data.ts src/lib/profile-data.test.ts
git commit -m "feat: add profile data-access layer with pure username matcher"
```

---

### Task 1.2: Create profile Suspense skeletons

**Files:**
- Create: `src/components/profile/profile-skeletons.tsx`

- [ ] **Step 1: Write the skeletons**

Create `src/components/profile/profile-skeletons.tsx`:

```tsx
/** Zero-CLS fallbacks for the profile route islands. Non-interactive. */

export function ProfileDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-subtle" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-surface-subtle" />
            <div className="h-4 w-32 rounded bg-surface-subtle" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-subtle" />
          ))}
        </div>
        <div className="h-40 rounded-xl bg-surface-subtle" />
      </div>
    </div>
  )
}

export function ProgressSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-8 w-56 rounded bg-surface-subtle mb-2" />
        <div className="h-4 w-72 rounded bg-surface-subtle mb-8" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-surface-subtle" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReadingListSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-surface-subtle mb-6" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-surface-subtle" />
        ))}
      </div>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-xl mx-auto animate-pulse">
        <div className="h-8 w-40 rounded bg-surface-subtle mb-8" />
        <div className="space-y-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-surface-subtle" />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/profile-skeletons.tsx
git commit -m "feat: add zero-CLS skeletons for profile route islands"
```

---

### Task 1.3: Create the four profile islands

Each island is the current page body, minus the outer chrome, with the inline `auth.getUser()`/`return null` replaced by `requireUser()`.

**Files:**
- Create: `src/components/profile/profile-dashboard-island.tsx`
- Create: `src/components/profile/progress-island.tsx`
- Create: `src/components/profile/reading-list-island.tsx`
- Create: `src/components/profile/settings-island.tsx`

- [ ] **Step 1: Dashboard island**

Create `src/components/profile/profile-dashboard-island.tsx`:

```tsx
import { createClient } from '@/lib/supabase-server'
import { requireUser } from '@/lib/profile-data'
import {
  calculateStreak,
  calculateBadges,
  calculatePathProgress,
} from '@/lib/profile'
import type { ArticleRead } from '@/lib/profile'
import { ProfileDashboard } from '@/components/profile/profile-dashboard'

export async function ProfileDashboardIsland() {
  const user = await requireUser()
  const supabase = await createClient()

  const [profileRes, readsRes] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('display_name, is_public, created_at')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('article_reads')
      .select('pillar, article_slug, read_at')
      .eq('user_id', user.id),
  ])

  const profile = profileRes.data
  const reads: ArticleRead[] = (readsRes.data ?? []).map((r) => ({
    pillar: r.pillar,
    articleSlug: r.article_slug,
    readAt: r.read_at,
  }))

  const displayName =
    profile?.display_name ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Seekvana Reader'

  const isPublic = profile?.is_public ?? false
  const memberSince = new Date(
    profile?.created_at ?? user.created_at
  ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const streak = calculateStreak(reads)
  const pathProgress = calculatePathProgress(reads)
  const completedPaths = pathProgress
    .filter((p) => p.status === 'completed')
    .map((p) => p.pathSlug)
  const inProgressPaths = pathProgress.filter((p) => p.status === 'in-progress')
  const badges = calculateBadges(streak, reads, completedPaths)
  const initials =
    displayName
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'

  return (
    <ProfileDashboard
      userId={user.id}
      displayName={displayName}
      initials={initials}
      isPublic={isPublic}
      memberSince={memberSince}
      totalReads={reads.length}
      streak={streak}
      completedPathsCount={completedPaths.length}
      earnedBadgesCount={badges.filter((b) => b.earned).length}
      badges={badges}
      inProgressPaths={inProgressPaths}
    />
  )
}
```

- [ ] **Step 2: Progress island** (owns `PathCard`, `PATH_COLORS`, `pathColor` moved from the page)

Create `src/components/profile/progress-island.tsx`:

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { requireUser } from '@/lib/profile-data'
import { calculatePathProgress } from '@/lib/profile'
import type { ArticleRead, PathProgress } from '@/lib/profile'

const PATH_COLORS: Record<string, string> = {
  'bg-purple-500': '#8B5CF6',
  'bg-teal-500': '#14B8A6',
  'bg-green-500': '#22C55E',
  'bg-amber-500': '#F59E0B',
  'bg-blue-500': '#3B82F6',
}

function pathColor(colorClass: string): string {
  return PATH_COLORS[colorClass] ?? '#C9633F'
}

export async function ProgressIsland() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: readsData } = await supabase
    .from('article_reads')
    .select('pillar, article_slug, read_at')
    .eq('user_id', user.id)

  const reads: ArticleRead[] = (readsData ?? []).map((r) => ({
    pillar: r.pillar,
    articleSlug: r.article_slug,
    readAt: r.read_at,
  }))

  const allPaths = calculatePathProgress(reads)
  const inProgress = allPaths.filter((p) => p.status === 'in-progress')
  const completed = allPaths.filter((p) => p.status === 'completed')
  const notStarted = allPaths.filter((p) => p.status === 'not-started')

  return (
    <>
      <div className="mb-8">
        <h1 className="font-fraunces text-2xl text-primary">Learning Progress</h1>
        <p className="text-sm text-secondary mt-1">
          {completed.length} completed · {inProgress.length} in progress · {notStarted.length} not started
        </p>
      </div>

      {inProgress.length > 0 && (
        <>
          <p className="font-fraunces text-sm text-secondary mb-3">In Progress</p>
          <div className="space-y-4 mb-8">
            {inProgress.map((p) => (
              <PathCard key={p.pathSlug} path={p} color={pathColor(p.colorClass)} expanded />
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <p className="font-fraunces text-sm text-secondary mb-3">Completed</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {completed.map((p) => (
              <div key={p.pathSlug} className="bg-surface border border-border rounded-xl px-5 py-4 flex gap-3 items-center">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-sm font-medium text-primary">{p.title}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    ✓ All {p.totalLessons} lessons complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {notStarted.length > 0 && (
        <>
          <p className="font-fraunces text-sm text-secondary mb-3">Not Started</p>
          <div className="space-y-3">
            {notStarted.map((p) => (
              <div key={p.pathSlug} className="bg-surface border border-border rounded-xl px-5 py-4 flex items-center gap-4 opacity-60">
                <span className="text-2xl">📘</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{p.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{p.totalLessons} lessons</p>
                </div>
                {p.nextLesson && (
                  <Link
                    href={`/library/${p.nextLesson.pillar}/${p.nextLesson.slug}`}
                    className="text-xs border border-border text-primary px-3 py-1.5 rounded-lg hover:bg-surface-subtle transition-colors flex-shrink-0"
                  >
                    Start →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {allPaths.length === 0 && (
        <div className="text-center py-16 text-secondary">
          <p className="mb-3">No paths found.</p>
          <Link href="/paths" className="text-accent text-sm hover:text-accent-deep transition-colors">
            Browse learning paths →
          </Link>
        </div>
      )}
    </>
  )
}

function PathCard({ path, color, expanded }: { path: PathProgress; color: string; expanded: boolean }) {
  const pct = path.totalLessons > 0
    ? Math.round((path.completedLessons / path.totalLessons) * 100)
    : 0

  const visibleLessons = path.lessons.slice(0, 8)

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-4 border-b border-border/50">
        <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <p className="text-base font-fraunces font-medium text-primary">{path.title}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex-1 bg-surface-subtle rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-secondary flex-shrink-0">
              {path.completedLessons} / {path.totalLessons}
            </span>
          </div>
        </div>
        {path.nextLesson && (
          <Link
            href={`/library/${path.nextLesson.pillar}/${path.nextLesson.slug}`}
            className="text-xs text-white px-4 py-1.5 rounded-lg flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: color }}
          >
            Continue →
          </Link>
        )}
      </div>
      {expanded && (
        <div className="px-5 py-3 grid sm:grid-cols-2 gap-x-6 gap-y-1">
          {visibleLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg px-1 ${lesson.isNext ? 'bg-accent-soft -mx-1 px-2' : ''}`}
            >
              {lesson.completed ? (
                <span className="text-green-500 text-sm">✓</span>
              ) : lesson.isNext ? (
                <span className="text-accent text-sm">→</span>
              ) : (
                <span className="text-border text-sm">○</span>
              )}
              <span
                className={`text-sm font-inter ${
                  lesson.completed
                    ? 'line-through text-secondary'
                    : lesson.isNext
                    ? 'font-medium text-accent'
                    : 'text-secondary'
                }`}
              >
                {lesson.title}
              </span>
              {lesson.isNext && (
                <span className="ml-auto text-[10px] bg-accent-soft text-accent rounded-full px-2 py-0.5">Next</span>
              )}
            </div>
          ))}
          {path.lessons.length > 8 && (
            <div className="py-1.5 px-1 text-xs text-secondary">
              + {path.lessons.length - 8} more lessons
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Reading-list island**

Create `src/components/profile/reading-list-island.tsx`:

```tsx
import { createClient } from '@/lib/supabase-server'
import { requireUser } from '@/lib/profile-data'
import { getAllArticles } from '@/lib/mdx'
import { ReadingListClient } from '@/app/profile/reading-list/reading-list-client'

export async function ReadingListIsland() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('reading_list')
    .select('id, pillar, article_slug, saved_at, read_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const allArticles = getAllArticles()
  const articleMap = new Map(
    allArticles.map((a) => [`${a.pillar}/${a.slug}`, a])
  )

  const items = (rows ?? []).map((row) => {
    const meta = articleMap.get(`${row.pillar}/${row.article_slug}`)
    return {
      id: row.id as string,
      pillar: row.pillar as string,
      articleSlug: row.article_slug as string,
      savedAt: row.saved_at as string,
      readAt: row.read_at as string | null,
      title: meta?.frontmatter.title ?? row.article_slug,
      readTime: meta?.frontmatter.readTime ?? 0,
      difficulty: (meta?.frontmatter.difficulty ?? 'beginner') as 'beginner' | 'intermediate' | 'advanced',
    }
  })

  return <ReadingListClient items={items} userId={user.id} />
}
```

- [ ] **Step 4: Settings island**

Create `src/components/profile/settings-island.tsx`:

```tsx
import { createClient } from '@/lib/supabase-server'
import { requireUser } from '@/lib/profile-data'
import { SettingsClient } from '@/app/profile/settings/settings-client'

export async function SettingsIsland() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, is_public')
    .eq('user_id', user.id)
    .single()

  return (
    <SettingsClient
      userId={user.id}
      email={user.email ?? ''}
      initialDisplayName={profile?.display_name ?? (user.user_metadata?.full_name as string) ?? ''}
      initialIsPublic={profile?.is_public ?? false}
      signInMethod={user.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Magic Link'}
    />
  )
}
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors. (Confirm the import paths `@/app/profile/reading-list/reading-list-client` and `@/app/profile/settings/settings-client` resolve — these client components already exist and were previously imported relatively by their pages.)

- [ ] **Step 6: Commit**

```bash
git add src/components/profile/profile-dashboard-island.tsx src/components/profile/progress-island.tsx src/components/profile/reading-list-island.tsx src/components/profile/settings-island.tsx
git commit -m "feat: add profile route islands (dashboard, progress, reading-list, settings)"
```

---

### Task 1.4: Rewrite the profile pages as static shell + Suspense, layout as passthrough

**Files:**
- Modify: `src/app/profile/layout.tsx`
- Modify: `src/app/profile/page.tsx`
- Modify: `src/app/profile/progress/page.tsx`
- Modify: `src/app/profile/reading-list/page.tsx`
- Modify: `src/app/profile/settings/page.tsx`

- [ ] **Step 1: Layout → passthrough**

Replace the entire contents of `src/app/profile/layout.tsx`:

```tsx
/**
 * Passthrough. The auth redirect that used to live here moved into each
 * route's Suspense island (requireUser in src/lib/profile-data.ts) so the
 * profile shells stay static under cacheComponents while the auth-gated
 * data streams behind a skeleton. A logged-out visitor sees the skeleton
 * for one beat, then requireUser() redirects to /?auth=required.
 */
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: `/profile` page → shell + Suspense**

Replace the entire contents of `src/app/profile/page.tsx`:

```tsx
import { Suspense } from 'react'
import { ProfileDashboardIsland } from '@/components/profile/profile-dashboard-island'
import { ProfileDashboardSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'My Profile' }

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileDashboardSkeleton />}>
      <ProfileDashboardIsland />
    </Suspense>
  )
}
```

- [ ] **Step 3: `/profile/progress` page → shell + Suspense**

Replace the entire contents of `src/app/profile/progress/page.tsx`:

```tsx
import { Suspense } from 'react'
import { ProgressIsland } from '@/components/profile/progress-island'
import { ProgressSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'Learning Progress' }

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<ProgressSkeleton />}>
          <ProgressIsland />
        </Suspense>
      </div>
    </div>
  )
}
```

Note: `ProgressSkeleton` renders its own `min-h-screen ... max-w-3xl` wrapper, so during fallback it briefly nests inside this shell's wrapper. This is cosmetically fine (same background, no CLS). If a reviewer objects, drop the wrapper from `ProgressSkeleton`; the current form is intentional so each skeleton is usable standalone.

- [ ] **Step 4: `/profile/reading-list` page → shell + Suspense**

Replace the entire contents of `src/app/profile/reading-list/page.tsx`:

```tsx
import { Suspense } from 'react'
import { ReadingListIsland } from '@/components/profile/reading-list-island'
import { ReadingListSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'Reading List' }

export default function ReadingListPage() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<ReadingListSkeleton />}>
          <ReadingListIsland />
        </Suspense>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: `/profile/settings` page → shell + Suspense**

Replace the entire contents of `src/app/profile/settings/page.tsx`:

```tsx
import { Suspense } from 'react'
import { SettingsIsland } from '@/components/profile/settings-island'
import { SettingsSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="font-fraunces text-2xl text-primary mb-8">Settings</h1>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsIsland />
        </Suspense>
      </div>
    </div>
  )
}
```

Note: the static `<h1>Settings</h1>` stays in the shell (it was static in the original); `SettingsSkeleton` also renders a heading placeholder, so during the fallback both the real h1 and the skeleton's placeholder h1 appear briefly. To avoid the double heading, remove the `h-8 w-40 ... mb-8` line from `SettingsSkeleton`. Do that in this step.

Apply this edit to `src/components/profile/profile-skeletons.tsx` — in `SettingsSkeleton`, delete the line:

```tsx
        <div className="h-8 w-40 rounded bg-surface-subtle mb-8" />
```

- [ ] **Step 6: Verify build stays green (flag still OFF)**

Run: `npm run build`
Expected: SUCCESS, 0 errors. Profile routes still print `ƒ Dynamic` (expected — flag is off). Nothing regressed.

- [ ] **Step 7: Lint + typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add src/app/profile/layout.tsx src/app/profile/page.tsx src/app/profile/progress/page.tsx src/app/profile/reading-list/page.tsx src/app/profile/settings/page.tsx src/components/profile/profile-skeletons.tsx
git commit -m "refactor: split profile pages into static shell + Suspense islands"
```

---

### Task 1.5: Make `/u/[username]` cookie-free (render via anon `getPublicProfile`)

**Files:**
- Modify: `src/app/u/[username]/page.tsx`

- [ ] **Step 1: Rewrite the page to use `getPublicProfile`**

Replace the data-fetch section of `src/app/u/[username]/page.tsx`. Keep the `BadgeIconPublic` component and all JSX below unchanged; only swap how `profile` + `reads` are obtained. The new top of the file (imports through the data fetch) becomes:

```tsx
import { notFound } from 'next/navigation'
import { BookOpen, Flame, Trophy, Award } from 'lucide-react'
import {
  calculateStreak,
  calculateBadges,
  calculatePathProgress,
} from '@/lib/profile'
import { getPublicProfile } from '@/lib/profile-data'

function BadgeIconPublic({ id }: { id: string }) {
  // ...unchanged (keep the existing implementation verbatim)...
}

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const data = await getPublicProfile(username)
  if (!data) notFound()
  const { profile, reads } = data

  const streak = calculateStreak(reads)
  const pathProgress = calculatePathProgress(reads)
  const completedPaths = pathProgress
    .filter((p) => p.status === 'completed')
    .map((p) => p.pathSlug)
  const badges = calculateBadges(streak, reads, completedPaths)
  const earnedBadges = badges.filter((b) => b.earned)

  const displayName = profile.display_name || username
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  // ...return (...existing JSX unchanged...)
}
```

Remove the now-unused `import { createClient } from '@/lib/supabase-server'` and the inline `supabase` / `profiles` / `readsData` blocks (lines that fetched and shaped data — now inside `getPublicProfile`). Leave everything from `return (` downward exactly as-is.

- [ ] **Step 2: Verify build (flag OFF)**

Run: `npm run build`
Expected: SUCCESS. `/u/[username]` still prints `ƒ Dynamic` (flag off) but no longer reads cookies — it will become cacheable in Phase 2.

- [ ] **Step 3: Lint + typecheck**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean. (`createClient` import must be gone or lint flags it unused.)

- [ ] **Step 4: Commit**

```bash
git add src/app/u/[username]/page.tsx
git commit -m "refactor: fetch public profile via cookie-free anon client"
```

---

### Task 1.6: Phase 1 gate — full verification with flag OFF

**Files:** none.

- [ ] **Step 1: Sync main**

Run: `git fetch && git log --oneline origin/main -5`
Rebase if content commits landed; re-run the checks below after rebasing.

- [ ] **Step 2: Full test suite**

Run: `npm test`
Expected: all pass (includes the new `profile-data.test.ts`).

- [ ] **Step 3: Full build + lint + typecheck**

Run: `npm run build && npm run lint && npx tsc --noEmit`
Expected: build SUCCESS 0 errors; lint clean; tsc clean.

- [ ] **Step 4: Confirm no `use cache` leaked in (flag is still off)**

Run: `git grep -n "use cache" -- src` (Windows: `git grep -n "use cache" src`)
Expected: NO matches. If any appear, the build would already have failed — remove them; they belong in Phase 2.

- [ ] **Step 5: Merge Phase 1 to main**

Merge/PR the Phase 1 branch. `main` stays green and deployable; profile/`/u` routes still `ƒ Dynamic` but fully Suspense-isolated and cookie-clean, ready for the flag.

---

## PHASE 2 — Flip the flag (one clean PR)

### Task 2.1: Enable `cacheComponents` and add cache directives

**Files:**
- Modify: `next.config.ts`
- Modify: `src/lib/profile-data.ts`

- [ ] **Step 1: Sync main**

Run: `git fetch && git log --oneline origin/main -5`
Rebase the Phase 2 branch onto latest `main`.

- [ ] **Step 2: Enable the flag**

Edit `next.config.ts` (repo root) — add `cacheComponents: true`:

```ts
const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};
```

- [ ] **Step 3: Add `use cache` to the public-profile fetch**

In `src/lib/profile-data.ts`, add the cache imports at the top:

```ts
import { cacheLife, cacheTag } from 'next/cache'
```

Then add the directive + cache config as the first three lines inside `getPublicProfile`:

```ts
export async function getPublicProfile(
  username: string
): Promise<{ profile: PublicProfileRow; reads: ArticleRead[] } | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`public-profile-${username}`)

  const supabase = anon()
  // ...rest unchanged...
}
```

Caveat to record in the commit body: with `cacheLife('minutes')`, a not-yet-existing username caches its `notFound()` for the profile-cache window (minutes). Acceptable for a low-traffic, `noindex` public page. If a shorter miss window is wanted later, tighten with an inline `cacheLife({ stale: 30, revalidate: 60, expire: 120 })`.

- [ ] **Step 4: Full build — the real test**

Run: `npm run build`
Expected: SUCCESS. If any route errors with "used cookies/headers/uncached data outside Suspense", it's a Phase-0 surprise that slipped through — fix it with the island pattern (Task 1.3/1.4 shape) or a cookie-free cached fetch (Task 1.1/1.5 shape), then re-run.

- [ ] **Step 5: Confirm the target routes flipped**

Inspect the build output route table. Expected:
- `/library/[pillar]/[slug]` — NO longer plain `ƒ Dynamic`; shows partial prerender (`◐`) or prerendered shell.
- `/paths/[slug]` — same.
- If either still prints `ƒ Dynamic`, its shell has an uncached dynamic read outside Suspense. Locate it (`generateMetadata` and the page body should only do fs reads via `getArticleBySlug`/`getPathBySlug`). If an fs data read is the blocker, wrap that specific loader in a `use cache` function (e.g. cache `getArticleBySlug(pillar, slug)` with `cacheLife('hours')`) and rebuild.

- [ ] **Step 6: Lint + typecheck + tests**

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: all clean.

- [ ] **Step 7: Commit**

```bash
git add next.config.ts src/lib/profile-data.ts
git commit -m "perf: enable cacheComponents and cache public profile fetch"
```

---

### Task 2.2 (optional optimization): Cache the article-list read in the reading-list island

Only do this if Task 2.1 build is green and you want to avoid re-parsing all MDX per reading-list request. Skip if it complicates the diff.

**Files:**
- Modify: `src/lib/mdx.ts` (wrap `getAllArticles` internals) OR `src/components/profile/reading-list-island.tsx`

- [ ] **Step 1: Wrap the article catalog in `use cache`**

Add a cached wrapper in `src/lib/mdx.ts` (adjacent to `getAllArticles`), leaving `getAllArticles` itself untouched:

```ts
import { cacheLife } from 'next/cache'

/** Cached article catalog for request-time consumers (reading list, etc.). */
export async function getCachedArticleCatalog() {
  'use cache'
  cacheLife('hours')
  return getAllArticles()
}
```

Then in `reading-list-island.tsx` change `const allArticles = getAllArticles()` to `const allArticles = await getCachedArticleCatalog()` and import it.

- [ ] **Step 2: Build + typecheck**

Run: `npm run build && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/lib/mdx.ts src/components/profile/reading-list-island.tsx
git commit -m "perf: cache article catalog for reading-list island"
```

---

### Task 2.3: Merge Phase 2

- [ ] **Step 1: Final sync + build**

Run: `git fetch && git rebase origin/main && npm run build`
Expected: clean after rebase.

- [ ] **Step 2: Merge/PR to main.** Deploy.

---

## PHASE 3 — Verify

### Task 3.1: Production TTFB / rendering verification

**Files:** none.

- [ ] **Step 1: Confirm deploy is live** on the Phase-2 commit.

- [ ] **Step 2: Measure article + path TTFB**

For a live article URL and a live path URL, run a TTFB check (browser DevTools Network → "Waiting for server response", or `curl -w "%{time_starttransfer}\n" -o NUL -s <url>` twice — second run is warm/cached). Target: shell TTFB < 0.4s (baseline was 0.94s).

- [ ] **Step 3: Confirm no CLS regression**

Run a Lighthouse pass on the article page (throttled). Expected: CLS ≤ ~0.05 (prior session's number), LCP not worse than ~0.8s.

- [ ] **Step 4: Record numbers** in a short note appended to `docs/perf-cache-components-migration.md` (before/after TTFB, LCP, CLS).

### Task 3.2: Logged-in manual QA (handed to the user)

**Files:** none (checklist handed to user; no credentials shared with the agent).

- [ ] **Step 1: Deliver this checklist to the user and wait for sign-off before calling the migration done.** User performs each logged in, in a real browser:

  - [ ] `/profile` — dashboard renders; name, streak, totals, badges correct; skeleton → content, no layout jump.
  - [ ] `/profile/progress` — in-progress / completed / not-started lists correct; progress bars accurate.
  - [ ] `/profile/reading-list` — saved items appear with correct titles/read-times; add/remove still works.
  - [ ] `/profile/settings` — display name + public toggle load correct values; saving works; sign-in method label correct.
  - [ ] `/u/<your-public-username>` — public profile renders (streak/badges/stats); may be up to a few minutes stale (expected — it's cached).
  - [ ] Logged OUT, visit `/profile` — brief skeleton, then redirect to `/?auth=required` (no crash, no infinite spinner).

- [ ] **Step 2: Fix any failure** via `systematic-debugging`; re-run the relevant build/QA step.

---

## Self-Review (completed during planning)

- **Spec coverage:** Phase 0 = discovery; Phase 1 = migrate the 6 routes (islands for cookie reads, cookie-free anon fetch for `/u`); Phase 2 = flip flag + cache directives + article/path marker verification; Phase 3 = TTFB + logged-in QA. All spec sections mapped.
- **Sequencing correctness:** `use cache` directives are confined to Phase 2 (flag on) — Phase 1 stays green with the flag off. Verified against the Cache Components skill (directive requires `cacheComponents`).
- **Fallback strategy:** left the two existing strategies untouched (spec decision); new profile skeletons are dedicated mocks (matches the article-island convention).
- **Type consistency:** `PublicProfileRow`, `ArticleRead`, `PathProgress`, `requireUser`, `getPublicProfile`, `matchPublicProfile`, `slugifyDisplayName` used consistently across tasks. Island prop shapes copied verbatim from the current pages, so `ProfileDashboard`, `ReadingListClient`, `SettingsClient` interfaces are unchanged.
- **Placeholder scan:** no TBD/TODO; every code step shows full code.
```

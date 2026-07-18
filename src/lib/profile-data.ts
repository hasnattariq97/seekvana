import { createClient as createAnonClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
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
 * Cached: public data, identical for every viewer, so it is safe to serve from
 * cache keyed by username. cacheLife('minutes') keeps it fresh enough for a
 * low-traffic, noindex profile page while giving near-static TTFB. A not-yet-
 * existing username caches its notFound for the cache window — acceptable here.
 * Returns null when no matching public profile exists.
 */
export async function getPublicProfile(
  username: string
): Promise<{ profile: PublicProfileRow; reads: ArticleRead[] } | null> {
  'use cache'
  cacheLife('minutes')
  cacheTag(`public-profile-${username}`)

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

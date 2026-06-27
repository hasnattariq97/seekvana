import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BookOpen, Flame, Trophy, Award } from 'lucide-react'
import {
  calculateStreak,
  calculateBadges,
  calculatePathProgress,
} from '@/lib/profile'
import type { ArticleRead } from '@/lib/profile'

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  // Find profile by display_name slug (lowercased, spaces → hyphens)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, display_name, is_public, created_at')
    .eq('is_public', true)

  const profile = profiles?.find((p) => {
    const slug = (p.display_name ?? '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return slug === username || p.user_id.startsWith(username)
  })

  if (!profile) notFound()

  const { data: readsData } = await supabase
    .from('article_reads')
    .select('pillar, article_slug, read_at')
    .eq('user_id', profile.user_id)

  const reads: ArticleRead[] = (readsData ?? []).map((r) => ({
    pillar: r.pillar,
    articleSlug: r.article_slug,
    readAt: r.read_at,
  }))

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

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-surface border-b border-border px-6 md:px-10 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-6 flex-wrap">
          <div className="w-20 h-20 rounded-full bg-accent ring-2 ring-border flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-fraunces text-2xl text-primary font-medium">{displayName}</h1>
            <p className="text-sm text-secondary mt-1">Member since {memberSince}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {streak > 0 && (
                <span className="bg-accent-soft text-accent text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Flame size={12} />
                  {streak}-day streak
                </span>
              )}
              <span className="bg-surface-subtle border border-border text-secondary text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <BookOpen size={12} />
                {reads.length} articles read
              </span>
              <span className="bg-surface-subtle border border-border text-secondary text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <Trophy size={12} />
                {completedPaths.length} paths completed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        {[
          { value: reads.length, label: 'Articles read', Icon: BookOpen },
          { value: streak, label: 'Day streak', Icon: Flame },
          { value: completedPaths.length, label: 'Paths completed', Icon: Trophy },
          { value: earnedBadges.length, label: 'Badges earned', Icon: Award },
        ].map((s) => (
          <div key={s.label} className="bg-surface py-6 text-center border-r border-border last:border-r-0 cursor-default">
            <s.Icon size={18} className="text-secondary mx-auto mb-2" />
            <div className="font-fraunces text-4xl text-primary font-medium">{s.value}</div>
            <div className="text-xs text-secondary mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-fraunces text-base text-primary mb-4">Badges</h2>
          {earnedBadges.length === 0 ? (
            <p className="text-sm text-secondary">No badges earned yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="text-center p-3 rounded-xl bg-accent-soft border border-accent/20">
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-xs font-medium text-primary leading-tight">{badge.name}</div>
                  <div className="text-[10px] text-accent mt-0.5">{badge.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

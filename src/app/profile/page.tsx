import { createClient } from '@/lib/supabase-server'
import {
  calculateStreak,
  calculateBadges,
  calculatePathProgress,
} from '@/lib/profile'
import type { ArticleRead } from '@/lib/profile'
import { ProfileDashboard } from '@/components/profile/profile-dashboard'

export const metadata = { title: 'My Profile — Seekvana' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

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

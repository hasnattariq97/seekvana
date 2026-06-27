'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Flame, Trophy, Award, Pencil, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Badge, PathProgress } from '@/lib/profile'

type Props = {
  userId: string
  displayName: string
  initials: string
  isPublic: boolean
  memberSince: string
  totalReads: number
  streak: number
  completedPathsCount: number
  earnedBadgesCount: number
  badges: Badge[]
  inProgressPaths: PathProgress[]
}

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const stats = (totalReads: number, streak: number, completedPathsCount: number, earnedBadgesCount: number) => [
  { value: totalReads, label: 'Articles read', Icon: BookOpen, accent: false },
  { value: streak, label: 'Day streak', Icon: Flame, accent: streak > 0 },
  { value: completedPathsCount, label: 'Paths completed', Icon: Trophy, accent: false },
  { value: earnedBadgesCount, label: 'Badges earned', Icon: Award, accent: false },
]

export function ProfileDashboard({
  userId,
  displayName,
  initials,
  isPublic: initialIsPublic,
  memberSince,
  totalReads,
  streak,
  completedPathsCount,
  earnedBadgesCount,
  badges,
  inProgressPaths,
}: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)

  async function togglePublic() {
    const next = !isPublic
    setIsPublic(next)
    const supabase = createClient()
    await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, is_public: next }, { onConflict: 'user_id' })
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <div className="bg-canvas border-b border-border px-6 md:px-10 py-10">
        <motion.div
          className="max-w-4xl mx-auto flex items-start justify-between gap-6 flex-wrap"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Left — avatar + name */}
          <div className="flex items-start gap-5">
            <motion.div variants={fadeUp} className="flex-shrink-0">
              {/* Double ring: canvas gap then accent */}
              <div
                className="w-[72px] h-[72px] rounded-full bg-accent flex items-center justify-center font-fraunces font-bold text-2xl text-white"
                style={{ boxShadow: '0 0 0 3px var(--color-canvas), 0 0 0 5px var(--color-accent)' }}
              >
                {initials}
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h1 className="font-fraunces text-[26px] font-bold text-primary leading-tight tracking-tight">
                {displayName}
              </h1>
              <p className="text-sm text-secondary mt-1">Member since {memberSince}</p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {streak > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-accent-soft border border-accent/30 text-accent text-xs px-3 py-1 rounded-full font-medium">
                    <Flame size={12} />
                    {streak}-day streak
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 bg-surface-subtle border border-border text-secondary text-xs px-3 py-1 rounded-full">
                  <BookOpen size={12} />
                  {totalReads} {totalReads === 1 ? 'article' : 'articles'} read
                </span>
                <span className="inline-flex items-center gap-1.5 bg-surface-subtle border border-border text-secondary text-xs px-3 py-1 rounded-full">
                  <Trophy size={12} />
                  {completedPathsCount} paths completed
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right — actions */}
          <motion.div variants={fadeUp} className="flex flex-col items-end gap-3">
            <Link
              href="/profile/settings"
              className="inline-flex items-center gap-1.5 bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-deep transition-colors font-medium"
            >
              <Pencil size={13} />
              Edit profile
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">Public profile</span>
              <button
                onClick={togglePublic}
                className={`relative inline-block w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  isPublic ? 'bg-accent' : 'bg-surface-subtle border border-border'
                }`}
                aria-label="Toggle public profile"
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    isPublic ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats row — gap grid so border-color shows as separators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border-b border-border">
        {stats(totalReads, streak, completedPathsCount, earnedBadgesCount).map((s) => (
          <div
            key={s.label}
            className="bg-surface-subtle py-6 text-center hover:bg-surface transition-colors cursor-default flex flex-col items-center gap-1"
          >
            <s.Icon size={18} className={s.accent ? 'text-accent' : 'text-secondary'} />
            <div className={`font-fraunces text-[42px] font-bold leading-none ${s.accent ? 'text-accent' : 'text-primary'}`}>
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-widest text-secondary font-medium mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 grid md:grid-cols-[1fr_320px] gap-5">

        {/* Badges */}
        <div className="bg-surface-subtle border border-border rounded-xl p-6">
          <p className="text-[11px] uppercase tracking-widest text-secondary font-medium mb-4">
            Achievements
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {badges.map((badge, i) => {
              const isInProgress = !badge.earned && badge.hint
              return (
                <motion.div
                  key={badge.id}
                  initial={badge.earned ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                  animate={badge.earned ? { scale: 1, opacity: 1 } : { opacity: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                  whileHover={{ y: -2 }}
                  className={`relative text-center p-4 rounded-xl cursor-default transition-shadow ${
                    badge.earned
                      ? 'bg-canvas border border-accent/30 shadow-[0_0_16px_rgba(201,99,63,0.10)]'
                      : isInProgress
                      ? 'bg-canvas border border-accent/20'
                      : 'bg-canvas border border-border opacity-40 grayscale'
                  }`}
                  title={badge.hint ?? badge.description}
                >
                  {/* Pulsing dot for in-progress */}
                  {isInProgress && !badge.earned && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  )}

                  <div className="text-2xl mb-1.5">{badge.emoji}</div>
                  <div className="text-[11px] font-semibold text-primary leading-tight">
                    {badge.name}
                  </div>
                  {badge.earned ? (
                    <div className="text-[10px] text-accent font-medium mt-0.5">
                      {badge.description}
                    </div>
                  ) : badge.hint ? (
                    <div className="text-[10px] text-accent font-medium mt-0.5">{badge.hint}</div>
                  ) : null}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Currently learning */}
        <div className="bg-surface-subtle border border-border rounded-xl p-6">
          <p className="text-[11px] uppercase tracking-widest text-secondary font-medium mb-4">
            Currently learning
          </p>

          {inProgressPaths.length === 0 ? (
            <Link
              href="/paths"
              className="flex flex-col items-center gap-2 border border-dashed border-border rounded-xl p-6 text-center hover:border-accent/40 hover:bg-canvas transition-colors group"
            >
              <Plus size={20} className="text-secondary group-hover:text-accent transition-colors" />
              <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                Browse paths to start learning
              </span>
            </Link>
          ) : (
            <div className="space-y-4">
              {inProgressPaths.slice(0, 2).map((p, idx) => (
                <div key={p.pathSlug} className="bg-canvas border border-border rounded-xl p-4">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-sm font-semibold text-primary leading-snug flex-1 pr-2">
                      {p.title}
                    </span>
                    <span className="font-fraunces font-bold text-sm text-accent flex-shrink-0">
                      {p.completedLessons}/{p.totalLessons}
                    </span>
                  </div>
                  {p.nextLesson?.title && (
                    <p className="text-[11px] text-secondary mb-3">
                      Next: {p.nextLesson.title}
                    </p>
                  )}
                  <div className="bg-border rounded-full h-1 overflow-hidden mb-3">
                    <div
                      className="bg-accent h-full rounded-full"
                      style={{
                        width: `${Math.max(4, Math.round((p.completedLessons / p.totalLessons) * 100))}%`,
                      }}
                    />
                  </div>
                  {p.nextLesson && (
                    <Link
                      href={`/library/${p.nextLesson.pillar}/${p.nextLesson.slug}`}
                      className="inline-flex items-center gap-1.5 bg-accent-soft border border-accent/25 text-accent text-xs px-3 py-1.5 rounded-lg hover:bg-accent hover:text-white hover:border-transparent transition-all font-medium"
                    >
                      Continue
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  )}
                </div>
              ))}

              {/* Add another path slot */}
              {inProgressPaths.length < 2 && (
                <Link
                  href="/paths"
                  className="flex items-center justify-center gap-2 border border-dashed border-border rounded-xl p-4 hover:border-accent/40 hover:bg-canvas transition-colors group"
                >
                  <Plus size={14} className="text-secondary group-hover:text-accent transition-colors" />
                  <span className="text-xs text-secondary group-hover:text-primary transition-colors">
                    Browse paths to add another
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

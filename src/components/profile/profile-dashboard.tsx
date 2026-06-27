'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Flame, Trophy, Award } from 'lucide-react'
import type { Badge, PathProgress } from '@/lib/profile'

type Props = {
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

export function ProfileDashboard({
  displayName,
  initials,
  isPublic,
  memberSince,
  totalReads,
  streak,
  completedPathsCount,
  earnedBadgesCount,
  badges,
  inProgressPaths,
}: Props) {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <div className="bg-surface border-b border-border px-6 md:px-10 py-10">
        <motion.div
          className="max-w-4xl mx-auto flex items-center gap-6 flex-wrap"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-accent ring-2 ring-border flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex-1 min-w-0">
            <h1 className="font-fraunces text-2xl text-primary font-medium">
              {displayName}
            </h1>
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
                {totalReads} articles read
              </span>
              <span className="bg-surface-subtle border border-border text-secondary text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <Trophy size={12} />
                {completedPathsCount} paths completed
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2 items-end">
            <Link
              href="/profile/settings"
              className="bg-accent text-white text-xs px-4 py-2 rounded-lg hover:bg-accent-deep transition-colors"
            >
              Edit profile
            </Link>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span>Public profile</span>
              <span
                className={`inline-block w-8 h-4 rounded-full transition-colors ${
                  isPublic ? 'bg-accent' : 'bg-surface-subtle border border-border'
                }`}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        {[
          { value: totalReads, label: 'Articles read', Icon: BookOpen },
          { value: streak, label: 'Day streak', Icon: Flame },
          { value: completedPathsCount, label: 'Paths completed', Icon: Trophy },
          { value: earnedBadgesCount, label: 'Badges earned', Icon: Award },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface py-6 text-center border-r border-border last:border-r-0 hover:bg-surface-subtle transition-colors cursor-default"
          >
            <s.Icon size={18} className="text-secondary mx-auto mb-2" />
            <div className="font-fraunces text-4xl text-primary font-medium">
              {s.value}
            </div>
            <div className="text-xs text-secondary mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 grid md:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-fraunces text-base text-primary mb-4">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={badge.earned ? { scale: 0.85, opacity: 0 } : { opacity: 0 }}
                animate={badge.earned ? { scale: 1, opacity: 1 } : { opacity: 1 }}
                transition={{
                  delay: i * 0.05,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className={`text-center p-3 rounded-xl ${
                  badge.earned
                    ? 'bg-accent-soft border border-accent/20'
                    : 'bg-surface-subtle opacity-40'
                }`}
                title={badge.hint ?? badge.description}
              >
                <div className="text-2xl mb-1">{badge.emoji}</div>
                <div className="text-xs font-medium text-primary leading-tight">
                  {badge.name}
                </div>
                {badge.earned ? (
                  <div className="text-[10px] text-accent mt-0.5">{badge.description}</div>
                ) : (
                  badge.hint && (
                    <div className="mt-1.5">
                      <div className="bg-border rounded-full h-0.5 overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full"
                          style={{ width: '30%' }}
                        />
                      </div>
                      <div className="text-[10px] text-secondary mt-0.5">{badge.hint}</div>
                    </div>
                  )
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Currently learning */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-fraunces text-base text-primary mb-4">Currently learning</h2>
          {inProgressPaths.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-secondary text-sm mb-3">No paths started yet.</p>
              <Link
                href="/paths"
                className="text-accent text-sm font-medium hover:text-accent-deep transition-colors"
              >
                Browse learning paths →
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {inProgressPaths.slice(0, 2).map((p) => (
                <div key={p.pathSlug}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-primary">{p.title}</span>
                    <span className="text-xs text-secondary">
                      {p.completedLessons}/{p.totalLessons}
                    </span>
                  </div>
                  <div className="bg-surface-subtle rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full"
                      style={{
                        width: `${Math.round(
                          (p.completedLessons / p.totalLessons) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  {p.nextLesson && (
                    <Link
                      href={`/library/${p.nextLesson.pillar}/${p.nextLesson.slug}`}
                      className="inline-block mt-2 text-xs bg-accent-soft text-accent px-3 py-1.5 rounded-lg hover:bg-accent hover:text-white transition-colors"
                    >
                      Continue →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

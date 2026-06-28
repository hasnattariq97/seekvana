'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'

type Props = {
  pillar: string
  articleSlug: string
  initialCompleted: boolean
  articleTitle?: string
}

export function MarkCompleteButton({ pillar, articleSlug, initialCompleted, articleTitle }: Props) {
  const { user, openAuthModal } = useAuth()
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  async function markComplete() {
    if (!user) {
      openAuthModal()
      return
    }
    if (completed) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('article_reads').upsert({
      user_id: user.id,
      pillar,
      article_slug: articleSlug,
    })
    setCompleted(true)
    setLoading(false)
  }

  return (
    <div className="my-12">
      <AnimatePresence mode="wait">
        {completed ? (
          /* ── Completed state ── */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-5 bg-success/8 border border-success/25 rounded-2xl px-7 py-6"
          >
            {/* Animated checkmark circle */}
            <div className="shrink-0 w-14 h-14 rounded-full bg-success/15 flex items-center justify-center">
              <motion.svg
                width="28" height="28" viewBox="0 0 28 28" fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <motion.path
                  d="M6 14.5l5.5 5.5 10.5-11"
                  stroke="var(--color-success)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                />
              </motion.svg>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-fraunces text-lg text-primary font-medium leading-snug">
                Lesson complete
              </p>
              {articleTitle && (
                <p className="text-sm text-secondary mt-0.5 line-clamp-1">
                  &quot;{articleTitle}&quot; marked as read
                </p>
              )}
            </div>

            <span className="shrink-0 text-xs font-semibold text-success bg-success/12 border border-success/25 px-3 py-1.5 rounded-full">
              ✓ Done
            </span>
          </motion.div>
        ) : (
          /* ── Default state ── */
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-5 bg-surface border border-border rounded-2xl px-7 py-6"
          >
            {/* Icon */}
            <div className="shrink-0 w-14 h-14 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="font-fraunces text-lg text-primary font-medium leading-snug">
                Finished reading?
              </p>
              <p className="text-sm text-secondary mt-0.5">
                Mark it complete to track your progress through the path.
              </p>
            </div>

            {/* CTA */}
            <motion.button
              onClick={markComplete}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 inline-flex items-center gap-2.5 bg-accent hover:bg-accent-deep disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Mark as complete
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

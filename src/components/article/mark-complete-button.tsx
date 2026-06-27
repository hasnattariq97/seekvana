'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'

type Props = {
  pillar: string
  articleSlug: string
  initialCompleted: boolean
}

export function MarkCompleteButton({ pillar, articleSlug, initialCompleted }: Props) {
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
    <button
      onClick={markComplete}
      disabled={loading || completed}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        completed
          ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 cursor-default'
          : 'bg-accent text-white hover:bg-accent-deep'
      }`}
    >
      <CheckCircle size={16} />
      {completed ? 'Completed' : 'Mark as complete'}
    </button>
  )
}

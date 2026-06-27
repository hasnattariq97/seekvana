'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'

type Props = {
  pillar: string
  articleSlug: string
  initialSaved: boolean
}

export function BookmarkButton({ pillar, articleSlug, initialSaved }: Props) {
  const { user, openAuthModal } = useAuth()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!user) {
      openAuthModal()
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      if (saved) {
        await supabase
          .from('reading_list')
          .delete()
          .eq('user_id', user.id)
          .eq('pillar', pillar)
          .eq('article_slug', articleSlug)
        setSaved(false)
      } else {
        await supabase.from('reading_list').upsert({
          user_id: user.id,
          pillar,
          article_slug: articleSlug,
        })
        setSaved(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Remove from reading list' : 'Save to reading list'}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
        saved
          ? 'bg-accent-soft text-accent border-accent/30'
          : 'bg-surface text-secondary border-border hover:text-accent hover:border-accent/30'
      }`}
    >
      <Bookmark
        size={15}
        className={saved ? 'fill-accent' : ''}
      />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

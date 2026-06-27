'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { PILLARS } from '@/lib/pillars'

type Item = {
  id: string
  pillar: string
  articleSlug: string
  savedAt: string
  readAt: string | null
  title: string
  readTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function ReadingListClient({
  items: initialItems,
  userId,
}: {
  items: Item[]
  userId: string
}) {
  const [items, setItems] = useState(initialItems)
  const [filter, setFilter] = useState<'all' | 'pending' | 'read'>('all')

  const filtered = items.filter((i) => {
    if (filter === 'pending') return !i.readAt
    if (filter === 'read') return !!i.readAt
    return true
  })

  const totalRead = items.filter((i) => i.readAt).length
  const totalPending = items.filter((i) => !i.readAt).length

  async function markRead(id: string) {
    const supabase = createClient()
    const now = new Date().toISOString()
    await supabase
      .from('reading_list')
      .update({ read_at: now })
      .eq('id', id)
      .eq('user_id', userId)
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, readAt: now } : i))
    )
  }

  async function remove(id: string) {
    const supabase = createClient()
    await supabase
      .from('reading_list')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const pillarName = (slug: string) =>
    PILLARS.find((p) => p.slug === slug)?.name ?? slug

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-fraunces text-2xl text-primary">Reading List</h1>
          <p className="text-sm text-secondary mt-1">
            {items.length} saved · {totalRead} read · {totalPending} pending
          </p>
        </div>
        <div className="flex gap-1 bg-surface-subtle rounded-lg p-1">
          {(['all', 'pending', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-surface text-primary font-medium shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-secondary">
          {filter === 'all'
            ? 'No saved articles yet. Bookmark articles as you read to save them here.'
            : `No ${filter} articles.`}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-surface border border-border rounded-xl px-5 py-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 ${
                item.readAt ? 'opacity-70' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1.5 flex-wrap">
                  <span className="bg-accent-soft text-accent text-xs px-2.5 py-0.5 rounded-full">
                    {pillarName(item.pillar)}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full capitalize ${difficultyColors[item.difficulty]}`}>
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-sm font-medium text-primary truncate">{item.title}</p>
                <p className="text-xs text-secondary mt-0.5">
                  {item.readTime > 0 ? `${item.readTime} min · ` : ''}
                  Saved {new Date(item.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.readAt ? (
                  <span className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-full">
                    ✓ Read
                  </span>
                ) : (
                  <span className="text-xs bg-accent-soft text-accent border border-accent/20 px-2.5 py-1 rounded-full">
                    Pending
                  </span>
                )}
                <Link
                  href={`/library/${item.pillar}/${item.articleSlug}`}
                  className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent-deep transition-colors"
                  onClick={() => { if (!item.readAt) markRead(item.id) }}
                >
                  {item.readAt ? 'Reread' : 'Read →'}
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  className="text-secondary hover:text-primary transition-colors text-lg leading-none px-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

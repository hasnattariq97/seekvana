'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export function ArticleFeedback() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  return (
    <div className="flex flex-wrap items-center gap-4 py-6">
      <span className="text-sm text-secondary font-medium">Was this helpful?</span>
      <div className="flex gap-2">
        <button
          onClick={() => setVote('up')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            vote === 'up'
              ? 'bg-accent text-white'
              : 'bg-surface-subtle text-secondary hover:bg-accent-soft hover:text-accent'
          }`}
          aria-pressed={vote === 'up'}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </button>
        <button
          onClick={() => setVote('down')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            vote === 'down'
              ? 'bg-accent text-white'
              : 'bg-surface-subtle text-secondary hover:bg-accent-soft hover:text-accent'
          }`}
          aria-pressed={vote === 'down'}
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </button>
      </div>
      {vote && (
        <span className="text-sm text-secondary">Thanks for your feedback!</span>
      )}
    </div>
  )
}

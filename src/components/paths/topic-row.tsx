'use client'

import Link from 'next/link'
import { ExternalLink, CheckCircle2 } from 'lucide-react'
import type { PathTopic } from '@/lib/mdx'

interface TopicRowProps {
  topic: PathTopic
  completed?: boolean
}

export function TopicRow({ topic, completed = false }: TopicRowProps) {
  const hasArticle = Boolean(topic.articlePillar && topic.articleSlug)

  return (
    <li className={`flex items-center gap-3 px-6 py-2.5 pl-10 text-sm hover:bg-surface-subtle transition-colors duration-100 ${completed ? 'opacity-60' : ''}`}>
      {/* Status indicator */}
      {completed ? (
        <CheckCircle2 size={14} strokeWidth={2} className="text-green-500 shrink-0" />
      ) : (
        <span className="w-3.5 h-3.5 rounded-full border border-border shrink-0" />
      )}

      <span className="font-mono text-[10px] text-secondary shrink-0 min-w-[30px]">
        {topic.id}
      </span>
      <span className={`flex-1 leading-snug ${completed ? 'line-through decoration-border text-secondary' : 'text-primary'}`}>
        {topic.title}
      </span>
      {hasArticle && (
        <Link
          href={`/library/${topic.articlePillar}/${topic.articleSlug}`}
          className={`inline-flex items-center gap-1 text-[10.5px] font-semibold rounded-md px-2 py-1 shrink-0 transition-colors duration-100 ${
            completed
              ? 'text-secondary bg-surface-subtle border border-border hover:text-accent'
              : 'text-accent bg-accent-soft hover:bg-accent/20'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={9} strokeWidth={2.2} />
          {completed ? 'Review' : 'Article'}
        </Link>
      )}
    </li>
  )
}

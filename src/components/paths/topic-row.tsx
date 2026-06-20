'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { PathTopic } from '@/lib/mdx'

interface TopicRowProps {
  topic: PathTopic
}

export function TopicRow({ topic }: TopicRowProps) {
  const hasArticle = Boolean(topic.articlePillar && topic.articleSlug)

  return (
    <li className="flex items-center gap-3 px-6 py-2.5 pl-12 text-sm text-primary hover:bg-surface-subtle transition-colors duration-100 cursor-default">
      <span className="font-mono text-[10.5px] text-secondary shrink-0 min-w-[34px]">
        {topic.id}
      </span>
      <span className="flex-1 leading-snug">{topic.title}</span>
      {hasArticle && (
        <Link
          href={`/library/${topic.articlePillar}/${topic.articleSlug}`}
          className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-accent bg-accent-soft rounded-md px-2 py-1 shrink-0 hover:bg-[#eec9b5] transition-colors duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={9} strokeWidth={2.2} />
          Article
        </Link>
      )}
    </li>
  )
}

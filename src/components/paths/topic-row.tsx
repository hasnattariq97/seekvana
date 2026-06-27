'use client'

import Link from 'next/link'
import type { PathTopic } from '@/lib/mdx'

interface TopicRowProps {
  topic: PathTopic
  status?: 'done' | 'current' | 'unread'
}

function CheckDone() {
  return (
    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function CheckCurrent() {
  return (
    <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center shrink-0">
      <div className="w-[7px] h-[7px] rounded-full bg-accent" />
    </div>
  )
}

function CheckEmpty() {
  return <div className="w-5 h-5 rounded-full border border-border shrink-0" />
}

export function TopicRow({ topic, status = 'unread' }: TopicRowProps) {
  const hasArticle = Boolean(topic.articlePillar && topic.articleSlug)
  const done = status === 'done'
  const current = status === 'current'

  return (
    <li
      className={`flex items-center gap-3 px-5 py-[10px] transition-colors duration-100 ${
        current
          ? 'border-l-[3px] border-accent bg-accent/[0.04] pl-[17px]'
          : 'border-l-[3px] border-transparent hover:bg-surface-subtle'
      }`}
    >
      {done ? <CheckDone /> : current ? <CheckCurrent /> : <CheckEmpty />}

      <span className={`font-mono text-[10.5px] font-medium shrink-0 w-[34px] tabular-nums ${current ? 'text-accent' : 'text-secondary'}`}>
        {topic.id}
      </span>

      <span className={`flex-1 leading-snug text-[13.5px] ${
        done ? 'text-secondary font-normal' : current ? 'text-primary font-semibold' : 'text-primary font-medium'
      }`}>
        {topic.title}
      </span>

      {hasArticle && (
        <Link
          href={`/library/${topic.articlePillar}/${topic.articleSlug}`}
          className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-[6px] px-[9px] py-[3px] shrink-0 border transition-colors duration-100 whitespace-nowrap ${
            done
              ? 'bg-canvas border-border text-secondary hover:text-accent'
              : current
              ? 'bg-accent/[0.08] border-accent/20 text-accent hover:bg-accent/15'
              : 'bg-canvas border-border text-secondary hover:text-accent'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {current ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Read now
            </>
          ) : done ? 'Review' : 'Article'}
        </Link>
      )}
    </li>
  )
}

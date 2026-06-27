'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TopicRow } from './topic-row'
import type { PathModule } from '@/lib/mdx'

interface ModuleItemProps {
  module: PathModule
  defaultOpen?: boolean
  readSet?: string[]
}

export function ModuleItem({ module, defaultOpen = false, readSet = [] }: ModuleItemProps) {
  const [open, setOpen] = useState(defaultOpen)

  const linkableTopics = module.topics.filter(t => t.articlePillar && t.articleSlug)
  const completedInModule = linkableTopics.filter(
    t => readSet.includes(`${t.articlePillar}/${t.articleSlug}`)
  ).length
  const isModuleComplete = linkableTopics.length > 0 && completedInModule === linkableTopics.length
  const isModuleStarted = completedInModule > 0 && !isModuleComplete

  // First unread linkable topic index (for 'current' marker)
  let currentTopicId: string | null = null
  if (isModuleStarted) {
    const firstUnread = linkableTopics.find(
      t => !readSet.includes(`${t.articlePillar}/${t.articleSlug}`)
    )
    if (firstUnread) currentTopicId = firstUnread.id
  }

  // Progress strip color
  const stripClass = isModuleComplete
    ? 'bg-gradient-to-r from-green-600 to-green-400'
    : isModuleStarted
    ? 'bg-gradient-to-r from-accent to-[#E0875F]'
    : 'bg-border'
  const stripWidth = isModuleComplete
    ? '100%'
    : isModuleStarted
    ? `${Math.max(Math.round((completedInModule / linkableTopics.length) * 100), 8)}%`
    : '100%'

  // Module number color
  const numColor = isModuleComplete
    ? 'text-green-600 dark:text-green-400'
    : isModuleStarted
    ? 'text-accent'
    : 'text-secondary'

  return (
    <div className="border-b border-border last:border-b-0 overflow-hidden">
      {/* Progress strip */}
      <div className="h-[3px] bg-border">
        <div className={`h-full ${stripClass}`} style={{ width: stripWidth }} />
      </div>

      {/* Header */}
      <button
        type="button"
        className="w-full flex items-center gap-4 px-5 py-[18px] text-left bg-surface-subtle hover:brightness-[0.97] dark:hover:brightness-110 transition-all duration-150"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`font-fraunces text-[15px] font-bold shrink-0 w-7 tabular-nums ${numColor}`}>
          {module.id}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-fraunces text-[15.5px] font-bold text-primary leading-tight">
            {module.title}
          </p>
          <p className="text-[12px] text-secondary mt-0.5 truncate max-w-[45ch]">
            {module.description}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isModuleComplete ? (
            <span className="inline-flex items-center gap-[5px] text-[11px] font-semibold rounded-full px-[10px] py-1 bg-green-600/10 border border-green-600/25 text-green-600 dark:text-green-400">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/>
                <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Complete
            </span>
          ) : isModuleStarted ? (
            <span className="inline-flex items-center text-[11px] font-semibold rounded-full px-[10px] py-1 bg-accent/10 border border-accent/25 text-accent">
              {completedInModule} / {linkableTopics.length}
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-medium rounded-full px-[10px] py-1 bg-canvas border border-border text-secondary">
              {module.topics.length} topics
            </span>
          )}
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className={`text-secondary transition-transform duration-250 shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Topics panel */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out bg-canvas"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <ul className="py-1.5 border-t border-border">
            {module.topics.map((topic) => {
              const done = Boolean(
                topic.articlePillar && topic.articleSlug &&
                readSet.includes(`${topic.articlePillar}/${topic.articleSlug}`)
              )
              const status = done ? 'done' : topic.id === currentTopicId ? 'current' : 'unread'
              return <TopicRow key={topic.id} topic={topic} status={status} />
            })}
          </ul>
          <div className="flex justify-between items-center px-5 py-2.5 pl-[52px] border-t border-border bg-surface-subtle">
            <span className="text-[11px] text-secondary"><span className="text-primary font-medium">Each topic</span> includes a 5-min task</span>
            <span className="text-[11px] font-semibold text-secondary">{module.topics.length} tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

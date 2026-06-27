'use client'

import { useState } from 'react'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
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
  const isModuleStarted = completedInModule > 0

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Header */}
      <button
        type="button"
        className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors duration-150 ${
          open ? 'bg-accent-soft hover:bg-accent-soft/70' : 'hover:bg-surface-subtle'
        }`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Module ID or complete check */}
        {isModuleComplete ? (
          <CheckCircle2 size={18} strokeWidth={2} className="text-green-500 shrink-0" />
        ) : (
          <span
            className={`font-mono text-[11px] font-bold tracking-wide shrink-0 min-w-[24px] transition-colors duration-200 ${
              open ? 'text-accent' : 'text-border'
            }`}
          >
            {module.id}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <p className={`font-fraunces text-[15.5px] font-semibold leading-tight ${isModuleComplete ? 'text-secondary line-through decoration-border' : 'text-primary'}`}>
            {module.title}
          </p>
          <p className="text-xs text-secondary mt-0.5 truncate max-w-[45ch]">
            {module.description}
          </p>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          {/* Progress badge */}
          {isModuleComplete ? (
            <span className="text-[11px] rounded-md px-2 py-1 border bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 font-semibold">
              Complete
            </span>
          ) : isModuleStarted ? (
            <span className={`text-[11.5px] rounded-md px-2 py-1 border transition-colors duration-200 ${
              open ? 'bg-accent-soft border-accent/25 text-accent-deep' : 'bg-surface-subtle border-border text-secondary'
            }`}>
              {completedInModule}/{linkableTopics.length}
            </span>
          ) : (
            <span className={`text-[11.5px] rounded-md px-2 py-1 border transition-colors duration-200 ${
              open ? 'bg-accent-soft border-accent/25 text-accent-deep' : 'bg-surface-subtle border-border text-secondary'
            }`}>
              {module.topics.length} topics
            </span>
          )}
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className={`text-secondary transition-transform duration-250 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Topics panel — grid-rows animation */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out bg-canvas border-t border-border"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          borderTopWidth: open ? '1px' : '0px',
        }}
      >
        <div className="overflow-hidden">
          <ul className="py-1.5">
            {module.topics.map((topic) => {
              const completed = Boolean(
                topic.articlePillar && topic.articleSlug &&
                readSet.includes(`${topic.articlePillar}/${topic.articleSlug}`)
              )
              return <TopicRow key={topic.id} topic={topic} completed={completed} />
            })}
          </ul>
          <div className="flex justify-between items-center px-6 py-2.5 pl-12 border-t border-border text-xs text-secondary">
            <span>Each topic includes a 5-min task</span>
            <span className="font-semibold text-primary">{module.topics.length} tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

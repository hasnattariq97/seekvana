import { ModuleItem } from './module-item'
import type { PathModule } from '@/lib/mdx'

interface ModuleListProps {
  modules: PathModule[]
  totalTopics: number
}

export function ModuleList({ modules, totalTopics }: ModuleListProps) {
  return (
    <section id="modules">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-fraunces text-xl font-semibold text-primary">Curriculum</h2>
        <span className="text-xs text-secondary">
          {modules.length} modules · {totalTopics} topics
        </span>
      </div>
      <p className="text-[13px] text-secondary mb-6 leading-relaxed">
        <strong className="text-primary font-semibold">Every topic takes under 5 minutes.</strong>{' '}
        Each ends with a hands-on task you can complete right now — no setup required to begin Module 00.
      </p>
      <div className="border border-border rounded-2xl overflow-hidden bg-surface">
        {modules.map((module) => (
          <ModuleItem
            key={module.id}
            module={module}
            defaultOpen={module.id === '00'}
          />
        ))}
      </div>
    </section>
  )
}

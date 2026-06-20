'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PathData } from '@/lib/mdx'

interface PathHeroProps {
  path: PathData
}

const NODE_LABELS: Record<string, string> = {
  '01': 'AI Landscape',
  '02': 'Terminal',
  '03': 'Dev Setup',
  '04': 'GitHub',
  '05': 'Python',
  '06': 'Web Basics',
  '07': 'Backend',
  '08': 'AI Tools',
  '09': 'Deploy',
  '10': 'Live App',
}

export function PathHero({ path }: PathHeroProps) {
  return (
    <header className="pb-14 border-b border-border mb-14">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium px-3 py-1 rounded-full border border-[#c3e6cd] bg-[#f0faf4] text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Beginner
        </span>
        <span className="inline-flex text-[11.5px] font-medium px-3 py-1 rounded-full border border-border bg-surface text-secondary">
          No experience needed
        </span>
        <span className="inline-flex text-[11.5px] font-medium px-3 py-1 rounded-full border border-border bg-surface text-secondary">
          Free
        </span>
      </div>

      {/* Title */}
      <h1 className="font-fraunces text-[clamp(2.4rem,5.5vw,3.5rem)] font-bold text-primary leading-[1.08] tracking-tight text-balance">
        {path.title}
      </h1>
      {path.subtitle && (
        <p className="font-fraunces text-[clamp(2rem,4.5vw,3rem)] italic text-accent leading-none mb-4">
          {path.subtitle}
        </p>
      )}
      <p className="text-[17px] text-secondary max-w-[52ch] leading-relaxed mb-10">
        {path.description}
      </p>

      {/* Journey milestone bar */}
      <div className="mb-9" role="img" aria-label={`Journey: ${path.modules.length} modules from ${path.modules[0]?.title} to ${path.modules[path.modules.length - 1]?.title}`}>
        <div className="relative flex items-start px-3.5">
          {/* Background line */}
          <div className="absolute top-[14px] left-[28px] right-[28px] h-[1.5px] bg-border z-0" />

          {/* Accent line — animates to show start */}
          <motion.div
            className="absolute top-[14px] left-[28px] right-[28px] h-[1.5px] bg-accent z-0 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.04 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />

          {/* Nodes */}
          {path.modules.map((module, i) => {
            const isFirst = i === 0
            const isLast = i === path.modules.length - 1
            return (
              <motion.div
                key={module.id}
                className="flex-1 flex flex-col items-center gap-1.5 relative z-10 min-w-0"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 + 0.3 }}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0 transition-colors ${
                    isFirst
                      ? 'bg-accent border-accent text-white shadow-[0_0_0_4px_var(--color-accent-soft)]'
                      : isLast
                      ? 'bg-success border-success text-white'
                      : 'bg-surface border-[1.5px] border-border text-secondary'
                  }`}
                >
                  {isLast ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    module.id
                  )}
                </div>
                <span
                  className={`text-[9.5px] text-center max-w-[64px] leading-tight overflow-hidden whitespace-nowrap text-ellipsis ${
                    isFirst ? 'text-accent font-semibold' : isLast ? 'text-success font-semibold' : 'text-secondary'
                  }`}
                >
                  {NODE_LABELS[module.id] ?? module.title}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-3.5 px-3.5 flex-wrap">
          {[
            { color: 'bg-accent', label: 'You are here' },
            { color: 'bg-border', label: 'Upcoming' },
            { color: 'bg-success', label: 'Destination' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[11px] text-secondary">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Meta line */}
      <p className="text-[13px] text-secondary mb-7 flex flex-wrap items-center gap-2">
        <span>{path.modules.length} modules</span>
        <span className="text-border">·</span>
        <span>{path.lessonCount} topics</span>
        <span className="text-border">·</span>
        <span>{path.lessonCount} hands-on tasks</span>
        <span className="text-border">·</span>
        <span>3–5 hours total</span>
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="#modules"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-deep text-white rounded-[10px] px-6 py-3.5 text-[15px] font-semibold transition-all duration-150 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(201,99,63,0.3)]"
        >
          Start Module 01
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
        <Link
          href="/paths"
          className="inline-flex items-center gap-1.5 bg-transparent hover:bg-surface-subtle text-secondary border border-border rounded-[10px] px-5 py-3.5 text-[14px] font-medium transition-colors duration-150"
        >
          View all paths
        </Link>
      </div>
    </header>
  )
}

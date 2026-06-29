'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Clock, CheckCircle2, Star, Activity,
  Brain, Terminal, Monitor, GitBranch, Code2, Globe,
  Database, Cpu, Rocket, Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PathData } from '@/lib/mdx'

const MODULE_ICONS: Record<string, LucideIcon> = {
  '01': Brain,
  '02': Terminal,
  '03': Monitor,
  '04': GitBranch,
  '05': Code2,
  '06': Globe,
  '07': Database,
  '08': Cpu,
  '09': Rocket,
  '10': Layers,
}

const PILL_ICONS: LucideIcon[] = [Clock, CheckCircle2, Star, Activity]

interface PathHeroProps {
  path: PathData
}

function HeroTitle({ raw }: { raw: string }) {
  const parts = raw.split(/(\*[^*]+\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className="not-italic text-accent">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        )
      )}
    </>
  )
}

export function PathHero({ path }: PathHeroProps) {
  const pills = path.pills ?? []
  const modules = path.modules ?? []

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-12 mt-5">

      {/* ── Top: left content + right illustration ── */}
      <div className="grid lg:grid-cols-[1fr_42%]">

        {/* Left */}
        <div className="p-8 lg:p-10 flex flex-col gap-5">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full border border-success/30 bg-success/10 text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
              No experience needed
            </span>
            <span className="inline-flex items-center text-[11px] font-medium px-3 py-1.5 rounded-full border border-border bg-surface-subtle text-secondary">
              Free forever
            </span>
          </div>

          {/* Title */}
          <h1 className="font-fraunces text-[clamp(2rem,3.8vw,2.9rem)] font-medium text-primary leading-[1.1] tracking-tight">
            {path.heroTitle ? (
              <HeroTitle raw={path.heroTitle} />
            ) : (
              <>
                {path.title}
                {path.subtitle && (
                  <span className="block italic text-accent mt-1">{path.subtitle}</span>
                )}
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-[14.5px] text-secondary leading-relaxed max-w-[44ch]">
            {path.description}
          </p>

          {/* Feature pills */}
          {pills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pills.map((label, i) => {
                const Icon = PILL_ICONS[i % PILL_ICONS.length]
                return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-[12px] text-secondary bg-surface-subtle border border-border rounded-full px-3 py-1.5"
                  >
                    <Icon size={11} strokeWidth={2} className="text-accent shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                )
              })}
            </div>
          )}

          {/* CTA + social proof */}
          <div className="flex items-center gap-4 flex-wrap mt-1">
            <Link
              href="#modules"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-deep text-white rounded-xl px-6 py-3 text-[14px] font-semibold transition-colors"
            >
              Start the path
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
            </Link>
            {path.learnerCount && (
              <p className="text-[12.5px] text-secondary">
                <strong className="text-primary font-semibold">
                  {path.learnerCount.toLocaleString()}+
                </strong>{' '}
                learners enrolled
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { value: `${modules.length}`, label: 'modules' },
              { value: `${path.lessonCount}`, label: 'topics' },
              { value: '3–5 hrs', label: 'total' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-surface-subtle border border-border rounded-lg px-3 py-1.5"
              >
                <span className="text-[13px] font-semibold text-primary">{value}</span>
                <span className="text-[12px] text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: cover image or branded placeholder */}
        <div className="hidden lg:flex items-center justify-center relative bg-surface-subtle min-h-[320px] border-l border-border">
          {path.coverImage ? (
            <Image
              src={path.coverImage}
              alt={`${path.title} illustration`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              {/* Decorative compass/grid pattern */}
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full border-2 border-border" />
                <div className="absolute inset-3 rounded-full border border-border/60" />
                <div className="absolute inset-6 rounded-full border border-border/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-[1.5px] bg-border absolute" />
                  <div className="h-16 w-[1.5px] bg-border absolute" />
                  <div className="w-5 h-5 rounded-full bg-accent-soft border-2 border-accent flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                </div>
                {/* Cardinal points */}
                {[
                  { label: 'N', style: { top: '4px', left: '50%', transform: 'translateX(-50%)' } },
                  { label: 'S', style: { bottom: '4px', left: '50%', transform: 'translateX(-50%)' } },
                  { label: 'E', style: { right: '4px', top: '50%', transform: 'translateY(-50%)' } },
                  { label: 'W', style: { left: '4px', top: '50%', transform: 'translateY(-50%)' } },
                ].map(({ label, style }) => (
                  <span
                    key={label}
                    className="absolute text-[9px] font-bold text-secondary/60"
                    style={style}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="space-y-1">
                <p className="font-fraunces text-base font-medium text-primary">
                  <span className="text-primary">Seek</span>
                  <span className="text-accent">vana</span>
                </p>
                <p className="text-[11px] text-secondary leading-relaxed">
                  Learn AI, clearly.
                </p>
              </div>
              <p className="text-[10px] text-secondary/60 leading-relaxed">
                Add cover image at<br />
                <code className="text-accent/80">public/images/paths/{path.slug}/cover.webp</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom: module strip ── */}
      {modules.length > 0 && (
        <div
          className="border-t border-border overflow-x-auto"
          role="list"
          aria-label="Path modules"
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${modules.length}, minmax(80px, 1fr))` }}
          >
            {modules.map((module, i) => {
              const isFirst = i === 0
              const isLast = i === modules.length - 1
              const Icon = MODULE_ICONS[module.id]

              return (
                <div
                  key={module.id}
                  role="listitem"
                  className="p-3 lg:p-3.5 flex flex-col gap-1.5 border-r border-border last:border-r-0 min-w-[80px]"
                >
                  <span
                    className={`text-[9px] font-bold tracking-widest uppercase ${
                      isFirst ? 'text-accent' : isLast ? 'text-success' : 'text-border'
                    }`}
                  >
                    {module.id}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isFirst
                        ? 'bg-accent-soft'
                        : isLast
                        ? 'bg-success/10'
                        : 'bg-surface-subtle'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        size={13}
                        strokeWidth={1.8}
                        className={
                          isFirst ? 'text-accent' : isLast ? 'text-success' : 'text-secondary'
                        }
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium leading-tight ${
                      isFirst ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {module.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

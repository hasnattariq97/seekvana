import Link from 'next/link'
import type { PathData } from '@/lib/mdx'

interface PathSidebarProps {
  path: PathData
  completedCount?: number
  continueHref?: string
  nextLessonTitle?: string | null
  nextLessonModuleTitle?: string | null
}

export function PathSidebar({
  path,
  completedCount = 0,
  continueHref = '#modules',
  nextLessonTitle,
  nextLessonModuleTitle,
}: PathSidebarProps) {
  const difficultyLabel = path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)
  const total = path.lessonCount ?? 0
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const isComplete = completedCount >= total && total > 0
  const inProgress = completedCount > 0 && !isComplete

  // SVG ring: r=26, circumference ≈ 163.4
  const CIRC = 163.4
  const dashOffset = CIRC * (1 - pct / 100)

  const ctaEyebrow = isComplete ? 'Path finished' : inProgress ? 'Continue where you left off' : 'Begin your journey'
  const ctaLabel = isComplete ? 'Review path' : inProgress ? 'Continue learning' : 'Start Module 01'

  return (
    <aside className="sticky top-[76px] flex flex-col gap-3.5">
      {/* Progress card */}
      <div className="bg-surface-subtle border border-border rounded-2xl p-6 flex flex-col gap-0">
        <p className="text-[10px] font-semibold text-secondary uppercase tracking-[0.1em] mb-4">
          Your progress
        </p>

        {/* Ring + info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-16 h-16 shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-border)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke={isComplete ? 'var(--color-success)' : 'var(--color-accent)'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-fraunces text-base font-bold text-primary leading-none">{completedCount}</span>
              <span className="text-[9px] text-secondary font-medium mt-0.5">of {total}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-fraunces text-[15px] font-bold text-primary leading-tight mb-1">{path.title}</p>
            <p className="text-[11px] text-secondary leading-relaxed">
              <span className={`font-semibold ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-accent'}`}>{pct}%</span>
              {' '}complete · {Math.max(0, total - completedCount)} topics left
            </p>
          </div>
        </div>

        {/* Up next strip */}
        {nextLessonTitle && (
          <div className="bg-canvas border border-border rounded-[10px] px-3.5 py-3 mb-5">
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-[0.08em] mb-1">Up next</p>
            <p className="text-[12px] font-semibold text-primary leading-snug">{nextLessonTitle}</p>
            {nextLessonModuleTitle && (
              <p className="text-[11px] text-secondary mt-0.5">{nextLessonModuleTitle}</p>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={continueHref}
          className={`flex items-center justify-between w-full text-white rounded-[10px] px-4 py-[13px] mb-6 transition-colors duration-150 ${
            isComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-accent hover:bg-accent-deep'
          }`}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.06em] opacity-75">{ctaEyebrow}</span>
            <span className="text-[14px] font-bold">{ctaLabel}</span>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>

        {/* Divider */}
        <div className="h-px bg-border mb-5" />

        {/* Meta rows */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between py-[9px] border-b border-border">
            <span className="flex items-center gap-[7px] text-[12px] text-secondary">
              <svg className="w-4 h-4 text-secondary/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Difficulty
            </span>
            <span className="text-[12px] font-semibold text-primary">{difficultyLabel}</span>
          </div>

          <div className="flex items-center justify-between py-[9px] border-b border-border">
            <span className="flex items-center gap-[7px] text-[12px] text-secondary">
              <svg className="w-4 h-4 text-secondary/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Total time
            </span>
            <span className="text-[12px] font-semibold text-primary">3–5 hours</span>
          </div>

          <div className="flex items-center justify-between py-[9px] border-b border-border">
            <span className="flex items-center gap-[7px] text-[12px] text-secondary">
              <svg className="w-4 h-4 text-secondary/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Prerequisites
            </span>
            <span className="text-[12px] font-semibold text-primary">None</span>
          </div>

          <div className="flex items-center justify-between py-[9px]">
            <span className="flex items-center gap-[7px] text-[12px] text-secondary">
              <svg className="w-4 h-4 text-secondary/60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              You'll build
            </span>
            <span className="text-[12px] font-semibold text-accent">Live AI app</span>
          </div>
        </div>
      </div>

      {/* After this path */}
      {path.nextPath && (
        <div className="bg-surface-subtle border border-border rounded-2xl p-4">
          <p className="text-[10.5px] font-bold text-secondary uppercase tracking-widest mb-2">
            After this path
          </p>
          <p className="font-fraunces text-[15px] font-semibold text-primary leading-tight mb-1">
            {path.nextPath.title}
          </p>
          <p className="text-xs text-secondary">
            {path.nextPath.lessonCount} lessons ·{' '}
            {path.nextPath.difficulty.charAt(0).toUpperCase() + path.nextPath.difficulty.slice(1)}
          </p>
          <Link
            href={`/paths/${path.nextPath.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mt-2.5 hover:gap-2.5 transition-all duration-150"
          >
            View path
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      )}
    </aside>
  )
}

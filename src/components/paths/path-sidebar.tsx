import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { PathData } from '@/lib/mdx'

interface PathSidebarProps {
  path: PathData
  completedCount?: number
  continueHref?: string
}

export function PathSidebar({ path, completedCount = 0, continueHref = '#modules' }: PathSidebarProps) {
  const difficultyLabel =
    path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)

  const total = path.lessonCount ?? 0
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const isComplete = completedCount >= total && total > 0
  const inProgress = completedCount > 0 && !isComplete

  const ctaLabel = isComplete ? 'Review path' : inProgress ? 'Continue learning' : 'Start Module 01'

  return (
    <aside className="sticky top-[76px] flex flex-col gap-3.5">
      {/* Progress card */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3.5">
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest">
            Your progress
          </p>
          {isComplete && (
            <CheckCircle2 size={15} strokeWidth={2} className="text-green-500" />
          )}
        </div>

        {/* Progress bar */}
        <div className="h-[5px] bg-border rounded-full mb-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-accent'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-secondary mb-5">
          {isComplete
            ? <span className="text-green-600 dark:text-green-400 font-medium">All {total} topics complete 🎉</span>
            : <>{completedCount} of {total} topics complete</>
          }
        </p>

        <Link
          href={continueHref}
          className={`flex items-center justify-between w-full text-white rounded-[10px] px-4 py-3.5 text-[13.5px] font-semibold transition-colors duration-150 mb-5 ${
            isComplete
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-accent hover:bg-accent-deep'
          }`}
        >
          <span>{ctaLabel}</span>
          <ArrowRight size={15} strokeWidth={2} />
        </Link>

        <div className="divide-y divide-border text-[12.5px]">
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">Difficulty</span>
            <span className="font-medium text-primary">{difficultyLabel}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">Total time</span>
            <span className="font-medium text-primary">3–5 hours</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">Prerequisites</span>
            <span className="font-medium text-primary">None</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-secondary">You'll build</span>
            <span className="font-medium text-primary">Live AI app</span>
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
            {path.nextPath.difficulty.charAt(0).toUpperCase() +
              path.nextPath.difficulty.slice(1)}
          </p>
          <Link
            href={`/paths/${path.nextPath.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mt-2.5 hover:gap-2.5 transition-all duration-150"
          >
            View path
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      )}
    </aside>
  )
}

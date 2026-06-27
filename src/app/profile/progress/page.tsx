import { createClient } from '@/lib/supabase-server'
import { calculatePathProgress } from '@/lib/profile'
import type { ArticleRead, PathProgress } from '@/lib/profile'
import Link from 'next/link'

export const metadata = { title: 'Learning Progress — Seekvana' }

const PATH_COLORS: Record<string, string> = {
  'bg-purple-500': '#8B5CF6',
  'bg-teal-500': '#14B8A6',
  'bg-green-500': '#22C55E',
  'bg-amber-500': '#F59E0B',
  'bg-blue-500': '#3B82F6',
}

function pathColor(colorClass: string): string {
  return PATH_COLORS[colorClass] ?? '#C9633F'
}

export default async function ProgressPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: readsData } = await supabase
    .from('article_reads')
    .select('pillar, article_slug, read_at')
    .eq('user_id', user.id)

  const reads: ArticleRead[] = (readsData ?? []).map((r) => ({
    pillar: r.pillar,
    articleSlug: r.article_slug,
    readAt: r.read_at,
  }))

  const allPaths = calculatePathProgress(reads)
  const inProgress = allPaths.filter((p) => p.status === 'in-progress')
  const completed = allPaths.filter((p) => p.status === 'completed')
  const notStarted = allPaths.filter((p) => p.status === 'not-started')

  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-fraunces text-2xl text-primary">Learning Progress</h1>
          <p className="text-sm text-secondary mt-1">
            {completed.length} completed · {inProgress.length} in progress · {notStarted.length} not started
          </p>
        </div>

        {inProgress.length > 0 && (
          <>
            <p className="font-fraunces text-sm text-secondary mb-3">In Progress</p>
            <div className="space-y-4 mb-8">
              {inProgress.map((p) => (
                <PathCard key={p.pathSlug} path={p} color={pathColor(p.colorClass)} expanded />
              ))}
            </div>
          </>
        )}

        {completed.length > 0 && (
          <>
            <p className="font-fraunces text-sm text-secondary mb-3">Completed</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {completed.map((p) => (
                <div key={p.pathSlug} className="bg-surface border border-border rounded-xl px-5 py-4 flex gap-3 items-center">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="text-sm font-medium text-primary">{p.title}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      ✓ All {p.totalLessons} lessons complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {notStarted.length > 0 && (
          <>
            <p className="font-fraunces text-sm text-secondary mb-3">Not Started</p>
            <div className="space-y-3">
              {notStarted.map((p) => (
                <div key={p.pathSlug} className="bg-surface border border-border rounded-xl px-5 py-4 flex items-center gap-4 opacity-60">
                  <span className="text-2xl">📘</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">{p.title}</p>
                    <p className="text-xs text-secondary mt-0.5">{p.totalLessons} lessons</p>
                  </div>
                  {p.nextLesson && (
                    <Link
                      href={`/library/${p.nextLesson.pillar}/${p.nextLesson.slug}`}
                      className="text-xs border border-border text-primary px-3 py-1.5 rounded-lg hover:bg-surface-subtle transition-colors flex-shrink-0"
                    >
                      Start →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {allPaths.length === 0 && (
          <div className="text-center py-16 text-secondary">
            <p className="mb-3">No paths found.</p>
            <Link href="/paths" className="text-accent text-sm hover:text-accent-deep transition-colors">
              Browse learning paths →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function PathCard({ path, color, expanded }: { path: PathProgress; color: string; expanded: boolean }) {
  const pct = path.totalLessons > 0
    ? Math.round((path.completedLessons / path.totalLessons) * 100)
    : 0

  const visibleLessons = path.lessons.slice(0, 8)

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-4 border-b border-border/50">
        <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <p className="text-base font-fraunces font-medium text-primary">{path.title}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex-1 bg-surface-subtle rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-secondary flex-shrink-0">
              {path.completedLessons} / {path.totalLessons}
            </span>
          </div>
        </div>
        {path.nextLesson && (
          <Link
            href={`/library/${path.nextLesson.pillar}/${path.nextLesson.slug}`}
            className="text-xs text-white px-4 py-1.5 rounded-lg flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: color }}
          >
            Continue →
          </Link>
        )}
      </div>
      {expanded && (
        <div className="px-5 py-3 grid sm:grid-cols-2 gap-x-6 gap-y-1">
          {visibleLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg px-1 ${lesson.isNext ? 'bg-accent-soft -mx-1 px-2' : ''}`}
            >
              {lesson.completed ? (
                <span className="text-green-500 text-sm">✓</span>
              ) : lesson.isNext ? (
                <span className="text-accent text-sm">→</span>
              ) : (
                <span className="text-border text-sm">○</span>
              )}
              <span
                className={`text-sm font-inter ${
                  lesson.completed
                    ? 'line-through text-secondary'
                    : lesson.isNext
                    ? 'font-medium text-accent'
                    : 'text-secondary'
                }`}
              >
                {lesson.title}
              </span>
              {lesson.isNext && (
                <span className="ml-auto text-[10px] bg-accent-soft text-accent rounded-full px-2 py-0.5">Next</span>
              )}
            </div>
          ))}
          {path.lessons.length > 8 && (
            <div className="py-1.5 px-1 text-xs text-secondary">
              + {path.lessons.length - 8} more lessons
            </div>
          )}
        </div>
      )}
    </div>
  )
}

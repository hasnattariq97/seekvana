import { Bookmark } from 'lucide-react'

/** Matches BookmarkButton default (unsaved) footprint exactly. Non-interactive. */
export function BookmarkButtonSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border bg-surface text-secondary border-border opacity-70"
    >
      <Bookmark size={15} />
      Save
    </div>
  )
}

/** Matches MarkCompleteButton default card footprint (my-12 + px-7 py-6 rounded-2xl). */
export function MarkCompleteSkeleton() {
  return (
    <div className="my-12" aria-hidden="true">
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-surface border border-border rounded-2xl px-7 py-6 animate-pulse">
        <div className="shrink-0 w-14 h-14 rounded-full bg-surface-subtle" />
        <div className="flex-1 w-full space-y-2 text-center sm:text-left">
          <div className="h-5 w-40 rounded bg-surface-subtle mx-auto sm:mx-0" />
          <div className="h-4 w-64 rounded bg-surface-subtle mx-auto sm:mx-0" />
        </div>
        <div className="shrink-0 h-11 w-44 rounded-xl bg-surface-subtle" />
      </div>
    </div>
  )
}

/** Matches the ArticleComments section header + form block footprint. */
export function CommentsSkeleton() {
  return (
    <section aria-label="Comments loading" className="mt-10" aria-hidden="true">
      <div className="h-6 w-40 rounded bg-surface-subtle mb-6 animate-pulse" />
      <div className="rounded-xl border border-border bg-surface p-5 space-y-4 mb-10">
        <div className="h-11 w-full rounded-lg bg-surface-subtle animate-pulse" />
        <div className="h-24 w-full rounded-lg bg-surface-subtle animate-pulse" />
        <div className="h-9 w-36 rounded-lg bg-surface-subtle animate-pulse" />
      </div>
      <div className="space-y-8">
        <div className="h-16 w-full rounded-lg bg-surface-subtle animate-pulse" />
        <div className="h-16 w-full rounded-lg bg-surface-subtle animate-pulse" />
      </div>
    </section>
  )
}

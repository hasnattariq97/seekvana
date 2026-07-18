/** Zero-CLS fallbacks for the profile route islands. Non-interactive. */

export function ProfileDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-subtle" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-surface-subtle" />
            <div className="h-4 w-32 rounded bg-surface-subtle" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-subtle" />
          ))}
        </div>
        <div className="h-40 rounded-xl bg-surface-subtle" />
      </div>
    </div>
  )
}

export function ProgressSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-8 w-56 rounded bg-surface-subtle mb-2" />
        <div className="h-4 w-72 rounded bg-surface-subtle mb-8" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-surface-subtle" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReadingListSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-surface-subtle mb-6" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-surface-subtle" />
        ))}
      </div>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6" aria-hidden="true">
      <div className="max-w-xl mx-auto animate-pulse">
        <div className="h-8 w-40 rounded bg-surface-subtle mb-8" />
        <div className="space-y-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-surface-subtle" />
          ))}
        </div>
      </div>
    </div>
  )
}

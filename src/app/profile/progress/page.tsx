import { Suspense } from 'react'
import { ProgressIsland } from '@/components/profile/progress-island'
import { ProgressSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'Learning Progress' }

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<ProgressSkeleton />}>
          <ProgressIsland />
        </Suspense>
      </div>
    </div>
  )
}

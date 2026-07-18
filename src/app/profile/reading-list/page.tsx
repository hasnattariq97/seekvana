import { Suspense } from 'react'
import { ReadingListIsland } from '@/components/profile/reading-list-island'
import { ReadingListSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'Reading List' }

export default function ReadingListPage() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<ReadingListSkeleton />}>
          <ReadingListIsland />
        </Suspense>
      </div>
    </div>
  )
}

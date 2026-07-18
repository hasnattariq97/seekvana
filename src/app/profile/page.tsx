import { Suspense } from 'react'
import { ProfileDashboardIsland } from '@/components/profile/profile-dashboard-island'
import { ProfileDashboardSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'My Profile' }

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileDashboardSkeleton />}>
      <ProfileDashboardIsland />
    </Suspense>
  )
}

import { Suspense } from 'react'
import { SettingsIsland } from '@/components/profile/settings-island'
import { SettingsSkeleton } from '@/components/profile/profile-skeletons'

export const metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="font-fraunces text-2xl text-primary mb-8">Settings</h1>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsIsland />
        </Suspense>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase-server'
import { SettingsClient } from './settings-client'

export const metadata = { title: 'Settings — Seekvana' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, is_public')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="font-fraunces text-2xl text-primary mb-8">Settings</h1>
        <SettingsClient
          userId={user.id}
          email={user.email ?? ''}
          initialDisplayName={profile?.display_name ?? (user.user_metadata?.full_name as string) ?? ''}
          initialIsPublic={profile?.is_public ?? false}
          signInMethod={user.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Magic Link'}
        />
      </div>
    </div>
  )
}

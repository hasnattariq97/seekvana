import { createClient } from '@/lib/supabase-server'
import { requireUser } from '@/lib/profile-data'
import { SettingsClient } from '@/app/profile/settings/settings-client'

export async function SettingsIsland() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, is_public')
    .eq('user_id', user.id)
    .single()

  return (
    <SettingsClient
      userId={user.id}
      email={user.email ?? ''}
      initialDisplayName={profile?.display_name ?? (user.user_metadata?.full_name as string) ?? ''}
      initialIsPublic={profile?.is_public ?? false}
      signInMethod={user.app_metadata?.provider === 'google' ? 'Google OAuth' : 'Magic Link'}
    />
  )
}

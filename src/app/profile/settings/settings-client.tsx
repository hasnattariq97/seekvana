'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Props = {
  userId: string
  email: string
  initialDisplayName: string
  initialIsPublic: boolean
  signInMethod: string
}

export function SettingsClient({
  userId,
  email,
  initialDisplayName,
  initialIsPublic,
  signInMethod,
}: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [editingName, setEditingName] = useState(false)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [streakReminder, setStreakReminder] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function saveProfile(updates: { display_name?: string; is_public?: boolean }) {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' })
    setSaving(false)
  }

  async function handleNameSave() {
    await saveProfile({ display_name: displayName })
    setEditingName(false)
  }

  async function togglePublic() {
    const next = !isPublic
    setIsPublic(next)
    await saveProfile({ is_public: next })
  }

  async function deleteAccount() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={onToggle}
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 cursor-pointer ${on ? 'bg-accent' : 'bg-border'}`}
      >
        <span
          className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${on ? 'left-[19px]' : 'left-[3px]'}`}
        />
      </button>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile section */}
      <div>
        <p className="font-fraunces text-sm text-secondary uppercase tracking-wide mb-3">Profile</p>
        <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Display name</p>
              {editingName ? (
                <div className="flex gap-2 mt-2">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-1.5 bg-canvas text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 flex-1"
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    disabled={saving}
                    className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent-deep transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingName(false)} className="text-xs text-secondary px-2 py-1.5">
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm text-secondary mt-0.5">{displayName || 'Not set'}</p>
              )}
            </div>
            {!editingName && (
              <button
                onClick={() => setEditingName(true)}
                className="text-xs border border-border text-primary px-3 py-1.5 rounded-lg hover:bg-surface-subtle transition-colors flex-shrink-0"
              >
                Edit
              </button>
            )}
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Email</p>
              <p className="text-sm text-secondary mt-0.5">{email}</p>
            </div>
            <span className="text-xs bg-surface-subtle text-secondary border border-border px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap ml-4">
              Verified
            </span>
          </div>

          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Public profile</p>
              <p className="text-xs text-secondary mt-0.5">Anyone with the link can view your profile</p>
            </div>
            <div className="flex-shrink-0">
              <Toggle on={isPublic} onToggle={togglePublic} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <p className="font-fraunces text-sm text-secondary uppercase tracking-wide mb-3">Notifications</p>
        <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Weekly digest</p>
              <p className="text-xs text-secondary mt-0.5">New articles in your favourite pillars</p>
            </div>
            <div className="flex-shrink-0">
              <Toggle on={weeklyDigest} onToggle={() => setWeeklyDigest((v) => !v)} />
            </div>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Streak reminders</p>
              <p className="text-xs text-secondary mt-0.5">Email when your streak is at risk</p>
            </div>
            <div className="flex-shrink-0">
              <Toggle on={streakReminder} onToggle={() => setStreakReminder((v) => !v)} />
            </div>
          </div>
        </div>
      </div>

      {/* Account */}
      <div>
        <p className="font-fraunces text-sm text-secondary uppercase tracking-wide mb-3">Account</p>
        <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
          <div className="px-5 py-4">
            <p className="text-sm font-medium text-primary">Sign in method</p>
            <p className="text-sm text-secondary mt-0.5">{signInMethod}</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Delete account</p>
              <p className="text-xs text-secondary mt-0.5">Permanently remove all your data</p>
            </div>
            {showDeleteConfirm ? (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={deleteAccount}
                  className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent-deep transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs text-secondary px-2 py-1.5"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs border border-border text-primary px-3 py-1.5 rounded-lg hover:bg-surface-subtle transition-colors flex-shrink-0"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

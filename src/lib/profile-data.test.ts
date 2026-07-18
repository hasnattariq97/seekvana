import { describe, it, expect } from 'vitest'
import { slugifyDisplayName, matchPublicProfile, type PublicProfileRow } from './profile-data'

const rows: PublicProfileRow[] = [
  { user_id: 'abc123-uuid', display_name: 'Ada Lovelace', is_public: true, created_at: '2026-01-01' },
  { user_id: 'def456-uuid', display_name: 'Grace Hopper!', is_public: true, created_at: '2026-02-01' },
]

describe('slugifyDisplayName', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugifyDisplayName('Ada Lovelace')).toBe('ada-lovelace')
  })
  it('strips non-alphanumeric characters', () => {
    expect(slugifyDisplayName('Grace Hopper!')).toBe('grace-hopper')
  })
  it('returns empty string for null', () => {
    expect(slugifyDisplayName(null)).toBe('')
  })
})

describe('matchPublicProfile', () => {
  it('matches by slugified display name', () => {
    expect(matchPublicProfile(rows, 'ada-lovelace')?.user_id).toBe('abc123-uuid')
  })
  it('matches by user_id prefix fallback', () => {
    expect(matchPublicProfile(rows, 'def456')?.user_id).toBe('def456-uuid')
  })
  it('returns null when nothing matches', () => {
    expect(matchPublicProfile(rows, 'nobody')).toBeNull()
  })
})

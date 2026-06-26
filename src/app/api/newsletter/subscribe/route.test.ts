import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase server client
vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

import { POST } from './route'
import { createClient } from '@/lib/supabase-server'

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/newsletter/subscribe', () => {
  const mockInsert = vi.fn()

  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({ insert: mockInsert }),
    } as never)
    mockInsert.mockReset()
  })

  it('returns 200 on valid new subscriber', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const res = await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('returns 400 on invalid email', async () => {
    const res = await POST(makeRequest({ email: 'notanemail', source: 'homepage' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 on empty email', async () => {
    const res = await POST(makeRequest({ email: '', source: 'homepage' }))
    expect(res.status).toBe(400)
  })

  it('returns 409 when email already subscribed', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505' } })
    const res = await POST(makeRequest({ email: 'existing@example.com', source: 'homepage' }))
    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.message).toContain('already')
  })

  it('returns 500 on unexpected database error', async () => {
    mockInsert.mockResolvedValue({ error: { code: 'UNKNOWN', message: 'db error' } })
    const res = await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(res.status).toBe(500)
  })
})

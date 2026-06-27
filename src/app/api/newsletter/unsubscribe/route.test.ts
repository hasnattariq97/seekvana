import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

import { GET } from './route'
import { createClient } from '@/lib/supabase-server'

function makeRequest(token?: string) {
  const url = token
    ? `http://localhost/api/newsletter/unsubscribe?token=${token}`
    : 'http://localhost/api/newsletter/unsubscribe'
  return new Request(url)
}

describe('GET /api/newsletter/unsubscribe', () => {
  const mockUpdate = vi.fn()
  const mockEq = vi.fn()

  beforeEach(() => {
    mockEq.mockReturnValue({ error: null })
    mockUpdate.mockReturnValue({ eq: mockEq })
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({ update: mockUpdate }),
    } as never)
    mockUpdate.mockReset()
    mockEq.mockReset()
  })

  it('redirects to /unsubscribed on valid token', async () => {
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockEq.mockResolvedValue({ error: null })
    const res = await GET(makeRequest('valid-token-123'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/unsubscribed')
  })

  it('returns 400 when token is missing', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(400)
  })

  it('returns 400 when token is empty string', async () => {
    const res = await GET(makeRequest(''))
    expect(res.status).toBe(400)
  })

  it('returns 500 on database error', async () => {
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockEq.mockResolvedValue({ error: { message: 'db error' } })
    const res = await GET(makeRequest('valid-token-123'))
    expect(res.status).toBe(500)
  })
})

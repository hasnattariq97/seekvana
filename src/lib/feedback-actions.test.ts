import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}))

import { submitFeedback } from './feedback-actions'
import { createClient } from '@supabase/supabase-js'
import { resend } from '@/lib/resend'

describe('submitFeedback', () => {
  const mockInsert = vi.fn()
  const mockEmailSend = vi.mocked(resend.emails.send)

  beforeEach(() => {
    vi.mocked(createClient).mockReturnValue({
      from: () => ({ insert: mockInsert }),
    } as never)
    mockInsert.mockReset()
    mockEmailSend.mockReset()
    mockInsert.mockResolvedValue({ error: null })
    mockEmailSend.mockResolvedValue({ data: { id: 'e1' }, error: null } as never)
  })

  it('returns error when message is too short', async () => {
    const result = await submitFeedback({ type: 'general', message: 'hi', email: '', pageUrl: '' })
    expect(result.error).toMatch(/10 characters/)
  })

  it('returns error when message is too long', async () => {
    const result = await submitFeedback({ type: 'general', message: 'a'.repeat(1001), email: '', pageUrl: '' })
    expect(result.error).toMatch(/1000 characters/)
  })

  it('returns error when email is invalid format', async () => {
    const result = await submitFeedback({ type: 'general', message: 'valid message here', email: 'notanemail', pageUrl: '' })
    expect(result.error).toMatch(/valid email/)
  })

  it('returns error when type is invalid', async () => {
    const result = await submitFeedback({ type: 'unknown' as never, message: 'valid message here', email: '', pageUrl: '' })
    expect(result.error).toMatch(/Invalid type/)
  })

  it('returns success on valid submission', async () => {
    const result = await submitFeedback({ type: 'bug', message: 'The search modal crashes on mobile.', email: 'user@example.com', pageUrl: 'https://seekvana.com/library/agentic-ai' })
    expect(result.success).toBe(true)
    expect(mockInsert).toHaveBeenCalledOnce()
  })

  it('sends notification email on success', async () => {
    await submitFeedback({ type: 'suggestion', message: 'Please add more RAG content.', email: '', pageUrl: '' })
    expect(mockEmailSend).toHaveBeenCalledOnce()
    const call = mockEmailSend.mock.calls[0][0] as Record<string, unknown>
    expect(call.to).toBe('hasnattariq97@gmail.com')
    expect((call.subject as string)).toContain('suggestion')
  })

  it('returns error when Supabase insert fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'db error' } })
    const result = await submitFeedback({ type: 'general', message: 'Valid message content here.', email: '', pageUrl: '' })
    expect(result.error).toMatch(/went wrong/)
  })

  it('still returns success if email send fails (non-blocking)', async () => {
    mockEmailSend.mockRejectedValue(new Error('Resend down'))
    const result = await submitFeedback({ type: 'general', message: 'Valid message content here.', email: '', pageUrl: '' })
    expect(result.success).toBe(true)
  })

  it('accepts empty email (optional field)', async () => {
    const result = await submitFeedback({ type: 'general', message: 'Valid message content here.', email: '', pageUrl: '' })
    expect(result.success).toBe(true)
  })
})

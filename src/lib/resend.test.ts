import { describe, it, expect, vi } from 'vitest'

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: {} }
  }),
}))

describe('resend client', () => {
  it('exports a resend instance', async () => {
    const { resend } = await import('./resend')
    expect(resend).toBeDefined()
    expect(resend.emails).toBeDefined()
  })
})

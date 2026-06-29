'use server'

import { createClient } from '@supabase/supabase-js'
import { isValidEmail } from '@/lib/email'
import { resend } from '@/lib/resend'

const ALLOWED_TYPES = ['general', 'bug', 'mistake', 'suggestion'] as const
type FeedbackType = typeof ALLOWED_TYPES[number]

interface FeedbackInput {
  type: FeedbackType
  message: string
  email: string
  pageUrl: string
}

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function submitFeedback(
  input: FeedbackInput
): Promise<{ success?: true; error?: string }> {
  const message = input.message.trim()
  const email = input.email.trim()
  const pageUrl = input.pageUrl.trim()

  if (!ALLOWED_TYPES.includes(input.type)) {
    return { error: 'Invalid type.' }
  }
  if (message.length < 10) {
    return { error: 'Message must be at least 10 characters.' }
  }
  if (message.length > 1000) {
    return { error: 'Message must be under 1000 characters.' }
  }
  if (email && !isValidEmail(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  const { error: dbError } = await supabase()
    .from('feedback')
    .insert({
      type: input.type,
      message,
      email: email || null,
      page_url: pageUrl || null,
    })

  if (dbError) {
    return { error: 'Something went wrong. Please try again.' }
  }

  // Non-blocking email notification
  resend.emails.send({
    from: 'Seekvana <noreply@seekvana.com>',
    to: 'hasnattariq97@gmail.com',
    subject: `[Seekvana Feedback] ${input.type} — ${message.slice(0, 60)}${message.length > 60 ? '…' : ''}`,
    text: [
      `Type:    ${input.type}`,
      `Message: ${message}`,
      `Email:   ${email || 'not provided'}`,
      `Page:    ${pageUrl || 'unknown'}`,
    ].join('\n'),
  }).catch((err: unknown) => {
    console.error('[feedback] email notification failed:', err)
  })

  return { success: true }
}

import { createClient } from '@/lib/supabase-server'
import { isValidEmail } from '@/lib/email'
import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/emails/welcome'
import { NextResponse } from 'next/server'
import { createElement } from 'react'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const token = crypto.randomUUID()
    const supabase = await createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim(), source: source ?? 'unknown', unsubscribe_token: token })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "You're already on the list! 🎉" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { message: 'Something went wrong. Try again?' },
        { status: 500 }
      )
    }

    const unsubscribeUrl = `https://seekvana.com/api/newsletter/unsubscribe?token=${token}`

    try {
      resend.emails.send({
        from: 'Seekvana <hello@seekvana.com>',
        to: email.toLowerCase().trim(),
        subject: "You're in — here's your free AI cheatsheet 🎉",
        react: createElement(WelcomeEmail, { unsubscribeUrl }),
      }).catch(() => {})
    } catch {
      // Non-blocking — subscriber is saved, email failure is acceptable
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong. Try again?' },
      { status: 500 }
    )
  }
}

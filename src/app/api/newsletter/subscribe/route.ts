import { createClient } from '@/lib/supabase-server'
import { isValidEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim(), source: source ?? 'unknown' })

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

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong. Try again?' },
      { status: 500 }
    )
  }
}

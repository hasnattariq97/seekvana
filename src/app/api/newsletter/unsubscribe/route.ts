import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ message: 'Missing token.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed' })
    .eq('unsubscribe_token', token)

  if (error) {
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/unsubscribed', request.url))
}

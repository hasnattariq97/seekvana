'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const SPAM_PATTERNS = ['http://', 'https://', 'buy now', 'click here', 'free money', 'make money fast', 'earn cash']

function isFlagged(body: string): boolean {
  const lower = body.toLowerCase()
  return SPAM_PATTERNS.some((p) => lower.includes(p))
}

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function postComment(
  articleId: string,
  name: string,
  body: string
): Promise<{ id?: string; error?: string }> {
  const n = name.trim()
  const b = body.trim()
  if (!n || n.length > 60) return { error: 'Name is required (max 60 characters).' }
  if (!b || b.length < 10) return { error: 'Comment must be at least 10 characters.' }
  if (b.length > 1000) return { error: 'Comment must be under 1000 characters.' }

  const { data, error } = await supabase().from('comments').insert({
    article_id: articleId,
    name: n,
    body: b,
    is_flagged: isFlagged(b),
  }).select('id').single()

  if (error) return { error: 'Failed to post comment. Please try again.' }
  revalidatePath(`/library/${articleId}`)
  return { id: data.id as string }
}

export async function postReply(
  articleId: string,
  parentId: string,
  name: string,
  body: string
): Promise<{ error?: string }> {
  const n = name.trim()
  const b = body.trim()
  if (!n || n.length > 60) return { error: 'Name is required (max 60 characters).' }
  if (!b || b.length < 10) return { error: 'Reply must be at least 10 characters.' }
  if (b.length > 1000) return { error: 'Reply must be under 1000 characters.' }

  const { error } = await supabase().from('comments').insert({
    article_id: articleId,
    parent_id: parentId,
    name: n,
    body: b,
    is_flagged: isFlagged(b),
  })

  if (error) return { error: 'Failed to post reply. Please try again.' }
  revalidatePath(`/library/${articleId}`)
  return {}
}

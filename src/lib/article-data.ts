import { cache } from 'react'
import { createClient as createAnonClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase-server'
import { buildCommentTree } from '@/lib/comment-tree'
import type { CommentWithReplies } from '@/types/comments'

/** Anon client — no cookies, so this read alone does NOT force dynamic rendering. */
function anon() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** Fresh comments for an article, shaped into a top-level + replies tree. */
export async function getArticleComments(articleId: string): Promise<CommentWithReplies[]> {
  const { data } = await anon()
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false })
  return buildCommentTree(data ?? [])
}

/**
 * Current authenticated user, deduped per request.
 * Both article islands (bookmark, completion) call this; React cache() collapses
 * them into a single auth.getUser() round-trip within one render.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/** Whether the current user has this article in their reading list. */
export async function getSavedStatus(pillar: string, slug: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('reading_list')
    .select('id')
    .eq('user_id', user.id)
    .eq('pillar', pillar)
    .eq('article_slug', slug)
    .single()
  return !!data
}

/** Whether the current user has marked this article complete. */
export async function getCompletedStatus(pillar: string, slug: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('article_reads')
    .select('id')
    .eq('user_id', user.id)
    .eq('pillar', pillar)
    .eq('article_slug', slug)
    .single()
  return !!data
}

/** All "<pillar>/<slug>" keys the current user has completed (for path progress). */
export async function getUserReadSet(): Promise<string[]> {
  const user = await getCurrentUser()
  if (!user) return []
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('article_reads')
    .select('pillar, article_slug')
    .eq('user_id', user.id)
  return (data ?? []).map(
    (r: { pillar: string; article_slug: string }) => `${r.pillar}/${r.article_slug}`
  )
}

import type { Comment, CommentWithReplies } from '@/types/comments'

/**
 * Groups a flat list of comment rows into top-level comments with nested replies.
 * Pure — no I/O. Preserves the input order within each level.
 */
export function buildCommentTree(rows: Comment[]): CommentWithReplies[] {
  const topLevel = rows.filter((c) => !c.parent_id)
  const replies = rows.filter((c) => c.parent_id)
  return topLevel.map((c) => ({
    ...c,
    replies: replies.filter((r) => r.parent_id === c.id),
  }))
}

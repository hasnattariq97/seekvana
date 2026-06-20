export type Comment = {
  id: string
  article_id: string
  parent_id: string | null
  name: string
  body: string
  is_flagged: boolean
  created_at: string
}

export type CommentWithReplies = Comment & {
  replies: Comment[]
}

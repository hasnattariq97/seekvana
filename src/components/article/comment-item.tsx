'use client'

import { useState, useTransition } from 'react'
import { CornerDownRight } from 'lucide-react'
import type { Comment, CommentWithReplies } from '@/types/comments'
import { postReply } from '@/lib/comment-actions'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-accent-soft text-accent font-medium text-sm flex items-center justify-center flex-shrink-0 select-none">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

interface ReplyFormProps {
  articleId: string
  parentId: string
  onSuccess: (reply: Comment) => void
  onCancel: () => void
}

function ReplyForm({ articleId, parentId, onSuccess, onCancel }: ReplyFormProps) {
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await postReply(articleId, parentId, name, body)
      if (result.error) {
        setError(result.error)
        return
      }
      onSuccess({
        id: crypto.randomUUID(),
        article_id: articleId,
        parent_id: parentId,
        name: name.trim(),
        body: body.trim(),
        is_flagged: false,
        created_at: new Date().toISOString(),
      })
      setName('')
      setBody('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <div>
        <input
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
        />
      </div>
      <div>
        <textarea
          placeholder="Write a reply… (min 10 characters)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none"
        />
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || !name.trim() || body.trim().length < 10}
          className="bg-accent text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-accent-deep transition disabled:opacity-60"
        >
          {isPending ? 'Posting…' : 'Post reply'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-secondary hover:text-primary transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

interface CommentItemProps {
  comment: CommentWithReplies
  articleId: string
}

export function CommentItem({ comment, articleId }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replies, setReplies] = useState<Comment[]>(comment.replies)

  function handleReplySuccess(reply: Comment) {
    setReplies((prev) => [...prev, reply])
    setShowReplyForm(false)
  }

  return (
    <div className="flex gap-3">
      <Avatar name={comment.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium text-primary">{comment.name}</span>
          <span className="text-xs text-secondary">{timeAgo(comment.created_at)}</span>
        </div>
        <p className="mt-1 text-sm text-primary leading-relaxed whitespace-pre-wrap break-words">
          {comment.body}
        </p>
        <button
          onClick={() => setShowReplyForm((v) => !v)}
          className="mt-2 flex items-center gap-1 text-xs text-secondary hover:text-accent transition"
        >
          <CornerDownRight className="h-3 w-3" />
          Reply
        </button>

        {showReplyForm && (
          <ReplyForm
            articleId={articleId}
            parentId={comment.id}
            onSuccess={handleReplySuccess}
            onCancel={() => setShowReplyForm(false)}
          />
        )}

        {replies.length > 0 && (
          <div className="mt-4 ml-2 border-l border-border pl-4 space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <Avatar name={reply.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-medium text-primary">{reply.name}</span>
                    <span className="text-xs text-secondary">{timeAgo(reply.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-primary leading-relaxed whitespace-pre-wrap break-words">
                    {reply.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

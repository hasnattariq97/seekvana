'use client'

import { useState, useTransition } from 'react'
import type { CommentWithReplies } from '@/types/comments'
import { CommentItem } from './comment-item'
import { postComment } from '@/lib/comment-actions'

interface ArticleCommentsProps {
  articleId: string
  initialComments: CommentWithReplies[]
}

export function ArticleComments({ articleId, initialComments }: ArticleCommentsProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>(initialComments)
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [bodyError, setBodyError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function validate(): boolean {
    let valid = true
    setNameError(null)
    setBodyError(null)
    if (!name.trim() || name.trim().length > 60) {
      setNameError('Name is required (max 60 characters).')
      valid = false
    }
    if (!body.trim() || body.trim().length < 10) {
      setBodyError('Comment must be at least 10 characters.')
      valid = false
    }
    if (body.trim().length > 1000) {
      setBodyError('Comment must be under 1000 characters.')
      valid = false
    }
    return valid
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    startTransition(async () => {
      const result = await postComment(articleId, name, body)
      if (result.error) {
        setBodyError(result.error)
        return
      }
      setComments((prev) => [
        {
          id: crypto.randomUUID(),
          article_id: articleId,
          parent_id: null,
          name: name.trim(),
          body: body.trim(),
          is_flagged: false,
          created_at: new Date().toISOString(),
          replies: [],
        },
        ...prev,
      ])
      setName('')
      setBody('')
    })
  }

  return (
    <section aria-label="Comments" className="mt-10">
      <h2 className="font-fraunces text-xl text-primary mb-6">
        Comments ({comments.length})
      </h2>

      {/* Top-level comment form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-surface p-5 space-y-4 mb-10"
      >
        <div>
          <input
            type="text"
            placeholder="Your name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
          />
          {nameError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
        </div>
        <div>
          <textarea
            placeholder="Share your thoughts, questions, or feedback… (min 10 characters)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {bodyError
              ? <p className="text-xs text-red-600 dark:text-red-400">{bodyError}</p>
              : <span />}
            <span className="text-xs text-secondary">{body.length}/1000</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-accent text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-accent-deep transition disabled:opacity-60"
        >
          {isPending ? 'Posting…' : 'Post comment →'}
        </button>
      </form>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-sm text-secondary py-6 text-center">
          Be the first to leave a comment.
        </p>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
            />
          ))}
        </div>
      )}
    </section>
  )
}

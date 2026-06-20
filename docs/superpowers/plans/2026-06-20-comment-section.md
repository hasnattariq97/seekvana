# Comment Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a native Supabase-backed comment section to every article page — anonymous (name required, no account), one level of replies, auto-flagging of spam.

**Architecture:** Comments are fetched server-side in `page.tsx` (no loading flash), then passed to a Client Component that handles optimistic UI for new posts and replies. All writes go through Server Actions that validate input and flag spam server-side.

**Tech Stack:** Next.js 15 App Router, Supabase JS (`@supabase/supabase-js`), Server Actions, Tailwind CSS variable tokens, TypeScript.

**Spec:** `docs/superpowers/specs/2026-06-20-comments-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/types/comments.ts` | Create | Shared `CommentWithReplies` type |
| `src/lib/comment-actions.ts` | Create | `postComment` + `postReply` Server Actions, spam flagging |
| `src/components/article/comment-item.tsx` | Create | Single comment row + reply thread + inline reply form |
| `src/components/article/article-comments.tsx` | Create | Full section: header, top-level form, comment list, empty state |
| `src/app/library/[pillar]/[slug]/page.tsx` | Modify | Fetch comments server-side, render `<ArticleComments />` |

---

## Task 1: Create the Supabase `comments` table

**Files:**
- Manual: Supabase SQL editor

- [ ] **Step 1: Run this SQL in your Supabase project → SQL Editor**

```sql
create table comments (
  id          uuid primary key default gen_random_uuid(),
  article_id  text not null,
  parent_id   uuid references comments(id) on delete cascade,
  name        text not null,
  body        text not null,
  is_flagged  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index on comments (article_id, created_at);
```

- [ ] **Step 2: Enable Row Level Security and add policies**

```sql
alter table comments enable row level security;

create policy "Anyone can read comments"
  on comments for select using (true);

create policy "Anyone can insert comments"
  on comments for insert with check (true);
```

- [ ] **Step 3: Verify in Supabase Table Editor**

Open Table Editor → confirm the `comments` table has columns: `id`, `article_id`, `parent_id`, `name`, `body`, `is_flagged`, `created_at`.

---

## Task 2: Shared type

**Files:**
- Create: `src/types/comments.ts`

- [ ] **Step 1: Create the type file**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/comments.ts
git commit -m "feat(comments): add shared Comment types"
```

---

## Task 3: Server Actions

**Files:**
- Create: `src/lib/comment-actions.ts`

- [ ] **Step 1: Create the actions file**

```ts
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
): Promise<{ error?: string }> {
  const n = name.trim()
  const b = body.trim()
  if (!n || n.length > 60) return { error: 'Name is required (max 60 characters).' }
  if (!b || b.length < 10) return { error: 'Comment must be at least 10 characters.' }
  if (b.length > 1000) return { error: 'Comment must be under 1000 characters.' }

  const { error } = await supabase().from('comments').insert({
    article_id: articleId,
    name: n,
    body: b,
    is_flagged: isFlagged(b),
  })

  if (error) return { error: 'Failed to post comment. Please try again.' }
  revalidatePath(`/library/${articleId}`)
  return {}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/comment-actions.ts
git commit -m "feat(comments): add postComment and postReply server actions"
```

---

## Task 4: CommentItem component

**Files:**
- Create: `src/components/article/comment-item.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/article/comment-item.tsx
git commit -m "feat(comments): add CommentItem component with reply support"
```

---

## Task 5: ArticleComments component

**Files:**
- Create: `src/components/article/article-comments.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
          {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
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
              ? <p className="text-xs text-red-500">{bodyError}</p>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/article/article-comments.tsx
git commit -m "feat(comments): add ArticleComments client component"
```

---

## Task 6: Wire comments into the article page

**Files:**
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

- [ ] **Step 1: Add the server-side fetch and import**

At the top of `page.tsx`, add these imports alongside the existing ones:

```ts
import { createClient } from '@supabase/supabase-js'
import type { CommentWithReplies } from '@/types/comments'
import { ArticleComments } from '@/components/article/article-comments'
```

- [ ] **Step 2: Add the fetch helper inside `ArticlePage`**

Inside the `ArticlePage` async function, after the `articleData` block and before the `return`, add:

```ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const { data: rawComments } = await supabase
  .from('comments')
  .select('*')
  .eq('article_id', `${pillar}/${slug}`)
  .order('created_at', { ascending: false })

const allRows = rawComments ?? []
const topLevel = allRows.filter((c) => !c.parent_id)
const replies = allRows.filter((c) => c.parent_id)
const comments: CommentWithReplies[] = topLevel.map((c) => ({
  ...c,
  replies: replies.filter((r) => r.parent_id === c.id),
}))
```

- [ ] **Step 3: Render `<ArticleComments />` in the JSX**

In the JSX, after `<ArticleFeedback />` and its `<hr>`, add:

```tsx
<hr className="border-border my-8" />
<ArticleComments
  articleId={`${pillar}/${slug}`}
  initialComments={comments}
/>
```

The bottom of the center column should now read:

```tsx
{/* Feedback */}
<hr className="border-border my-8" />
<ArticleFeedback />

{/* Comments */}
<hr className="border-border my-8" />
<ArticleComments
  articleId={`${pillar}/${slug}`}
  initialComments={comments}
/>

{/* Prev/Next + Related */}
<ArticleNav pillar={pillar} slug={slug} />
```

- [ ] **Step 4: Commit**

```bash
git add src/app/library/\[pillar\]/\[slug\]/page.tsx
git commit -m "feat(comments): fetch comments server-side and render on article page"
```

---

## Task 7: Build verification

**Files:** None

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: exits with code 0, no TypeScript or Next.js errors.

- [ ] **Step 2: Start dev server and verify manually**

```bash
npm run dev
```

Open any article page (e.g. `http://localhost:3000/library/agentic-ai/what-is-an-agent`).

Verify:
1. Comment section appears below the feedback widget
2. "Be the first to leave a comment." shows initially
3. Submitting with no name → name error shown
4. Submitting with < 10 chars → body error shown
5. Valid submit → comment appears immediately at top, form clears
6. "Reply ↩" expands inline form under a comment
7. Valid reply → appears indented under the comment
8. Reply button does not appear on replies (one level only)
9. Character counter updates as you type

- [ ] **Step 3: Verify in Supabase**

Open Supabase Table Editor → `comments` table. Confirm rows were inserted with correct `article_id`, `name`, `body`, `is_flagged`.

- [ ] **Step 4: Final commit if any lint fixes needed**

```bash
npm run lint
git add -A
git commit -m "fix(comments): address lint warnings"
```

# Comment Section — Design Spec
**Date:** 2026-06-20  
**Status:** Approved

---

## Overview

Add a native comment section to every article page, backed by Supabase. Anonymous (name required, no account), one level of replies, auto-flagging of spam. Comments load server-side to avoid flash.

---

## Database Schema

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

- `article_id` — `"{pillar}/{slug}"` string, e.g. `"agentic-ai/what-is-an-agent"`
- `parent_id` — null = top-level; non-null = reply (max one level deep)
- `is_flagged` — set server-side if body contains `http` or common spam patterns
- RLS: `anon` role can `SELECT` and `INSERT` only; no `UPDATE` or `DELETE`

---

## Architecture

**Approach:** Server-fetched list + Server Actions for writes.

- `page.tsx` fetches top-level comments + their replies server-side via Supabase server client, passes as prop — no loading flash
- `actions.ts` handles all inserts server-side, including flagging logic
- Client Component manages optimistic UI — new comments/replies appear instantly

---

## File Structure

```
src/
  app/
    library/[pillar]/[slug]/
      page.tsx          (updated) fetch comments, pass to ArticleComments
      actions.ts        (new) postComment, postReply Server Actions
  components/
    article/
      article-comments.tsx   (new) Client Component — list + top-level form
      comment-item.tsx       (new) single comment + reply thread + reply form toggle
```

---

## Flagging Logic (server-side, in actions.ts)

A comment is auto-flagged (`is_flagged = true`) if its body:
- Contains `http` (any URL)
- Matches common spam patterns (e.g. "buy now", "click here", "free money")

Flagged comments still appear to readers — they are only marked in the DB for manual review in Supabase dashboard.

---

## UI Spec

**Placement:** Below `<ArticleFeedback />` on the center column, separated by `<hr className="border-border my-8" />`.

### Comment form
- Name input (required, `max 60 chars`)
- Textarea (required, `min 10 chars`, `max 1000 chars`, 4 rows)
- Submit button: `bg-accent text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-accent-deep`
- Validation errors shown inline below each field in `text-red-500 text-xs`
- On submit: optimistic insert → form clears → comment appears at top of list

### Comment list
- Newest first
- Avatar: first letter of name in `w-8 h-8 rounded-full bg-accent-soft text-accent font-medium text-sm` circle
- Name in `text-sm font-medium text-primary`, date in `text-xs text-secondary`
- Body in `text-sm text-primary leading-relaxed`
- "Reply ↩" ghost button below each top-level comment
- Replies indented with `ml-10 border-l border-border pl-4`

### Reply form
- Expands inline below the comment on "Reply ↩" click
- Same fields as top-level form (name + message)
- "Cancel" link collapses it without submitting
- Replies cannot themselves have a Reply button (one level only)

### Empty state
- "Be the first to leave a comment." in `text-secondary text-sm`

### Section header
- `font-fraunces text-xl text-primary` — e.g. "Comments (12)"

---

## Constraints

- All colors via CSS variable tokens only (no hardcoded hex)
- All corners `rounded-xl` (containers) / `rounded-lg` (buttons, inputs)
- Tailwind classes only, no inline styles
- No auth required — name is free text
- `next/image` not applicable here (no images)

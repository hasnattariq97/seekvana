# Profile Pages Design

**Date:** 2026-06-27  
**Status:** Approved

---

## Overview

Four profile routes: `/profile`, `/profile/reading-list`, `/profile/progress`, `/profile/settings`. Accessed via navbar avatar dropdown. Goal: gamified motivation hub + opt-in social identity.

---

## Design Decisions

- **Gamified** — streaks, badges, progress rings
- **Social** — public profile opt-in (`/u/username`), not Google-indexed (`noindex`)
- **Private by default** — user explicitly toggles public on settings page
- **Badges earned by:** 7-day streak, 30-day streak, path completion, 10 articles in a pillar
- **Progress granularity:** lesson-level + path-level, with resume button
- **Reading list status:** manual — "Mark as read" button at bottom of every article
- **Save to reading list:** bookmark icon on every article page

---

## Database Schema (Supabase)

### `user_profiles`
| Column | Type | Notes |
|---|---|---|
| user_id | uuid (PK, FK auth.users) | |
| display_name | text | nullable, falls back to email prefix |
| is_public | boolean | default false |
| created_at | timestamptz | |

### `reading_list`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK |  |
| user_id | uuid FK |  |
| pillar | text | e.g. "agentic-ai" |
| article_slug | text | e.g. "what-is-an-agent" |
| saved_at | timestamptz |  |
| read_at | timestamptz | null = pending |

### `article_reads`
Tracks explicit "Mark as read" events. Used for streak calculation and path progress.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK |  |
| user_id | uuid FK |  |
| pillar | text |  |
| article_slug | text |  |
| path_slug | text | nullable — set if article is a path lesson |
| read_at | timestamptz |  |

Unique constraint: `(user_id, pillar, article_slug)` — one read record per article per user.

### Streak calculation
Computed client-side from `article_reads`: count consecutive calendar days with at least one `read_at` up to today.

### Badge calculation
Computed from existing tables — no separate badge table needed:
- **7-day streak / 30-day streak** — from streak calculation above
- **Path complete** — all lessons in a path present in `article_reads`
- **Pillar mastery (10 articles)** — count `article_reads` rows per pillar ≥ 10

---

## Pages

### `/profile` — Showcase dashboard

**Layout:** dark hero band + stats row + two-column body

**Hero band (dark bg):**
- Avatar (initials, clay background)
- Display name + member since date
- Stat chips: streak, articles read, paths completed
- Edit profile button
- Public profile toggle (on/off)

**Stats row (4 columns):**
Articles read · Day streak · Paths completed · Badges earned

**Body (2-col grid):**
- Left: Badges grid — earned (full opacity) + locked (35% opacity, shows progress hint)
- Right: Currently learning — in-progress paths with progress bars + Continue buttons

**Auth gate:** redirect to homepage with auth modal if not logged in.

---

### `/profile/reading-list` — Saved articles

**Header:** title + count summary (X saved · X read · X pending)

**Filter tabs:** All · Pending · Read

**Article rows:**
- Pillar emoji icon + pillar badge + difficulty badge
- Title (truncated) + read time + saved date
- Status badge: amber "Pending" or green "✓ Read"
- CTA: "Read →" (pending) or "Reread" (read) + × remove button

**Bookmark button on article pages:**
- Lucide `Bookmark` icon in article header area
- Filled when saved, outline when not
- Requires auth — triggers auth modal if logged out
- Optimistic UI toggle, writes to `reading_list` table

---

### `/profile/progress` — Learning path progress

**Three sections (in order):**

**In Progress** — full card per path:
- Colored left border (path color)
- Title + progress bar + "X / Y lessons"
- Continue button (links to next unread lesson)
- Expanded lesson checklist: ✓ complete (strikethrough) · → next (highlighted accent) · ○ upcoming

**Completed** — 2-col grid of compact cards with graduation cap emoji

**Not Started** — dimmed cards with Start button

**Mark as read button on article pages:**
- Appears at bottom of every article
- "Mark as complete" — writes to `article_reads`
- If article belongs to a path (`lessonModule` in frontmatter), also updates path progress
- Changes to "✓ Completed" after click

---

### `/profile/settings` — Account settings

**Three sections:**

**Profile:**
- Display name (editable inline)
- Email (read-only, verified badge)
- Public profile toggle

**Notifications:**
- Weekly digest toggle (email)
- Streak reminder toggle (email when streak at risk)

**Account:**
- Sign-in method (read-only)
- Delete account (destructive, requires confirmation dialog)

---

## Article Page Changes

Two new UI elements added to every article page:

1. **Bookmark icon** — top of article near title. Saves to `reading_list`.
2. **Mark as complete button** — bottom of article above prev/next nav. Writes to `article_reads`.

Both require auth — show auth modal if logged out.

---

## Public Profile (`/u/[username]`)

- Route: `src/app/u/[username]/page.tsx`
- Shows same layout as `/profile` but read-only, no edit controls
- Only renders if `user_profiles.is_public = true` — else 404
- `<meta name="robots" content="noindex">` on all `/u/` pages
- `username` derived from display_name slug or user_id prefix

---

## Auth Gates

All four `/profile/*` routes: if no session, redirect to `/?auth=required` which opens the auth modal.

---

## Out of Scope

- Email sending for notifications (toggle saved to DB, actual emails deferred)
- Avatar image upload (initials only for now)
- Social features (following, activity feeds)

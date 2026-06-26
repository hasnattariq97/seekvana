# Auth + Newsletter — Design Spec
**Date:** 2026-06-26  
**Status:** Approved

---

## 1. Auth System

### Goal
Let users sign in to unlock social (comments) and personalization (progress tracking, streaks, reading list).

### Method
- **Magic link** (passwordless email link) + **Google OAuth**
- No passwords. Magic link IS the recovery mechanism.
- Supabase Auth handles both providers (already wired).

### UI Pattern: Modal Overlay
- Triggered by: "Get started" button in navbar, "Sign in to comment" prompt, any gated feature nudge
- Centered modal, `backdrop-blur-sm bg-black/50` overlay
- Framer Motion: `opacity 0→1, scale 0.97→1, duration 200ms`
- Close: Escape key or backdrop click
- Mobile: modal fills bottom 90% of screen (bottom sheet style)

### Modal States

**State 1 — Sign In Form**
```
[Seekvana logo icon]
"Welcome to Seekvana"
"Track progress · Comment · Save articles"

[Continue with Google]  ← Google first, highest conversion

─── or email ───

[your@email.com input]
[Send magic link →]  ← bg-accent

"By signing in you agree to our Terms"
[× close]
```

**State 2 — Magic Link Sent**
```
📬
"Check your inbox"
"We sent a magic link to [email]"
[email shown in text-accent]
Info box: "Click the link in your email. Expires in 1 hour."
"Wrong email? Try again" link
```

**State 3 — Signed In (navbar)**
- "Get started" button replaced by user avatar (circle, initials, bg-accent)
- Avatar click opens dropdown

**Profile Dropdown**
```
[Name]
[email]
─────
📚 My Reading List   → /profile/reading-list
🏆 My Progress       → /profile/progress  
⚙️ Settings          → /profile/settings
─────
Sign out
```

### New Routes
- `/auth/callback` — Supabase redirect handler (magic link + OAuth callback)
- `/profile/reading-list` — saved articles (Phase 2 scope)
- `/profile/progress` — learning path progress (Phase 2 scope)
- `/profile/settings` — email prefs, display name (Phase 2 scope)

> Profile pages are stubs in this phase. Auth flow + navbar state change is the full scope here.

### Supabase Setup
- Enable Email (magic link) provider in Supabase Auth settings
- Enable Google OAuth provider (needs Google Cloud Console client ID + secret)
- Set redirect URL: `https://seekvana.com/auth/callback` (+ localhost for dev)
- Server-side session via `@supabase/ssr` middleware — already installed

### New `.env.local` vars needed
```
GOOGLE_CLIENT_ID=...       # from Google Cloud Console
GOOGLE_CLIENT_SECRET=...   # from Google Cloud Console
```
Add these in Supabase dashboard under Auth → Providers → Google.

### Files to Create/Modify
| File | Change |
|---|---|
| `src/middleware.ts` | New — Supabase session refresh on every request |
| `src/lib/supabase-server.ts` | New — server client (cookies) |
| `src/components/auth/auth-modal.tsx` | New — modal with both states |
| `src/context/auth-context.tsx` | New — session state, `useAuth()` hook |
| `src/app/auth/callback/route.ts` | New — exchange code for session |
| `src/components/layout/navbar.tsx` | Modify — signed-in state + avatar dropdown |

---

## 2. Newsletter

### Goal
Convert readers into subscribers. Lead magnet (free AI Tools Cheatsheet) + weekly content digest. Aspirational positioning: "world's #1 AI learning platform."

### Provider
Supabase `newsletter_subscribers` table (stores email + subscribed_at + confirmed bool).  
No third-party email service in scope for this phase — just capture emails. Wire to Resend/Mailchimp later.

### Placement 1: Homepage Section
- Full-width split layout — sits between RecentArticles and Footer
- Left: copy + form. Right: 3D-tilted cheatsheet mockup visual.
- Copy:
  - Eyebrow: `FREE WEEKLY NEWSLETTER`
  - H2: "The AI knowledge you actually need"
  - Body: "New articles, tool picks, and practical guides every Tuesday — written for humans, not hype merchants."
  - Checkmarks: "✓ Free AI Tools Cheatsheet on signup" · "✓ No spam, ever"
  - Social proof: "Join 10,000+ learners · Unsubscribe anytime"
- CTA button: "Get it free →" bg-accent

### Placement 2: Post-Article Card
- Dark card (bg-primary/`#1c1b19`) with clay accent circles — appears below article body, above prev/next navigation
- Eyebrow: "ENJOYED THIS ARTICLE?"
- H3: "Get the best of Seekvana every Tuesday"
- Body: "New articles, AI tool picks, and practical guides. Free cheatsheet on signup."
- Inline form: email input + "Subscribe free" button
- Decorative: 📬 emoji, subtle radial glow circles

### Success State (both placements)
- Form replaced in-place (no page reload) with:
  - 🎉 "You're in!"
  - "First issue lands Tuesday. Check your inbox for the free cheatsheet."
  - "Download Cheatsheet →" button (links to PDF asset)
- Framer Motion: `AnimatePresence` swap, `opacity 0→1, y 8→0`

### Error States
- Empty submit → shake animation on input, "Please enter your email"
- Invalid email → inline error below input
- Already subscribed → "You're already on the list! 🎉"
- Server error → "Something went wrong. Try again?"

### Supabase Table
```sql
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  confirmed boolean default false,
  source text -- 'homepage' | 'post-article'
);
```

### API Route
`POST /api/newsletter/subscribe`  
Body: `{ email: string, source: string }`  
Returns: `{ success: boolean, message: string }`  
Validates email, inserts to Supabase, returns appropriate message for already-subscribed case.

### Files to Create/Modify
| File | Change |
|---|---|
| `src/components/newsletter/newsletter-section.tsx` | New — homepage split section |
| `src/components/newsletter/post-article-newsletter.tsx` | New — dark card variant |
| `src/components/newsletter/newsletter-form.tsx` | New — shared form logic (used by both) |
| `src/app/api/newsletter/subscribe/route.ts` | New — POST handler |
| `src/app/page.tsx` | Modify — add NewsletterSection between RecentArticles and Footer |
| `src/app/library/[pillar]/[slug]/page.tsx` | Modify — add PostArticleNewsletter above prev/next nav |

---

## 3. Shared Decisions

- **No Zustand** — auth state via React Context (`useAuth`), newsletter form state is local
- **Framer Motion** already installed — use for modal, success swap, form shake
- **No external auth library** (NextAuth etc.) — Supabase Auth is sufficient and already installed
- **`next/navigation` `useRouter`** for post-auth redirect back to the page user came from (store `returnTo` in session storage before opening modal)

---

## 4. Out of Scope (this phase)

- Profile pages content (reading list, progress tracking)
- Email sending / drip campaigns
- Cheatsheet PDF (placeholder download link is fine)
- Social features beyond comments (already built)
- Streak system (data model only, no UI)

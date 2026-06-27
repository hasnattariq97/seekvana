# Newsletter Email Sending — Design Spec

## Goal

Wire up Resend so that:
1. Subscribers receive a branded welcome email immediately on signup
2. Subscribers can unsubscribe via a link in any email
3. Weekly broadcasts are sent manually via Resend dashboard (no custom UI needed)

## Architecture

Resend handles all email delivery. The subscribe API gains one extra step: after inserting to Supabase, it calls Resend to send the welcome email. A new unsubscribe API route validates a token and marks the subscriber inactive. React Email provides branded email templates.

Supabase `newsletter_subscribers` table gains two columns:
- `unsubscribe_token` — UUID generated at insert time, used in unsubscribe link
- `status` — `active` | `unsubscribed`, default `active`

## Email Provider

**Resend** — free tier 3k emails/month, React Email support, simple Node.js SDK.

From address: `hello@seekvana.com` (requires seekvana.com domain verified in Resend).
Until domain verified: use Resend's onboarding sandbox address.

## Welcome Email

- Triggered: immediately after successful subscribe insert
- Subject: "You're in — here's your free AI cheatsheet 🎉"
- Content: warm confirmation, cheatsheet download link (placeholder `#` for now), unsubscribe link
- Template: React Email component, brand colors (clay accent `#C9633F`, warm cream bg `#FAF8F3`, Fraunces-style heading via web-safe fallback)

## Unsubscribe Flow

- Every email contains: `https://seekvana.com/api/newsletter/unsubscribe?token=<uuid>`
- `GET /api/newsletter/unsubscribe?token=xxx` finds subscriber by token, sets `status = 'unsubscribed'`, redirects to `/unsubscribed`
- `/unsubscribed` page: simple confirmation "You've been removed from the list."

## Resend Broadcasts (manual, no code)

Export active subscribers from Supabase → upload to Resend Audience → compose in Resend dashboard → send. No code needed for this flow.

## Files

| File | Action | Purpose |
|---|---|---|
| `src/emails/welcome.tsx` | Create | React Email welcome template |
| `src/lib/resend.ts` | Create | Resend client singleton |
| `src/app/api/newsletter/subscribe/route.ts` | Modify | Add token generation + Resend welcome email call |
| `src/app/api/newsletter/subscribe/route.test.ts` | Modify | Add tests for token generation + email sending |
| `src/app/api/newsletter/unsubscribe/route.ts` | Create | Unsubscribe handler |
| `src/app/api/newsletter/unsubscribe/route.test.ts` | Create | Unsubscribe tests |
| `src/app/unsubscribed/page.tsx` | Create | Confirmation page |

# Cookie Consent Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gate Google Analytics and Google AdSense behind real, granular visitor consent (Accept All / Decline All / Manage), satisfying Google's AdSense EU User Consent Policy and GDPR/UK-GDPR/CCPA, without breaking the site's Cache Components (PPR) prerendering that a concurrent PR just shipped.

**Architecture:** A pure cookie-parsing module (`src/lib/consent.ts`) backs a single Suspense-isolated Server Component island (`ConsentGate`) that reads the consent cookie and conditionally renders the GA/AdSense `<script>` tags plus the banner UI (`CookieBanner`, a client component covering collapsed/expanded/reopened states). The cookie read is isolated behind its own `<Suspense>` boundary in the root layout — required because `cacheComponents: true` is already enabled sitewide, and an unguarded `cookies()` read in the root layout would force every page back to dynamic rendering.

**Tech Stack:** Next.js 16.2.9 App Router (React 19.2.4), `next/headers` `cookies()`, plain `document.cookie` client-side writes, Vitest 4 for the pure-logic unit tests. No new dependencies.

---

## Reality check vs. the design spec

The spec at `docs/superpowers/specs/2026-07-18-cookie-consent-banner-design.md` already reflects two corrections found while writing this plan (both explained inline in the spec, dated 2026-07-18):

1. **`cacheComponents: true` is already live** (from a separately-merged PR #7) — the consent cookie read MUST be Suspense-isolated in its own island (`ConsentGate`), not called directly in the root layout body, or it re-breaks the whole site's prerendering.
2. **`Footer` is only rendered on the homepage** (verified via repo-wide grep) — the "reopen preferences later" affordance is NOT a footer link (unreachable from 99% of pages); it's a small persistent tab rendered by `CookieBanner` itself, sitewide via the root layout.

Read the spec once before starting — this plan implements it exactly, including those two corrections.

---

## File Structure

**New files**
- `src/lib/consent.ts` — types (`ConsentCategories`, `ConsentState`), constants (`CONSENT_COOKIE_NAME`, `CONSENT_COOKIE_MAX_AGE_SECONDS`), pure `parseConsentCookie()`, server `getConsent()`.
- `src/lib/consent.test.ts` — unit tests for `parseConsentCookie()`.
- `src/components/consent/cookie-banner.tsx` — client component: collapsed bar, expanded Manage panel, persistent reopen tab. Owns all its own UI state.
- `src/components/consent/consent-gate.tsx` — async Server Component: calls `getConsent()`, renders conditional GA/AdSense scripts + `<CookieBanner>`.

**Modified files**
- `src/app/layout.tsx` — remove the three script tags from `<head>` (lines 76-78); add `<Suspense fallback={null}><ConsentGate /></Suspense>` in `<body>`.
- `src/app/privacy/page.tsx` — Section 3 gets a short addition: mention of the consent banner, and a new `#do-not-sell` anchor with the CCPA-required "Do Not Sell or Share" statement.

**Unchanged** — everything else. No changes to Supabase, auth, or any other page.

---

## Task 1: Pure consent-cookie parsing + unit tests

**Files:**
- Create: `src/lib/consent.ts`
- Test: `src/lib/consent.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/consent.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseConsentCookie } from './consent'

describe('parseConsentCookie', () => {
  it('returns null when the cookie is missing', () => {
    expect(parseConsentCookie(undefined)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(parseConsentCookie('')).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    expect(parseConsentCookie('{not json')).toBeNull()
  })

  it('returns null when required fields are the wrong type', () => {
    expect(parseConsentCookie(JSON.stringify({ analytics: 'yes', advertising: true }))).toBeNull()
  })

  it('returns null when a required field is missing', () => {
    expect(parseConsentCookie(JSON.stringify({ analytics: true }))).toBeNull()
  })

  it('parses a valid all-true payload', () => {
    expect(parseConsentCookie(JSON.stringify({ analytics: true, advertising: true }))).toEqual({
      analytics: true,
      advertising: true,
    })
  })

  it('parses a valid mixed payload', () => {
    expect(parseConsentCookie(JSON.stringify({ analytics: true, advertising: false }))).toEqual({
      analytics: true,
      advertising: false,
    })
  })

  it('ignores extra unknown fields rather than rejecting them', () => {
    expect(
      parseConsentCookie(JSON.stringify({ analytics: false, advertising: false, extra: 'ignored' }))
    ).toEqual({ analytics: false, advertising: false })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/consent.test.ts`
Expected: FAIL — cannot resolve `./consent` (file not created yet).

- [ ] **Step 3: Write the implementation**

`src/lib/consent.ts`:

```ts
import { cookies } from 'next/headers'

export interface ConsentCategories {
  analytics: boolean
  advertising: boolean
}

export type ConsentState = ConsentCategories | null

export const CONSENT_COOKIE_NAME = 'seekvana_consent'
export const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 * 6 // ~6 months

/**
 * Parses the raw consent cookie value. Pure — no I/O.
 * Fails closed to null (treated as "no decision yet") on anything
 * malformed, missing, or wrong-shaped, rather than half-trusting it.
 */
export function parseConsentCookie(raw: string | undefined): ConsentState {
  if (!raw) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).analytics !== 'boolean' ||
    typeof (parsed as Record<string, unknown>).advertising !== 'boolean'
  ) {
    return null
  }
  const { analytics, advertising } = parsed as ConsentCategories
  return { analytics, advertising }
}

/** Server-side read of the current visitor's consent state. */
export async function getConsent(): Promise<ConsentState> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(CONSENT_COOKIE_NAME)?.value
  return parseConsentCookie(raw)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/consent.test.ts`
Expected: PASS — 8 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/consent.ts src/lib/consent.test.ts
git commit -m "feat: add consent-cookie parsing with unit tests"
```

---

## Task 2: Build `CookieBanner` (collapsed bar + expanded Manage panel + reopen tab)

**Files:**
- Create: `src/components/consent/cookie-banner.tsx`

This is the only stateful piece: `useState` tracks a view mode `'hidden' | 'collapsed' | 'expanded'`, derived on mount from `initialConsent` (`null` → `'collapsed'`; non-null → `'hidden'`, with a persistent small tab always shown once a decision exists so the visitor can get back to `'expanded'`).

- [ ] **Step 1: Write the component**

`src/components/consent/cookie-banner.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ConsentCategories, ConsentState } from '@/lib/consent'
import { CONSENT_COOKIE_NAME, CONSENT_COOKIE_MAX_AGE_SECONDS } from '@/lib/consent'

interface CookieBannerProps {
  initialConsent: ConsentState
}

type ViewMode = 'collapsed' | 'expanded' | 'tab'

function writeConsentCookie(value: ConsentCategories) {
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(value)
  )}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function CookieBanner({ initialConsent }: CookieBannerProps) {
  const router = useRouter()
  const [mode, setMode] = useState<ViewMode>(initialConsent === null ? 'collapsed' : 'tab')
  const [analytics, setAnalytics] = useState(initialConsent?.analytics ?? false)
  const [advertising, setAdvertising] = useState(initialConsent?.advertising ?? false)

  function apply(value: ConsentCategories) {
    writeConsentCookie(value)
    setAnalytics(value.analytics)
    setAdvertising(value.advertising)
    setMode('tab')
    router.refresh()
  }

  if (mode === 'tab') {
    return (
      <button
        onClick={() => setMode('expanded')}
        aria-label="Cookie preferences"
        className="fixed left-4 bottom-4 z-40 flex items-center gap-1.5 bg-surface hover:bg-surface-subtle text-secondary hover:text-primary text-xs font-medium px-3 py-2 rounded-full border border-border shadow-lg transition-colors"
      >
        🍪 Cookie preferences
      </button>
    )
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 bg-surface border-t border-border shadow-[0_-4px_16px_rgba(26,23,20,0.08)]">
      <div className="max-w-screen-xl mx-auto px-5 py-4">
        {mode === 'collapsed' && (
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <p className="text-xs text-secondary flex-1">
              We use cookies to analyze site traffic and show personalized advertising.
              Necessary cookies are always on. See our{' '}
              <a href="/privacy" className="text-accent underline underline-offset-2">
                Privacy Policy
              </a>{' '}
              for details.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setMode('expanded')}
                className="text-xs font-medium text-secondary hover:text-primary underline underline-offset-2 px-2"
              >
                Manage
              </button>
              <button
                onClick={() => apply({ analytics: false, advertising: false })}
                className="text-xs font-medium px-3.5 py-2 rounded-lg border border-border text-primary hover:bg-surface-subtle transition-colors"
              >
                Decline All
              </button>
              <button
                onClick={() => apply({ analytics: true, advertising: true })}
                className="text-xs font-medium px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-deep text-white transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        )}

        {mode === 'expanded' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-primary">Manage cookie preferences</p>

            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="text-xs font-medium text-primary">Analytics</p>
                <p className="text-xs text-secondary">Helps us understand how visitors use Seekvana.</p>
              </div>
              <button
                role="switch"
                aria-checked={analytics}
                onClick={() => setAnalytics((v) => !v)}
                className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
                  analytics ? 'bg-accent' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    analytics ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="text-xs font-medium text-primary">Advertising</p>
                <p className="text-xs text-secondary">Used to show personalized ads via Google AdSense.</p>
              </div>
              <button
                role="switch"
                aria-checked={advertising}
                onClick={() => setAdvertising((v) => !v)}
                className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
                  advertising ? 'bg-accent' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    advertising ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-secondary">
              Necessary cookies (like keeping you signed in) are always on and aren&apos;t covered here.{' '}
              <a href="/privacy" className="text-accent underline underline-offset-2">
                Privacy Policy
              </a>{' '}
              ·{' '}
              <a href="/privacy#do-not-sell" className="text-accent underline underline-offset-2">
                Do Not Sell or Share My Info
              </a>
            </p>

            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => apply({ analytics: false, advertising: false })}
                className="text-xs font-medium px-3.5 py-2 rounded-lg border border-border text-primary hover:bg-surface-subtle transition-colors"
              >
                Decline All
              </button>
              <button
                onClick={() => apply({ analytics, advertising })}
                className="text-xs font-medium px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-deep text-white transition-colors"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/consent/cookie-banner.tsx
git commit -m "feat: add CookieBanner (collapsed bar, manage panel, reopen tab)"
```

---

## Task 3: Build `ConsentGate` (the Suspense-isolated island)

**Files:**
- Create: `src/components/consent/consent-gate.tsx`

- [ ] **Step 1: Write the component**

`src/components/consent/consent-gate.tsx`:

```tsx
import { getConsent } from '@/lib/consent'
import { CookieBanner } from './cookie-banner'

export async function ConsentGate() {
  const consent = await getConsent()

  return (
    <>
      {consent?.analytics && (
        <>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-CX5PQDJSZD" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CX5PQDJSZD');`,
            }}
          />
        </>
      )}
      {consent?.advertising && (
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4583972977988838"
          crossOrigin="anonymous"
        />
      )}
      <CookieBanner initialConsent={consent} />
    </>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/consent/consent-gate.tsx
git commit -m "feat: add ConsentGate — conditional GA/AdSense scripts + banner"
```

---

## Task 4: Wire `ConsentGate` into the root layout (remove unconditional scripts)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read the current file**

Confirm the three script tags are still at `<head>` lines ~76-78 exactly as:

```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CX5PQDJSZD"></script>
<script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CX5PQDJSZD');` }} />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4583972977988838" crossOrigin="anonymous"></script>
```

If the surrounding file differs meaningfully from what's described, STOP and report rather than guessing.

- [ ] **Step 2: Remove the three script tags from `<head>`**

Delete those three lines. `<head>` should afterward contain only the `preconnect` links — nothing else.

- [ ] **Step 3: Add the `ConsentGate` import**

Add near the other component imports:

```tsx
import { ConsentGate } from "@/components/consent/consent-gate";
```

- [ ] **Step 4: Render `ConsentGate` inside `<body>`, Suspense-wrapped**

Inside `<body>`, alongside the other body-level singletons (`AuthModal`, `SideFeedback`), add:

```tsx
<Suspense fallback={null}>
  <ConsentGate />
</Suspense>
```

Placement doesn't need to be adjacent to those specific components, but it must be inside `<body>` (not `<head>`) and must be wrapped in its own `<Suspense>` — do not remove or merge this boundary with the existing `<Suspense fallback={null}><ScrollToTop /><ProgressBar /></Suspense>` block; keep it as a separate, dedicated boundary so a slow/failing consent read can never affect `ScrollToTop`/`ProgressBar` or vice versa.

`Suspense` is already imported in this file (used by the `ScrollToTop`/`ProgressBar` block) — no new import needed for it.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `src/app/layout.tsx`.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: 0 new errors (pre-existing unrelated warnings elsewhere are fine).

- [ ] **Step 7: Verify the Cache Components precondition holds**

Run: `npm run build`
Expected: build succeeds. Specifically check that `/library/[pillar]/[slug]`, `/paths/[slug]`, `/library/[pillar]`, `/glossary/[term]`, and `/u/[username]` still show `◐` (Partial Prerender) or better in the route summary — **not** a regression back to `ƒ Dynamic` on any of them. If any route that was `◐` before this task is now `ƒ`, the Suspense boundary around `ConsentGate` is not correctly isolating the `cookies()` read — stop and re-check Step 4 before proceeding; do not paper over it by moving on.

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: gate GA/AdSense behind consent, isolated in its own Suspense boundary"
```

---

## Task 5: Add CCPA "Do Not Sell or Share" section to the privacy page

**Files:**
- Modify: `src/app/privacy/page.tsx`

- [ ] **Step 1: Read the current Section 3 ("Advertising & Cookies")**

Confirm it still matches the content read during brainstorming (starts `<h2 ...>3. Advertising & Cookies</h2>`, ends with the "manage or disable cookies... browser settings" paragraph, around lines 54-98).

- [ ] **Step 2: Add a short note about the new banner, plus the CCPA anchor**

Insert, right after the opening `<div className="space-y-3 text-secondary leading-relaxed">` of Section 3 (i.e. as the new first paragraph of that section, before the existing "We display advertisements..." paragraph):

```tsx
<p>
  When you first visit Seekvana, a cookie banner lets you accept, decline, or
  customize analytics and advertising cookies. You can change your choice at
  any time using the &ldquo;Cookie preferences&rdquo; tab shown in the bottom-left
  corner of any page.
</p>
```

Then, add a new subsection right after Section 3 closes (i.e. a new `<section>` between the existing Section 3 and Section 4 "Affiliate Links"), renumbering Section 4 onward is **not** required — add it as `3a` in heading text to avoid renumbering every subsequent section:

```tsx
<section id="do-not-sell">
  <h2 className="font-fraunces text-xl text-primary mb-3">3a. Do Not Sell or Share My Personal Information (California)</h2>
  <div className="space-y-3 text-secondary leading-relaxed">
    <p>
      If you are a California resident, you have the right to opt out of the
      &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of your personal information under the
      CCPA/CPRA. Declining or disabling &ldquo;Advertising&rdquo; cookies in our cookie
      preferences banner (available via the &ldquo;Cookie preferences&rdquo; tab on any
      page) stops the sharing of your data with Google for ad personalization,
      which satisfies this request.
    </p>
    <p>
      You can also opt out directly through{' '}
      <a href="https://www.google.com/settings/ads" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
        Google Ads Settings
      </a>
      .
    </p>
  </div>
</section>
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit` and `npm run lint`
Expected: no errors in this file.

- [ ] **Step 4: Commit**

```bash
git add src/app/privacy/page.tsx
git commit -m "docs: add CCPA Do Not Sell/Share section to privacy page"
```

---

## Task 6: Manual verification (no automated test harness exists for this UI)

This repo has no React component test infrastructure (Vitest covers pure logic and server actions only) — verify by hand, exactly as documented in the spec's Testing section.

- [ ] **Step 1: Production build + serve**

Run: `npm run build` then `npm run start` (or `npx next start -p 3001` if port 3000 is occupied by another running dev server — check with `netstat` first, never kill a process you didn't start without confirming with the user).

- [ ] **Step 2: Fresh-visitor check (clear cookies first)**

Open the homepage in a private/incognito window (guarantees no existing consent cookie). Confirm:
- The collapsed bar appears at the bottom, with Manage / Decline All / Accept All all visible and roughly equal in size/weight (no button noticeably smaller, greyed out, or link-styled while another is a solid button).
- **View page source** (not DevTools Elements, which shows the live DOM after scripts may have run — use actual "View Page Source" or a plain `curl`/`Invoke-WebRequest` fetch of the HTML) and confirm zero occurrences of `googletagmanager.com` or `googlesyndication.com` anywhere in the raw HTML.

- [ ] **Step 3: Accept All**

Click Accept All. Confirm the bar disappears and the small "🍪 Cookie preferences" tab appears bottom-left. Reload the page and **view page source** again — confirm both `googletagmanager.com` and `googlesyndication.com` script tags are now present.

- [ ] **Step 4: Decline All (fresh incognito window)**

Repeat Step 2 in a new private window, click Decline All instead. Confirm the tab appears, but page source after reload still has **zero** occurrences of either script domain.

- [ ] **Step 5: Manage → partial consent**

Fresh private window → click Manage → toggle only Analytics on (Advertising stays off) → Save preferences. Reload, view source: `googletagmanager.com` present, `googlesyndication.com` absent.

- [ ] **Step 6: Reopen tab works from a non-homepage page**

With a decision already made (any of the above), navigate to an article page (e.g. `/library/agentic-ai/chatbot-vs-agent`) and a path page (e.g. `/paths/getting-started`). Confirm the "🍪 Cookie preferences" tab is visible on **both** — not just the homepage — and clicking it reopens the expanded Manage panel with the previously-saved toggle states correctly reflected.

- [ ] **Step 7: Privacy page**

Visit `/privacy`, confirm the new banner-mention paragraph and the new "3a. Do Not Sell or Share My Personal Information" section render correctly and the in-banner "Do Not Sell or Share My Info" link (`/privacy#do-not-sell`) scrolls to it.

- [ ] **Step 8: If anything fails**, invoke `superpowers:systematic-debugging` before attempting a fix. Otherwise proceed.

---

## Task 7: Full verification & wrap-up

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all tests pass, including the new `consent.test.ts` (8 tests).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 3: Final production build**

Run: `npm run build`
Expected: 0 errors. Re-confirm the Cache Components route markers from Task 4 Step 7 still hold (no route regressed from `◐`/`○` back to `ƒ`).

- [ ] **Step 4: Invoke verification-before-completion**

Confirm every claim (tests pass, lint clean, build clean, all manual checks in Task 6 done) with actual command output before declaring done — per `superpowers:verification-before-completion`.

---

## Self-review (author checklist — completed)

- **Spec coverage:** every row of the spec's Decisions table maps to a concrete task — placement/buttons/manage-interaction (Task 2), script gating + Suspense isolation (Tasks 3-4), audience/persistence (Task 1's cookie constants + banner defaults), reopening (Task 2's tab), necessary-cookies-exempt (never gated anywhere), CCPA link (Task 5), copy requirement naming "personalized advertising" (Task 2's collapsed-bar text), explicit out-of-scope items (not built anywhere in this plan).
- **Both corrections from the spec are load-bearing in this plan, not just mentioned:** Task 4 Step 7 explicitly re-verifies the Cache Components precondition after wiring; Task 2's reopen tab (not a footer link) is the actual reopening mechanism, with Task 6 Step 6 specifically testing it from a non-homepage page.
- **No placeholders:** every code step is complete, runnable code — no "add appropriate styling" or similar.
- **Type consistency:** `ConsentCategories`/`ConsentState` used identically across `consent.ts`, `cookie-banner.tsx`, `consent-gate.tsx`. `CONSENT_COOKIE_NAME`/`CONSENT_COOKIE_MAX_AGE_SECONDS` defined once in `consent.ts`, imported (not redefined) everywhere else.

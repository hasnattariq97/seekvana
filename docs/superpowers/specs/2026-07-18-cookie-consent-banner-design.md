# Cookie Consent Banner — Design

## Problem

Seekvana already runs Google Analytics 4 (`gtag`, ID `G-CX5PQDJSZD`) and Google AdSense (`adsbygoogle.js`, client `ca-pub-4583972977988838`) unconditionally for every visitor, from `src/app/layout.tsx:75-77`. No consent is collected before either script fires. The site's own `/privacy` page (`src/app/privacy/page.tsx`) already discloses this cookie/ad usage in detail with opt-out links — but disclosure alone isn't consent, and nothing currently blocks the scripts.

This is a real gap against Google's own AdSense EU User Consent Policy (contractual term of using AdSense — non-compliance risks account suspension) and against GDPR/UK-GDPR/ePrivacy for any EEA/UK/Swiss visitor, given the site's audience is global and not geo-restricted.

## Research grounding (2026-07-18, direct web research — see conversation for full findings)

- A custom-built consent dialog is explicitly permitted by Google: *"You can use the Google CMP, a third-party CMP, or create your own consent dialog"* ([support.google.com/adsense/answer/7670013](https://support.google.com/adsense/answer/7670013)). The TCF-certified-CMP mandate (Jan 2024) applies to programmatic/real-time-bidding ad demand, not plain AdSense — not applicable here.
- Real script-blocking until consent (rather than firing regardless) is a valid, sufficient compliance approach per Google's own Consent Mode documentation ([developers.google.com/tag-platform/security/guides/consent](https://developers.google.com/tag-platform/security/guides/consent)). Consent Mode v2's signal-passing API (`ad_storage`, `analytics_storage`, etc.) is an optional enhancement for preserving modeled conversion data — relevant mainly to sites running Google Ads remarketing/conversion campaigns, which Seekvana does not. **Explicitly deferred**, not part of this design.
- UK ICO and French CNIL both require **equal prominence**: Accept and Decline must be the same size/visual weight and take the same number of clicks — burying reject behind a "Manage" link, or making reject a plain text link while accept is a solid button, is a documented enforcement target (CNIL issued formal notices for exactly this in Dec 2024).
- Google's policy specifically requires the banner's first layer to name **"ads personalisation"** — a generic "we use cookies" is called out as insufficient.
- Pre-ticked consent boxes are invalid everywhere; only strictly-necessary cookies (Supabase auth session, in our case) are GDPR-exempt from consent.
- CCPA/CPRA doesn't mandate a banner, but requires an accessible "Do Not Sell or Share My Personal Information" mechanism if data is shared for advertising purposes — which sharing data with Google for ad personalization qualifies as. Cheap to satisfy with a link, not worth skipping.
- No universal legal maximum on consent-cookie lifetime; CNIL (often the strictest, most-cited EU authority) leans toward ~6 months in its guidance. Given global reach, 6 months is the safer choice over the common-but-less-conservative 12-month default.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Placement | Full-width bottom bar |
| Buttons (collapsed state) | Three, equal prominence: **Manage** (text-style, left/inline) · **Decline All** (bordered button) · **Accept All** (solid accent button) |
| Manage interaction | Expands the *same bar* in place (not a modal) to show two toggles: Analytics, Advertising — plus a "Save preferences" button |
| Toggle defaults | Both **off** until the visitor acts (no pre-ticking) |
| Script gating | Real blocking — `layout.tsx` does not render the `gtag`/`adsbygoogle` `<script>` tags at all until the relevant category is consented |
| Audience | Shown to every visitor globally — no geo-detection, simplest and safest (over-inclusive, never under-inclusive) |
| Consent persistence | A single cookie, **6 months** expiry, server-readable |
| Reopening later | A "Cookie preferences" link in the footer (next to Privacy Policy / Terms, `src/components/layout/footer.tsx` around lines 186-187) reopens the banner in its expanded Manage state |
| Necessary cookies | Supabase auth session — never gated, not shown as a toggle (GDPR-exempt, no legal choice to offer) |
| CCPA link | A "Do Not Sell or Share My Personal Info" link, placed in the expanded Manage panel next to the Privacy Policy reference |
| Copy requirement | First-layer text must explicitly say cookies are used for **ads personalisation** and analytics — not just "cookies." Neutral tone, no jargon ("data controller", "functional cookies"), specific about what's collected. |
| Explicitly out of scope | Google Consent Mode v2 signal-passing API; geo-detection/EEA-only targeting; IAB TCF integration |

## Architecture

**New files:**
- `src/lib/consent.ts` — pure + server helpers:
  - `type ConsentCategories = { analytics: boolean; advertising: boolean }`
  - `type ConsentState = ConsentCategories | null` (`null` = no decision made yet)
  - `parseConsentCookie(raw: string | undefined): ConsentState` — pure, parses the cookie's JSON value; returns `null` on missing/malformed input. **Unit-testable in isolation** (no I/O), same pattern as `buildCommentTree`/`computePathProgress` from the Suspense-streaming work.
  - `getConsent(): Promise<ConsentState>` — server-side, reads the cookie via `next/headers` `cookies()`, calls `parseConsentCookie`.
  - `CONSENT_COOKIE_NAME`, `CONSENT_COOKIE_MAX_AGE_SECONDS` (6 months) constants.
- `src/components/consent/cookie-banner.tsx` — `'use client'`. Renders the collapsed 3-button bar or the expanded Manage panel (component-local `useState` for expanded/collapsed — no need for a global store, this is a single, self-contained UI unit). On Accept All / Decline All / Save preferences: writes the cookie client-side (`document.cookie` with the 6-month max-age) and calls `router.refresh()` (Next.js App Router) so the server-rendered script tags in `layout.tsx` immediately reflect the new consent state — no full page reload needed.
  - Takes `initialConsent: ConsentState` as a prop (passed from `layout.tsx`, already read server-side) so it can decide instantly whether to render at all, with no flash-of-banner-then-hide.
- `src/components/consent/reopen-preferences-link.tsx` — thin client component for the footer; on click, sets a flag (simplest: a client-side event the banner listens for, or lifts a tiny shared open/expanded state via React context scoped to just these two components — do not reach for a global store for this) that forces `CookieBanner` back into its expanded Manage view even if consent was already given.

**Correction (found while planning, 2026-07-18):** `next.config.ts` already has `cacheComponents: true` (from the separately-shipped Cache Components migration, PR #7). Under that flag, any `cookies()` read — however fast — forces static rendering to stop at that point in the tree unless it's isolated behind its own `<Suspense>` boundary. Calling `getConsent()` directly in the root layout's Server Component body (as originally drafted) would make **every page on the site** dynamic again, undoing PR #7 entirely. Fixed below by giving consent its own island, same pattern as the article/path/profile Suspense work.

- `src/components/consent/consent-gate.tsx` — new async Server Component. Calls `getConsent()`, and renders: the conditional `gtag`/`adsbygoogle` `<script>` tags (GA only if `consent?.analytics === true`, AdSense only if `consent?.advertising === true`) plus `<CookieBanner initialConsent={consent} />`. This is the ONLY place that reads the consent cookie.
- `src/app/layout.tsx` — the existing `gtag`/`adsbygoogle` `<script>` tags currently live in `<head>` (`layout.tsx:76-78`) and are removed from there. In their place, `<body>` renders `<Suspense fallback={null}><ConsentGate /></Suspense>` alongside the other body-level singletons (`AuthModal`, `SideFeedback`). `<head>` keeps only the two static `preconnect` links — nothing consent-dependent remains in `<head>`. `fallback={null}` (no dedicated skeleton component) is correct here, not a shortcut: `CookieBanner` is a `position: fixed` bottom bar, not part of normal document flow, so it popping in causes zero layout shift for surrounding content — unlike the article-page islands (comments, save button) which sit inline and needed skeleton placeholders to avoid CLS.
  - Moving the analytics/ad scripts from `<head>` to end-of-`<body>` is intentional, not incidental: both scripts already carry `async`, and GA4's `gtag.js` is designed to tolerate late loading (it queues calls via `dataLayer` before the library itself loads) — this is the same placement Google Tag Manager's own recommended snippet uses. This sidesteps any uncertainty about Suspense boundaries inside `<head>` specifically, at no real cost to analytics accuracy.
  - `RootLayout` itself does **not** become `async` and does **not** call `getConsent()` — that call is fully contained inside `ConsentGate`, which is the only thing wrapped in Suspense.
- `src/components/layout/footer.tsx` — add a "Cookie preferences" entry near the existing Privacy Policy / Terms of Use links (~line 186-187), rendering `<ReopenPreferencesLink />`.
- `src/app/privacy/page.tsx` — Section 3 ("Advertising & Cookies") gets a short addition noting the consent banner and linking the CCPA "Do Not Sell or Share" mechanism; no structural rewrite needed, this page already covers the substance correctly.

## Data flow

1. **First visit, no cookie**: `getConsent()` returns `null` server-side → GA/AdSense scripts are not rendered at all → `CookieBanner` receives `initialConsent={null}` → shows the collapsed 3-button bar.
2. **Visitor clicks Accept All**: client writes `{analytics: true, advertising: true}` to the cookie, calls `router.refresh()`. Server re-renders `layout.tsx`, `getConsent()` now returns the new state, GA + AdSense script tags render into the page for the first time.
3. **Visitor clicks Decline All**: writes `{analytics: false, advertising: false}`. Banner hides. Scripts never render. Necessary cookies (Supabase auth) are entirely unaffected — they were never gated.
4. **Visitor clicks Manage → toggles Analytics on, Advertising off → Save preferences**: writes `{analytics: true, advertising: false}`. Only the GA script renders on refresh; AdSense stays out.
5. **Later visit, within 6 months**: `getConsent()` returns the stored state immediately, banner doesn't show, scripts render per the stored choice from the very first server response (no flash).
6. **After 6 months, or visitor clicks "Cookie preferences" in the footer**: banner reappears (expired cookie → `null` state) or reopens in its expanded Manage view (footer link path) pre-filled with the current toggle state, so the visitor can change their mind — satisfies the "withdraw consent anytime" requirement.

## Error handling

- Malformed/corrupted cookie value (e.g. from a future schema change) → `parseConsentCookie` returns `null` → treated identically to "no decision yet," banner shows again. No crash path — this is the same defensive-default pattern as `getUserReadSet()`'s degrade-to-`[]` from the earlier Suspense work, applied to a simpler pure-parse case.
- No server-side auth/network calls are introduced by this feature — it's a pure cookie read on every request (cheap, no Supabase involvement), so no new failure mode around external services.

## Testing

- `src/lib/consent.test.ts` — unit tests for `parseConsentCookie`: valid JSON → correct object; missing cookie → `null`; malformed JSON → `null`; partial/wrong-shape JSON (e.g. `{analytics: "yes"}`) → `null` (fail closed, don't half-trust a malformed value).
- No unit tests planned for `CookieBanner`/`ReopenPreferencesLink` themselves — this repo has no existing React component test harness (only Vitest for pure logic/server actions), and introducing one would be new infrastructure beyond this feature's scope. Verified manually instead:
  - Fresh browser (no cookie): banner shows; **view page source** confirms no `gtag`/`adsbygoogle` script tags present at all (not just hidden/disabled — genuinely absent from the HTML).
  - Click Accept All: banner hides, reload confirms scripts now present in page source, cookie inspector shows the 6-month-expiry cookie.
  - Click Decline All: banner hides, scripts stay absent from page source on reload.
  - Manage → toggle only Analytics on → Save: confirm only `gtag` script present, `adsbygoogle` absent.
  - Footer "Cookie preferences" link: reopens banner in expanded Manage state with current toggle values reflected correctly.
  - Equal-prominence visual check: Accept All and Decline All are the same size/style/weight in the collapsed bar (screenshot comparison), per the ICO/CNIL guidance above.

## Explicitly out of scope (for a future pass, if ever needed)

- Google Consent Mode v2 signal API (`gtag('consent', ...)`) — only matters if Seekvana starts running Google Ads remarketing/conversion campaigns, which it does not today.
- Geo-detection / EEA-only targeting — decided against for simplicity; showing to all visitors is over-inclusive but never under-inclusive, so there's no compliance downside to skipping this.
- IAB TCF integration / third-party CMP product (Cookiebot, OneTrust, etc.) — not required for plain AdSense per Google's own docs; custom banner is sufficient.

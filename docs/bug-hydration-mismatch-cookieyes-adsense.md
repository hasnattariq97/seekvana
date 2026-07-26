# Bug: hydration mismatch between CookieYes and AdSense scripts

**Filed:** 2026-07-26
**Location:** `src/app/layout.tsx:71`
**Severity:** Not blocking, but has real consequences — see below.

## What happens

On every page load, React logs a hydration mismatch error:

```
A tree hydrated but some attributes of the server rendered HTML didn't
match the client properties.
```

The server renders one `<script>` tag in `<head>`:
- AdSense: `id={null}`, `type={null}`, `src="https://pagead2.googlesyndication.com/pagead/managed/js/adsense/..."`

The client instead renders:
- CookieYes: `id="cookieyes"`, `type="text/javascript"`, `src="https://cdn-cookieyes.com/client_data/.../script.js"`

Same slot, different script tag, server vs. client. Also affects an adjacent inline script: server ships `dataLayer`/`gtag` init, client ships JSON-LD org schema (or vice versa) — the diff shown was:
```
+ id="cookieyes" / src="cdn-cookieyes.com/..."
- id={null} / src="pagead2.googlesyndication.com/..."
```

## Why it's not just a cosmetic warning

1. **Consent-timing risk.** If this reflects real logic choosing whether to load the ad script or the consent script based on something that differs between server and client render (a cookie, `window`, or consent state not available during SSR), users could see ads/tracking scripts load *before* their cookie consent choice is actually confirmed — a real GDPR/consent-compliance issue, not just a rendering nicety.
2. **Warning fatigue.** This fires on every page load in dev. It will keep burying genuinely new console errors under a permanent, ignorable-looking red banner, making future regressions harder to spot.

React does not crash on this — it discards the SSR output for that node and re-renders client-side, so there's no visible breakage today. That's why it wasn't blocking during the lesson 14.01 quiz-component work where it was first noticed.

## How it was found

Surfaced while browser-testing the new `SelfPlacementQuiz` component on `/library/agentic-ai/what-this-path-is` — confirmed unrelated to that component (same error appears on any page load, quiz or not).

## Next steps (not done yet)

- Read `src/app/layout.tsx` around line 71 and whatever determines which script (`cookieyes` vs. AdSense/gtag) renders in `<head>`.
- Determine whether the branching condition is genuinely server/client-divergent (e.g. reads a cookie only available client-side) — if so, move that decision into a client-only wrapper so SSR doesn't guess wrong, or render both consistently and gate visibility instead of gating which script tag exists.
- Once fixed, verify: no hydration warning on cold load, and confirm ad/tracking scripts still respect actual consent state (don't fire before consent).

# Newsletter Email Sending Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send branded welcome emails via Resend on signup and handle unsubscribes via token link.

**Architecture:** Resend SDK sends emails from the subscribe API route. Supabase table gains `unsubscribe_token` (UUID) and `status` columns. React Email provides the branded template. A new unsubscribe API route + confirmation page completes the flow.

**Tech Stack:** Resend SDK (`resend`), React Email (`@react-email/components`), Supabase (existing), Next.js App Router API routes, Vitest (existing test setup)

---

## Pre-requisites (do manually before starting)

1. Create a free account at resend.com
2. Go to **API Keys** → create key named `seekvana` with Send access → copy it
3. Add to `.env.local`: `RESEND_API_KEY=re_xxxxxxxxxxxx`
4. Add to Vercel environment variables: `RESEND_API_KEY=re_xxxxxxxxxxxx`

---

## Task 1: Supabase migration — add unsubscribe_token and status columns

**Files:**
- No code files — Supabase dashboard SQL editor

- [ ] **Step 1: Run migration in Supabase SQL editor**

Go to supabase.com → your project → SQL Editor → run:

```sql
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'unsubscribed'));

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_unsubscribe_token_idx
  ON newsletter_subscribers (unsubscribe_token);
```

- [ ] **Step 2: Verify in Table Editor**

Go to Table Editor → `newsletter_subscribers` → confirm both columns exist with correct defaults.

---

## Task 2: Install dependencies

**Files:** `package.json` (modified by npm)

- [ ] **Step 1: Install packages**

```bash
npm install resend @react-email/components
```

- [ ] **Step 2: Verify install**

```bash
node -e "require('resend'); console.log('resend ok')"
```

Expected: `resend ok`

---

## Task 3: Resend client singleton

**Files:**
- Create: `src/lib/resend.ts`

- [ ] **Step 1: Write test**

Create `src/lib/resend.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: {} })),
}))

describe('resend client', () => {
  it('exports a resend instance', async () => {
    const { resend } = await import('./resend')
    expect(resend).toBeDefined()
    expect(resend.emails).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test -- src/lib/resend.test.ts
```

Expected: FAIL — `Cannot find module './resend'`

- [ ] **Step 3: Implement**

Create `src/lib/resend.ts`:

```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- src/lib/resend.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/resend.ts src/lib/resend.test.ts
git commit -m "feat: add Resend client singleton"
```

---

## Task 4: Welcome email React Email template

**Files:**
- Create: `src/emails/welcome.tsx`

- [ ] **Step 1: Create the template**

Create `src/emails/welcome.tsx`:

```tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  unsubscribeUrl: string
  cheatsheetUrl?: string
}

export function WelcomeEmail({
  unsubscribeUrl,
  cheatsheetUrl = '#',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You're in — your free AI cheatsheet is ready</Preview>
      <Body style={{ backgroundColor: '#FAF8F3', fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 20px' }}>
          {/* Header */}
          <Section style={{ textAlign: 'center', paddingBottom: '24px' }}>
            <Text style={{ fontSize: '22px', fontWeight: '600', color: '#1C1B19', margin: 0 }}>
              Seekvana
            </Text>
            <Text style={{ fontSize: '13px', color: '#6F6B62', margin: '4px 0 0' }}>
              Learn AI, clearly.
            </Text>
          </Section>

          {/* Main card */}
          <Section style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E6E1D7', padding: '40px 36px' }}>
            <Heading style={{ fontSize: '28px', color: '#1C1B19', fontWeight: '500', margin: '0 0 12px', lineHeight: '1.3' }}>
              You&apos;re in! 🎉
            </Heading>
            <Text style={{ fontSize: '16px', color: '#6F6B62', lineHeight: '1.7', margin: '0 0 24px' }}>
              Welcome to Seekvana — your weekly guide to AI, clearly explained.
              Every Tuesday you&apos;ll get new articles, AI tool picks, and practical guides.
            </Text>

            <Text style={{ fontSize: '15px', color: '#1C1B19', fontWeight: '600', margin: '0 0 12px' }}>
              Your free cheatsheet is ready:
            </Text>

            <Button
              href={cheatsheetUrl}
              style={{
                backgroundColor: '#C9633F',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Download AI Cheatsheet →
            </Button>

            <Hr style={{ borderColor: '#E6E1D7', margin: '32px 0' }} />

            <Text style={{ fontSize: '14px', color: '#6F6B62', lineHeight: '1.6', margin: 0 }}>
              In the meantime, explore our most popular articles:
            </Text>
            <Text style={{ fontSize: '14px', margin: '8px 0 0' }}>
              <Link href="https://seekvana.com/library/agentic-ai/what-is-an-agent" style={{ color: '#C9633F' }}>
                What is an AI Agent?
              </Link>
              {' · '}
              <Link href="https://seekvana.com/library/agentic-ai/rag-explained" style={{ color: '#C9633F' }}>
                RAG Without the Hype
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: 'center', padding: '24px 0' }}>
            <Text style={{ fontSize: '12px', color: '#A39E92', margin: 0 }}>
              You&apos;re receiving this because you signed up at seekvana.com.
            </Text>
            <Text style={{ fontSize: '12px', color: '#A39E92', margin: '4px 0 0' }}>
              <Link href={unsubscribeUrl} style={{ color: '#A39E92' }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: no errors related to `src/emails/welcome.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/emails/welcome.tsx
git commit -m "feat: add welcome email React Email template"
```

---

## Task 5: Update subscribe route — add token generation + send welcome email

**Files:**
- Modify: `src/app/api/newsletter/subscribe/route.ts`
- Modify: `src/app/api/newsletter/subscribe/route.test.ts`

- [ ] **Step 1: Add failing tests first**

Replace `src/app/api/newsletter/subscribe/route.test.ts` with:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}))

import { POST } from './route'
import { createClient } from '@/lib/supabase-server'
import { resend } from '@/lib/resend'

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/newsletter/subscribe', () => {
  const mockInsert = vi.fn()
  const mockEmailSend = vi.mocked(resend.emails.send)

  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({ insert: mockInsert }),
    } as never)
    mockInsert.mockReset()
    mockEmailSend.mockReset()
    mockEmailSend.mockResolvedValue({ data: { id: 'email-123' }, error: null } as never)
  })

  it('returns 200 on valid new subscriber', async () => {
    mockInsert.mockResolvedValue({ data: [{ unsubscribe_token: 'abc-123' }], error: null })
    const res = await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('calls resend.emails.send after successful insert', async () => {
    mockInsert.mockResolvedValue({ data: [{ unsubscribe_token: 'abc-123' }], error: null })
    await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(mockEmailSend).toHaveBeenCalledOnce()
    const callArgs = mockEmailSend.mock.calls[0][0] as Record<string, unknown>
    expect(callArgs.to).toBe('test@example.com')
    expect(callArgs.subject).toContain('cheatsheet')
  })

  it('still returns 200 if email send fails (non-blocking)', async () => {
    mockInsert.mockResolvedValue({ data: [{ unsubscribe_token: 'abc-123' }], error: null })
    mockEmailSend.mockRejectedValue(new Error('Resend down'))
    const res = await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(res.status).toBe(200)
  })

  it('returns 400 on invalid email', async () => {
    const res = await POST(makeRequest({ email: 'notanemail', source: 'homepage' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 on empty email', async () => {
    const res = await POST(makeRequest({ email: '', source: 'homepage' }))
    expect(res.status).toBe(400)
  })

  it('returns 409 when email already subscribed', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505' } })
    const res = await POST(makeRequest({ email: 'existing@example.com', source: 'homepage' }))
    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.message).toContain('already')
  })

  it('returns 500 on unexpected database error', async () => {
    mockInsert.mockResolvedValue({ error: { code: 'UNKNOWN', message: 'db error' } })
    const res = await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests — expect 2 new failures**

```bash
npm test -- src/app/api/newsletter/subscribe/route.test.ts
```

Expected: `calls resend.emails.send` and `still returns 200 if email send fails` FAIL.

- [ ] **Step 3: Update subscribe route**

Replace `src/app/api/newsletter/subscribe/route.ts` with:

```typescript
import { createClient } from '@/lib/supabase-server'
import { isValidEmail } from '@/lib/email'
import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/emails/welcome'
import { NextResponse } from 'next/server'
import { createElement } from 'react'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim(), source: source ?? 'unknown' })
      .select('unsubscribe_token')

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "You're already on the list! 🎉" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { message: 'Something went wrong. Try again?' },
        { status: 500 }
      )
    }

    const token = data?.[0]?.unsubscribe_token
    const unsubscribeUrl = `https://seekvana.com/api/newsletter/unsubscribe?token=${token}`

    resend.emails.send({
      from: 'Seekvana <hello@seekvana.com>',
      to: email.toLowerCase().trim(),
      subject: "You're in — here's your free AI cheatsheet 🎉",
      react: createElement(WelcomeEmail, { unsubscribeUrl }),
    }).catch(() => {
      // Non-blocking — subscriber is saved, email failure is acceptable
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong. Try again?' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test -- src/app/api/newsletter/subscribe/route.test.ts
```

Expected: 7/7 PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/newsletter/subscribe/route.ts src/app/api/newsletter/subscribe/route.test.ts
git commit -m "feat: send welcome email via Resend on newsletter subscribe"
```

---

## Task 6: Unsubscribe API route

**Files:**
- Create: `src/app/api/newsletter/unsubscribe/route.ts`
- Create: `src/app/api/newsletter/unsubscribe/route.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/app/api/newsletter/unsubscribe/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

import { GET } from './route'
import { createClient } from '@/lib/supabase-server'

function makeRequest(token?: string) {
  const url = token
    ? `http://localhost/api/newsletter/unsubscribe?token=${token}`
    : 'http://localhost/api/newsletter/unsubscribe'
  return new Request(url)
}

describe('GET /api/newsletter/unsubscribe', () => {
  const mockUpdate = vi.fn()
  const mockEq = vi.fn()

  beforeEach(() => {
    mockEq.mockReturnValue({ error: null })
    mockUpdate.mockReturnValue({ eq: mockEq })
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({ update: mockUpdate }),
    } as never)
    mockUpdate.mockReset()
    mockEq.mockReset()
  })

  it('redirects to /unsubscribed on valid token', async () => {
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockEq.mockResolvedValue({ error: null })
    const res = await GET(makeRequest('valid-token-123'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('/unsubscribed')
  })

  it('returns 400 when token is missing', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(400)
  })

  it('returns 400 when token is empty string', async () => {
    const res = await GET(makeRequest(''))
    expect(res.status).toBe(400)
  })

  it('returns 500 on database error', async () => {
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockEq.mockResolvedValue({ error: { message: 'db error' } })
    const res = await GET(makeRequest('valid-token-123'))
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests — expect all fail**

```bash
npm test -- src/app/api/newsletter/unsubscribe/route.test.ts
```

Expected: FAIL — `Cannot find module './route'`

- [ ] **Step 3: Implement the route**

Create `src/app/api/newsletter/unsubscribe/route.ts`:

```typescript
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ message: 'Missing token.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed' })
    .eq('unsubscribe_token', token)

  if (error) {
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/unsubscribed', request.url))
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test -- src/app/api/newsletter/unsubscribe/route.test.ts
```

Expected: 4/4 PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/newsletter/unsubscribe/route.ts src/app/api/newsletter/unsubscribe/route.test.ts
git commit -m "feat: add unsubscribe API route with token validation"
```

---

## Task 7: Unsubscribed confirmation page

**Files:**
- Create: `src/app/unsubscribed/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/unsubscribed/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Unsubscribed — Seekvana',
  description: "You've been removed from the Seekvana newsletter.",
  robots: { index: false },
}

export default function UnsubscribedPage() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-4xl mb-6">👋</div>
        <h1 className="font-fraunces text-3xl font-medium text-primary mb-3">
          You&apos;ve been unsubscribed
        </h1>
        <p className="font-inter text-base text-secondary mb-8">
          You won&apos;t receive any more emails from Seekvana. If you change your mind,
          you can always subscribe again.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent-deep transition-colors"
        >
          Back to Seekvana
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: build succeeds, `/unsubscribed` appears in output as static page.

- [ ] **Step 3: Commit**

```bash
git add src/app/unsubscribed/page.tsx
git commit -m "feat: add unsubscribed confirmation page"
```

---

## Task 8: Verify Resend domain + end-to-end test

- [ ] **Step 1: Add seekvana.com domain to Resend**

1. Go to resend.com → **Domains** → **Add Domain**
2. Enter `seekvana.com`
3. Add the DNS records Resend shows you to your domain registrar
4. Click **Verify** — status should turn green

Until verified, emails send from Resend's sandbox (`onboarding@resend.dev`) — fine for testing.

- [ ] **Step 2: Test subscribe + welcome email end-to-end**

1. Deploy to Vercel (push to GitHub → auto-deploy)
2. Go to `seekvana.vercel.app`
3. Subscribe with a real email
4. Check inbox — welcome email should arrive within 30 seconds
5. Click unsubscribe link in email — should land on `/unsubscribed` page
6. Check Supabase `newsletter_subscribers` — `status` column should be `unsubscribed`

- [ ] **Step 3: Run full test suite**

```bash
npm test
```

Expected: all tests pass including new ones.

- [ ] **Step 4: Final push**

```bash
git push
```

---

## Self-Review Notes

- Welcome email send is fire-and-forget (`.catch()`) — subscriber is saved even if Resend is down. ✅
- Unsubscribe token is a UUID generated by Postgres `gen_random_uuid()` — cryptographically safe. ✅
- `/unsubscribed` page has `robots: { index: false }` — won't appear in Google. ✅
- No cheatsheet URL yet — placeholder `#` used, replace with real URL when PDF is ready. ✅
- Domain verification is manual — documented in Task 8. ✅

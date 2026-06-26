# Auth + Newsletter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Magic Link + Google OAuth auth (modal, session state, signed-in navbar) and two newsletter CTA placements (homepage split section + post-article dark card) backed by Supabase.

**Architecture:** Auth uses Supabase Auth with `@supabase/ssr` middleware for server-side session refresh; client-side state lives in `AuthContext`. Newsletter captures emails via a Next.js API route into a Supabase table — no email provider in this phase. Both features are independent and can be implemented in parallel.

**Tech Stack:** Next.js 15 App Router, Supabase (`@supabase/ssr` already installed), Framer Motion (already installed), Vitest (new), Tailwind CSS tokens only.

---

## File Map

### Auth
| File | Action | Responsibility |
|---|---|---|
| `src/middleware.ts` | Create | Refresh Supabase session on every request |
| `src/lib/supabase-server.ts` | Create | Server-side Supabase client (reads cookies) |
| `src/app/auth/callback/route.ts` | Create | Exchange OAuth/magic-link code for session |
| `src/app/auth/error/page.tsx` | Create | Auth error stub page |
| `src/context/auth-context.tsx` | Create | `useAuth()` hook — user, loading, modal open/close |
| `src/components/auth/auth-modal.tsx` | Create | Modal UI — form state, magic link, Google OAuth |
| `src/components/layout/navbar.tsx` | Modify | Replace "Get started" with auth-aware avatar/button |
| `src/app/layout.tsx` | Modify | Wrap with `AuthProvider`, render `AuthModal` |
| `src/app/profile/reading-list/page.tsx` | Create | Stub — "Coming soon" |
| `src/app/profile/progress/page.tsx` | Create | Stub — "Coming soon" |
| `src/app/profile/settings/page.tsx` | Create | Stub — "Coming soon" |

### Newsletter
| File | Action | Responsibility |
|---|---|---|
| `src/lib/email.ts` | Create | `isValidEmail(email)` — pure validator |
| `src/app/api/newsletter/subscribe/route.ts` | Create | POST handler — validates, inserts to Supabase |
| `src/components/newsletter/newsletter-form.tsx` | Create | Shared form: email input, submit, shake, success swap |
| `src/components/newsletter/newsletter-section.tsx` | Create | Homepage split layout with cheatsheet visual |
| `src/components/newsletter/post-article-newsletter.tsx` | Create | Dark card for post-article placement |
| `src/app/page.tsx` | Modify | Add `NewsletterSection` between `RecentArticles` and `Footer` |
| `src/app/library/[pillar]/[slug]/page.tsx` | Modify | Add `PostArticleNewsletter` above prev/next nav |

### Tests
| File | Tests |
|---|---|
| `src/lib/email.test.ts` | `isValidEmail` — valid/invalid/edge cases |
| `src/app/api/newsletter/subscribe/route.test.ts` | POST handler — success, duplicate, invalid email, server error |

---

## Part A — Auth

---

### Task 1: Vitest setup

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```typescript
// intentionally empty — placeholder for future global setup
```

- [ ] **Step 4: Add test script to `package.json`**

Open `package.json`. In the `"scripts"` block, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify setup works**

```bash
npm test
```
Expected: `No test files found` — that's fine, setup succeeded.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/test/setup.ts package.json
git commit -m "chore: add Vitest test setup"
```

---

### Task 2: Email validator (TDD)

**Files:**
- Create: `src/lib/email.ts`
- Create: `src/lib/email.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/email.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { isValidEmail } from './email'

describe('isValidEmail', () => {
  it('accepts a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })
  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })
  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })
  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })
  it('rejects missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })
  it('rejects whitespace only', () => {
    expect(isValidEmail('   ')).toBe(false)
  })
})
```

- [ ] **Step 2: Run — expect fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './email'`

- [ ] **Step 3: Implement `src/lib/email.ts`**

```typescript
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test
```
Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts src/lib/email.test.ts
git commit -m "feat: add email validator utility"
```

---

### Task 3: Supabase server client + middleware

**Files:**
- Create: `src/lib/supabase-server.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create `src/lib/supabase-server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — cookie mutation ignored
          }
        },
      },
    }
  )
}
```

- [ ] **Step 2: Create `src/middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — must not be removed
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase-server.ts src/middleware.ts
git commit -m "feat: add Supabase server client and session middleware"
```

---

### Task 4: Auth callback route + error page

**Files:**
- Create: `src/app/auth/callback/route.ts`
- Create: `src/app/auth/error/page.tsx`

- [ ] **Step 1: Create `src/app/auth/callback/route.ts`**

```typescript
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
```

- [ ] **Step 2: Create `src/app/auth/error/page.tsx`**

```typescript
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="font-fraunces text-2xl text-primary mb-2">Sign in failed</h1>
        <p className="text-secondary text-sm mb-6">
          The link may have expired or already been used. Links expire after 1 hour.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-accent-deep text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition"
        >
          Back to Seekvana
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/auth/callback/route.ts src/app/auth/error/page.tsx
git commit -m "feat: add auth callback route and error page"
```

---

### Task 5: AuthContext

**Files:**
- Create: `src/context/auth-context.tsx`

- [ ] **Step 1: Create `src/context/auth-context.tsx`**

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type AuthContextValue = {
  user: User | null
  loading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setIsAuthModalOpen(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/context/auth-context.tsx
git commit -m "feat: add AuthContext with session state and modal control"
```

---

### Task 6: AuthModal component

**Files:**
- Create: `src/components/auth/auth-modal.tsx`

- [ ] **Step 1: Create `src/components/auth/auth-modal.tsx`**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'

type ModalState = 'idle' | 'loading' | 'sent' | 'error'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<ModalState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Reset form when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      const t = setTimeout(() => {
        setEmail('')
        setState('idle')
        setErrorMsg('')
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isAuthModalOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [closeAuthModal])

  const handleMagicLink = async () => {
    if (!email.trim()) return
    setState('loading')
    const supabase = createClient()
    const returnTo = sessionStorage.getItem('returnTo') ?? '/'
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    })
    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setState('sent')
    }
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    const returnTo = sessionStorage.getItem('returnTo') ?? '/'
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    })
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAuthModal}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-surface border border-border rounded-t-2xl sm:rounded-2xl p-8 w-full sm:max-w-sm shadow-2xl text-center"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1 text-secondary hover:text-primary transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {state !== 'sent' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-11 h-11 bg-accent-soft rounded-xl mx-auto mb-4 flex items-center justify-center text-xl">
                    🧭
                  </div>
                  <h2 className="font-fraunces text-xl text-primary font-semibold mb-1">
                    Welcome to Seekvana
                  </h2>
                  <p className="text-secondary text-sm mb-6">
                    Track progress · Comment · Save articles
                  </p>

                  {/* Google — first for highest conversion */}
                  <button
                    onClick={handleGoogle}
                    className="w-full border border-border rounded-xl py-2.5 px-4 text-sm font-semibold text-primary flex items-center justify-center gap-2 hover:bg-surface-subtle transition-colors mb-3"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-secondary">or email</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                    placeholder="your@email.com"
                    className="w-full border border-border rounded-xl py-2.5 px-4 text-sm text-primary bg-transparent mb-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition"
                  />

                  {state === 'error' && (
                    <p className="text-red-500 text-xs mb-2 text-left">{errorMsg}</p>
                  )}

                  <button
                    onClick={handleMagicLink}
                    disabled={state === 'loading'}
                    className="w-full bg-accent hover:bg-accent-deep text-white rounded-xl py-2.5 text-sm font-bold transition-colors disabled:opacity-60 mb-4"
                  >
                    {state === 'loading' ? 'Sending…' : 'Send magic link →'}
                  </button>

                  <p className="text-xs text-secondary">
                    By signing in you agree to our{' '}
                    <a href="/terms" className="text-accent underline underline-offset-2">
                      Terms
                    </a>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-4xl mb-3">📬</div>
                  <h2 className="font-fraunces text-xl text-primary font-semibold mb-2">
                    Check your inbox
                  </h2>
                  <p className="text-secondary text-sm mb-2">We sent a magic link to</p>
                  <p className="text-accent font-semibold text-sm mb-4">{email}</p>
                  <div className="bg-accent-soft rounded-xl p-3 text-xs text-secondary text-left mb-4">
                    Click the link in your email to sign in. Link expires in 1 hour.
                  </div>
                  <button
                    onClick={() => setState('idle')}
                    className="text-xs text-secondary hover:text-accent transition-colors"
                  >
                    Wrong email? Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/auth/auth-modal.tsx
git commit -m "feat: add AuthModal with magic link and Google OAuth"
```

---

### Task 7: Update layout.tsx + Navbar + profile stubs

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/navbar.tsx`
- Create: `src/app/profile/reading-list/page.tsx`
- Create: `src/app/profile/progress/page.tsx`
- Create: `src/app/profile/settings/page.tsx`

- [ ] **Step 1: Update `src/app/layout.tsx`**

Add `AuthProvider` wrapping inside `SearchProvider`, and render `AuthModal` after `SearchModalServer`. The final provider chain should be: `ThemeProvider > SearchProvider > AuthProvider`.

Replace the `body` content with:

```typescript
// Add to imports at top:
import { AuthProvider } from '@/context/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'

// Replace body content:
<body className="bg-canvas min-h-screen antialiased">
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <SearchProvider>
      <AuthProvider>
        <Navbar />
        <main>{children}</main>
        <SearchModalServer />
        <AuthModal />
      </AuthProvider>
    </SearchProvider>
  </ThemeProvider>
</body>
```

- [ ] **Step 2: Update `src/components/layout/navbar.tsx`**

Add these imports at the top of the file:
```typescript
import { useAuth } from '@/context/auth-context'
```

Add a new `UserButton` component after the `Logo` function definition (before `DesktopNav`):

```typescript
function UserButton() {
  const { user, loading, openAuthModal } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const supabase = createClient()

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-surface-subtle animate-pulse" />
  }

  if (!user) {
    return (
      <button
        onClick={() => {
          sessionStorage.setItem('returnTo', window.location.pathname)
          openAuthModal()
        }}
        className="hidden md:inline-flex items-center bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent-deep transition-colors"
      >
        Get started
      </button>
    )
  }

  const initials = (user.user_metadata?.full_name as string)
    ?.split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || user.email?.[0].toUpperCase() || '?'

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center hover:bg-accent-deep transition-colors"
        aria-label="Account menu"
      >
        {initials}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 z-50 w-52 bg-surface border border-border rounded-xl shadow-lg py-1.5 overflow-hidden"
            >
              <div className="px-4 py-2.5 border-b border-border mb-1">
                <p className="text-sm font-semibold text-primary truncate">
                  {(user.user_metadata?.full_name as string) || 'Seekvana Reader'}
                </p>
                <p className="text-xs text-secondary truncate">{user.email}</p>
              </div>
              {[
                { href: '/profile/reading-list', icon: '📚', label: 'My Reading List' },
                { href: '/profile/progress', icon: '🏆', label: 'My Progress' },
                { href: '/profile/settings', icon: '⚙️', label: 'Settings' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary hover:bg-surface-subtle transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border mx-2 my-1" />
              <button
                onClick={async () => {
                  setDropdownOpen(false)
                  const supabase = createClient()
                  await supabase.auth.signOut()
                }}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-accent hover:bg-surface-subtle transition-colors"
              >
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
```

Add `createClient` import to navbar:
```typescript
import { createClient } from '@/lib/supabase'
```

In the `Navbar` function, replace the "Get started" `<Link>` block (lines 278–283) with `<UserButton />`:
```typescript
{/* Auth — desktop only */}
<UserButton />
```

- [ ] **Step 3: Create profile stub pages**

Create `src/app/profile/reading-list/page.tsx`:
```typescript
export default function ReadingListPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-4xl mb-4">📚</div>
        <h1 className="font-fraunces text-2xl text-primary mb-2">Reading List</h1>
        <p className="text-secondary text-sm">Coming soon — save articles as you read.</p>
      </div>
    </div>
  )
}
```

Create `src/app/profile/progress/page.tsx`:
```typescript
export default function ProgressPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-4xl mb-4">🏆</div>
        <h1 className="font-fraunces text-2xl text-primary mb-2">My Progress</h1>
        <p className="text-secondary text-sm">Coming soon — track your learning path progress.</p>
      </div>
    </div>
  )
}
```

Create `src/app/profile/settings/page.tsx`:
```typescript
export default function SettingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-4xl mb-4">⚙️</div>
        <h1 className="font-fraunces text-2xl text-primary mb-2">Settings</h1>
        <p className="text-secondary text-sm">Coming soon — manage your account preferences.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 5: Smoke test in dev**

```bash
npm run dev
```
1. Open http://localhost:3000
2. Click "Get started" → modal opens ✓
3. Click backdrop → modal closes ✓
4. Press Escape → modal closes ✓
5. Enter email → click "Send magic link" → "Check your inbox" state appears ✓
6. "Wrong email? Try again" → returns to form ✓

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/components/layout/navbar.tsx src/app/profile/
git commit -m "feat: wire AuthProvider, AuthModal, and signed-in navbar state"
```

---

## Part B — Newsletter

---

### Task 8: Supabase table

**This step requires manual action in the Supabase dashboard.**

- [ ] **Step 1: Create the table**

Go to your Supabase project → SQL Editor → paste and run:

```sql
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  confirmed boolean default false,
  source text
);

-- Index for fast duplicate checks
create index newsletter_subscribers_email_idx on newsletter_subscribers (email);
```

- [ ] **Step 2: Verify in Table Editor**

Navigate to Table Editor → confirm `newsletter_subscribers` table exists with columns: `id`, `email`, `subscribed_at`, `confirmed`, `source`.

---

### Task 9: Newsletter API route (TDD)

**Files:**
- Create: `src/app/api/newsletter/subscribe/route.ts`
- Create: `src/app/api/newsletter/subscribe/route.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/app/api/newsletter/subscribe/route.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase server client
vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

import { POST } from './route'
import { createClient } from '@/lib/supabase-server'

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/newsletter/subscribe', () => {
  const mockInsert = vi.fn()

  beforeEach(() => {
    vi.mocked(createClient).mockResolvedValue({
      from: () => ({ insert: mockInsert }),
    } as never)
    mockInsert.mockReset()
  })

  it('returns 200 on valid new subscriber', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const res = await POST(makeRequest({ email: 'test@example.com', source: 'homepage' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
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

- [ ] **Step 2: Run — expect fail**

```bash
npm test
```
Expected: FAIL — `Cannot find module './route'`

- [ ] **Step 3: Implement `src/app/api/newsletter/subscribe/route.ts`**

```typescript
import { createClient } from '@/lib/supabase-server'
import { isValidEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

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
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim(), source: source ?? 'unknown' })

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

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong. Try again?' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test
```
Expected: all tests pass (email tests + route tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/newsletter/ src/lib/email.ts src/lib/email.test.ts
git commit -m "feat: add newsletter subscribe API route"
```

---

### Task 10: NewsletterForm shared component

**Files:**
- Create: `src/components/newsletter/newsletter-form.tsx`

- [ ] **Step 1: Create `src/components/newsletter/newsletter-form.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

type NewsletterFormProps = {
  source: 'homepage' | 'post-article'
  dark?: boolean
}

export function NewsletterForm({ source, dark = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = async () => {
    if (!email.trim()) {
      triggerShake()
      setErrorMsg('Please enter your email')
      setState('error')
      return
    }

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      const data = await res.json()

      if (res.status === 409) {
        setState('duplicate')
        return
      }
      if (!res.ok) {
        setState('error')
        setErrorMsg(data.message ?? 'Something went wrong. Try again?')
        return
      }
      setState('success')
    } catch {
      setState('error')
      setErrorMsg('Something went wrong. Try again?')
    }
  }

  const inputClass = dark
    ? 'flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-accent/50 transition'
    : 'flex-1 min-w-0 border border-border rounded-xl py-2.5 px-4 text-sm text-primary bg-white outline-none focus:ring-2 focus:ring-accent/30 transition'

  const buttonClass =
    'shrink-0 bg-accent hover:bg-accent-deep text-white rounded-xl py-2.5 px-5 text-sm font-bold transition-colors disabled:opacity-60 whitespace-nowrap'

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-1"
      >
        <div className="text-3xl mb-2">🎉</div>
        <p className={`font-fraunces text-lg font-semibold mb-1 ${dark ? 'text-[#efebe1]' : 'text-primary'}`}>
          You're in!
        </p>
        <p className={`text-sm mb-3 ${dark ? 'text-[#a39e92]' : 'text-secondary'}`}>
          First issue lands Tuesday. Check your inbox for the free cheatsheet.
        </p>
        <a
          href="#"
          className="inline-block bg-accent hover:bg-accent-deep text-white rounded-lg px-4 py-2 text-sm font-bold transition-colors"
        >
          Download Cheatsheet →
        </a>
      </motion.div>
    )
  }

  if (state === 'duplicate') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-1"
      >
        <div className="text-2xl mb-2">🎉</div>
        <p className={`text-sm font-semibold ${dark ? 'text-[#efebe1]' : 'text-primary'}`}>
          You're already on the list!
        </p>
        <p className={`text-xs mt-1 ${dark ? 'text-[#a39e92]' : 'text-secondary'}`}>
          See you Tuesday.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div
        animate={shake ? { x: [0, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          className={inputClass}
        />
        <button
          onClick={handleSubmit}
          disabled={state === 'loading'}
          className={buttonClass}
        >
          {state === 'loading' ? 'Subscribing…' : 'Get it free →'}
        </button>
      </motion.div>
      <AnimatePresence>
        {state === 'error' && errorMsg && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-xs mt-1.5 ${dark ? 'text-red-400' : 'text-red-500'}`}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/newsletter/newsletter-form.tsx
git commit -m "feat: add shared NewsletterForm component"
```

---

### Task 11: NewsletterSection (homepage)

**Files:**
- Create: `src/components/newsletter/newsletter-section.tsx`

- [ ] **Step 1: Create `src/components/newsletter/newsletter-section.tsx`**

```typescript
import { NewsletterForm } from './newsletter-form'

export function NewsletterSection() {
  return (
    <section className="w-full bg-canvas border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border my-16">
          {/* Left: copy + form */}
          <div className="flex-1 bg-surface p-8 md:p-12 flex flex-col justify-center">
            <p className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
              Free Weekly Newsletter
            </p>
            <h2 className="font-fraunces text-3xl md:text-4xl text-primary font-semibold leading-tight mb-3">
              The AI knowledge<br className="hidden md:block" /> you actually need
            </h2>
            <p className="text-secondary text-base leading-relaxed mb-4 max-w-md">
              New articles, tool picks, and practical guides every Tuesday — written for humans, not hype merchants.
            </p>
            <ul className="flex flex-col sm:flex-row gap-2 text-sm text-secondary mb-6">
              <li className="flex items-center gap-1.5">
                <span className="text-success font-bold">✓</span>
                Free AI Tools Cheatsheet on signup
              </li>
              <li className="flex items-center gap-1.5 sm:ml-4">
                <span className="text-success font-bold">✓</span>
                No spam, ever
              </li>
            </ul>
            <div className="max-w-md">
              <NewsletterForm source="homepage" />
            </div>
            <p className="text-xs text-secondary mt-3">
              Join 10,000+ learners · Unsubscribe anytime
            </p>
          </div>

          {/* Right: cheatsheet visual */}
          <div className="hidden md:flex w-72 lg:w-80 bg-accent-soft items-center justify-center p-10 shrink-0">
            <div className="flex flex-col items-center gap-4">
              {/* 3D-stacked card effect */}
              <div className="relative w-32 h-44">
                <div className="absolute top-3 left-3 w-32 h-44 bg-border rounded-xl" />
                <div className="absolute top-1.5 left-1.5 w-32 h-44 bg-accent-soft rounded-xl border border-border" />
                <div className="relative w-32 h-44 bg-surface rounded-xl border border-border shadow-md p-4 flex flex-col">
                  <div className="h-1 bg-accent rounded-full mb-3" />
                  <p className="font-fraunces text-xs font-bold text-primary leading-tight mb-1">
                    AI TOOLS
                  </p>
                  <p className="font-fraunces text-xs font-bold text-primary leading-tight mb-3">
                    CHEATSHEET
                  </p>
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[90, 75, 85, 70, 80, 65, 75].map((w, i) => (
                      <div
                        key={i}
                        className="h-1.5 bg-surface-subtle rounded-full"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="inline-block bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">AI Tools Cheatsheet</p>
                <p className="text-xs text-secondary mt-0.5">Yours instantly on signup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to `src/app/page.tsx`**

Open `src/app/page.tsx`. Import `NewsletterSection` and add it between the last content section and `Footer`:

```typescript
import { NewsletterSection } from '@/components/newsletter/newsletter-section'

// In JSX, between RecentArticles and Footer:
<NewsletterSection />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 4: Check in dev**

```bash
npm run dev
```
Visit http://localhost:3000, scroll to newsletter section. Confirm: split layout, cheatsheet visual visible on desktop, stacks on mobile.

- [ ] **Step 5: Commit**

```bash
git add src/components/newsletter/newsletter-section.tsx src/app/page.tsx
git commit -m "feat: add NewsletterSection to homepage"
```

---

### Task 12: PostArticleNewsletter + wire into article page

**Files:**
- Create: `src/components/newsletter/post-article-newsletter.tsx`
- Modify: `src/app/library/[pillar]/[slug]/page.tsx`

- [ ] **Step 1: Create `src/components/newsletter/post-article-newsletter.tsx`**

```typescript
import { NewsletterForm } from './newsletter-form'

export function PostArticleNewsletter() {
  return (
    <div className="relative bg-[#1c1b19] rounded-2xl p-7 md:p-8 overflow-hidden">
      {/* Decorative glow circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/20 blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 right-16 w-20 h-20 rounded-full bg-accent/10 blur-xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <p className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
            Enjoyed this article?
          </p>
          <h3 className="font-fraunces text-xl md:text-2xl font-semibold text-[#efebe1] leading-snug mb-2">
            Get the best of Seekvana every Tuesday
          </h3>
          <p className="text-sm text-[#a39e92] mb-5">
            New articles, AI tool picks, and practical guides. Free cheatsheet on signup.
          </p>
          <NewsletterForm source="post-article" dark />
        </div>
        <div className="text-5xl md:text-6xl opacity-60 shrink-0 hidden sm:block">
          📬
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add to article page**

Open `src/app/library/[pillar]/[slug]/page.tsx`. Import and add `PostArticleNewsletter` in the center column, above the prev/next navigation section:

```typescript
import { PostArticleNewsletter } from '@/components/newsletter/post-article-newsletter'

// In JSX, above prev/next nav (after article body):
<div className="mt-12 mb-8">
  <PostArticleNewsletter />
</div>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: 0 errors.

- [ ] **Step 4: Check in dev**

```bash
npm run dev
```
Visit any article page (e.g. http://localhost:3000/library/agentic-ai/what-is-an-agent). Scroll to bottom of article. Confirm: dark newsletter card appears above prev/next nav. Submit a test email — success state appears in-place.

- [ ] **Step 5: Commit**

```bash
git add src/components/newsletter/post-article-newsletter.tsx src/app/library/
git commit -m "feat: add PostArticleNewsletter to article pages"
```

---

## Final Checks

- [ ] **Run full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Production build**

```bash
npm run build
```
Expected: 0 errors, 0 warnings (or pre-existing warnings only).

- [ ] **Supabase config checklist** (manual)
  - [ ] Enable Email (magic link) provider: Supabase Dashboard → Authentication → Providers → Email → enable "Magic Link"
  - [ ] Enable Google provider: Authentication → Providers → Google → paste Client ID + Secret from Google Cloud Console
  - [ ] Add redirect URLs: Authentication → URL Configuration → add `https://seekvana.com/auth/callback` and `http://localhost:3000/auth/callback`
  - [ ] Confirm `newsletter_subscribers` table exists (Task 8)

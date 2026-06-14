# Phase 2 — Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Set up the complete Seekvana design system — color tokens, typography, dark mode ThemeProvider, and ThemeToggle component — so every subsequent phase can use `bg-canvas`, `text-accent`, `font-fraunces`, etc. as Tailwind utilities.

**Architecture:** The project uses Tailwind v4, which is CSS-native (no `tailwind.config.ts`). Custom tokens are defined as CSS custom properties in `:root`/`.dark` and exposed as Tailwind utilities via `@theme inline {}` in globals.css. shadcn CSS vars (`--primary`, `--border`, etc.) are remapped to Seekvana tokens in `:root` so shadcn components automatically use our design system. ThemeProvider (next-themes) switches the `.dark` class on `<html>`, which triggers the dark token overrides.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4 (CSS-native config), next-themes 0.4.6, Framer Motion 12, next/font/google, Lucide React

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/lib/supabase.ts` | Supabase browser client factory |
| Modify | `src/app/globals.css` | Full replacement: Seekvana tokens, @theme inline, base styles |
| Modify | `src/app/layout.tsx` | Replace Geist fonts → Fraunces/Inter/JetBrains Mono, add ThemeProvider, update metadata |
| Create | `src/components/providers/theme-provider.tsx` | next-themes ThemeProvider wrapper (client component) |
| Create | `src/components/ui/theme-toggle.tsx` | Animated sun/moon toggle button |

---

## Task 1: Supabase Browser Client

**Files:**
- Create: `src/lib/supabase.ts`

- [x] Create `src/lib/supabase.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [x] Verify TypeScript compiles cleanly:

```bash
npx tsc --noEmit
```

Expected: exits with no errors.

- [x] Commit:

```bash
git add src/lib/supabase.ts
git commit -m "feat: add supabase browser client"
```

---

## Task 2: Replace globals.css with Seekvana Design Tokens

**Files:**
- Modify: `src/app/globals.css`

**Why this approach:** Tailwind v4 has no `tailwind.config.ts`. Custom utilities are defined in `@theme inline {}` pointing to CSS custom properties. The `inline` keyword means Tailwind outputs `var()` references rather than resolved values, which allows `:root`/`.dark` switching to work at runtime. shadcn CSS vars (`--primary`, `--accent`, etc.) are remapped to Seekvana tokens in `:root` and `.dark` so shadcn components inherit our theme automatically.

- [x] Replace `src/app/globals.css` entirely with the following:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* ── Seekvana color utilities ─────────────────────────────────────────── */
  /* These generate: bg-canvas, text-canvas, border-canvas, etc.            */
  --color-canvas:         var(--color-canvas);
  --color-surface:        var(--color-surface);
  --color-surface-subtle: var(--color-surface-subtle);
  --color-border:         var(--color-border);
  --color-primary:        var(--color-text-primary);    /* text-primary, bg-primary */
  --color-secondary:      var(--color-text-secondary);  /* text-secondary           */
  --color-accent:         var(--color-accent);          /* text-accent, bg-accent = clay */
  --color-accent-deep:    var(--color-accent-deep);
  --color-accent-soft:    var(--color-accent-soft);
  --color-info:           var(--color-info);
  --color-success:        var(--color-success);

  /* ── shadcn component compatibility ──────────────────────────────────── */
  /* shadcn components reference --color-background, --color-foreground,   */
  /* --color-card, etc. as Tailwind utilities internally.                   */
  --color-background:           var(--color-canvas);
  --color-foreground:           var(--color-text-primary);
  --color-card:                 var(--color-surface);
  --color-card-foreground:      var(--color-text-primary);
  --color-popover:              var(--color-surface);
  --color-popover-foreground:   var(--color-text-primary);
  --color-primary-foreground:   #ffffff;
  --color-secondary-foreground: var(--color-text-primary);
  --color-muted:                var(--color-surface-subtle);
  --color-muted-foreground:     var(--color-text-secondary);
  --color-accent-foreground:    #ffffff;
  --color-destructive:          oklch(0.577 0.245 27.325);
  --color-input:                var(--color-border);
  --color-ring:                 var(--color-accent);

  /* ── Font utilities ───────────────────────────────────────────────────── */
  /* Generates: font-fraunces, font-inter, font-mono, font-sans             */
  --font-fraunces: var(--font-fraunces);
  --font-inter:    var(--font-inter);
  --font-mono:     var(--font-mono);
  --font-sans:     var(--font-inter);  /* shadcn uses font-sans internally */

  /* ── Border radius scale ─────────────────────────────────────────────── */
  --radius-sm:  0.375rem;
  --radius-md:  0.5rem;
  --radius-lg:  0.75rem;
  --radius-xl:  1rem;
  --radius-2xl: 1.5rem;
}

/* ── Light theme ──────────────────────────────────────────────────────────── */
:root {
  --radius: 0.5rem;

  /* Seekvana raw tokens */
  --color-canvas:         #FAF8F3;
  --color-surface:        #FFFFFF;
  --color-surface-subtle: #F4F1EA;
  --color-border:         #E6E1D7;
  --color-text-primary:   #1C1B19;
  --color-text-secondary: #6F6B62;
  --color-accent:         #C9633F;
  --color-accent-deep:    #A84E2E;
  --color-accent-soft:    #F6E4DB;
  --color-info:           #2F7D6B;
  --color-success:        #4E8A5B;

  /* shadcn vars remapped to Seekvana tokens */
  --background:          var(--color-canvas);
  --foreground:          var(--color-text-primary);
  --card:                var(--color-surface);
  --card-foreground:     var(--color-text-primary);
  --popover:             var(--color-surface);
  --popover-foreground:  var(--color-text-primary);
  --primary:             var(--color-accent);
  --primary-foreground:  #ffffff;
  --secondary:           var(--color-surface-subtle);
  --secondary-foreground: var(--color-text-primary);
  --muted:               var(--color-surface-subtle);
  --muted-foreground:    var(--color-text-secondary);
  --accent:              var(--color-accent-soft);
  --accent-foreground:   var(--color-accent);
  --destructive:         oklch(0.577 0.245 27.325);
  --border:              var(--color-border);
  --input:               var(--color-border);
  --ring:                var(--color-accent);
}

/* ── Dark theme ───────────────────────────────────────────────────────────── */
.dark {
  /* Seekvana dark tokens */
  --color-canvas:         #181712;
  --color-surface:        #211F1A;
  --color-surface-subtle: #2A2823;
  --color-border:         #38352E;
  --color-text-primary:   #EFEBE1;
  --color-text-secondary: #A39E92;
  --color-accent:         #E0875F;
  --color-accent-deep:    #C96B45;
  --color-accent-soft:    #3A2A22;
  --color-info:           #5FB39B;
  --color-success:        #6BA876;

  /* shadcn dark overrides */
  --primary:             var(--color-accent);
  --primary-foreground:  #ffffff;
  --destructive:         oklch(0.704 0.191 22.216);
}

/* ── Base styles ──────────────────────────────────────────────────────────── */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-canvas text-primary antialiased;
    font-family: var(--font-inter), system-ui, sans-serif;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-fraunces), Georgia, serif;
  }

  code, pre {
    font-family: var(--font-mono), "Courier New", monospace;
  }
}
```

- [x] Start the dev server and verify:

```bash
npm run dev
```

Open http://localhost:3000. Expected: background is warm cream (`#FAF8F3`), not white. No console errors.

- [x] Commit:

```bash
git add src/app/globals.css
git commit -m "feat: add seekvana design tokens and theme to globals.css"
```

---

## Task 3: Replace Fonts in layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

The current layout imports Geist and Geist_Mono. Replace them with Fraunces, Inter, and JetBrains Mono. Also add `suppressHydrationWarning` to `<html>` (required by next-themes to avoid hydration mismatch when class switches server→client).

- [x] Replace `src/app/layout.tsx` entirely:

```typescript
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Seekvana — Learn AI, clearly",
  description:
    "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [x] Check `npx tsc --noEmit` — expected: no errors.

- [x] Verify at localhost:3000: heading text should render in Fraunces (a warm serif), body in Inter (clean sans-serif). Open DevTools → Elements → inspect `<html>` and confirm `--font-fraunces`, `--font-inter`, `--font-mono` CSS variables are present.

- [x] Commit:

```bash
git add src/app/layout.tsx
git commit -m "feat: replace geist with fraunces, inter, jetbrains mono fonts"
```

---

## Task 4: ThemeProvider Component

**Files:**
- Create: `src/components/providers/theme-provider.tsx`

This is a thin client-component wrapper around next-themes `ThemeProvider`. It exists as a separate file because next-themes requires `"use client"` and the root layout is a Server Component.

- [x] Create `src/components/providers/theme-provider.tsx`:

```typescript
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [x] Commit:

```bash
git add src/components/providers/theme-provider.tsx
git commit -m "feat: add theme provider wrapper component"
```

---

## Task 5: ThemeToggle Component

**Files:**
- Create: `src/components/ui/theme-toggle.tsx`

An animated button that cycles light ↔ dark. Uses Framer Motion `AnimatePresence` to animate the sun/moon icon swap (rotate + scale, 200ms). The `mounted` guard prevents SSR hydration mismatch — renders a same-size placeholder until mounted.

- [x] Create `src/components/ui/theme-toggle.tsx`:

```typescript
"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-border bg-surface" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors hover:bg-surface-subtle"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: -90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
```

- [x] Commit:

```bash
git add src/components/ui/theme-toggle.tsx
git commit -m "feat: add animated theme toggle (sun/moon)"
```

---

## Task 6: Wire ThemeProvider into Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [x] Update `src/app/layout.tsx` to import ThemeProvider and wrap children:

```typescript
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Seekvana — Learn AI, clearly",
  description:
    "Learn Agentic AI and all things AI — clear, well-sourced articles for everyone from beginners to advanced builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [x] Verify at localhost:3000:
  - Background color matches system preference (cream in light, near-black in dark)
  - No hydration errors in browser console
  - `suppressHydrationWarning` silences the expected class mismatch on `<html>`

- [x] Commit:

```bash
git add src/app/layout.tsx
git commit -m "feat: wire theme provider into root layout"
```

---

## Task 7: Build Verification

**Files:** none (verification only)

- [x] Run the production build:

```bash
npm run build
```

Expected output ends with:
```
✓ Compiled successfully
Route (app) ...
```

If errors appear, read each one carefully — they will point to a specific file and line. Fix the issue in that file, then re-run `npm run build`.

- [x] Run lint:

```bash
npm run lint
```

Expected: `✔ No ESLint warnings or errors`

- [x] If any fixes were needed, commit them:

```bash
git add -A
git commit -m "fix: resolve build/lint errors in design system"
```

---

## Self-Review Notes

**Spec coverage check:**
- [x] Task 1: Supabase client (`src/lib/supabase.ts`) ✓
- [x] Task 2: Color tokens in globals.css — all 11 light + 11 dark tokens ✓, @theme inline ✓, base styles ✓
- [x] Task 3: Fraunces / Inter / JetBrains Mono via next/font/google ✓, font-variable applied to `<html>` ✓
- [x] Task 4: Tailwind config — handled in globals.css via @theme inline (Tailwind v4, no tailwind.config.ts needed) ✓
- [x] Task 5: ThemeProvider with attribute="class" defaultTheme="system" enableSystem ✓
- [x] Task 6: ThemeToggle with Framer Motion sun/moon rotate+scale ✓
- [x] Task 7: Root layout — fonts, ThemeProvider, metadata ✓

**Tailwind v4 note:** The build guide mentions updating `tailwind.config.ts` but the project uses Tailwind v4 which is CSS-native. All token exposure is done in `@theme inline {}` inside globals.css — no config file needed or correct to add.

**No placeholders:** All code blocks are complete and exact.

**Type consistency:** `ThemeProviderProps` from next-themes is re-exported correctly. Font variables (`--font-fraunces`, etc.) are referenced consistently in globals.css and layout.tsx.

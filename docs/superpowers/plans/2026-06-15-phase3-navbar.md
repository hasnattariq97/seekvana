# Phase 3 — Navigation Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Seekvana sticky navigation bar — logo, desktop nav with animated dropdown menus, scroll-aware border, right-side actions (search, theme toggle, CTA), mobile Sheet drawer, and a shared React Context for the search modal trigger.

**Architecture:** A single `src/components/layout/navbar.tsx` contains three co-located sub-components (`Logo`, `DesktopNav`, `MobileNav`) assembled by the top-level `Navbar`. A `src/context/search-context.tsx` holds the search-modal open state — the navbar triggers `openSearch()`, Phase 6 will render the actual modal. Navbar is added to `layout.tsx` inside the existing `ThemeProvider`.

**Tech Stack:** Next.js 15 App Router · TypeScript · Tailwind v4 CSS tokens (`bg-surface`, `text-primary`, `text-accent`, `text-secondary`, `border-border`, `bg-surface-subtle`, `bg-accent`, `bg-accent-deep`) · Framer Motion (`useScroll`, `useTransform`) · `@base-ui/react` via shadcn wrappers (`NavigationMenu*`, `Sheet*`) · Lucide React icons · `ThemeToggle` already at `src/components/ui/theme-toggle.tsx`

---

## Critical: @base-ui/react vs @radix-ui

This project's shadcn components use **`@base-ui/react`** (not `@radix-ui`). Key differences that affect this plan:

- **Animations use `data-starting-style` / `data-ending-style`** CSS selectors, not `data-state`. The `NavigationMenuPositioner` popup uses Base UI's built-in scale+opacity transition for the outer container.
- **Framer Motion** is used for (1) the scroll-aware border (`useScroll` + `useTransform`) and (2) the dropdown *content* panels (`motion.ul` / `motion.div` with `initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}`). Because Base UI unmounts each `NavigationMenuContent` when switching items, the `initial` state fires correctly on every open — this satisfies the spec exactly.
- **`NavigationMenuTrigger` active state** is `data-popup-open`, not `data-state=open`.
- **`SheetTrigger`** renders as `<button>` by default (no `asChild` needed).
- **`NavigationMenuLink`** renders as `<a>` with `href` prop (standard anchor, not Next.js client-side routing). This is acceptable for a static content site; all main page navigations are full navigations.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| **Create** | `src/context/search-context.tsx` | `SearchProvider` + `useSearch` hook — shared modal open/close state |
| **Create** | `src/components/layout/navbar.tsx` | `Logo`, `DesktopNav`, `MobileNav`, `Navbar` assembly |
| **Modify** | `src/app/layout.tsx` | Add `SearchProvider` wrapper + `<Navbar />` |

---

## Task 1: Search Context Provider

**Files:**
- Create: `src/context/search-context.tsx`

The navbar search button calls `openSearch()` from this context. Phase 6 will read `isSearchOpen` to render the modal. This is a prerequisite — build it first.

- [ ] **Step 1: Create the file**

Create `src/context/search-context.tsx` with this exact content:

```tsx
"use client";

import { createContext, useContext, useState } from "react";

interface SearchContextValue {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors from the new file.

- [ ] **Step 3: Commit**

```bash
git add src/context/search-context.tsx
git commit -m "feat: add search context provider for modal open state"
```

---

## Task 2: Navbar — Logo, Scroll Border, Right Actions, Layout Shell

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Modify: `src/app/layout.tsx`

Build the complete navbar shell. Desktop nav links and mobile sheet are added in Tasks 3–4. This task gets the navbar visible, the logo correct, the scroll border working, and the right-side actions functional.

- [ ] **Step 1: Create `src/components/layout/navbar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSearch } from "@/context/search-context";
import { cn } from "@/lib/utils";

// ─── Nav data ─────────────────────────────────────────────────────────────────

const LEARNING_PATHS = [
  { label: "AI for Beginners",       href: "/paths/ai-for-beginners" },
  { label: "Master Agentic AI",      href: "/paths/master-agentic-ai" },
  { label: "Build Your First Agent", href: "/paths/build-first-agent" },
  { label: "Prompt Engineering",     href: "/paths/prompt-engineering" },
  { label: "Beginner to AI Engineer",href: "/paths/beginner-to-engineer" },
] as const;

const PILLARS = [
  { label: "AI Foundations",        href: "/library/ai-foundations",       flagship: false },
  { label: "Large Language Models", href: "/library/large-language-models", flagship: false },
  { label: "Agentic AI",            href: "/library/agentic-ai",            flagship: true  },
  { label: "Building with AI",      href: "/library/building-with-ai",      flagship: false },
  { label: "AI Tools & Comparisons",href: "/library/ai-tools",              flagship: false },
  { label: "Use Cases",             href: "/library/use-cases",             flagship: false },
  { label: "Concepts & Theory",     href: "/library/concepts-theory",       flagship: false },
  { label: "Ethics & Safety",       href: "/library/ethics-safety",         flagship: false },
  { label: "Careers",               href: "/library/careers",               flagship: false },
] as const;

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="text-accent"
      >
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 5 L12.5 9.5 L10 11.5 L7.5 9.5 Z" fill="currentColor" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      </svg>
      <span className="font-fraunces font-medium text-lg text-primary leading-none">
        Seekvana
      </span>
    </Link>
  );
}

// ─── Desktop navigation ───────────────────────────────────────────────────────

function DesktopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className="px-3 py-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Learning Paths dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm text-secondary bg-transparent hover:text-primary hover:bg-surface-subtle data-popup-open:bg-surface-subtle data-popup-open:text-primary">
            Learning Paths
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <motion.ul
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="w-52 p-2 space-y-0.5"
            >
              {LEARNING_PATHS.map((path) => (
                <li key={path.href}>
                  <NavigationMenuLink
                    href={path.href}
                    className="block rounded-md px-3 py-2 text-sm text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
                  >
                    {path.label}
                  </NavigationMenuLink>
                </li>
              ))}
            </motion.ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Library mega-menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm text-secondary bg-transparent hover:text-primary hover:bg-surface-subtle data-popup-open:bg-surface-subtle data-popup-open:text-primary">
            Library
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 gap-x-2 p-3 w-[400px]"
            >
              {PILLARS.map((pillar) => (
                <NavigationMenuLink
                  key={pillar.href}
                  href={pillar.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm hover:bg-surface-subtle transition-colors",
                    pillar.flagship
                      ? "text-accent font-medium"
                      : "text-primary"
                  )}
                >
                  {pillar.label}
                </NavigationMenuLink>
              ))}
            </motion.div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Tools */}
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/tools"
            className="px-3 py-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            Tools
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ─── Mobile navigation sheet content ─────────────────────────────────────────

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <Logo />
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <Link
          href="/"
          onClick={onClose}
          className="block px-3 py-2 rounded-lg text-sm text-primary hover:bg-surface-subtle transition-colors"
        >
          Home
        </Link>

        <div className="pt-3 pb-1">
          <p className="px-3 mb-1.5 text-xs font-medium text-secondary uppercase tracking-wider">
            Learning Paths
          </p>
          {LEARNING_PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              onClick={onClose}
              className="block px-3 py-2 rounded-lg text-sm text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
            >
              {path.label}
            </Link>
          ))}
        </div>

        <div className="pt-3 pb-1">
          <p className="px-3 mb-1.5 text-xs font-medium text-secondary uppercase tracking-wider">
            Library
          </p>
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              onClick={onClose}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm hover:bg-surface-subtle transition-colors",
                pillar.flagship
                  ? "text-accent font-medium"
                  : "text-primary hover:text-accent"
              )}
            >
              {pillar.label}
            </Link>
          ))}
        </div>

        <Link
          href="/tools"
          onClick={onClose}
          className="block px-3 py-2 rounded-lg text-sm text-primary hover:bg-surface-subtle transition-colors"
        >
          Tools
        </Link>
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-border">
        <Link
          href="/paths/ai-for-beginners"
          onClick={onClose}
          className="flex w-full items-center justify-center bg-accent text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent-deep transition-colors"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}

// ─── Navbar (assembled) ───────────────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 10], [0, 1]);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <DesktopNav />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Search */}
          <button
            onClick={openSearch}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-subtle transition-colors"
            aria-label="Open search"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Get started — desktop only */}
          <Link
            href="/paths/ai-for-beginners"
            className="hidden md:inline-flex items-center bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent-deep transition-colors"
          >
            Get started
          </Link>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-subtle transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-surface border-border p-0 overflow-hidden"
              showCloseButton={false}
            >
              <MobileNav onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Scroll-aware bottom border — invisible at top, fades in on scroll */}
      <motion.div
        className="absolute bottom-0 inset-x-0 h-px bg-border"
        style={{ opacity: borderOpacity }}
      />
    </header>
  );
}
```

- [ ] **Step 2: Update `src/app/layout.tsx`**

Add two imports at the top of the file:

```tsx
import { SearchProvider } from "@/context/search-context";
import { Navbar } from "@/components/layout/navbar";
```

Replace the full `<body>` element:

```tsx
<body className="bg-canvas min-h-screen antialiased">
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <SearchProvider>
      <Navbar />
      <main>{children}</main>
    </SearchProvider>
  </ThemeProvider>
</body>
```

- [ ] **Step 3: Run dev server and verify in browser**

```bash
npm run dev
```

Visit `http://localhost:3000`. Check all of these:

1. **Logo**: SVG compass icon in clay/accent color + "Seekvana" in Fraunces serif
2. **Scroll border**: At page top = no border line. Scroll down 10px = border fades in
3. **Desktop (≥768px)**: "Learning Paths" and "Library" triggers visible with chevrons
4. **Learning Paths dropdown**: Opens with 5 items, scale+opacity animate in
5. **Library dropdown**: Opens a wider 2-column panel; "Agentic AI" shows in accent/clay color
6. **Right side**: Search icon, theme toggle (sun/moon), "Get started" button in clay
7. **Mobile (<768px)**: Hamburger icon appears, "Get started" hidden, desktop nav hidden
8. **Mobile drawer**: Hamburger opens left Sheet with logo, grouped links, "Get started" at bottom
9. **Dark mode**: Toggle works, all colors shift correctly
10. No TypeScript errors in terminal

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/navbar.tsx src/app/layout.tsx
git commit -m "feat: build Phase 3 navbar — logo, desktop dropdowns, mobile sheet, scroll border"
```

---

## Task 3: Production Build Verification

**Files:** none (verification only)

- [ ] **Step 1: Run lint**

```bash
npm run lint 2>&1
```

Fix any ESLint errors before continuing. Common issues:
- Unused imports → remove them
- `react/no-unescaped-entities` → not relevant here (no prose text)
- `@next/next/no-img-element` → not relevant here (no `<img>`)

- [ ] **Step 2: Run production build**

```bash
npm run build 2>&1
```

Expected output ends with:
```
✓ Compiled successfully
Route (app)    Size    First Load JS
┌ ○ /          ...
```

- [ ] **Step 3: Fix any build errors**

If TypeScript errors appear, common causes and fixes:

**"Property 'flagship' does not exist"** — the `as const` arrays need type assertion. Change the `PILLARS.map` access to use optional chaining: `pillar.flagship === true`

**"Module not found: @/context/search-context"** — verify the file exists at `src/context/search-context.tsx`

**"`showCloseButton` is not a valid prop"** — check `src/components/ui/sheet.tsx` line ~50. If the prop is named differently, match what the component expects. Alternative: remove `showCloseButton={false}` and instead set `className` to hide the close button: `[&>[data-slot=sheet-close]]:hidden`

**Hydration error on `bg-surface/90`** — if opacity modifier fails on the CSS variable, replace `bg-surface/90` with inline style: `style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 90%, transparent)' }}`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: resolve Phase 3 build and lint errors"
```

---

## Spec Coverage Checklist

| Requirement | Task | Status |
|---|---|---|
| Sticky top-0 z-50, full width, height 56px (`h-14`) | 2 | ✓ |
| `bg-surface/90 backdrop-blur-sm` | 2 | ✓ |
| Bottom border visible only after scroll (`useScroll` + `useTransform`) | 2 | ✓ |
| Logo: SVG compass/aperture in `text-accent` | 2 | ✓ |
| Logo: "Seekvana" in `font-fraunces font-medium text-lg` | 2 | ✓ |
| Logo wrapped in Next.js Link to "/" | 2 | ✓ |
| Desktop: Home, Learning Paths, Library, Tools links | 2 | ✓ |
| Learning Paths dropdown — 5 items with exact URLs | 2 | ✓ |
| Library dropdown — 9 pillars, 2-column layout | 2 | ✓ |
| "Agentic AI" pillar shown in accent color | 2 | ✓ |
| Dropdown content animation: Framer Motion opacity 0→1, y 4→0, 150ms | 2 | ✓ |
| Search button → `openSearch()` context call | 2 | ✓ |
| `ThemeToggle` component in right section | 2 | ✓ |
| "Get started" → `/paths/ai-for-beginners`, `bg-accent` style | 2 | ✓ |
| Mobile: hamburger (`Menu` icon) appears below `md` | 2 | ✓ |
| Mobile: Sheet opens from the left | 2 | ✓ |
| Mobile Sheet: logo at top | 2 | ✓ |
| Mobile Sheet: all nav links listed vertically | 2 | ✓ |
| Mobile Sheet: "Get started" button at bottom | 2 | ✓ |
| Navbar added to `layout.tsx` (every page) | 2 | ✓ |
| CSS variable tokens only — no hardcoded hex values | All | ✓ |
| TypeScript throughout | All | ✓ |

---

## Notes

**Layered animations:** Dropdown containers get Base UI's built-in scale+opacity (Popup level). Dropdown *content* gets Framer Motion opacity+y (content level). Both fire on each open because Base UI unmounts and remounts each `NavigationMenuContent` when switching between items.

**Nav link routing:** `NavigationMenuLink` renders as a native `<a>` tag, causing full-page navigation rather than Next.js SPA transitions. For a content/SEO site like Seekvana this is acceptable — pages are server-rendered and navigation loads fast. If client-side routing is needed later, each `NavigationMenuLink` can be updated to use the Base UI `render` prop: `<NavigationMenuLink render={<Link href="..." />}>`.

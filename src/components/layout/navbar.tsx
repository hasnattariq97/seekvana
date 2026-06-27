"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// ─── Nav data ─────────────────────────────────────────────────────────────────

const LEARNING_PATHS_META = [
  { label: "Getting Started", href: "/paths/getting-started", lessons: 101, difficulty: "Beginner", dotClass: "bg-success" },
] as const;

const PILLARS = [
  { label: "AI Foundations",         href: "/library/ai-foundations",        flagship: false },
  { label: "Large Language Models",  href: "/library/large-language-models", flagship: false },
  { label: "Agentic AI",             href: "/library/agentic-ai",            flagship: true  },
  { label: "Building with AI",       href: "/library/building-with-ai",      flagship: false },
  { label: "AI Tools & Comparisons", href: "/library/ai-tools",              flagship: false },
  { label: "AI in Practice",         href: "/library/ai-in-practice",        flagship: false },
  { label: "Prompt Engineering",     href: "/library/prompt-engineering",    flagship: false },
  { label: "Ethics & Safety",        href: "/library/ethics-safety",         flagship: false },
  { label: "Careers",                href: "/library/careers",               flagship: false },
] as const;

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 shrink-0">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-accent"
      >
        <path d="M12 1.5 L10.5 10.5 L12 12 L13.5 10.5 Z" fill="currentColor" />
        <path d="M12 22.5 L10.5 13.5 L12 12 L13.5 13.5 Z" fill="currentColor" fillOpacity="0.14" />
        <path d="M22.5 12 L13.5 10.5 L12 12 L13.5 13.5 Z" fill="currentColor" fillOpacity="0.28" />
        <path d="M1.5 12 L10.5 10.5 L12 12 L10.5 13.5 Z" fill="currentColor" fillOpacity="0.28" />
      </svg>
      <span className="font-fraunces font-bold text-lg leading-none"><span className="text-primary">Seek</span><span className="text-accent">vana</span></span>
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
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="w-72 p-2"
            >
              {LEARNING_PATHS_META.map((path) => (
                <NavigationMenuLink
                  key={path.href}
                  href={path.href}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-surface-subtle transition-colors group"
                >
                  <span className={`w-2 h-2 rounded-full ${path.dotClass} mt-2 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{path.label}</p>
                    <p className="text-xs text-secondary mt-0.5">{path.lessons} lessons · {path.difficulty}</p>
                  </div>
                </NavigationMenuLink>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <NavigationMenuLink
                  href="/paths"
                  className="block rounded-lg px-3 py-2 text-xs text-accent hover:bg-surface-subtle transition-colors font-medium"
                >
                  Browse all paths →
                </NavigationMenuLink>
              </div>
            </motion.div>
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
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-surface-subtle transition-colors",
                    pillar.flagship
                      ? "text-accent font-medium"
                      : "text-primary"
                  )}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${pillar.flagship ? "bg-accent" : "bg-border"}`} />
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
  const { user, openAuthModal } = useAuth()
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
          <p className="px-3 mb-1.5 text-xs font-semibold text-secondary">
            Learning Paths
          </p>
          {LEARNING_PATHS_META.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-primary hover:bg-surface-subtle hover:text-accent transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${path.dotClass}`} />
              {path.label}
            </Link>
          ))}
        </div>

        <div className="pt-3 pb-1">
          <p className="px-3 mb-1.5 text-xs font-semibold text-secondary">
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
      <div className="p-4 border-t border-border space-y-2">
        {user ? (
          <>
            <Link
              href="/profile/reading-list"
              onClick={onClose}
              className="flex w-full items-center justify-center border border-border text-primary rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-surface-subtle transition-colors"
            >
              My Profile
            </Link>
            <button
              onClick={async () => {
                onClose()
                const supabase = createClient()
                await supabase.auth.signOut()
              }}
              className="flex w-full items-center justify-center text-accent text-sm font-medium py-1"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              onClose()
              sessionStorage.setItem('returnTo', window.location.pathname)
              openAuthModal()
            }}
            className="flex w-full items-center justify-center bg-accent text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-accent-deep transition-colors"
          >
            Get started
          </button>
        )}
      </div>
    </div>
  );
}

// ─── User button (auth-aware) ─────────────────────────────────────────────────

function UserButton() {
  const { user, loading, openAuthModal } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-surface-subtle animate-pulse hidden md:block" />
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
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-60 bg-canvas border border-border rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(26,23,20,0.16), 0 4px 16px rgba(26,23,20,0.08)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-[18px] py-5 bg-surface-subtle border-b border-border">
                <div
                  className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-fraunces font-bold text-base text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#C9633F 0%,#E0875F 100%)', boxShadow: '0 2px 8px rgba(201,99,63,0.35)' }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-fraunces text-[15px] font-bold text-primary truncate leading-tight">
                    {(user.user_metadata?.full_name as string) || 'Seekvana Reader'}
                  </p>
                  <p className="text-[11px] text-secondary truncate mt-0.5">{user.email}</p>
                </div>
                <div className="w-[18px] h-[18px] rounded-full bg-accent/12 border border-accent/20 flex items-center justify-center shrink-0">
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              {/* Nav items */}
              <div className="p-2">
                {[
                  { href: '/profile', label: 'My Profile', desc: 'Badges & activity', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                  { href: '/profile/reading-list', label: 'Reading List', desc: 'Saved articles', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></svg> },
                  { href: '/profile/progress', label: 'My Progress', desc: 'Paths & completions', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="15"/><path d="M20 21H4"/><path d="M17 15l-5 3-5-3"/></svg> },
                  { href: '/profile/settings', label: 'Settings', desc: 'Account & preferences', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    className="group flex items-center gap-[11px] px-[10px] py-[9px] rounded-[9px] hover:bg-surface-subtle transition-colors duration-100"
                  >
                    <div className="w-[30px] h-[30px] rounded-[8px] bg-surface-subtle border border-border flex items-center justify-center text-secondary shrink-0 group-hover:bg-border/60 transition-colors duration-100">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-primary leading-none">{item.label}</p>
                      <p className="text-[10px] text-secondary mt-[3px]">{item.desc}</p>
                    </div>
                  </Link>
                ))}

                <div className="h-px bg-border mx-[2px] my-[6px]" />

                <button
                  onClick={async () => {
                    setDropdownOpen(false)
                    const supabase = createClient()
                    await supabase.auth.signOut()
                  }}
                  className="group w-full flex items-center gap-[11px] px-[10px] py-[9px] rounded-[9px] hover:bg-red-500/5 transition-colors duration-100 mb-0.5"
                >
                  <div className="w-[30px] h-[30px] rounded-[8px] bg-red-500/7 border border-red-500/12 flex items-center justify-center shrink-0 group-hover:bg-red-500/12 transition-colors duration-100">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B43232" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  </div>
                  <span className="text-[13px] font-medium text-red-600 dark:text-red-400">Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
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

          {/* Auth — desktop only */}
          <UserButton />

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

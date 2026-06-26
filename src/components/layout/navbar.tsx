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

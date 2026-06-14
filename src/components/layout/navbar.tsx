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
  { label: "AI for Beginners",        href: "/paths/ai-for-beginners" },
  { label: "Master Agentic AI",       href: "/paths/master-agentic-ai" },
  { label: "Build Your First Agent",  href: "/paths/build-first-agent" },
  { label: "Prompt Engineering",      href: "/paths/prompt-engineering" },
  { label: "Beginner to AI Engineer", href: "/paths/beginner-to-engineer" },
] as const;

const PILLARS = [
  { label: "AI Foundations",         href: "/library/ai-foundations",        flagship: false },
  { label: "Large Language Models",  href: "/library/large-language-models", flagship: false },
  { label: "Agentic AI",             href: "/library/agentic-ai",            flagship: true  },
  { label: "Building with AI",       href: "/library/building-with-ai",      flagship: false },
  { label: "AI Tools & Comparisons", href: "/library/ai-tools",              flagship: false },
  { label: "Use Cases",              href: "/library/use-cases",             flagship: false },
  { label: "Concepts & Theory",      href: "/library/concepts-theory",       flagship: false },
  { label: "Ethics & Safety",        href: "/library/ethics-safety",         flagship: false },
  { label: "Careers",                href: "/library/careers",               flagship: false },
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

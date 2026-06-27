"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  learn: [
    { label: "Getting Started", href: "/paths/getting-started" },
    { label: "All Paths", href: "/paths" },
  ],
  library: [
    { label: "AI Foundations", href: "/library/ai-foundations" },
    { label: "Agentic AI", href: "/library/agentic-ai" },
    { label: "LLMs", href: "/library/large-language-models" },
    { label: "Building with AI", href: "/library/building-with-ai" },
    { label: "All Topics", href: "/library" },
  ],
  tools: [
    { label: "AI Tool Reviews", href: "/tools" },
    { label: "Best AI Coding Tools", href: "/tools/coding" },
    { label: "Best LLM APIs", href: "/tools/llm-apis" },
    { label: "Comparisons", href: "/tools/compare" },
  ],
} as const;

function FooterLogo() {
  return (
    <div className="flex items-center gap-1.5">
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
      <span className="font-fraunces font-bold text-lg leading-none">
        <span className="text-primary">Seek</span>
        <span className="text-accent">vana</span>
      </span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-subtle border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <FooterLogo />
            <p className="mt-3 text-sm text-secondary">Learn AI, clearly.</p>
            <a
              href="https://twitter.com/seekvana"
              className="mt-4 inline-flex items-center gap-2 text-xs text-secondary hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @seekvana
            </a>
            <p className="mt-6 text-xs text-secondary">
              © 2026 Seekvana. Made for AI learners everywhere.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-fraunces text-sm text-primary font-medium mb-4">
              Learn
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Library */}
          <div>
            <h4 className="font-fraunces text-sm text-primary font-medium mb-4">
              Library
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.library.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-fraunces text-sm text-primary font-medium mb-4">
              Tools
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/privacy"
            className="text-xs text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
          >
            Privacy Policy
          </Link>
          <span className="text-secondary text-xs hidden sm:block" aria-hidden="true">·</span>
          <Link
            href="/terms"
            className="text-xs text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
          >
            Terms of Use
          </Link>
          <span className="text-secondary text-xs hidden sm:block" aria-hidden="true">·</span>
          <Link
            href="/contact"
            className="text-xs text-secondary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none rounded"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

const FOOTER_LINKS = {
  learn: [
    { label: "AI for Beginners", href: "/paths/ai-for-beginners" },
    { label: "Master Agentic AI", href: "/paths/master-agentic-ai" },
    { label: "Build Your First Agent", href: "/paths/build-first-agent" },
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
    <div className="flex items-center gap-2">
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
            <p className="mt-6 text-xs text-secondary">© 2026 Seekvana</p>
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
                    className="text-sm text-secondary hover:text-primary transition-colors"
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
                    className="text-sm text-secondary hover:text-primary transition-colors"
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
                    className="text-sm text-secondary hover:text-primary transition-colors"
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
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-secondary text-xs hidden sm:block" aria-hidden="true">·</span>
          <Link
            href="/terms"
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            Terms of Use
          </Link>
          <span className="text-secondary text-xs hidden sm:block" aria-hidden="true">·</span>
          <Link
            href="/contact"
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

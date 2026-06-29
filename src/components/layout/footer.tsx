"use client";

import Link from "next/link";
import { useState } from "react";
import { useSubscribed } from "@/hooks/use-subscribed";

function FooterLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent">
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

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const { subscribed, setSubscribed } = useSubscribed();

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "footer" }),
      });
      if (res.status === 409) { setState("duplicate"); return; }
      if (res.ok) { setState("success"); setSubscribed(); return; }
      setState("error");
    } catch {
      setState("error");
    }
  };

  if (subscribed) return (
    <p className="text-sm text-secondary">You&apos;re already subscribed. See you Tuesday!</p>
  );
  if (state === "success") return (
    <p className="text-sm text-accent font-medium">You&apos;re in — see you Tuesday! 🎉</p>
  );
  if (state === "duplicate") return (
    <p className="text-sm text-secondary">You&apos;re already subscribed. See you Tuesday!</p>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="your@email.com"
          className="flex-1 min-w-0 bg-surface-subtle border border-border rounded-xl py-2.5 px-3.5 text-sm text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-accent/30 transition"
        />
        <button
          onClick={handleSubmit}
          disabled={state === "loading"}
          className="shrink-0 bg-accent hover:bg-accent-deep text-white rounded-xl py-2.5 px-4 text-sm font-bold transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {state === "loading" ? "…" : "Get it free →"}
        </button>
      </div>
      {state === "error" && <p className="text-xs text-red-500">Something went wrong. Try again?</p>}
      <p className="text-xs text-secondary flex items-center gap-1.5">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9633F" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        No spam · Unsubscribe anytime
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-subtle border-t border-border">

      {/* Top band — mission + newsletter */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-14 py-10 grid md:grid-cols-2 gap-10 md:gap-16 border-b border-border">

        {/* Mission */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-3">Our mission</p>
          <p className="font-fraunces text-2xl font-light italic text-primary leading-snug mb-6">
            Making AI education <strong className="font-bold not-italic text-accent">free</strong><br className="hidden md:block" /> for every human on earth.
          </p>
          <div className="flex gap-8">
            {[
              { num: "30+", lbl: "Free articles" },
              { num: "9", lbl: "Topic pillars" },
              { num: "∞", lbl: "Always free" },
            ].map((s) => (
              <div key={s.lbl}>
                <div className="font-fraunces text-2xl font-bold text-primary leading-none">{s.num}</div>
                <div className="text-xs text-secondary mt-1 font-medium">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col justify-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">Weekly newsletter · free</p>
          <p className="font-fraunces text-base font-bold text-primary tracking-tight">AI knowledge, every Tuesday.</p>
          <FooterNewsletter />
        </div>
      </div>

      {/* Nav grid */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-14 py-10 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-border">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <FooterLogo />
          <p className="mt-3 text-sm text-secondary leading-relaxed max-w-[200px]">
            Free AI education for curious humans who want to stay ahead.
          </p>
          <div className="flex gap-2 mt-5">
            {[
              { label: "X / Twitter", href: "https://twitter.com/seekvana", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />, fill: true },
              { label: "GitHub", href: "https://github.com/seekvana", icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>, fill: false },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg bg-canvas border border-border flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill={s.fill ? "currentColor" : "none"} stroke={s.fill ? "none" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Learn */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-2.5 mb-4 inline-block">Learn</h4>
          <ul className="space-y-0">
            {[
              { label: "Getting Started", href: "/paths/getting-started" },
              { label: "All Paths", href: "/paths" },
              { label: "AI Foundations", href: "/library/ai-foundations" },
            ].map((l) => (
              <li key={l.href} className="border-b border-border last:border-none">
                <Link href={l.href} className="flex items-center justify-between py-2 text-sm text-secondary hover:text-primary hover:pl-1 transition-all group">
                  {l.label}
                  <span className="opacity-0 group-hover:opacity-100 text-accent text-xs transition-opacity">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Library */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-2.5 mb-4 inline-block">Library</h4>
          <ul className="space-y-0">
            {[
              { label: "Agentic AI", href: "/library/agentic-ai" },
              { label: "Large Language Models", href: "/library/large-language-models" },
              { label: "Building with AI", href: "/library/building-with-ai" },
              { label: "Prompt Engineering", href: "/library/prompt-engineering" },
              { label: "All 9 Topics →", href: "/library", accent: true },
            ].map((l) => (
              <li key={l.href} className="border-b border-border last:border-none">
                <Link href={l.href} className={`flex items-center justify-between py-2 text-sm hover:pl-1 transition-all group ${l.accent ? "text-accent font-medium hover:text-accent-deep" : "text-secondary hover:text-primary"}`}>
                  {l.label}
                  {!l.accent && <span className="opacity-0 group-hover:opacity-100 text-accent text-xs transition-opacity">→</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools & More */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-2.5 mb-4 inline-block">Tools & More</h4>
          <ul className="space-y-0">
            {[
              { label: "AI Tool Reviews", href: "/tools" },
              { label: "Glossary", href: "/glossary" },
              { label: "Contact", href: "/contact" },
              { label: "About Seekvana", href: "/about" },
            ].map((l) => (
              <li key={l.href} className="border-b border-border last:border-none">
                <Link href={l.href} className="flex items-center justify-between py-2 text-sm text-secondary hover:text-primary hover:pl-1 transition-all group">
                  {l.label}
                  <span className="opacity-0 group-hover:opacity-100 text-accent text-xs transition-opacity">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-14 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-secondary">© 2026 Seekvana · <span className="text-primary font-medium">Free AI education for everyone, everywhere.</span></p>
        <div className="flex items-center">
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Use", href: "/terms" },
            { label: "Contact", href: "/contact" },
          ].map((l, i) => (
            <Link key={l.href} href={l.href} className={`text-xs text-secondary hover:text-primary transition-colors px-3.5 ${i < 2 ? "border-r border-border" : ""} ${i === 0 ? "pl-0" : ""}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-secondary">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9633F" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Made for AI learners everywhere
        </div>
      </div>

    </footer>
  );
}

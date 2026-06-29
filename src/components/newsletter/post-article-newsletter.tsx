'use client'

import { useSubscribed } from '@/hooks/use-subscribed'
import { NewsletterForm } from './newsletter-form'


export function PostArticleNewsletter() {
  const { subscribed, setSubscribed } = useSubscribed()

  // null = not yet hydrated (avoid flash)
  if (subscribed === null || subscribed) return null

  return (
    <div className="relative bg-surface border border-border rounded-2xl px-8 py-9 overflow-hidden my-12" style={{ boxShadow: '0 2px 16px rgba(26,23,20,0.07)' }}>
      {/* Subtle top-right glow */}
      <div
        aria-hidden="true"
        className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,99,63,0.08) 0%, transparent 70%)' }}
      />

      {/* Left: copy + form */}
      <div className="relative">
        {/* Eyebrow */}
        <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase text-accent mb-3">
          <span className="inline-block w-4 h-px bg-accent flex-shrink-0" aria-hidden="true" />
          Weekly digest
        </p>

        <h3 className="font-fraunces text-[28px] font-medium leading-[1.2] text-primary tracking-tight mb-3">
          Help me build the AI newsletter<br />
          I always wanted to <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>read.</em>
        </h3>

        <p className="text-sm text-secondary leading-relaxed mb-6 max-w-sm">
          New articles, tool picks, and practical guides — plus a free cheatsheet when you sign up.
        </p>

        <NewsletterForm source="post-article" onSuccess={setSubscribed} />

        {/* Trust row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-xs text-secondary">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            No spam, ever
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            5-minute read
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            Free forever
          </span>
        </div>
      </div>

    </div>
  )
}

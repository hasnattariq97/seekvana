'use client'

import { useSubscribed } from '@/hooks/use-subscribed'
import { NewsletterForm } from './newsletter-form'

export function NewsletterSection() {
  const { subscribed, setSubscribed } = useSubscribed()
  if (subscribed === null || subscribed) return null

  return (
    <section className="w-full bg-canvas border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border">

          {/* Left: copy + form */}
          <div className="flex-1 bg-surface p-8 md:p-10 flex flex-col justify-center gap-5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-accent uppercase">
              Free Weekly Newsletter
            </p>

            <h2 className="font-fraunces text-[28px] md:text-[32px] text-primary font-semibold leading-tight">
              The AI knowledge<br />you <em className="not-italic text-accent">actually</em> need
            </h2>

            <p className="text-sm text-secondary leading-relaxed max-w-sm">
              New articles, tool picks, and practical guides every Tuesday — written for humans, not hype merchants.
            </p>

            <ul className="flex flex-col sm:flex-row gap-3 text-sm text-secondary">
              <li className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l2.5 2.5 5.5-5"/></svg>
                Free AI Tools Cheatsheet on signup
              </li>
              <li className="flex items-center gap-1.5 sm:ml-4">
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l2.5 2.5 5.5-5"/></svg>
                No spam, ever
              </li>
            </ul>

            <div className="max-w-sm">
              <NewsletterForm source="homepage" onSuccess={() => setTimeout(setSubscribed, 4000)} />
            </div>

            <p className="text-xs text-secondary">
              Unsubscribe anytime
            </p>
          </div>

          {/* Right: cheatsheet visual */}
          <div className="hidden md:flex w-64 lg:w-72 bg-accent-soft items-center justify-center p-8 shrink-0">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-28 h-40">
                <div className="absolute top-2 left-2 w-28 h-40 bg-border/60 rounded-xl" />
                <div className="absolute top-1 left-1 w-28 h-40 bg-surface-subtle rounded-xl border border-border" />
                <div className="relative w-28 h-40 bg-surface rounded-xl border border-border shadow-sm p-4 flex flex-col">
                  <div className="h-[3px] w-full bg-accent rounded-full mb-3" />
                  <p className="font-fraunces text-[10px] font-bold text-primary leading-tight mb-3">
                    AI TOOLS<br />CHEATSHEET
                  </p>
                  <div className="flex flex-col gap-[7px] flex-1">
                    {[88, 72, 82, 68, 78, 62, 74].map((w, i) => (
                      <div key={i} className="h-[5px] bg-surface-subtle rounded-full" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded">
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

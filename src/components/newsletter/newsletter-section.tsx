import { NewsletterForm } from './newsletter-form'

export function NewsletterSection() {
  return (
    <section className="w-full bg-canvas border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border">

          {/* Left: copy + form */}
          <div className="flex-1 bg-surface p-8 md:p-12 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-accent-soft border border-accent/20 rounded-full px-3 py-1 mb-5 w-fit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="none" aria-hidden="true">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span className="text-[11px] font-bold tracking-widest text-accent uppercase">Free Weekly Newsletter</span>
            </div>

            {/* Headline */}
            <h2 className="font-fraunces text-3xl md:text-4xl text-primary font-semibold leading-tight mb-3">
              The AI knowledge<br className="hidden md:block" /> you <span className="italic text-accent">actually</span> need.
            </h2>

            {/* Subtext */}
            <p className="text-secondary text-base leading-relaxed mb-6 max-w-md">
              Cut through the noise. Get the newest AI tools, practical guides, and real-world insights — every Tuesday.
            </p>

            {/* Benefit rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
              {[
                { label: 'Useful, not hype', sub: 'Actionable insights you can use.' },
                { label: 'Tools that deliver', sub: 'Handpicked tools worth your time.' },
                { label: 'No spam, ever', sub: 'One focused email. Unsubscribe anytime.' },
              ].map((b) => (
                <div key={b.label} className="flex items-start gap-2">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center shrink-0">
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l2.5 2.5 5.5-5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-primary leading-snug">{b.label}</p>
                    <p className="text-[12px] text-secondary leading-snug mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="max-w-md">
              <NewsletterForm source="homepage" />
            </div>
            <p className="text-xs text-secondary mt-3 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary/50"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Right: bonus panel */}
          <div className="hidden md:flex w-72 lg:w-80 bg-accent-soft items-center justify-center p-10 shrink-0">
            <div className="flex flex-col gap-5 w-full">
              {/* Free bonus badge */}
              <div className="inline-flex items-center gap-2 bg-accent text-white rounded-full px-3 py-1 w-fit text-[11px] font-bold tracking-wide uppercase">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none" aria-hidden="true">
                  <path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
                Free Bonus
              </div>

              {/* Bonus title */}
              <div>
                <h3 className="font-fraunces text-xl font-bold text-primary leading-tight mb-1">
                  Essential<br/>Agentic AI Repos
                </h3>
                <p className="text-sm text-secondary">Your instant download on signup.</p>
              </div>

              {/* Card mockup */}
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-fraunces text-[11px] font-bold text-primary uppercase tracking-wide leading-tight">Agentic<br/>AI Repos</p>
                  <div className="w-6 h-6 rounded-full bg-accent-soft flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="none">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  </div>
                </div>
                {[
                  { icon: '⚙️', text: 'Highly Effective Workflow Frameworks' },
                  { icon: '📊', text: 'Advanced Data Optimization Tools' },
                  { icon: '🔧', text: 'Powerful Automation Components' },
                  { icon: '💡', text: 'Strategic Logic & Reasoning Utilities' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-2">
                    <span className="text-[13px] shrink-0">{item.icon}</span>
                    <span className="text-[11.5px] text-primary leading-snug font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-secondary text-center">
                Curated. Tested. Updated regularly.{' '}
                <span className="text-accent font-semibold">Yours free.</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

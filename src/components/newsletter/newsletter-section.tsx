import { NewsletterForm } from './newsletter-form'

export function NewsletterSection() {
  return (
    <section className="w-full bg-canvas border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border my-16">
          {/* Left: copy + form */}
          <div className="flex-1 bg-surface p-8 md:p-12 flex flex-col justify-center">
            <p className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
              Free Weekly Newsletter
            </p>
            <h2 className="font-fraunces text-3xl md:text-4xl text-primary font-semibold leading-tight mb-3">
              The AI knowledge<br className="hidden md:block" /> you actually need
            </h2>
            <p className="text-secondary text-base leading-relaxed mb-4 max-w-md">
              New articles, tool picks, and practical guides every Tuesday — written for humans, not hype merchants.
            </p>
            <ul className="flex flex-col sm:flex-row gap-2 text-sm text-secondary mb-6">
              <li className="flex items-center gap-1.5">
                <span className="text-success font-bold">✓</span>
                Free AI Tools Cheatsheet on signup
              </li>
              <li className="flex items-center gap-1.5 sm:ml-4">
                <span className="text-success font-bold">✓</span>
                No spam, ever
              </li>
            </ul>
            <div className="max-w-md">
              <NewsletterForm source="homepage" />
            </div>
            <p className="text-xs text-secondary mt-3">
              Join 10,000+ learners · Unsubscribe anytime
            </p>
          </div>

          {/* Right: cheatsheet visual */}
          <div className="hidden md:flex w-72 lg:w-80 bg-accent-soft items-center justify-center p-10 shrink-0">
            <div className="flex flex-col items-center gap-4">
              {/* 3D-stacked card effect */}
              <div className="relative w-32 h-44">
                <div className="absolute top-3 left-3 w-32 h-44 bg-border rounded-xl" />
                <div className="absolute top-1.5 left-1.5 w-32 h-44 bg-accent-soft rounded-xl border border-border" />
                <div className="relative w-32 h-44 bg-surface rounded-xl border border-border shadow-md p-4 flex flex-col">
                  <div className="h-1 bg-accent rounded-full mb-3" />
                  <p className="font-fraunces text-xs font-bold text-primary leading-tight mb-1">
                    AI TOOLS
                  </p>
                  <p className="font-fraunces text-xs font-bold text-primary leading-tight mb-3">
                    CHEATSHEET
                  </p>
                  <div className="flex flex-col gap-1.5 flex-1">
                    {[90, 75, 85, 70, 80, 65, 75].map((w, i) => (
                      <div
                        key={i}
                        className="h-1.5 bg-surface-subtle rounded-full"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="inline-block bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">
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

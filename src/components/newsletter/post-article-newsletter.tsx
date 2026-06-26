import { NewsletterForm } from './newsletter-form'

export function PostArticleNewsletter() {
  return (
    <div className="dark relative bg-canvas rounded-2xl p-7 md:p-8 overflow-hidden">
      {/* Decorative glow circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/20 blur-xl pointer-events-none" />
      <div className="absolute -bottom-6 right-16 w-20 h-20 rounded-full bg-accent/10 blur-xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <p className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
            Enjoyed this article?
          </p>
          <h3 className="font-fraunces text-xl md:text-2xl font-semibold text-primary leading-snug mb-2">
            Get the best of Seekvana every Tuesday
          </h3>
          <p className="text-sm text-secondary mb-5">
            New articles, AI tool picks, and practical guides. Free cheatsheet on signup.
          </p>
          <NewsletterForm source="post-article" dark />
        </div>
        <div className="text-5xl md:text-6xl opacity-60 shrink-0 hidden sm:block">
          📬
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Seekvana',
  description: 'Get in touch with the Seekvana team — for corrections, suggestions, partnerships, or general enquiries.',
}

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Contact</span>
      </nav>

      <h1 className="font-fraunces text-4xl text-primary mb-3">Get in touch</h1>
      <p className="text-secondary leading-relaxed mb-10">
        We read every message. Whether you&apos;ve spotted an error, have a question about the content,
        or want to work together — reach out and we&apos;ll get back to you.
      </p>

      {/* Primary contact */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-4">Email us directly</p>
        <a
          href="mailto:seekvanateam@gmail.com"
          className="font-fraunces text-xl text-accent hover:text-accent-deep transition-colors"
        >
          seekvanateam@gmail.com
        </a>
        <p className="text-sm text-secondary mt-2">We aim to respond within 2–3 business days.</p>
      </div>

      {/* What to contact for */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-4">What you can reach us about</p>
        <ul className="space-y-3">
          {[
            { label: 'Content corrections', desc: 'Spotted a factual error or outdated information in an article' },
            { label: 'Suggestions', desc: 'Topics you\'d like us to cover or learning paths you\'d find useful' },
            { label: 'Partnerships & collaborations', desc: 'Guest articles, co-created content, or tool partnerships' },
            { label: 'Advertising enquiries', desc: 'Sponsored content, direct ad placements, or media kit requests' },
            { label: 'Privacy & data requests', desc: 'Exercising your data rights under GDPR or other privacy laws' },
            { label: 'General questions', desc: 'Anything else about Seekvana or its content' },
          ].map(({ label, desc }) => (
            <li key={label} className="flex gap-3">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
              <div>
                <span className="text-sm font-medium text-primary">{label}</span>
                <span className="text-sm text-secondary"> — {desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Social */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-10">
        <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-4">Follow us</p>
        <div className="flex flex-col gap-3">
          <a
            href="https://twitter.com/seekvana"
            className="text-sm text-accent hover:text-accent-deep transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter / X — @seekvana
          </a>
        </div>
      </div>

      {/* Legal links */}
      <p className="text-xs text-secondary text-center">
        <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:text-accent transition-colors">Terms of Use</Link>
      </p>
    </div>
  )
}

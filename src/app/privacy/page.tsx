import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Seekvana',
  description: 'How Seekvana collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Privacy Policy</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-secondary">
        <p className="text-sm">Last updated: June 2026</p>
        <p>Seekvana (<strong className="text-primary">seekvana.com</strong>) is a free AI learning resource. We take privacy seriously and collect minimal data.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">What we collect</h2>
        <p>We use analytics (Google Analytics) to understand how visitors use the site — page views, device type, and referring sources. No personally identifiable information is collected without your explicit consent.</p>
        <p>If you subscribe to our newsletter, we store your email address to send you updates. You can unsubscribe at any time.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Advertising</h2>
        <p>We display ads via Google AdSense. Google may use cookies to personalize ads based on your browsing history. You can opt out via <a href="https://adssettings.google.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Contact</h2>
        <p>Questions? Email us at <Link href="/contact" className="text-accent hover:underline">our contact page</Link>.</p>
      </div>
    </div>
  )
}

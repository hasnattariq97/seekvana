import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — Seekvana',
  description: 'Terms and conditions for using Seekvana.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Terms of Use</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-6">Terms of Use</h1>
      <div className="space-y-4 text-secondary">
        <p className="text-sm">Last updated: June 2026</p>
        <p>By accessing Seekvana, you agree to these terms. If you disagree, please do not use the site.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Content</h2>
        <p>All content on Seekvana is for educational purposes. We aim for accuracy but make no guarantees. The AI field moves fast — always verify important information from primary sources.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Intellectual property</h2>
        <p>All original content is © 2026 Seekvana. You may share excerpts with attribution. You may not reproduce full articles without permission.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Affiliate links</h2>
        <p>Some links on Seekvana are affiliate links. We may earn a commission if you purchase through them, at no cost to you. We only recommend tools we believe in.</p>
        <h2 className="font-fraunces text-xl text-primary mt-8 mb-3">Contact</h2>
        <p>Questions? <Link href="/contact" className="text-accent hover:underline">Get in touch</Link>.</p>
      </div>
    </div>
  )
}

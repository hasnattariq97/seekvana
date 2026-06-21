import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Seekvana',
  description: 'Get in touch with the Seekvana team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Contact</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-4">Get in touch</h1>
      <p className="text-secondary mb-8">
        Found an error? Have a suggestion? Want to collaborate? We&apos;d love to hear from you.
      </p>
      <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Email</p>
          <a href="mailto:hello@seekvana.com" className="text-accent hover:underline text-sm">
            hello@seekvana.com
          </a>
        </div>
        <div>
          <p className="text-sm font-medium text-primary mb-1">Twitter / X</p>
          <a
            href="https://twitter.com/seekvana"
            className="text-accent hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            @seekvana
          </a>
        </div>
      </div>
    </div>
  )
}

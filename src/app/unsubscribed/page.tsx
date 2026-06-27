import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Unsubscribed — Seekvana',
  description: "You've been removed from the Seekvana newsletter.",
  robots: { index: false },
}

export default function UnsubscribedPage() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-4xl mb-6">👋</div>
        <h1 className="font-fraunces text-3xl font-medium text-primary mb-3">
          You&apos;ve been unsubscribed
        </h1>
        <p className="font-inter text-base text-secondary mb-8">
          You won&apos;t receive any more emails from Seekvana. If you change your mind,
          you can always subscribe again.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent-deep transition-colors"
        >
          Back to Seekvana
        </Link>
      </div>
    </main>
  )
}

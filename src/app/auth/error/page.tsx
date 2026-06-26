import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="font-fraunces text-2xl text-primary mb-2">Sign in failed</h1>
        <p className="text-secondary text-sm mb-6">
          The link may have expired or already been used. Links expire after 1 hour.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-accent-deep text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition"
        >
          Back to Seekvana
        </Link>
      </div>
    </div>
  )
}

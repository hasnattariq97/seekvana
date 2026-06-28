'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-fraunces text-3xl text-primary">Something went wrong</h1>
      <p className="text-secondary max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-accent text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-accent-deep transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-border text-primary rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-surface-subtle transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

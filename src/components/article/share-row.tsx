'use client'

import { useState, useEffect, useRef } from 'react'
import { Link2, Check } from 'lucide-react'

interface ShareRowProps {
  url: string // absolute canonical article URL
  title: string // article title
  label: string // "Share" (top) or "Share this article" (bottom)
}

const BTN =
  'inline-flex items-center justify-center h-9 w-9 rounded-lg bg-surface-subtle border border-border text-secondary hover:text-accent hover:border-accent transition-colors'
const ICON = 'h-4 w-4'

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
      <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.017.941-.008.032c0 1.201.986 2.181 2.201 2.181 1.216 0 2.201-.98 2.201-2.181A2.186 2.186 0 0 0 20.226 2c-.928 0-1.732.573-2.045 1.382l-4.435-1.04a.522.522 0 0 0-.634.363l-1.658 5.213c-2.75.061-5.24.819-7.077 2.028a2.65 2.65 0 0 0-1.821-.74C1.192 9.134 0 10.32 0 11.779c0 .921.474 1.734 1.19 2.207a4.078 4.078 0 0 0-.062.7c0 3.542 4.121 6.42 9.199 6.42 5.078 0 9.199-2.878 9.199-6.42 0-.23-.021-.457-.062-.679.717-.472 1.207-1.296 1.207-2.228zm-17 1.463c0-.82.671-1.488 1.484-1.488.813 0 1.484.668 1.484 1.488s-.671 1.487-1.484 1.487c-.813 0-1.484-.667-1.484-1.487zm8.949 4.187c-.881.881-2.57.949-3.065.949-.496 0-2.185-.068-3.066-.949a.334.334 0 0 1 0-.472.334.334 0 0 1 .472 0c.556.556 1.739.752 2.594.752.855 0 2.038-.196 2.594-.752a.334.334 0 0 1 .472 0 .334.334 0 0 1-.001.472zm-.408-2.7c-.813 0-1.484-.667-1.484-1.487 0-.82.671-1.488 1.484-1.488.813 0 1.484.668 1.484 1.488s-.671 1.487-1.484 1.487z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function ShareRow({ url, title, label }: ShareRowProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const links = [
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, icon: <XIcon /> },
    { name: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${t}`, icon: <RedditIcon /> },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <LinkedInIcon /> },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <FacebookIcon /> },
  ]

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked (e.g. insecure context) — silently no-op
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-secondary">{label}</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className={BTN}
        >
          {l.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className={copied ? `${BTN} w-auto px-3 gap-1.5 text-accent border-accent` : BTN}
      >
        {copied ? <Check className={ICON} /> : <Link2 className={ICON} />}
        {copied && <span className="text-sm">Copied!</span>}
      </button>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { ChevronDown, MessageSquare, Bug, AlertCircle, Lightbulb } from 'lucide-react'
import { submitFeedback } from '@/lib/feedback-actions'

const CATEGORIES = [
  { type: 'general',    icon: MessageSquare, label: 'General' },
  { type: 'bug',        icon: Bug,           label: 'Bug report' },
  { type: 'mistake',    icon: AlertCircle,   label: 'Mistake' },
  { type: 'suggestion', icon: Lightbulb,     label: 'Suggestion' },
] as const

type FeedbackType = typeof CATEGORIES[number]['type']

export function FooterFeedback() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [messageError, setMessageError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessageError(null)
    setServerError(null)

    if (message.trim().length < 10) {
      setMessageError('Message must be at least 10 characters.')
      return
    }
    if (message.trim().length > 1000) {
      setMessageError('Message must be under 1000 characters.')
      return
    }

    startTransition(async () => {
      const result = await submitFeedback({
        type,
        message: message.trim(),
        email: email.trim(),
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      })
      if (result.error) {
        setServerError(result.error)
        return
      }
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setOpen(false)
        setMessage('')
        setEmail('')
        setType('general')
      }, 3000)
    })
  }

  return (
    <div className="border-t border-border">
      {/* Accordion trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 md:px-14 py-4 text-sm text-secondary hover:text-primary transition-colors group"
        aria-expanded={open}
        aria-controls="footer-feedback-panel"
      >
        <span className="font-medium">Send feedback</span>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 group-hover:text-accent"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </button>

      {/* Expandable panel */}
      <div
        id="footer-feedback-panel"
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-6 md:px-14 pb-8">
            {done ? (
              <p className="text-sm text-secondary text-center py-4">
                Thanks! Your feedback helps us improve Seekvana.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-xl">
                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIES.map(({ type: t, icon: Icon, label }) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        type === t
                          ? 'bg-accent-soft border-accent text-accent'
                          : 'border-border text-secondary hover:border-accent/50 hover:text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <div className="mb-3">
                  <label htmlFor="feedback-message" className="sr-only">Message</label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="Your message…"
                    className="w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    {messageError
                      ? <p className="text-xs text-red-600 dark:text-red-400">{messageError}</p>
                      : <span />}
                    <span className="text-xs text-secondary">{message.length}/1000</span>
                  </div>
                </div>

                {/* Email + submit row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label htmlFor="feedback-email" className="sr-only">Email address</label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={254}
                      placeholder="Email (optional)"
                      className="w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 bg-accent hover:bg-accent-deep text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {isPending ? 'Sending…' : 'Send feedback →'}
                  </button>
                </div>

                {serverError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">{serverError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

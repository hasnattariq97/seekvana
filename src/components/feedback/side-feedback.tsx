'use client'

import { useState, useTransition } from 'react'
import { X, MessageSquare, Bug, AlertCircle, Lightbulb } from 'lucide-react'
import { submitFeedback } from '@/lib/feedback-actions'

const CATEGORIES = [
  { type: 'general',    icon: MessageSquare, label: 'General' },
  { type: 'bug',        icon: Bug,           label: 'Bug' },
  { type: 'mistake',    icon: AlertCircle,   label: 'Mistake' },
  { type: 'suggestion', icon: Lightbulb,     label: 'Suggest' },
] as const

type FeedbackType = typeof CATEGORIES[number]['type']

export function SideFeedback() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [messageError, setMessageError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClose() {
    setOpen(false)
    setMessage('')
    setEmail('')
    setType('general')
    setMessageError(null)
    setServerError(null)
    setDone(false)
  }

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
      setTimeout(handleClose, 3000)
    })
  }

  return (
    <>
      {/* Side tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open feedback form"
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-deep text-white text-xs font-semibold px-3 py-2 rounded-l-lg shadow-lg transition-colors"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Feedback
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        className="fixed right-0 top-0 h-full w-80 z-50 bg-surface border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Feedback form"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-accent mb-0.5">Seekvana</p>
            <h2 className="font-fraunces text-base font-medium text-primary">Share your feedback</h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close feedback form"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-subtle transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {done ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
              <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <p className="font-fraunces text-lg text-primary">Thank you!</p>
              <p className="text-sm text-secondary">Your feedback helps us improve Seekvana.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-secondary leading-relaxed">
                Found a bug, spotted a mistake, or have a suggestion? We read every message.
              </p>

              {/* Category pills */}
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(({ type: t, icon: Icon, label }) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      type === t
                        ? 'bg-accent-soft border-accent text-accent'
                        : 'border-border text-secondary hover:border-accent/50 hover:text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="side-feedback-message" className="sr-only">Message</label>
                <textarea
                  id="side-feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={1000}
                  placeholder="Your message…"
                  className="w-full rounded-lg border border-border bg-canvas px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition resize-none"
                />
                <div className="flex items-center justify-between mt-1">
                  {messageError
                    ? <p className="text-xs text-red-600 dark:text-red-400">{messageError}</p>
                    : <span />}
                  <span className="text-xs text-secondary">{message.length}/1000</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="side-feedback-email" className="sr-only">Email address</label>
                <input
                  id="side-feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  placeholder="Email (optional — for a reply)"
                  className="w-full rounded-lg border border-border bg-canvas px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
                />
              </div>

              {serverError && (
                <p className="text-xs text-red-600 dark:text-red-400">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-deep text-white rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {isPending ? 'Sending…' : 'Send feedback →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

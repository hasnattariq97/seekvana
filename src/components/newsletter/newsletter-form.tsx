'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

type NewsletterFormProps = {
  source: 'homepage' | 'post-article'
  dark?: boolean
}

export function NewsletterForm({ source, dark = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = async () => {
    if (!email.trim()) {
      triggerShake()
      setErrorMsg('Please enter your email')
      setState('error')
      return
    }

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      const data = await res.json()

      if (res.status === 409) {
        setState('duplicate')
        return
      }
      if (!res.ok) {
        setState('error')
        setErrorMsg(data.message ?? 'Something went wrong. Try again?')
        return
      }
      setState('success')
    } catch {
      setState('error')
      setErrorMsg('Something went wrong. Try again?')
    }
  }

  const inputClass = dark
    ? 'flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-accent/50 transition'
    : 'flex-1 min-w-0 border border-border rounded-xl py-2.5 px-4 text-sm text-primary bg-surface outline-none focus:ring-2 focus:ring-accent/30 transition'

  const buttonClass =
    'shrink-0 bg-accent hover:bg-accent-deep text-white rounded-xl py-2.5 px-5 text-sm font-bold transition-colors disabled:opacity-60 whitespace-nowrap'

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-1"
      >
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-fraunces text-lg font-semibold mb-1 text-primary">
          You&apos;re in!
        </p>
        <p className="text-sm mb-3 text-secondary">
          First issue lands Tuesday. Check your inbox for the free cheatsheet.
        </p>
        <a
          href="#"
          className="inline-block bg-accent hover:bg-accent-deep text-white rounded-lg px-4 py-2 text-sm font-bold transition-colors"
        >
          Download Cheatsheet →
        </a>
      </motion.div>
    )
  }

  if (state === 'duplicate') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-1"
      >
        <div className="text-2xl mb-2">🎉</div>
        <p className="text-sm font-semibold text-primary">
          You&apos;re already on the list!
        </p>
        <p className="text-xs mt-1 text-secondary">
          See you Tuesday.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div
        animate={shake ? { x: [0, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') { setState('idle'); setErrorMsg('') } }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          className={inputClass}
        />
        <button
          onClick={handleSubmit}
          disabled={state === 'loading'}
          className={buttonClass}
        >
          {state === 'loading' ? 'Subscribing…' : 'Get it free →'}
        </button>
      </motion.div>
      <AnimatePresence>
        {state === 'error' && errorMsg && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-xs mt-1.5 ${dark ? 'text-red-400' : 'text-red-500'}`}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

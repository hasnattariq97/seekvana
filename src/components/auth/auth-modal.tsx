'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'

type ModalState = 'idle' | 'loading' | 'sent' | 'error'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<ModalState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Reset form when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      const t = setTimeout(() => {
        setEmail('')
        setState('idle')
        setErrorMsg('')
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isAuthModalOpen])

  // Close on Escape
  useEffect(() => {
    if (!isAuthModalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isAuthModalOpen, closeAuthModal])

  const handleMagicLink = async () => {
    if (!email.trim()) return
    setState('loading')
    const supabase = createClient()
    const returnTo = sessionStorage.getItem('returnTo') ?? '/'
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    })
    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setState('sent')
    }
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    const returnTo = sessionStorage.getItem('returnTo') ?? '/'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
      },
    })
    if (error) {
      setState('error')
      setErrorMsg(error.message)
    }
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAuthModal}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-surface border border-border rounded-t-2xl sm:rounded-2xl p-8 w-full sm:max-w-sm shadow-2xl text-center"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1 text-secondary hover:text-primary transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {state !== 'sent' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-11 h-11 bg-accent-soft rounded-xl mx-auto mb-4 flex items-center justify-center text-xl">
                    🧭
                  </div>
                  <h2 className="font-fraunces text-xl text-primary font-semibold mb-1">
                    Welcome to Seekvana
                  </h2>
                  <p className="text-secondary text-sm mb-6">
                    Track progress · Comment · Save articles
                  </p>

                  {/* Google — first for highest conversion */}
                  <button
                    onClick={handleGoogle}
                    className="w-full border border-border rounded-xl py-2.5 px-4 text-sm font-semibold text-primary flex items-center justify-center gap-2 hover:bg-surface-subtle transition-colors mb-3"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-secondary">or email</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                    placeholder="your@email.com"
                    className="w-full border border-border rounded-xl py-2.5 px-4 text-sm text-primary bg-transparent mb-2.5 outline-none focus:ring-2 focus:ring-accent/30 transition"
                  />

                  {state === 'error' && (
                    <p className="text-red-500 text-xs mb-2 text-left">{errorMsg}</p>
                  )}

                  <button
                    onClick={handleMagicLink}
                    disabled={state === 'loading'}
                    className="w-full bg-accent hover:bg-accent-deep text-white rounded-xl py-2.5 text-sm font-bold transition-colors disabled:opacity-60 mb-4"
                  >
                    {state === 'loading' ? 'Sending…' : 'Send magic link →'}
                  </button>

                  <p className="text-xs text-secondary">
                    By signing in you agree to our{' '}
                    <a href="/terms" className="text-accent underline underline-offset-2">
                      Terms
                    </a>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-4xl mb-3">📬</div>
                  <h2 className="font-fraunces text-xl text-primary font-semibold mb-2">
                    Check your inbox
                  </h2>
                  <p className="text-secondary text-sm mb-2">We sent a magic link to</p>
                  <p className="text-accent font-semibold text-sm mb-4">{email}</p>
                  <div className="bg-accent-soft rounded-xl p-3 text-xs text-secondary text-left mb-4">
                    Click the link in your email to sign in. Link expires in 1 hour.
                  </div>
                  <button
                    onClick={() => setState('idle')}
                    className="text-xs text-secondary hover:text-accent transition-colors"
                  >
                    Wrong email? Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

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
            className="relative w-full sm:max-w-[368px] overflow-hidden"
            style={{
              background: 'var(--color-canvas)',
              border: '1px solid #D0CAC1',
              borderRadius: '24px',
              boxShadow: '0 2px 0 rgba(255,255,255,0.9) inset, 0 40px 80px rgba(26,23,20,0.18), 0 12px 32px rgba(26,23,20,0.1)',
            }}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close */}
            <button
              onClick={closeAuthModal}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(26,23,20,0.06)', border: '1px solid rgba(26,23,20,0.08)' }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#6B6560" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {state !== 'sent' ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  {/* Hero section */}
                  <div
                    className="px-8 pt-9 pb-[26px] text-center relative overflow-hidden border-b"
                    style={{ background: 'linear-gradient(170deg,#EDE8DF 0%,var(--color-canvas) 100%)', borderColor: '#E4DED6' }}
                  >
                    {/* Glow */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-40 h-24 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse, rgba(201,99,63,0.12) 0%, transparent 70%)' }} />

                    {/* Logo ring */}
                    <div
                      className="w-14 h-14 rounded-2xl inline-flex items-center justify-center mb-[18px] relative z-10"
                      style={{ background: 'var(--color-canvas)', border: '1px solid #D0CAC1', boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 16px rgba(26,23,20,0.1), 0 0 0 4px rgba(201,99,63,0.07)' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent">
                        <path d="M12 1.5 L10.5 10.5 L12 12 L13.5 10.5 Z" fill="currentColor" />
                        <path d="M12 22.5 L10.5 13.5 L12 12 L13.5 13.5 Z" fill="currentColor" fillOpacity="0.14" />
                        <path d="M22.5 12 L13.5 10.5 L12 12 L13.5 13.5 Z" fill="currentColor" fillOpacity="0.28" />
                        <path d="M1.5 12 L10.5 10.5 L12 12 L10.5 13.5 Z" fill="currentColor" fillOpacity="0.28" />
                      </svg>
                    </div>

                    <h2 className="font-fraunces text-[22px] font-bold relative z-10" style={{ letterSpacing: '-0.5px', color: 'var(--color-text-primary)' }}>
                      Welcome to <span style={{ color: 'var(--color-text-primary)' }}>Seek</span><span style={{ color: 'var(--color-accent)' }}>vana</span>
                    </h2>
                    <p className="text-[12px] text-secondary mt-1.5 mb-[18px] relative z-10">
                      Your AI learning journey starts here
                    </p>

                    {/* Feature pills */}
                    <div className="flex items-center justify-center gap-[5px] flex-wrap relative z-10">
                      {[
                        { label: 'Track progress', icon: <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="15"/><path d="M20 21H4"/><path d="M17 15l-5 3-5-3"/></svg> },
                        { label: 'Comment', icon: <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                        { label: 'Save articles', icon: <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
                      ].map(f => (
                        <span key={f.label} className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-medium" style={{ background: 'rgba(201,99,63,0.07)', border: '1px solid rgba(201,99,63,0.15)', color: '#A06040' }}>
                          {f.icon}{f.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 pt-[22px] pb-6 flex flex-col gap-[10px]">
                    {/* Google */}
                    <button
                      onClick={handleGoogle}
                      className="flex items-center justify-center gap-[10px] w-full py-3 px-4 rounded-xl text-[13px] font-semibold text-primary transition-colors hover:bg-surface-subtle"
                      style={{ background: 'white', border: '1.5px solid #D0CAC1', boxShadow: '0 1px 4px rgba(26,23,20,0.07)' }}
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: '#E4DED6' }} />
                      <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: '#B0AA9E' }}>or with email</span>
                      <div className="flex-1 h-px" style={{ background: '#E4DED6' }} />
                    </div>

                    {/* Email input */}
                    <div className="relative">
                      <div className="absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B0AA9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                        placeholder="your@email.com"
                        className="w-full py-3 pl-[38px] pr-4 rounded-xl text-[13px] text-primary outline-none transition-all"
                        style={{ background: '#EDE8DF', border: '1.5px solid #D0CAC1', boxShadow: '0 1px 3px rgba(26,23,20,0.05) inset' }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.background = 'var(--color-canvas)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,99,63,0.1)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#D0CAC1'; e.currentTarget.style.background = '#EDE8DF'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,23,20,0.05) inset' }}
                      />
                    </div>

                    {state === 'error' && (
                      <p className="text-red-500 text-xs -mt-1">{errorMsg}</p>
                    )}

                    {/* Magic link CTA */}
                    <button
                      onClick={handleMagicLink}
                      disabled={state === 'loading'}
                      className="w-full flex flex-col items-center justify-center gap-[3px] py-[14px] px-4 rounded-xl disabled:opacity-60 transition-all duration-150 hover:-translate-y-px active:translate-y-0"
                      style={{ background: 'var(--color-accent)', border: 'none', boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 6px 20px rgba(201,99,63,0.4), 0 2px 6px rgba(26,23,20,0.15)' }}
                    >
                      <span className="text-[14px] font-bold text-white flex items-center gap-[7px]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                        {state === 'loading' ? 'Sending…' : 'Send magic link'}
                      </span>
                      {state !== 'loading' && (
                        <span className="text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.55)' }}>No password needed · check your inbox</span>
                      )}
                    </button>

                    {/* Terms */}
                    <p className="text-center text-[11px] leading-relaxed" style={{ color: '#B0AA9E' }}>
                      By signing in you agree to our{' '}
                      <a href="/terms" className="underline underline-offset-2" style={{ color: '#8A8078' }}>Terms</a>
                      {' '}and{' '}
                      <a href="/privacy" className="underline underline-offset-2" style={{ color: '#8A8078' }}>Privacy Policy</a>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                  {/* Hero */}
                  <div
                    className="px-7 pt-9 pb-7 text-center relative overflow-hidden border-b"
                    style={{ background: 'linear-gradient(170deg,#EDE8DF 0%,var(--color-canvas) 100%)', borderColor: '#E4DED6' }}
                  >
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-44 h-28 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse,rgba(201,99,63,0.10) 0%,transparent 70%)' }} />

                    {/* Envelope + check icon tile */}
                    <div
                      className="w-[60px] h-[60px] rounded-[18px] inline-flex items-center justify-center mb-[18px] relative z-10"
                      style={{ background: 'var(--color-canvas)', border: '1px solid #D0CAC1', boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 16px rgba(26,23,20,0.1), 0 0 0 5px rgba(201,99,63,0.06)' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="3" y="7" width="22" height="16" rx="2.5" stroke="var(--color-accent)" strokeWidth="1.6"/>
                        <path d="M3 10l11 7 11-7" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="21" cy="9" r="4" fill="var(--color-canvas)" stroke="var(--color-accent)" strokeWidth="1.4"/>
                        <path d="M19.2 9l1.3 1.3 2-2" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <h2 className="font-fraunces text-[21px] font-bold text-primary relative z-10" style={{ letterSpacing: '-0.4px' }}>
                      Check your inbox
                    </h2>
                    <p className="text-[12px] text-secondary mt-1.5 relative z-10">We sent a magic link to</p>
                    <span
                      className="inline-block text-[13px] font-semibold mt-2 px-[10px] py-[3px] rounded-[6px] relative z-10"
                      style={{ color: 'var(--color-accent)', background: 'rgba(201,99,63,0.07)', border: '1px solid rgba(201,99,63,0.15)' }}
                    >
                      {email}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-6 pt-5 pb-6 flex flex-col gap-3">
                    {/* Info strip */}
                    <div className="flex items-start gap-[11px] p-[14px] rounded-xl" style={{ background: '#EDE8DF', border: '1px solid #D9D4CB' }}>
                      <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-px" style={{ background: 'var(--color-canvas)', border: '1px solid #D0CAC1' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.71 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.9.35 1.85.58 2.81.71A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-primary mb-0.5">Click the link in your email to sign in</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: '#9E9890' }}>Check your spam folder if you don't see it within a minute</p>
                      </div>
                    </div>

                    {/* Expiry row */}
                    <div className="flex items-center gap-2 px-[14px] py-[10px] rounded-[10px]" style={{ background: '#EDE8DF', border: '1px solid #D9D4CB' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9E9890" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="text-[11px] flex-1" style={{ color: '#9E9890' }}>Link expires in</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: 'var(--color-accent)', background: 'rgba(201,99,63,0.08)', border: '1px solid rgba(201,99,63,0.15)' }}>
                        1 hour
                      </span>
                    </div>

                    {/* Open email CTA */}
                    <button
                      onClick={() => { const domain = email.split('@')[1]; window.open(`https://${domain}`, '_blank') }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white transition-colors"
                      style={{ background: 'var(--color-accent)', boxShadow: '0 1px 0 rgba(255,255,255,0.15) inset, 0 6px 20px rgba(201,99,63,0.35)' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Open email app
                    </button>

                    <p className="text-center text-[12px]" style={{ color: '#9E9890' }}>
                      Wrong email?{' '}
                      <button onClick={() => setState('idle')} className="font-semibold" style={{ color: 'var(--color-accent)', borderBottom: '1px solid rgba(201,99,63,0.3)' }}>
                        Try again
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

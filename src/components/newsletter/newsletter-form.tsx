'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

type NewsletterFormProps = {
  source: 'homepage' | 'post-article'
  dark?: boolean
  onSuccess?: () => void
}

const confettiPieces = [
  { left: '8%', dur: '3.2s', delay: '0.1s', shape: 'rect', color: '#C9633F', op: 0.5, w: 7, h: 7 },
  { left: '22%', dur: '2.8s', delay: '0.5s', shape: 'circle', color: '#D4A574', op: 0.45, w: 6, h: 6 },
  { left: '38%', dur: '3.6s', delay: '0s', shape: 'tri', color: '#C9633F', op: 0.35, w: 6, h: 6 },
  { left: '54%', dur: '2.6s', delay: '0.7s', shape: 'wide', color: '#8B6F5E', op: 0.45, w: 8, h: 4 },
  { left: '68%', dur: '3.1s', delay: '0.3s', shape: 'rect', color: '#C9633F', op: 0.4, w: 6, h: 6, rotate: true },
  { left: '80%', dur: '2.9s', delay: '0.9s', shape: 'circle', color: '#D4A574', op: 0.5, w: 5, h: 5 },
  { left: '91%', dur: '3.4s', delay: '0.2s', shape: 'tri', color: '#8B6F5E', op: 0.35, w: 6, h: 6 },
]

function ConfettiPiece({ piece }: { piece: typeof confettiPieces[0] }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: piece.left,
    animation: `seekvana-confetti-fall ${piece.dur} linear ${piece.delay} infinite`,
  }
  const svgProps = { width: piece.w, height: piece.h }
  let svgContent: React.ReactNode
  if (piece.shape === 'rect') {
    svgContent = <rect width={piece.w} height={piece.h} rx="1" fill={piece.color} opacity={piece.op} transform={piece.rotate ? `rotate(30 ${piece.w / 2} ${piece.h / 2})` : undefined} />
  } else if (piece.shape === 'circle') {
    const r = piece.w / 2
    svgContent = <circle cx={r} cy={r} r={r} fill={piece.color} opacity={piece.op} />
  } else if (piece.shape === 'tri') {
    svgContent = <polygon points={`${piece.w / 2},0 ${piece.w},${piece.h} 0,${piece.h}`} fill={piece.color} opacity={piece.op} />
  } else {
    svgContent = <rect width={piece.w} height={piece.h} rx="1" fill={piece.color} opacity={piece.op} />
  }
  return (
    <div style={style}>
      <svg {...svgProps}>{svgContent}</svg>
    </div>
  )
}

function CheckMark() {
  return (
    <div style={{ marginBottom: 18, position: 'relative', zIndex: 1, display: 'inline-flex' }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(201,99,63,0.08)', border: '1px solid rgba(201,99,63,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 7px rgba(201,99,63,0.04)',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', background: '#C9633F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(201,99,63,0.4)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
    </div>
  )
}

const expectItems = [
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9633F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    text: 'New Seekvana articles',
    sub: '· published that week',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9633F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    text: 'Handpicked AI tools & news',
    sub: '· no fluff',
  },
  {
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9633F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    text: 'Must-have GitHub repos',
    sub: '· curated picks',
  },
]

function ExpectStrip({ label, items }: { label: string; items: typeof expectItems }) {
  return (
    <div style={{
      background: '#EDE8DF', border: '1px solid #D9D4CB', borderRadius: 12,
      padding: '14px 16px', textAlign: 'left', marginBottom: 18,
      position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9E9890', fontWeight: 600, marginBottom: 2 }}>
        {label}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#F5F0E8',
            border: '1px solid #D0CAC1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {item.icon}
          </div>
          <div style={{ fontSize: 12, color: '#1A1714', fontWeight: 500, lineHeight: 1.35 }}>
            {item.text} <span style={{ color: '#9E9890', fontWeight: 400, fontSize: 11 }}>{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function HintRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#B0AA9E', position: 'relative', zIndex: 1 }}>
      {icon}
      {text}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#F5F0E8',
  border: '1px solid #D0CAC1',
  borderRadius: 20,
  padding: '28px 32px 24px',
  textAlign: 'center',
  boxShadow: '0 24px 64px rgba(26,23,20,0.12),0 4px 16px rgba(26,23,20,0.06),0 2px 0 rgba(255,255,255,0.8) inset',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
}

const versionTagStyle: React.CSSProperties = {
  position: 'absolute', top: 14, left: 14,
  fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
  color: '#9E9890', background: '#EDE8DF', border: '1px solid #D9D4CB',
  padding: '3px 8px', borderRadius: 20,
}

function SuccessCard() {
  return (
    <div style={cardStyle}>
      <style>{`
        @keyframes seekvana-confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(380px) rotate(400deg); opacity: 0; }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confettiPieces.map((p, i) => <ConfettiPiece key={i} piece={p} />)}
      </div>
      <div style={versionTagStyle}>New subscriber</div>

      <CheckMark />

      <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: 24, fontWeight: 700, color: '#1A1714', letterSpacing: '-0.4px', marginBottom: 8, position: 'relative', zIndex: 1 }}>
        You&apos;re <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#C9633F' }}>in!</span>
      </div>
      <p style={{ fontSize: 13, color: '#6B6560', lineHeight: 1.65, marginBottom: 24, position: 'relative', zIndex: 1 }}>
        First issue lands <strong style={{ color: '#1A1714' }}>this Tuesday.</strong><br />
        Your free cheatsheet is on its way now.
      </p>

      <ExpectStrip label="Every Tuesday you'll get" items={expectItems.slice(0, 2)} />

      <HintRow
        icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B0AA9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
        text="Confirm your email to receive the cheatsheet"
      />
    </div>
  )
}

function DuplicateCard() {
  return (
    <div style={cardStyle}>
      <style>{`
        @keyframes seekvana-confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(380px) rotate(400deg); opacity: 0; }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confettiPieces.map((p, i) => <ConfettiPiece key={i} piece={p} />)}
      </div>
      <div style={versionTagStyle}>Already subscribed</div>

      <CheckMark />

      <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: 24, fontWeight: 700, color: '#1A1714', letterSpacing: '-0.4px', marginBottom: 8, position: 'relative', zIndex: 1 }}>
        You&apos;re already on<br />the <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#C9633F' }}>list!</span>
      </div>
      <p style={{ fontSize: 13, color: '#6B6560', lineHeight: 1.65, marginBottom: 16, position: 'relative', zIndex: 1 }}>
        Good taste. Next issue drops <strong style={{ color: '#1A1714' }}>this Tuesday</strong> — check your inbox.
      </p>

      <ExpectStrip label="Every Tuesday you'll get" items={expectItems.slice(0, 2)} />

      <HintRow
        icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B0AA9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
        text="Check spam if you don't see it within a minute"
      />
    </div>
  )
}

export function NewsletterForm({ source, dark = false, onSuccess }: NewsletterFormProps) {
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
      onSuccess?.()
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
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <SuccessCard />
      </motion.div>
    )
  }

  if (state === 'duplicate') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <DuplicateCard />
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

'use client'

import { useState, useId } from 'react'
import { useReducedMotion } from 'framer-motion'

interface FAQProps {
  children: React.ReactNode
  heading?: string
}

interface FAQItemProps {
  question: string
  children: React.ReactNode
}

export function FAQ({ children, heading = 'Common questions' }: FAQProps) {
  return (
    <section className="my-10" aria-label="Frequently asked questions">
      <p className="font-inter text-xs font-semibold tracking-widest uppercase text-accent mb-2">
        FAQ
      </p>
      <h2 className="font-fraunces text-2xl font-medium text-primary mb-8 scroll-mt-20">
        {heading}
      </h2>
      <ul className="border-t border-border" role="list">
        {children}
      </ul>
    </section>
  )
}

export function FAQItem({ question, children }: FAQItemProps) {
  const [open, setOpen] = useState(false)
  const shouldReduce = useReducedMotion() ?? false
  const id = useId()

  return (
    <li
      className={`border-b border-border rounded-sm transition-colors duration-200 ${
        open ? 'bg-accent-soft' : ''
      }`}
    >
      <button
        id={`faq-btn-${id}`}
        aria-controls={`faq-panel-${id}`}
        className="w-full flex items-start justify-between gap-4 px-4 py-5 text-left cursor-pointer bg-transparent border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`font-fraunces text-lg font-medium leading-snug transition-colors duration-150 ${
            open ? 'text-accent-deep' : 'text-primary'
          }`}
        >
          {question}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 mt-0.5 transition-colors duration-150 ${
            open ? 'text-accent-deep' : 'text-secondary'
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              transition: shouldReduce ? undefined : 'transform 0.25s ease',
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            <line x1="10" y1="4" x2="10" y2="16" />
            <line x1="4" y1="10" x2="16" y2="10" />
          </svg>
        </span>
      </button>

      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: shouldReduce ? undefined : 'grid-template-rows 0.28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-4 pb-5 text-base text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </li>
  )
}

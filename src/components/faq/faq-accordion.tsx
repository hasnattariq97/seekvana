'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { FaqItem } from './faq-section'

// Matches the site's house easing (see learning-paths.tsx).
const EXPO = [0.16, 1, 0.3, 1] as const

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <ul className="border-t border-border" role="list">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: EXPO, delay: Math.min(i * 0.05, 0.3) }}
            className={`group/faq rounded-sm border-b border-border transition-colors duration-200 ${
              isOpen ? 'bg-accent-soft' : 'hover:bg-surface-subtle'
            }`}
          >
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-start justify-between gap-4 border-none bg-transparent px-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <span
                  className={`font-fraunces text-lg font-medium leading-snug transition-colors duration-150 ${
                    isOpen ? 'text-accent-deep' : 'text-primary group-hover/faq:text-accent'
                  }`}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 shrink-0 transition-colors duration-150 ${
                    isOpen ? 'text-accent-deep' : 'text-secondary group-hover/faq:text-accent'
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
                      transition: reduce ? undefined : 'transform 0.25s ease',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <line x1="10" y1="4" x2="10" y2="16" />
                    <line x1="4" y1="10" x2="16" y2="10" />
                  </svg>
                </span>
              </button>
            </h3>

            {/* grid-rows 0fr→1fr keeps the answer in the DOM (collapsed, not
                unmounted) so its text stays crawlable and matches the schema. */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: reduce ? undefined : 'grid-template-rows 0.28s ease',
              }}
              aria-hidden={!isOpen}
            >
              <div style={{ overflow: 'hidden' }}>
                <p className="max-w-prose px-4 pb-5 text-base leading-relaxed text-secondary">
                  {item.a}
                </p>
              </div>
            </div>
          </motion.li>
        )
      })}
    </ul>
  )
}

'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { FaqItem } from './faq-section'

// Matches the site's house easing (see learning-paths.tsx).
const EXPO = [0.16, 1, 0.3, 1] as const

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <ul className="border-t border-border">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: EXPO, delay: Math.min(i * 0.05, 0.3) }}
            className="border-b border-border"
          >
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-5 py-5 text-left"
              >
                <span
                  className={`text-base md:text-lg font-medium leading-snug transition-colors duration-200 ${
                    isOpen ? 'text-accent' : 'text-primary group-hover:text-accent'
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                    isOpen
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-border text-secondary group-hover:border-accent/50 group-hover:text-accent'
                  }`}
                >
                  <motion.span
                    className="grid place-items-center"
                    animate={reduce ? undefined : { rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EXPO }}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </motion.span>
                </span>
              </button>
            </h3>

            {/* Answer stays mounted (height-collapsed, not unmounted) so its text
                remains in the DOM for crawlers and matches the FAQPage schema. */}
            <motion.div
              initial={false}
              animate={
                reduce
                  ? { height: isOpen ? 'auto' : 0 }
                  : { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }
              }
              transition={{ duration: reduce ? 0 : 0.32, ease: EXPO }}
              className="overflow-hidden"
              aria-hidden={!isOpen}
            >
              <p className="max-w-prose pb-5 pr-10 text-[15px] leading-relaxed text-secondary md:text-base">
                {item.a}
              </p>
            </motion.div>
          </motion.li>
        )
      })}
    </ul>
  )
}

// src/components/mdx/math.tsx
import katex from 'katex'
import type { ReactNode } from 'react'

interface MathProps {
  children: ReactNode
}

export function Math({ children }: MathProps) {
  const input = typeof children === 'string' ? children : String(children ?? '')
  const html = katex.renderToString(input, {
    throwOnError: false,
    displayMode: false,
  })
  return (
    <span
      className="katex-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function MathBlock({ children }: MathProps) {
  const input = typeof children === 'string' ? children : String(children ?? '')
  const html = katex.renderToString(input, {
    throwOnError: false,
    displayMode: true,
  })
  return (
    <div
      className="my-6 overflow-x-auto text-center py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

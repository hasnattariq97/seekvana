// src/components/mdx/math.tsx
import { isValidElement } from 'react'
import katex from 'katex'
import type { ReactNode } from 'react'

interface MathProps {
  children: ReactNode
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children)
  return ''
}

export function Math({ children }: MathProps) {
  const input = extractText(children)
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
  const input = extractText(children)
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

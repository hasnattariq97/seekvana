// src/components/mdx/math.tsx
import katex from 'katex'

interface MathProps {
  children: string
}

export function Math({ children }: MathProps) {
  const html = katex.renderToString(children, {
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
  const html = katex.renderToString(children, {
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

// src/components/mdx/mermaid.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  children: string
}

export function Mermaid({ children }: MermaidProps) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string | null>(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    let active = true
    setSvg(null)
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
        themeVariables: {
          primaryColor: '#C9633F',
          primaryTextColor: resolvedTheme === 'dark' ? '#EFEBE1' : '#1C1B19',
          background: resolvedTheme === 'dark' ? '#181712' : '#FAF8F3',
          mainBkg: resolvedTheme === 'dark' ? '#2A2823' : '#F4F1EA',
          nodeBorder: '#E6E1D7',
          lineColor: '#6F6B62',
        },
      })
      mermaid.render(idRef.current, children.trim()).then(({ svg: out }) => {
        if (active) setSvg(out)
      }).catch(() => {
        if (active) setSvg('<p style="color:var(--color-accent);font-size:14px;padding:8px">Diagram error — check Mermaid syntax</p>')
      })
    })
    return () => { active = false }
  }, [children, resolvedTheme])

  if (!svg) {
    return (
      <div className="my-8 bg-surface-subtle rounded-xl border border-border p-8 text-center text-secondary text-sm animate-pulse">
        Loading diagram…
      </div>
    )
  }

  return (
    <div
      className="my-8 overflow-x-auto bg-surface-subtle rounded-xl border border-border p-6 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

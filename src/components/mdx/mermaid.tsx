'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  children: string
}

// Light/dark palette values for Mermaid's JS API (CSS vars not supported there)
const THEME = {
  light: {
    bg:          '#FAF8F3',
    nodeFill:    '#F6E4DB',
    nodeBorder:  '#C9633F',
    nodeText:    '#1C1B19',
    secondary:   '#F4F1EA',
    border2:     '#E6E1D7',
    line:        '#C9633F',
    edgeLabel:   '#FAF8F3',
    muted:       '#6F6B62',
  },
  dark: {
    bg:          '#2A2823',
    nodeFill:    '#3A2A22',
    nodeBorder:  '#E0875F',
    nodeText:    '#EFEBE1',
    secondary:   '#211F1A',
    border2:     '#38352E',
    line:        '#E0875F',
    edgeLabel:   '#2A2823',
    muted:       '#A39E92',
  },
}

export function Mermaid({ children }: MermaidProps) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string | null>(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    let active = true
    setSvg(null)

    const t = resolvedTheme === 'dark' ? THEME.dark : THEME.light

    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          background:           t.bg,
          primaryColor:         t.nodeFill,
          primaryBorderColor:   t.nodeBorder,
          primaryTextColor:     t.nodeText,
          secondaryColor:       t.secondary,
          secondaryBorderColor: t.border2,
          tertiaryColor:        t.secondary,
          tertiaryBorderColor:  t.border2,
          lineColor:            t.line,
          edgeLabelBackground:  t.edgeLabel,
          textColor:            t.nodeText,
          clusterBkg:           t.secondary,
          clusterBorder:        t.border2,
          titleColor:           t.nodeText,
          nodeBorder:           t.nodeBorder,
          mainBkg:              t.nodeFill,
          fontFamily:           'Inter, system-ui, sans-serif',
          fontSize:             '14px',
        },
      })

      mermaid
        .render(idRef.current, children.trim())
        .then(({ svg: out }) => { if (active) setSvg(out) })
        .catch(() => {
          if (active)
            setSvg(
              '<p style="color:var(--color-accent);font-size:14px;padding:8px">Diagram error — check Mermaid syntax</p>'
            )
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
      className="my-8 overflow-x-auto rounded-xl border border-accent/20 bg-accent-soft/30 p-6 flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

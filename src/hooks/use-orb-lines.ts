'use client'

import { useEffect, useState } from 'react'

export interface LineData {
  x1: number
  y1: number
  x2: number
  y2: number
  id: string
}

export interface OrbRefs {
  // left column
  tools: React.RefObject<HTMLDivElement | null>
  database: React.RefObject<HTMLDivElement | null>
  knowledge: React.RefObject<HTMLDivElement | null>
  // right column
  memory: React.RefObject<HTMLDivElement | null>
  agent: React.RefObject<HTMLDivElement | null>
  evaluation: React.RefObject<HTMLDivElement | null>
  // bottom
  orchestration: React.RefObject<HTMLDivElement | null>
  deployment: React.RefObject<HTMLDivElement | null>
  // robot
  robot: React.RefObject<HTMLDivElement | null>
  // hero section
  hero: React.RefObject<HTMLElement | null>
}

function getCenter(el: HTMLElement, hero: HTMLElement): { x: number; y: number } {
  const eRect = el.getBoundingClientRect()
  const hRect = hero.getBoundingClientRect()
  return {
    x: eRect.left - hRect.left + eRect.width / 2,
    y: eRect.top - hRect.top + eRect.height / 2,
  }
}

export function useOrbLines(refs: OrbRefs): LineData[] {
  const [lines, setLines] = useState<LineData[]>([])

  useEffect(() => {
    function compute() {
      const hero = refs.hero.current
      const robot = refs.robot.current
      if (!hero || !robot) return

      const robotCenter = getCenter(robot, hero)

      const orbEntries: Array<[string, React.RefObject<HTMLDivElement | null>]> = [
        ['tools', refs.tools],
        ['database', refs.database],
        ['knowledge', refs.knowledge],
        ['memory', refs.memory],
        ['agent', refs.agent],
        ['evaluation', refs.evaluation],
        ['orchestration', refs.orchestration],
        ['deployment', refs.deployment],
      ]

      const next: LineData[] = []
      for (const [id, ref] of orbEntries) {
        if (!ref.current) continue
        const c = getCenter(ref.current, hero)
        next.push({ id, x1: c.x, y1: c.y, x2: robotCenter.x, y2: robotCenter.y })
      }
      setLines(next)
    }

    const ro = new ResizeObserver(compute)
    if (refs.hero.current) ro.observe(refs.hero.current)
    compute()

    return () => ro.disconnect()
  }, [refs])

  return lines
}

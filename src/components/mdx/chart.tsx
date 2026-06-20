// src/components/mdx/chart.tsx
'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartDataPoint {
  label: string
  value: number
}

interface ChartProps {
  type: 'bar'
  title: string
  data: ChartDataPoint[]
  unit?: string
  caption?: string
}

export function Chart({ title, data = [], unit, caption }: ChartProps) {
  const formatted = data.map((d) => ({ ...d, name: d.label }))

  return (
    <figure className="my-8 bg-surface-subtle border border-border rounded-xl p-6">
      <p className="font-fraunces text-base font-medium text-primary mb-5">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ left: 8, right: 40, top: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            tickFormatter={(v) => `${v}${unit ?? ''}`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            width={140}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`${v ?? ''}${unit ?? ''}`, '']}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill="var(--color-accent)"
                fillOpacity={Math.max(0.5, 1 - i * 0.08)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {caption && (
        <figcaption className="text-xs text-secondary mt-4">{caption}</figcaption>
      )}
    </figure>
  )
}

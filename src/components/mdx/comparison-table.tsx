interface ComparisonTableProps {
  headers: string   // "Col1|||Col2|||Col3"
  rows: string      // "R1C1|||R1C2|||R1C3|||R2C1|||R2C2|||R2C3" (flat, chunks by column count)
  title?: string
  highlight?: string
}

export function ComparisonTable({ headers, rows, title, highlight }: ComparisonTableProps) {
  const columns = headers ? headers.split('|||') : []
  const colCount = columns.length || 1
  const flat = rows ? rows.split('|||') : []
  const parsed: string[][] = []
  for (let i = 0; i < flat.length; i += colCount) {
    parsed.push(flat.slice(i, i + colCount))
  }

  return (
    <div className="my-8 overflow-x-auto">
      {title && <p className="font-semibold text-sm text-secondary mb-2">{title}</p>}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`border border-border px-4 py-3 text-left font-semibold ${
                  highlight && col === highlight
                    ? 'bg-accent-soft text-accent'
                    : 'bg-surface-subtle text-primary'
                }`}
              >
                {col}
                {highlight && col === highlight && (
                  <span className="ml-2 text-xs font-normal bg-accent text-white px-1.5 py-0.5 rounded-full align-middle">
                    Recommended
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsed.map((row, ri) => (
            <tr key={ri} className="even:bg-surface-subtle">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-border px-4 py-3 text-primary ${
                    highlight && columns[ci] === highlight ? 'bg-accent-soft/40' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

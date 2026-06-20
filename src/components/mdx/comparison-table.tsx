interface ComparisonTableProps {
  columns: string[]
  rows: string[][]
  highlight?: string
}

export function ComparisonTable({ columns = [], rows = [], highlight }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
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
          {rows.map((row, ri) => (
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

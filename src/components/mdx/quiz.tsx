'use client'
import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface QuizProps {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export function Quiz({ question, options, correct, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="my-8 bg-surface border border-border rounded-xl p-6">
      <p className="font-fraunces text-lg text-primary mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((option, i) => {
          let cls =
            'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center gap-2 '
          if (!answered) {
            cls +=
              'border-border bg-surface-subtle hover:border-accent hover:bg-accent-soft cursor-pointer text-primary'
          } else if (i === correct) {
            cls +=
              'border-green-500 bg-green-50 dark:bg-green-950/30 text-primary cursor-default'
          } else if (i === selected) {
            cls +=
              'border-red-400 bg-red-50 dark:bg-red-950/30 text-primary cursor-default'
          } else {
            cls += 'border-border bg-surface-subtle text-secondary cursor-default'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              aria-pressed={answered ? i === selected : undefined}
            >
              {answered && i === correct && (
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              )}
              {answered && i === selected && i !== correct && (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              {option}
            </button>
          )
        })}
      </div>
      {answered && (
        <div
          role="alert"
          className={`mt-4 p-4 rounded-lg text-sm ${
            selected === correct
              ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
              : 'bg-accent-soft text-primary'
          }`}
        >
          <strong>{selected === correct ? 'Correct! ' : 'Not quite — '}</strong>
          {explanation}
        </div>
      )}
    </div>
  )
}

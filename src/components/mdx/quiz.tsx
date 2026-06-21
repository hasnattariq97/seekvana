'use client'
import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface QuizProps {
  question: string
  options: string | string[]
  correct: number | string
  explanation: string
}

export function Quiz({ question, options = [], correct, explanation }: QuizProps) {
  const parsedOptions: string[] = Array.isArray(options)
    ? options
    : String(options).split('|||')
  const parsedCorrect = typeof correct === 'string' ? parseInt(correct, 10) : correct
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="my-8 bg-surface border border-border rounded-xl p-6">
      <p className="font-fraunces text-lg text-primary mb-4">{question}</p>
      <div className="space-y-2">
        {parsedOptions.map((option, i) => {
          let cls =
            'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-center gap-2 '
          if (!answered) {
            cls +=
              'border-border bg-surface-subtle hover:border-accent hover:bg-accent-soft cursor-pointer text-primary'
          } else if (i === parsedCorrect) {
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
              {answered && i === parsedCorrect && (
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              )}
              {answered && i === selected && i !== parsedCorrect && (
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
            selected === parsedCorrect
              ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
              : 'bg-accent-soft text-primary'
          }`}
        >
          <strong>{selected === parsedCorrect ? 'Correct! ' : 'Not quite — '}</strong>
          {explanation}
        </div>
      )}
    </div>
  )
}

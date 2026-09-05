'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Question {
  section: string
  prompt: string
  options: [string, string, string] // 0pt, 1pt, 2pt
}

const QUESTIONS: Question[] = [
  {
    section: 'Terminal and command line',
    prompt: 'When you see a command-line prompt on your computer, you:',
    options: [
      'Have never opened one',
      'Can navigate folders and run a command someone gave you, but look things up constantly',
      'Use it comfortably for everyday tasks like installing something or running a script',
    ],
  },
  {
    section: 'Python basics',
    prompt: 'Reading a short Python script (10-20 lines, a function, a loop, an if statement), you:',
    options: [
      "Wouldn't know what most of it does",
      "Can follow the logic even if you couldn't write it from scratch",
      'Could write something similar yourself',
    ],
  },
  {
    section: 'Python basics',
    prompt: 'The words "variable," "function," and "loop" are:',
    options: ['Unfamiliar', 'Familiar, roughly', 'Things you use correctly without thinking'],
  },
  {
    section: 'Git and version control',
    prompt: 'Git and GitHub, to you, are:',
    options: [
      'Unfamiliar',
      "Somewhat familiar, you've cloned a repo or made a commit before",
      'A normal part of how you already work',
    ],
  },
  {
    section: 'APIs and how software talks to software',
    prompt: 'An API request, in your own words, is:',
    options: [
      'Not something you could explain',
      "Something you've heard of and roughly understand",
      "Something you've made yourself, in code or with a tool like Postman",
    ],
  },
  {
    section: 'APIs and how software talks to software',
    prompt: 'An API key or environment variable is:',
    options: [
      'An unfamiliar term',
      "Something you've seen but never set up yourself",
      'Something you already know how to create and keep out of your code',
    ],
  },
  {
    section: 'Databases',
    prompt: 'A database table, in your own words, is:',
    options: [
      'Not something you could explain',
      "Something you've heard of and roughly understand",
      "Something you've queried or built yourself",
    ],
  },
  {
    section: 'Prior AI and agent exposure',
    prompt: 'Chatbots and AI assistants (ChatGPT, Claude, etc.), you:',
    options: [
      'Have used casually a handful of times',
      'Use regularly for work or study',
      'Have already tried an AI coding tool like Copilot, Cursor, or Claude Code',
    ],
  },
  {
    section: 'Prior AI and agent exposure',
    prompt: 'The difference between a chatbot and an "AI agent" that can take actions on its own:',
    options: [
      "You're not sure there is one",
      'You have a rough idea',
      'You could explain it clearly to someone else',
    ],
  },
  {
    section: 'Working independently',
    prompt: 'When software throws an error message at you, you:',
    options: [
      "Usually don't know where to start",
      'Can often find the fix by searching the exact message',
      'Can usually diagnose the cause yourself before searching',
    ],
  },
  {
    section: 'Working independently',
    prompt: 'Installing new software or a developer tool on your own computer:',
    options: [
      'Makes you nervous',
      'Is fine as long as there are clear instructions',
      'Is something you do without a second thought',
    ],
  },
]

interface Tier {
  min: number
  max: number
  label: string
  advice: React.ReactNode
}

const TIERS: Tier[] = [
  {
    min: 0,
    max: 7,
    label: "You're missing foundational terminal, Python, or Git basics this path assumes",
    advice: (
      <>
        Detour through{' '}
        <Link href="/paths/getting-started" className="underline underline-offset-2 hover:text-accent-deep">
          Getting Started
        </Link>{' '}
        first, then come back and start 14.02.
      </>
    ),
  },
  {
    min: 8,
    max: 15,
    label: 'You have real gaps but enough footing to learn the rest as you go',
    advice: <>Continue to 14.02 normally, don&apos;t skip anything yet.</>,
  },
  {
    min: 16,
    max: 22,
    label: 'You already know most of the fundamentals this module covers',
    advice: (
      <>Skim 14.01-14.05 quickly for the Cursor/Claude Code specifics, then slow down starting Module 17.</>
    ),
  },
]

function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0]
}

export function SelfPlacementQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null))
  const [goal, setGoal] = useState('')

  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === QUESTIONS.length
  const score = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0)
  const tier = allAnswered ? getTier(score) : null

  function selectAnswer(qIndex: number, points: number) {
    setAnswers((prev) => {
      const next = [...prev]
      next[qIndex] = points
      return next
    })
  }

  let lastSection = ''

  return (
    <div className="my-8 bg-surface border border-border rounded-xl p-6">
      <p className="font-inter text-xs font-semibold tracking-widest uppercase text-accent mb-2">
        Self-placement quiz
      </p>
      <p className="text-sm text-secondary mb-6">
        Answer honestly, no looking anything up. {answeredCount}/{QUESTIONS.length} answered.
      </p>

      <div className="space-y-6">
        {QUESTIONS.map((q, qIndex) => {
          const showSection = q.section !== lastSection
          lastSection = q.section
          const selected = answers[qIndex]

          return (
            <div key={qIndex}>
              {showSection && (
                <p className="font-fraunces text-sm font-medium text-accent-deep mb-2 mt-4 first:mt-0">
                  {q.section}
                </p>
              )}
              <p className="text-base text-primary mb-3">
                {qIndex + 1}. {q.prompt}
              </p>
              <div className="space-y-2">
                {q.options.map((option, optIndex) => {
                  const isSelected = selected === optIndex
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => selectAnswer(qIndex, optIndex)}
                      aria-pressed={isSelected}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent-soft text-primary'
                          : 'border-border bg-surface-subtle hover:border-accent hover:bg-accent-soft cursor-pointer text-primary'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        <div>
          <p className="font-fraunces text-sm font-medium text-accent-deep mb-2 mt-4">
            Your actual goal (not scored)
          </p>
          <p className="text-base text-primary mb-3">
            12. In one sentence, why are you here? For example, &ldquo;I want to ship a real
            agent project,&rdquo; &ldquo;I want a developer job,&rdquo; or &ldquo;I&apos;m just
            curious how these tools work.&rdquo; You&apos;ll reread this in Module 26.
          </p>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={2}
            placeholder="Write your answer here..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface-subtle text-primary text-sm placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          />
        </div>
      </div>

      {allAnswered && tier && (
        <div role="status" className="mt-6 p-5 rounded-lg bg-accent-soft">
          <p className="font-fraunces text-lg text-accent-deep mb-1">
            Score: {score}/22: {tier.label}
          </p>
          <p className="text-sm text-primary">{tier.advice}</p>
        </div>
      )}

      {!allAnswered && (
        <p className="mt-6 text-sm text-secondary">
          Answer questions 1-11 above to see your placement. Question 12 is just for you.
        </p>
      )}
    </div>
  )
}

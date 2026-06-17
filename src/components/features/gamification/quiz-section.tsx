'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Lightbulb, Trophy, AlertTriangle } from 'lucide-react'
import type { QuizQuestion, QuizOption } from '@/schemas/gamification'
import { cn } from '@/lib/utils'

type QuizSectionProps = {
  questions: QuizQuestion[]
  previousAnswers: Record<string, string>
  onAnswer: (questionId: string, answerId: string, isCorrect: boolean, xp: number) => Promise<{ newTotal: number; level: number }>
  onAllDone: () => void
}

const TYPE_LABELS: Record<QuizQuestion['type'], { label: string; color: string; icon: string }> = {
  normal: { label: 'Questão', color: 'text-blue-500', icon: '📝' },
  pegadinha: { label: '⚠️ PEGADINHA', color: 'text-red-500', icon: '🚨' },
  charada: { label: '🧩 CHARADA', color: 'text-purple-500', icon: '🧩' },
}

type QuestionState = {
  selected: string | null
  revealed: boolean
  xpEarned: number
}

export function QuizSection({ questions, previousAnswers, onAnswer, onAllDone }: QuizSectionProps) {
  const [states, setStates] = useState<Record<string, QuestionState>>(() => {
    const init: Record<string, QuestionState> = {}
    for (const q of questions) {
      const prev = previousAnswers[q.id]
      init[q.id] = {
        selected: prev ?? null,
        revealed: !!prev,
        xpEarned: prev ? (q.options.find(o => o.id === prev)?.isCorrect ? q.xpReward : 0) : 0,
      }
    }
    return init
  })
  const [showHint, setShowHint] = useState<Record<string, boolean>>({})
  const [xpFlash, setXpFlash] = useState<{ id: string; xp: number; correct: boolean } | null>(null)

  const allAnswered = questions.every((q) => states[q.id]?.revealed)

  async function handleSelect(q: QuizQuestion, opt: QuizOption) {
    if (states[q.id]?.revealed) return

    setStates((prev) => ({
      ...prev,
      [q.id]: { selected: opt.id, revealed: true, xpEarned: opt.isCorrect ? q.xpReward : 0 },
    }))

    await onAnswer(q.id, opt.id, opt.isCorrect, q.xpReward)
    setXpFlash({ id: q.id, xp: opt.isCorrect ? q.xpReward : 0, correct: opt.isCorrect })
    setTimeout(() => setXpFlash(null), 2000)
  }

  return (
    <div className="space-y-8">
      {questions.map((q, qi) => {
        const state = states[q.id]
        const typeInfo = TYPE_LABELS[q.type]

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.15 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-bold uppercase tracking-wider', typeInfo.color)}>
                  {typeInfo.icon} {typeInfo.label}
                </span>
                <span className="text-xs text-muted-foreground">— Questão {qi + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-yellow-500">+{q.xpReward} XP</span>
                {q.hint && !state.revealed && (
                  <button
                    onClick={() => setShowHint((p) => ({ ...p, [q.id]: !p[q.id] }))}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Lightbulb className="w-3 h-3" /> Dica
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-base font-medium leading-relaxed">{q.question}</p>

              <AnimatePresence>
                {showHint[q.id] && q.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                  >
                    💡 {q.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid gap-2">
                {q.options.map((opt) => {
                  const isSelected = state.selected === opt.id
                  const isRevealed = state.revealed

                  let optClass = 'border-border text-foreground hover:border-primary hover:bg-primary/5 cursor-pointer'
                  if (isRevealed && opt.isCorrect) optClass = 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 cursor-default'
                  else if (isRevealed && isSelected && !opt.isCorrect) optClass = 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 cursor-default'
                  else if (isRevealed) optClass = 'border-border text-muted-foreground cursor-default opacity-60'

                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={!isRevealed ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(q, opt)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all duration-200 flex items-start gap-3',
                        optClass,
                      )}
                    >
                      <span className="shrink-0 mt-0.5 font-bold uppercase text-xs w-4">{opt.id})</span>
                      <span className="flex-1">{opt.text}</span>
                      {isRevealed && opt.isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500 mt-0.5" />}
                      {isRevealed && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />}
                    </motion.button>
                  )
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {state.revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    {(() => {
                      const selected = q.options.find((o) => o.id === state.selected)
                      const isCorrect = selected?.isCorrect ?? false
                      return (
                        <div className={cn(
                          'rounded-lg p-3 text-sm flex gap-2 items-start mt-1',
                          isCorrect
                            ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                            : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300',
                        )}>
                          {isCorrect
                            ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                          <span>{selected?.explanation}</span>
                        </div>
                      )
                    })()}

                    {/* XP Flash */}
                    {xpFlash?.id === q.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          'text-center font-black text-lg mt-2',
                          xpFlash.correct ? 'text-yellow-500' : 'text-muted-foreground',
                        )}
                      >
                        {xpFlash.correct ? `+${xpFlash.xp} XP 🎉` : 'Tente a próxima!'}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}

      {/* All done CTA */}
      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <button
              onClick={onAllDone}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <Trophy className="w-5 h-5" />
              Ir para o Desafio Prático →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

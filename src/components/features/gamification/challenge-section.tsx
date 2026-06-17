'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, Trophy } from 'lucide-react'
import type { Challenge } from '@/schemas/gamification'
import { cn } from '@/lib/utils'

type ChallengeSectionProps = {
  challenge: Challenge
  completed: boolean
  onComplete: () => Promise<void>
}

export function ChallengeSection({ challenge, completed, onComplete }: ChallengeSectionProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onComplete()
    setLoading(false)
    setConfirming(false)
  }

  return (
    <div className="space-y-6">
      {/* Challenge card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-xl border-2 p-6 space-y-4',
          completed
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
            : 'border-border bg-card',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Desafio Prático
              </span>
              <span className="text-xs font-bold text-yellow-500">+{challenge.xpReward} XP</span>
            </div>
            <h3 className="text-xl font-black text-foreground">{challenge.title}</h3>
          </div>
          {completed && (
            <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
          )}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">{challenge.description}</p>

        {/* Steps */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Passo a passo:</p>
          <ol className="space-y-2">
            {challenge.instructions.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 text-sm"
              >
                <span className={cn(
                  'shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5',
                  completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground',
                )}>
                  {completed ? '✓' : i + 1}
                </span>
                <span className={completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                  {step}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Verification hint */}
        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground border border-border">
          <span className="font-bold">Como vai ser validado:</span>{' '}
          {challenge.verificationHint}
        </div>

        {/* Actions */}
        {!completed && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {challenge.url && (
              <a
                href={challenge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir {challenge.url}
              </a>
            )}

            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" />
                Concluí o desafio!
              </button>
            ) : (
              <div className="flex-1 space-y-2">
                <p className="text-xs text-center text-muted-foreground">
                  Tem certeza? Marque apenas se realmente completou os passos.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirming(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition-colors"
                  >
                    Ainda não
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {loading ? 'Salvando...' : 'Sim, concluí! ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm"
          >
            <Trophy className="w-4 h-4" />
            Desafio concluído! +{challenge.xpReward} XP conquistados.
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

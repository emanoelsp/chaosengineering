'use client'

import { motion } from 'framer-motion'
import { getXpProgress } from '@/lib/gamification/content'
import type { Level } from '@/schemas/gamification'
import { cn } from '@/lib/utils'

type XpBarProps = {
  totalXp: number
  levelInfo: Level
  compact?: boolean
}

export function XpBar({ totalXp, levelInfo, compact = false }: XpBarProps) {
  const { current, max, pct } = getXpProgress(totalXp)

  if (compact) {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base shrink-0">{levelInfo.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
            <span className={cn('font-semibold truncate', levelInfo.color)}>{levelInfo.name}</span>
            <span className="shrink-0 ml-1">{totalXp} XP</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{levelInfo.emoji}</span>
          <div>
            <p className={cn('font-bold text-sm', levelInfo.color)}>Nível {levelInfo.level} — {levelInfo.name}</p>
            <p className="text-xs text-muted-foreground">{current} / {max} XP para o próximo nível</p>
          </div>
        </div>
        <span className="text-2xl font-black text-foreground">{totalXp} XP</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}

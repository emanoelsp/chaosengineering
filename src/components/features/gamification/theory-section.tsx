'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, BookOpen, Code2, Lightbulb } from 'lucide-react'
import type { TheorySection } from '@/schemas/gamification'
import { cn } from '@/lib/utils'

type TheorySectionProps = {
  sections: TheorySection[]
  onRead: () => void
  alreadyRead: boolean
}

export function TheorySectionView({ sections, onRead, alreadyRead }: TheorySectionProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(sections.map((_, i) => [i, i === 0]))
  )

  function toggleAll() {
    const allOpen = sections.every((_, i) => expanded[i])
    setExpanded(Object.fromEntries(sections.map((_, i) => [i, !allOpen])))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>{sections.length} seções de teoria</span>
        </div>
        <button onClick={toggleAll} className="text-xs text-primary hover:underline">
          Expandir tudo
        </button>
      </div>

      {sections.map((sec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="border border-border rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setExpanded((p) => ({ ...p, [i]: !p[i] }))}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
          >
            <span className="font-bold text-sm text-foreground">{sec.heading}</span>
            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', expanded[i] && 'rotate-180')} />
          </button>

          {expanded[i] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 pb-5 space-y-3 border-t border-border"
            >
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mt-4">
                {sec.body}
              </p>

              {sec.highlight && (
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">{sec.highlight}</p>
                </div>
              )}

              {sec.code && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                    <Code2 className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">código</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono text-foreground bg-muted/30">
                    <code>{sec.code}</code>
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}

      {!alreadyRead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-2 text-center"
        >
          <button
            onClick={onRead}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            Li tudo! Ir para o Quiz →
          </button>
        </motion.div>
      )}

      {alreadyRead && (
        <div className="text-center text-sm text-green-500 font-medium flex items-center justify-center gap-1">
          ✓ Teoria lida
        </div>
      )}
    </div>
  )
}

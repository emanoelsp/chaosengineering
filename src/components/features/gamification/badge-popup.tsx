'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import type { Badge } from '@/schemas/gamification'

type BadgePopupProps = {
  badge: Badge | null
  onClose: () => void
}

export function BadgePopup({ badge, onClose }: BadgePopupProps) {
  const hasShot = useRef(false)

  useEffect(() => {
    if (!badge || hasShot.current) return
    hasShot.current = true

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#9B59B6', '#3498DB'],
    })

    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [badge, onClose])

  useEffect(() => {
    if (!badge) hasShot.current = false
  }, [badge])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="text-8xl mb-4 block"
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {badge.emoji}
            </motion.div>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-1">
              Emblema Desbloqueado!
            </p>
            <h2 className="text-2xl font-black text-foreground mb-2">{badge.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{badge.description}</p>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Continuar Jornada →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

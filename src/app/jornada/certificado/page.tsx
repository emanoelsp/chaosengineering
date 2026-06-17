'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Printer, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useGamification } from '@/hooks/use-gamification'
import { useAuth } from '@/hooks/use-auth'
import { CHAPTERS } from '@/lib/gamification/content'

function formatDate(d: Date | undefined) {
  if (!d) return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const date = d instanceof Date ? d : new Date((d as unknown as { seconds: number }).seconds * 1000)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function CertificadoPage() {
  const { user, loading: authLoading } = useAuth()
  const { progress, loading, allCompleted } = useGamification()
  const shotRef = useRef(false)

  useEffect(() => {
    if (!allCompleted || shotRef.current) return
    shotRef.current = true

    const fire = (opts: confetti.Options) => confetti({ ...opts, disableForReducedMotion: true })

    const duration = 4000
    const end = Date.now() + duration
    ;(function frame() {
      fire({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FFA500', '#FF4500'] })
      fire({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#9B59B6', '#3498DB', '#2ECC71'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [allCompleted])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-4xl">🦫</motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-black">Login necessário</h1>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl">Fazer Login →</Link>
        </div>
      </div>
    )
  }

  if (!allCompleted) {
    const done = progress?.completedChapters?.length ?? 0
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-black">Certificado Bloqueado</h1>
          <p className="text-muted-foreground text-sm">
            Complete todos os {CHAPTERS.length} capítulos para desbloquear.
            Faltam {CHAPTERS.length - done} capítulo(s).
          </p>
          <Link href="/jornada" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl">← Voltar à Jornada</Link>
        </div>
      </div>
    )
  }

  const displayName = progress?.displayName ?? user.displayName ?? 'Aluno'
  const completedAt = progress?.completedAt as unknown as Date | undefined
  const earnedBadges = CHAPTERS.filter((c) => progress?.earnedBadges?.includes(c.badge.id))
  const totalXp = progress?.totalXp ?? 0

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 print:bg-white print:py-0 print:px-0">
      {/* Screen controls (hidden on print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href="/jornada" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar à Jornada
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-bold rounded-xl text-sm hover:opacity-80 transition-opacity"
        >
          <Printer className="w-4 h-4" /> Imprimir Certificado
        </button>
      </div>

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto print:max-w-full"
      >
        <div
          id="certificate"
          className="bg-white text-gray-900 rounded-2xl print:rounded-none overflow-hidden shadow-2xl print:shadow-none relative"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Top border decoration */}
          <div className="h-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

          {/* Content */}
          <div className="px-12 py-10 print:px-16 print:py-12 space-y-8 text-center">
            {/* Header */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-sans">Universidade do Caos — Chaos GPT Academy</p>
              <div className="text-5xl">🦫</div>
              <h1 className="text-4xl font-black tracking-tight leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Certificado de Conclusão
              </h1>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-gray-300 text-lg">❧</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Body */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-sans uppercase tracking-widest">Certificamos que</p>
              <p className="text-4xl font-black text-gray-900 leading-tight">{displayName}</p>
              <p className="text-sm text-gray-500 font-sans max-w-md mx-auto leading-relaxed">
                completou com êxito a <strong>Jornada do Caos</strong>, demonstrando domínio em
                Engenharia do Caos, Circuit Breaker, Prompt Injection, Blast Radius e CI/CD com testes caóticos.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 print:gap-8">
              {[
                { label: 'XP Total', value: `${totalXp} XP`, icon: '⭐' },
                { label: 'Capítulos', value: `${CHAPTERS.length}/5`, icon: '📚' },
                { label: 'Data', value: formatDate(completedAt), icon: '📅' },
              ].map((stat) => (
                <div key={stat.label} className="text-center space-y-1">
                  <div className="text-2xl">{stat.icon}</div>
                  <p className="text-sm font-black font-sans text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-sans uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-sans">Emblemas Conquistados</p>
              <div className="flex items-start justify-center gap-4 flex-wrap">
                {earnedBadges.map((c) => (
                  <div key={c.badge.id} className="text-center space-y-1">
                    <span className="text-3xl block">{c.badge.emoji}</span>
                    <p className="text-xs font-sans text-gray-600 max-w-[80px] leading-tight">{c.badge.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-gray-300 text-lg">❧</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Signature */}
            <div className="flex items-end justify-around">
              <div className="text-center space-y-1">
                <p className="text-2xl font-black" style={{ fontFamily: 'cursive' }}>General Capivara</p>
                <div className="h-px w-32 bg-gray-300 mx-auto" />
                <p className="text-xs text-gray-400 font-sans">General Capivara 🦫</p>
                <p className="text-xs text-gray-400 font-sans">Chaos Engineering Academy</p>
              </div>
              <div className="text-center space-y-1">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-xs text-gray-400 font-sans">Selo de Autenticidade</p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-300 font-sans">
              chaos-gpt.academy • {new Date().getFullYear()} • Engenharia do Caos para o Futuro
            </p>
          </div>

          {/* Bottom border */}
          <div className="h-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400" />
        </div>
      </motion.div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate { position: fixed; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}

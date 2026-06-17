'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, CheckCircle2, ChevronRight, Trophy, Star } from 'lucide-react'
import { useGamification } from '@/hooks/use-gamification'
import { useAuth } from '@/hooks/use-auth'
import { XpBar } from '@/components/features/gamification/xp-bar'
import { CHAPTERS } from '@/lib/gamification/content'
import { cn } from '@/lib/utils'

export default function JornadaPage() {
  const { user, loading: authLoading } = useAuth()
  const { progress, loading, levelInfo, isChapterUnlocked, isChapterCompleted, allCompleted } = useGamification()

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-4xl"
          >
            🦫
          </motion.div>
          <p className="text-muted-foreground text-sm">Carregando sua jornada...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <span className="text-6xl">🔒</span>
          <h1 className="text-2xl font-black">Acesso Restrito</h1>
          <p className="text-muted-foreground">Faça login para iniciar sua Jornada do Caos.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Fazer Login →
          </Link>
        </div>
      </div>
    )
  }

  const completedCount = progress?.completedChapters?.length ?? 0
  const pct = Math.round((completedCount / CHAPTERS.length) * 100)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 space-y-6">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-2"
            >
              🦫
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Jornada do{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Caos
              </span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              5 capítulos. Teoria, charadas, pegadinhas e desafios práticos.
              Complete tudo e ganhe o certificado de <strong>Mestre do Caos</strong>.
            </p>
          </div>

          {/* XP + progress */}
          <div className="max-w-lg mx-auto space-y-3">
            <XpBar totalXp={progress?.totalXp ?? 0} levelInfo={levelInfo} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{completedCount} de {CHAPTERS.length} capítulos completos</span>
              <span className="font-bold">{pct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Badges earned */}
          {(progress?.earnedBadges?.length ?? 0) > 0 && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Emblemas conquistados</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {CHAPTERS.filter((c) => progress?.earnedBadges?.includes(c.badge.id)).map((c) => (
                  <motion.div
                    key={c.badge.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    title={`${c.badge.name}: ${c.badge.description}`}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-3xl">{c.badge.emoji}</span>
                    <span className="text-xs text-muted-foreground max-w-[70px] text-center leading-tight">{c.badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapter path */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/40 via-muted to-transparent hidden sm:block" />

          <div className="space-y-6">
            {CHAPTERS.map((chapter, i) => {
              const unlocked = isChapterUnlocked(chapter.id)
              const completed = isChapterCompleted(chapter.id)
              const chapterXp = progress?.chapterProgress?.[chapter.id]
              const earnedXp = (chapterXp?.quizXp ?? 0) + (chapterXp?.challengeXp ?? 0)

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {unlocked ? (
                    <Link href={`/jornada/${chapter.id}`} className="group block">
                      <div className={cn(
                        'relative flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200',
                        completed
                          ? 'border-green-500/60 bg-green-50/50 dark:bg-green-950/20'
                          : 'border-border hover:border-primary/60 hover:bg-muted/30 cursor-pointer',
                      )}>
                        {/* Chapter icon */}
                        <div className={cn(
                          'shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl relative z-10',
                          `bg-gradient-to-br ${chapter.color}`,
                        )}>
                          {completed ? '✅' : chapter.emoji}
                          {completed && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-muted-foreground">Capítulo {chapter.order}</span>
                            {completed && <span className="text-xs font-bold text-green-500">Completo</span>}
                          </div>
                          <h2 className="font-black text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                            {chapter.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>

                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-yellow-500 font-bold">
                              {completed ? `${earnedXp} / ${chapter.xpTotal} XP` : `${chapter.xpTotal} XP`}
                            </span>
                            <span className="text-xs text-muted-foreground">{chapter.badge.emoji} {chapter.badge.name}</span>
                            <span className="text-xs text-muted-foreground">{chapter.quiz.length} questões</span>
                          </div>
                        </div>

                        <ChevronRight className="shrink-0 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                      </div>
                    </Link>
                  ) : (
                    <div className={cn(
                      'flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-border opacity-50',
                    )}>
                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-muted-foreground">Capítulo {chapter.order} — Bloqueado</span>
                        <h2 className="font-black text-base text-foreground">{chapter.title}</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          Complete o capítulo anterior para desbloquear.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}

            {/* Certificate node */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: CHAPTERS.length * 0.1 + 0.1 }}
            >
              {allCompleted ? (
                <Link href="/jornada/certificado" className="group block">
                  <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border-2 border-yellow-500/60 bg-yellow-50/50 dark:bg-yellow-950/20 hover:border-yellow-400 transition-all">
                    <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl">
                      🏆
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">Desbloqueado!</span>
                      </div>
                      <h2 className="font-black text-base sm:text-lg text-foreground group-hover:text-yellow-500 transition-colors">
                        Certificado de Mestre do Caos
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Imprima e mostre para o mundo que você dominou a Engenharia do Caos.
                      </p>
                    </div>
                    <Trophy className="shrink-0 w-5 h-5 text-yellow-500 mt-1" />
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-border opacity-40">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Complete todos os capítulos</span>
                    <h2 className="font-black text-base text-foreground">Certificado de Mestre do Caos</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {CHAPTERS.length - completedCount} capítulo(s) restante(s) para desbloquear.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

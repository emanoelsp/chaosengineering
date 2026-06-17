'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, HelpCircle, Swords, Lock, Trophy } from 'lucide-react'
import { useGamification } from '@/hooks/use-gamification'
import { useAuth } from '@/hooks/use-auth'
import { XpBar } from '@/components/features/gamification/xp-bar'
import { TheorySectionView } from '@/components/features/gamification/theory-section'
import { QuizSection } from '@/components/features/gamification/quiz-section'
import { ChallengeSection } from '@/components/features/gamification/challenge-section'
import { BadgePopup } from '@/components/features/gamification/badge-popup'
import { CHAPTERS } from '@/lib/gamification/content'
import type { Badge } from '@/schemas/gamification'
import { cn } from '@/lib/utils'

type Tab = 'theory' | 'quiz' | 'challenge'

export default function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const {
    progress,
    loading,
    levelInfo,
    isChapterUnlocked,
    onTheoryRead,
    onQuizAnswer,
    onChallengeComplete,
  } = useGamification()

  const [activeTab, setActiveTab] = useState<Tab>('theory')
  const [badgeToShow, setBadgeToShow] = useState<Badge | null>(null)

  const chapter = CHAPTERS.find((c) => c.id === chapterId)

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <span className="text-5xl">🦫</span>
          <p className="text-muted-foreground">Capítulo não encontrado.</p>
          <Link href="/jornada" className="text-primary hover:underline">← Voltar à Jornada</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-4xl">
          🦫
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <span className="text-6xl">🔒</span>
          <h1 className="text-2xl font-black">Login necessário</h1>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl">Fazer Login →</Link>
        </div>
      </div>
    )
  }

  if (!isChapterUnlocked(chapterId)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-black">Capítulo Bloqueado</h1>
          <p className="text-muted-foreground text-sm">Complete o capítulo anterior primeiro.</p>
          <Link href="/jornada" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl">
            ← Voltar à Jornada
          </Link>
        </div>
      </div>
    )
  }

  const cp = progress?.chapterProgress?.[chapterId]
  const theoryRead = cp?.theoryRead ?? false
  const quizAnswers = cp?.quizAnswers ?? {}
  const challengeCompleted = cp?.challengeCompleted ?? false
  const allQuizAnswered = chapter.quiz.every((q) => quizAnswers[q.id])

  async function handleTheoryRead() {
    await onTheoryRead(chapterId)
    setActiveTab('quiz')
  }

  async function handleQuizAnswer(qId: string, aId: string, correct: boolean, xp: number) {
    return onQuizAnswer(chapterId, qId, aId, correct, xp)
  }

  async function handleChallengeComplete() {
    if (!chapter) return
    const result = await onChallengeComplete(chapterId, chapter.challenge.xpReward)
    if (result.newBadge) {
      setBadgeToShow(chapter.badge)
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; locked: boolean }[] = [
    { id: 'theory', label: 'Teoria', icon: <BookOpen className="w-4 h-4" />, locked: false },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" />, locked: !theoryRead },
    { id: 'challenge', label: 'Desafio', icon: <Swords className="w-4 h-4" />, locked: !allQuizAnswered },
  ]

  return (
    <>
      <BadgePopup
        badge={badgeToShow}
        onClose={() => {
          setBadgeToShow(null)
          const nextChapter = CHAPTERS.find((c) => c.order === chapter.order + 1)
          if (nextChapter) {
            router.push(`/jornada/${nextChapter.id}`)
          } else {
            router.push('/jornada')
          }
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/jornada" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <XpBar totalXp={progress?.totalXp ?? 0} levelInfo={levelInfo} compact />
            </div>
          </div>
        </div>

        {/* Chapter header */}
        <div className={cn('relative overflow-hidden', `bg-gradient-to-br ${chapter.color}`)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-3xl mx-auto px-4 py-10 text-white">
            <div className="flex items-center gap-2 mb-2 opacity-80 text-sm">
              <span>Capítulo {chapter.order} de {CHAPTERS.length}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-5xl shrink-0">{chapter.emoji}</span>
              <div>
                <h1 className="text-3xl font-black">{chapter.title}</h1>
                <p className="text-white/80 text-sm mt-1">{chapter.subtitle}</p>
                <div className="flex items-center gap-3 mt-2 text-white/80 text-xs">
                  <span>{chapter.badge.emoji} {chapter.badge.name}</span>
                  <span>•</span>
                  <span>{chapter.xpTotal} XP</span>
                  <span>•</span>
                  <span>{chapter.quiz.length} questões</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-[57px] z-30 border-b border-border bg-background">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.locked && setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                    tab.locked && 'opacity-40 cursor-not-allowed',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.locked ? <Lock className="w-3 h-3" /> : tab.icon}
                  {tab.label}
                  {tab.id === 'quiz' && allQuizAnswered && <span className="text-xs text-green-500">✓</span>}
                  {tab.id === 'challenge' && challengeCompleted && <Trophy className="w-3 h-3 text-yellow-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <TheorySectionView
                  sections={chapter.theory.sections}
                  onRead={handleTheoryRead}
                  alreadyRead={theoryRead}
                />
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <QuizSection
                  questions={chapter.quiz}
                  previousAnswers={quizAnswers}
                  onAnswer={handleQuizAnswer}
                  onAllDone={() => setActiveTab('challenge')}
                />
              </motion.div>
            )}

            {activeTab === 'challenge' && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <ChallengeSection
                  challenge={chapter.challenge}
                  completed={challengeCompleted}
                  onComplete={handleChallengeComplete}
                />

                {challengeCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center space-y-3"
                  >
                    {chapter.order < CHAPTERS.length ? (
                      <>
                        <p className="text-muted-foreground text-sm">Capítulo concluído! Próximo passo:</p>
                        <Link
                          href={`/jornada/${CHAPTERS[chapter.order].id}`}
                          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                          {CHAPTERS[chapter.order].emoji} Capítulo {chapter.order + 1}: {CHAPTERS[chapter.order].title} →
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground text-sm">Você completou TODOS os capítulos!</p>
                        <Link
                          href="/jornada/certificado"
                          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                        >
                          🏆 Resgatar Certificado →
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

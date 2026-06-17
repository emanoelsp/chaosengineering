'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  getUserProgress,
  initUserProgress,
  markTheoryRead,
  submitQuizAnswer,
  completeChallenge,
} from '@/services/gamification'
import type { UserProgress } from '@/schemas/gamification'
import { CHAPTERS, getLevelForXp, LEVELS } from '@/lib/gamification/content'

export function useGamification() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getUserProgress(user.uid).then(async (p) => {
      if (!p) {
        const fresh = await initUserProgress(user.uid, user.displayName ?? 'Aluno')
        setProgress(fresh)
      } else {
        setProgress(p)
      }
      setLoading(false)
    })
  }, [user])

  const onTheoryRead = useCallback(async (chapterId: string) => {
    if (!user || !progress) return
    await markTheoryRead(user.uid, chapterId)
    setProgress((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        chapterProgress: {
          ...prev.chapterProgress,
          [chapterId]: {
            ...prev.chapterProgress[chapterId],
            chapterId,
            theoryRead: true,
            startedAt: new Date(),
            quizAnswers: prev.chapterProgress[chapterId]?.quizAnswers ?? {},
            quizXp: prev.chapterProgress[chapterId]?.quizXp ?? 0,
            challengeCompleted: prev.chapterProgress[chapterId]?.challengeCompleted ?? false,
            challengeXp: prev.chapterProgress[chapterId]?.challengeXp ?? 0,
          },
        },
      }
    })
  }, [user, progress])

  const onQuizAnswer = useCallback(async (
    chapterId: string,
    questionId: string,
    answerId: string,
    isCorrect: boolean,
    xpEarned: number,
  ) => {
    if (!user || !progress) return { newTotal: 0, level: 1 }
    const result = await submitQuizAnswer(user.uid, chapterId, questionId, answerId, isCorrect, xpEarned)
    setProgress((prev) => {
      if (!prev) return prev
      const cp = prev.chapterProgress[chapterId] ?? {
        chapterId, theoryRead: false, quizAnswers: {}, quizXp: 0, challengeCompleted: false, challengeXp: 0, startedAt: new Date(),
      }
      return {
        ...prev,
        totalXp: result.newTotal,
        level: result.level,
        chapterProgress: {
          ...prev.chapterProgress,
          [chapterId]: {
            ...cp,
            quizAnswers: { ...cp.quizAnswers, [questionId]: answerId },
            quizXp: cp.quizXp + (isCorrect ? xpEarned : 0),
          },
        },
      }
    })
    return result
  }, [user, progress])

  const onChallengeComplete = useCallback(async (chapterId: string, xpEarned: number) => {
    if (!user || !progress) return { newTotal: 0, level: 1, newBadge: null }
    const result = await completeChallenge(user.uid, chapterId, xpEarned)
    const chapter = CHAPTERS.find((c) => c.id === chapterId)!
    setProgress((prev) => {
      if (!prev) return prev
      const cp = prev.chapterProgress[chapterId] ?? {
        chapterId, theoryRead: false, quizAnswers: {}, quizXp: 0, challengeCompleted: false, challengeXp: 0, startedAt: new Date(),
      }
      return {
        ...prev,
        totalXp: result.newTotal,
        level: result.level,
        completedChapters: [...(prev.completedChapters ?? []), chapterId],
        earnedBadges: [...(prev.earnedBadges ?? []), chapter.badge.id],
        chapterProgress: {
          ...prev.chapterProgress,
          [chapterId]: { ...cp, challengeCompleted: true, challengeXp: xpEarned, completedAt: new Date() },
        },
      }
    })
    return result
  }, [user, progress])

  const isChapterUnlocked = useCallback((chapterId: string) => {
    const chapter = CHAPTERS.find((c) => c.id === chapterId)
    if (!chapter || chapter.order === 1) return true
    const prev = CHAPTERS.find((c) => c.order === chapter.order - 1)
    if (!prev) return true
    return progress?.completedChapters?.includes(prev.id) ?? false
  }, [progress])

  const isChapterCompleted = useCallback((chapterId: string) => {
    return progress?.completedChapters?.includes(chapterId) ?? false
  }, [progress])

  const levelInfo = progress ? getLevelForXp(progress.totalXp) : LEVELS[0]
  const allCompleted = CHAPTERS.every((c) => progress?.completedChapters?.includes(c.id))

  return {
    progress,
    loading,
    levelInfo,
    allCompleted,
    isChapterUnlocked,
    isChapterCompleted,
    onTheoryRead,
    onQuizAnswer,
    onChallengeComplete,
  }
}

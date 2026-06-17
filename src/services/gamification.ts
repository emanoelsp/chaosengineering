'use client'

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { UserProgress } from '@/schemas/gamification'
import { CHAPTERS, getLevelForXp } from '@/lib/gamification/content'

const COLLECTION = 'userProgress'

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const ref = doc(db, COLLECTION, userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as UserProgress
}

export async function initUserProgress(userId: string, displayName: string): Promise<UserProgress> {
  const progress: UserProgress = {
    userId,
    displayName,
    totalXp: 0,
    level: 1,
    earnedBadges: [],
    completedChapters: [],
    chapterProgress: {},
    startedAt: new Date(),
  }
  await setDoc(doc(db, COLLECTION, userId), {
    ...progress,
    startedAt: serverTimestamp(),
  })
  return progress
}

export async function markTheoryRead(userId: string, chapterId: string): Promise<void> {
  const ref = doc(db, COLLECTION, userId)
  await updateDoc(ref, {
    [`chapterProgress.${chapterId}.chapterId`]: chapterId,
    [`chapterProgress.${chapterId}.theoryRead`]: true,
    [`chapterProgress.${chapterId}.startedAt`]: serverTimestamp(),
  })
}

export async function submitQuizAnswer(
  userId: string,
  chapterId: string,
  questionId: string,
  answerId: string,
  isCorrect: boolean,
  xpEarned: number,
): Promise<{ newTotal: number; level: number }> {
  const ref = doc(db, COLLECTION, userId)
  const snap = await getDoc(ref)
  const data = snap.data() as UserProgress

  const alreadyAnswered = data.chapterProgress?.[chapterId]?.quizAnswers?.[questionId]
  if (alreadyAnswered) return { newTotal: data.totalXp, level: data.level }

  const newTotal = data.totalXp + (isCorrect ? xpEarned : 0)
  const currentQuizXp = data.chapterProgress?.[chapterId]?.quizXp ?? 0
  const level = getLevelForXp(newTotal).level

  await updateDoc(ref, {
    totalXp: newTotal,
    level,
    [`chapterProgress.${chapterId}.quizAnswers.${questionId}`]: answerId,
    [`chapterProgress.${chapterId}.quizXp`]: currentQuizXp + (isCorrect ? xpEarned : 0),
  })

  return { newTotal, level }
}

export async function completeChallenge(
  userId: string,
  chapterId: string,
  xpEarned: number,
): Promise<{ newTotal: number; level: number; newBadge: string | null }> {
  const ref = doc(db, COLLECTION, userId)
  const snap = await getDoc(ref)
  const data = snap.data() as UserProgress

  const alreadyDone = data.chapterProgress?.[chapterId]?.challengeCompleted
  if (alreadyDone) return { newTotal: data.totalXp, level: data.level, newBadge: null }

  const chapter = CHAPTERS.find((c) => c.id === chapterId)!
  const newTotal = data.totalXp + xpEarned
  const level = getLevelForXp(newTotal).level
  const completedChapters = [...(data.completedChapters ?? []), chapterId]
  const earnedBadges = [...(data.earnedBadges ?? []), chapter.badge.id]

  const allDone = CHAPTERS.every((c) => completedChapters.includes(c.id))

  await updateDoc(ref, {
    totalXp: newTotal,
    level,
    completedChapters,
    earnedBadges,
    [`chapterProgress.${chapterId}.challengeCompleted`]: true,
    [`chapterProgress.${chapterId}.challengeXp`]: xpEarned,
    [`chapterProgress.${chapterId}.completedAt`]: serverTimestamp(),
    ...(allDone ? { completedAt: serverTimestamp() } : {}),
  })

  return { newTotal, level, newBadge: chapter.badge.id }
}

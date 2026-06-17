export type QuizOption = {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

export type QuizQuestion = {
  id: string
  type: 'normal' | 'pegadinha' | 'charada'
  question: string
  options: QuizOption[]
  hint?: string
  xpReward: number
}

export type Challenge = {
  id: string
  title: string
  description: string
  instructions: string[]
  url?: string
  verificationHint: string
  xpReward: number
}

export type Chapter = {
  id: string
  order: number
  title: string
  subtitle: string
  emoji: string
  color: string
  xpTotal: number
  badge: Badge
  theory: {
    sections: TheorySection[]
  }
  quiz: QuizQuestion[]
  challenge: Challenge
}

export type TheorySection = {
  heading: string
  body: string
  highlight?: string
  code?: string
}

export type Badge = {
  id: string
  emoji: string
  name: string
  description: string
  chapterId: string
}

export type Level = {
  level: number
  name: string
  minXp: number
  maxXp: number
  emoji: string
  color: string
}

export type UserProgress = {
  userId: string
  displayName: string
  totalXp: number
  level: number
  earnedBadges: string[]
  completedChapters: string[]
  chapterProgress: Record<string, ChapterProgress>
  startedAt: Date
  completedAt?: Date
}

export type ChapterProgress = {
  chapterId: string
  startedAt: Date
  completedAt?: Date
  theoryRead: boolean
  quizAnswers: Record<string, string>
  quizXp: number
  challengeCompleted: boolean
  challengeXp: number
}

'use client'

import { create } from 'zustand'
import type { ChaosType } from '@/schemas/chaos'
import type { CircuitState } from '@/lib/circuit-breaker'

interface ActiveExperiment {
  type: ChaosType
  target: string
  delayMs?: number
  durationMs: number
  blastRadius: number
  startedAt: Date
}

interface ChaosStore {
  activeExperiment: ActiveExperiment | null
  circuitState: CircuitState
  fallbackActive: boolean
  setExperiment: (experiment: ActiveExperiment | null) => void
  setCircuitState: (state: CircuitState) => void
  setFallbackActive: (active: boolean) => void
  reset: () => void
}

export const useChaosStore = create<ChaosStore>()((set) => ({
  activeExperiment: null,
  circuitState: 'CLOSED',
  fallbackActive: false,

  setExperiment: (experiment) => set({ activeExperiment: experiment }),
  setCircuitState: (circuitState) => set({ circuitState }),
  setFallbackActive: (fallbackActive) => set({ fallbackActive }),
  reset: () => set({ activeExperiment: null, circuitState: 'CLOSED', fallbackActive: false }),
}))

import type { ChaosType } from '@/schemas/chaos'

interface ActiveExperiment {
  type: ChaosType
  target: string
  delayMs: number
  startedAt: number
  endsAt: number
  blastRadius: number
}

// Singleton para simular experimentos de caos em dev/staging
class ChaosEngine {
  private experiment: ActiveExperiment | null = null

  inject(config: {
    type: ChaosType
    target: string
    delayMs?: number
    durationMs: number
    blastRadius: number
  }) {
    this.experiment = {
      type: config.type,
      target: config.target,
      delayMs: config.delayMs ?? 0,
      startedAt: Date.now(),
      endsAt: Date.now() + config.durationMs,
      blastRadius: config.blastRadius,
    }
  }

  stop() {
    this.experiment = null
  }

  getActiveExperiment(): ActiveExperiment | null {
    if (!this.experiment) return null
    if (Date.now() > this.experiment.endsAt) {
      this.experiment = null
      return null
    }
    return this.experiment
  }

  shouldAffect(target: string): boolean {
    const exp = this.getActiveExperiment()
    if (!exp || exp.target !== target) return false
    return Math.random() * 100 <= exp.blastRadius
  }

  async applyToRequest(target: string): Promise<void> {
    const exp = this.getActiveExperiment()
    if (!exp || !this.shouldAffect(target)) return

    switch (exp.type) {
      case 'latency':
        await new Promise((resolve) => setTimeout(resolve, exp.delayMs))
        break
      case 'error_500':
        throw new Error('CHAOS_INJECTED: Simulated 500 error')
      case 'timeout':
        await new Promise((_, reject) =>
          setTimeout(() => reject(new Error('CHAOS_INJECTED: Simulated timeout')), exp.delayMs || 5000)
        )
        break
      case 'unavailable':
        throw new Error('CHAOS_INJECTED: Service unavailable')
    }
  }
}

export const chaosEngine = new ChaosEngine()

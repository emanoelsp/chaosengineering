import { chaosEngine } from '@/lib/chaos-engine'
import { freightCircuitBreaker } from '@/lib/circuit-breaker'
import type { InjectChaosInput } from '@/schemas/chaos'

export function injectChaos(input: InjectChaosInput) {
  chaosEngine.inject(input)
}

export function stopChaos() {
  chaosEngine.stop()
}

export function getActiveExperiment() {
  return chaosEngine.getActiveExperiment()
}

export function getSystemMetrics() {
  const cbStatus = freightCircuitBreaker.getStatus()
  const experiment = chaosEngine.getActiveExperiment()

  return {
    circuitBreaker: cbStatus,
    chaosActive: experiment !== null,
    experiment,
    timestamp: new Date(),
  }
}

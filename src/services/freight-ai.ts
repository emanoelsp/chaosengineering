import { freightCircuitBreaker } from '@/lib/circuit-breaker'
import { chaosEngine } from '@/lib/chaos-engine'
import { calculateFreightWithAI } from '@/ai/agents/freight-agent'
import { FALLBACK_FREIGHT } from '@/ai/guardrails/output-guardrail'
import type { FreightOutput } from '@/schemas/freight'

const TARGET = 'api-frete-ia'

export async function calculateFreight(rawInput: unknown): Promise<FreightOutput> {
  try {
    // Aplica caos antes de chamar a IA (apenas em dev/staging)
    if (process.env.NODE_ENV !== 'production') {
      await chaosEngine.applyToRequest(TARGET)
    }

    return await freightCircuitBreaker.call(() => calculateFreightWithAI(rawInput))
  } catch (error) {
    const msg = (error as Error).message ?? ''

    if (msg.startsWith('INPUT_REJECTED:')) throw error

    if (msg.startsWith('CIRCUIT_OPEN:') || msg.startsWith('FREIGHT_TIMEOUT:') || msg.startsWith('CHAOS_INJECTED:')) {
      return { ...FALLBACK_FREIGHT, isFallback: true }
    }

    console.error('[freight-ai:service] Erro inesperado:', msg)
    return { ...FALLBACK_FREIGHT, isFallback: true }
  }
}

export function getCircuitBreakerStatus() {
  return freightCircuitBreaker.getStatus()
}

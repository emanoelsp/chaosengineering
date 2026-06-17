import { z } from 'zod'

export const ChaosTypeSchema = z.enum([
  'latency',
  'error_500',
  'timeout',
  'unavailable',
])

export const InjectChaosSchema = z.object({
  type: ChaosTypeSchema,
  target: z.string().min(1).max(50),
  delayMs: z.number().int().min(0).max(30000).optional(),
  durationMs: z.number().int().min(1000).max(300000),
  blastRadius: z.number().int().min(1).max(100),
})

export const ChaosMetricsSchema = z.object({
  errorRate: z.number().min(0).max(100),
  avgResponseTimeMs: z.number().nonnegative(),
  conversionRate: z.number().min(0).max(100),
  circuitBreakerState: z.enum(['CLOSED', 'OPEN', 'HALF_OPEN']),
  fallbackActive: z.boolean(),
  timestamp: z.date(),
})

export type ChaosType = z.infer<typeof ChaosTypeSchema>
export type InjectChaosInput = z.infer<typeof InjectChaosSchema>
export type ChaosMetrics = z.infer<typeof ChaosMetricsSchema>

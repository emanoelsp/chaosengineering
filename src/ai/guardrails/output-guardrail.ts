import { FreightOutputSchema, type FreightOutput } from '@/schemas/freight'

export const FALLBACK_FREIGHT: FreightOutput = {
  valorFrete: 10.0,
  prazoEntrega: 7,
  justificativa: 'Frete padrão (serviço de IA temporariamente indisponível)',
  isFallback: true,
}

export function validateFreightOutput(raw: unknown): FreightOutput {
  const parsed = FreightOutputSchema.safeParse(raw)

  if (!parsed.success) {
    console.error('[guardrail:output] Output inválido da IA:', raw, parsed.error.issues)
    throw new Error('OUTPUT_INVALID: Resposta da IA fora do schema esperado')
  }

  // Sanity check: frete nunca pode ser R$ 0
  if (parsed.data.valorFrete === 0) {
    throw new Error('OUTPUT_INVALID: valorFrete não pode ser zero')
  }

  return { ...parsed.data, isFallback: false }
}

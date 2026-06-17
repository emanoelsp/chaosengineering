import { getGroqClient, AI_MODEL, AI_MAX_TOKENS, AI_TIMEOUT_MS } from '@/lib/ai/client'
import { FREIGHT_SYSTEM_PROMPT } from '@/ai/prompts/freight-system-prompt'
import { validateFreightInput } from '@/ai/guardrails/input-guardrail'
import { validateFreightOutput, FALLBACK_FREIGHT } from '@/ai/guardrails/output-guardrail'
import type { FreightInput, FreightOutput } from '@/schemas/freight'

export async function calculateFreightWithAI(rawInput: unknown): Promise<FreightOutput> {
  const input: FreightInput = validateFreightInput(rawInput)

  const userMessage = JSON.stringify({
    cep: input.cep,
    peso: input.peso,
    quantidadeItens: input.itens.reduce((acc, i) => acc + i.quantidade, 0),
  })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  try {
    const groq = getGroqClient()

    const completion = await groq.chat.completions.create(
      {
        model: AI_MODEL,
        max_tokens: AI_MAX_TOKENS,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: FREIGHT_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      },
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    const text = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(text)

    return validateFreightOutput(parsed)
  } catch (error) {
    clearTimeout(timeoutId)

    const msg = (error as Error).message ?? ''
    const isCircuitOpen = msg.startsWith('CIRCUIT_OPEN:')
    const isInputRejected = msg.startsWith('INPUT_REJECTED:')
    const isTimeout = (error as Error).name === 'AbortError'

    if (isInputRejected || isCircuitOpen) throw error

    console.error('[freight-agent] Erro ao calcular frete:', msg)

    if (isTimeout) {
      throw new Error('FREIGHT_TIMEOUT: API de frete não respondeu em tempo hábil')
    }

    return FALLBACK_FREIGHT
  }
}

import { FreightInputSchema, type FreightInput } from '@/schemas/freight'
import { ZodError } from 'zod'

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above|prior)/i,
  /system\s*prompt/i,
  /jailbreak/i,
  /forget\s+everything/i,
  /act\s+as/i,
  /frete\s+gr[aá]tis/i,
  /desconto\s+de\s+100/i,
  /\beval\b|\bexec\b/i,
]

export function validateFreightInput(raw: unknown): FreightInput {
  const parsed = FreightInputSchema.safeParse(raw)

  if (!parsed.success) {
    throw new ZodError(parsed.error.issues)
  }

  const cepStr = String(parsed.data.cep)
  const allText = JSON.stringify(parsed.data)

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(allText) || pattern.test(cepStr)) {
      throw new Error('INPUT_REJECTED: Possível tentativa de injeção detectada')
    }
  }

  return parsed.data
}

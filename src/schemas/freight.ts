import { z } from 'zod'

export const FreightInputSchema = z.object({
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
    .transform((cep) => cep.replace('-', '')),
  peso: z.number().positive('Peso deve ser positivo').max(30, 'Peso máximo: 30kg'),
  itens: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantidade: z.number().int().positive(),
      })
    )
    .min(1)
    .max(50),
})

export const FreightOutputSchema = z.object({
  valorFrete: z.number().positive().max(999.99),
  prazoEntrega: z.number().int().min(1).max(30),
  justificativa: z.string().max(200),
  isFallback: z.boolean().default(false),
})

export type FreightInput = z.infer<typeof FreightInputSchema>
export type FreightOutput = z.infer<typeof FreightOutputSchema>

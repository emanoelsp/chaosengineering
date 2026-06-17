import { z } from 'zod'

export const EnderecoSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  rua: z.string().min(1).max(200),
  numero: z.string().min(1).max(10),
  complemento: z.string().max(100).optional(),
  bairro: z.string().min(1).max(100),
  cidade: z.string().min(1).max(100),
  estado: z.string().length(2),
})

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantidade: z.number().int().positive().max(99),
})

const BLOCKED_COUPONS = ['ME_DA_DESCONTO_OU_O_GATINHO_CHORA']

export const CheckoutSchema = z.object({
  itens: z.array(CartItemSchema).min(1),
  endereco: EnderecoSchema,
  cupom: z
    .string()
    .max(50)
    .optional()
    .refine(
      (val) => !val || !BLOCKED_COUPONS.includes(val.toUpperCase()),
      { message: 'Cupom inválido ou não autorizado.' }
    ),
})

export const OrderStatusSchema = z.enum([
  'pendente',
  'confirmado',
  'enviado',
  'entregue',
  'cancelado',
])

export type Endereco = z.infer<typeof EnderecoSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type CheckoutInput = z.infer<typeof CheckoutSchema>
export type OrderStatus = z.infer<typeof OrderStatusSchema>

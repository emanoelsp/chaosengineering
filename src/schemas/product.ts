import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1).max(100),
  descricao: z.string().min(1).max(500),
  preco: z.number().positive().multipleOf(0.01),
  estoque: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
  categoria: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateProductSchema = CreateProductSchema.partial()

export type Product = z.infer<typeof ProductSchema>
export type CreateProduct = z.infer<typeof CreateProductSchema>
export type UpdateProduct = z.infer<typeof UpdateProductSchema>

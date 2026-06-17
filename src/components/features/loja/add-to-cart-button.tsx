'use client'

import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/schemas/product'
import { toast } from 'sonner'

export function AddToCartButton({ product }: { product: Product }) {
  const { add, items } = useCartStore()
  const inCart = items.find((i) => i.product.id === product.id)?.quantidade ?? 0

  return (
    <button
      onClick={() => {
        add(product)
        toast.success(`${product.nome} adicionado!`, { description: 'Veja seu carrinho para finalizar.' })
      }}
      className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      {inCart > 0 ? `Adicionar mais (${inCart} no carrinho)` : 'Adicionar ao carrinho'}
    </button>
  )
}

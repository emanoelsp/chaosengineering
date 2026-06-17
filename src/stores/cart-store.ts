'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/schemas/product'

interface CartItem {
  product: Product
  quantidade: number
}

interface CartStore {
  items: CartItem[]
  add: (product: Product, quantidade?: number) => void
  remove: (productId: string) => void
  updateQuantity: (productId: string, quantidade: number) => void
  clear: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, quantidade = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantidade: Math.min(i.quantidade + quantidade, product.estoque) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantidade }] }
        })
      },

      remove: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }))
      },

      updateQuantity: (productId, quantidade) => {
        if (quantidade <= 0) {
          get().remove(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantidade } : i
          ),
        }))
      },

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, i) => acc + i.product.preco * i.quantidade, 0),

      itemCount: () => get().items.reduce((acc, i) => acc + i.quantidade, 0),
    }),
    { name: 'chaos-gpt-cart' }
  )
)

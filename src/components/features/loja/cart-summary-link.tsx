'use client'

import Link from 'next/link'
import { useCartStore } from '@/stores/cart-store'

export function CartSummaryLink() {
  const count = useCartStore((s) => s.itemCount())

  if (count === 0) return null

  return (
    <Link
      href="/checkout"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
    >
      🛒 Ver carrinho ({count})
    </Link>
  )
}

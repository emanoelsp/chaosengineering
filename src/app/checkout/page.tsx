'use client'

import { useCartStore } from '@/stores/cart-store'
import { useFreight } from '@/hooks/use-freight'
import { formatCurrency } from '@/lib/utils'

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const { freight, loading, error, calculate } = useFreight()

  const subtotal = total()

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Finalizar Compra</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-6">
          {/* Resumo dos itens */}
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Itens do pedido</h2>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between py-1 text-sm">
                <span>{item.product.nome} × {item.quantidade}</span>
                <span>{formatCurrency(item.product.preco * item.quantidade)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </section>

          {/* FreightCalculator component goes here */}
          {freight && (
            <section className="rounded-lg border p-4">
              <h2 className="mb-2 font-semibold">Frete</h2>
              {freight.isFallback && (
                <div className="mb-2 rounded bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Frete calculado pelo fallback (API de IA indisponível)
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Prazo: {freight.prazoEntrega} dias úteis</span>
                <span className="font-semibold">{formatCurrency(freight.valorFrete)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{freight.justificativa}</p>
            </section>
          )}

          {freight && (
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(subtotal + freight.valorFrete)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cart-store'
import { useFreight } from '@/hooks/use-freight'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const BLOCKED_COUPONS = ['ME_DA_DESCONTO_OU_O_GATINHO_CHORA']

export default function CheckoutPage() {
  const { items, total, updateQuantity, remove, clear } = useCartStore()
  const { freight, loading: freightLoading, error: freightError, calculate } = useFreight()

  const [cep, setCep] = useState('')
  const [cupom, setCupom] = useState('')
  const [cupomError, setCupomError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const subtotal = total()

  const handleCalculateFreight = async () => {
    const peso = items.reduce((acc, i) => acc + 0.3 * i.quantidade, 0)
    const itens = items.map((i) => ({ id: i.product.id, quantidade: i.quantidade }))
    await calculate(cep, peso, itens)
  }

  const handleSubmit = async () => {
    if (!freight) {
      toast.error('Calcule o frete antes de finalizar.')
      return
    }

    if (cupom && BLOCKED_COUPONS.includes(cupom.toUpperCase())) {
      setCupomError('Cupom inválido ou não autorizado.')
      return
    }

    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      const fakeId = Math.random().toString(36).slice(2, 10).toUpperCase()
      setOrderId(fakeId)
      clear()
    } finally {
      setSubmitting(false)
    }
  }

  if (orderId) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <div className="text-6xl">🦫</div>
        <h1 className="text-2xl font-bold">Pedido confirmado!</h1>
        <p className="text-muted-foreground">Pedido #{orderId}</p>
        {freight?.isFallback && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            ⚡ Compra realizada com Circuit Breaker ativo — frete pelo fallback!
          </div>
        )}
        <Link href="/loja" className="inline-block text-sm text-primary underline">
          Continuar comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Finalizar Compra</h1>

      {items.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Link href="/loja" className="text-sm text-primary underline">
            Ir para a loja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Itens */}
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Itens do pedido</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🦫</span>
                    <div>
                      <p className="font-medium">{item.product.nome}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                          className="px-1 hover:text-foreground"
                        >
                          −
                        </button>
                        <span>{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                          className="px-1 hover:text-foreground"
                        >
                          +
                        </button>
                        <button
                          onClick={() => remove(item.product.id)}
                          className="ml-2 text-destructive hover:underline"
                        >
                          remover
                        </button>
                      </div>
                    </div>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.product.preco * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </section>

          {/* Frete */}
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Calcular Frete</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CEP (ex: 01310-100)"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleCalculateFreight}
                disabled={freightLoading || !cep.trim()}
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 transition-colors"
              >
                {freightLoading ? 'Calculando...' : 'Calcular'}
              </button>
            </div>

            {freightError && (
              <p className="mt-2 text-sm text-destructive">{freightError}</p>
            )}

            {freight && (
              <div className="mt-3 space-y-1">
                {freight.isFallback && (
                  <div className="rounded bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
                    ⚡ Frete calculado pelo fallback — Circuit Breaker ativo
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prazo: {freight.prazoEntrega} dias úteis</span>
                  <span className="font-semibold">{formatCurrency(freight.valorFrete)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{freight.justificativa}</p>
              </div>
            )}
          </section>

          {/* Cupom */}
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Cupom de Desconto</h2>
            <input
              type="text"
              placeholder="Código do cupom"
              value={cupom}
              onChange={(e) => {
                setCupom(e.target.value)
                setCupomError(null)
              }}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {cupomError && (
              <p className="mt-1 text-sm text-destructive">{cupomError}</p>
            )}
          </section>

          {/* Total */}
          {freight && (
            <div className="flex justify-between text-lg font-bold px-1">
              <span>Total</span>
              <span>{formatCurrency(subtotal + freight.valorFrete)}</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !freight}
            className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {submitting
              ? 'Processando...'
              : freight
              ? 'Finalizar Compra'
              : 'Calcule o frete para continuar'}
          </button>
        </div>
      )}
    </div>
  )
}

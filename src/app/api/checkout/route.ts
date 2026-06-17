import { NextRequest, NextResponse } from 'next/server'
import { CheckoutSchema } from '@/schemas/order'
import { calculateFreight } from '@/services/freight-ai'
import { createOrder } from '@/services/orders'
import { decrementStock, getProduct } from '@/services/products'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = CheckoutSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  const { itens, endereco, cupom } = parsed.data

  // Calcular peso total e buscar produtos
  let pesoTotal = 0
  let subtotal = 0

  for (const item of itens) {
    const product = await getProduct(item.productId)
    if (!product) {
      return NextResponse.json({ error: `Produto ${item.productId} não encontrado.` }, { status: 404 })
    }
    if (product.estoque < item.quantidade) {
      return NextResponse.json({ error: `Estoque insuficiente: ${product.nome}` }, { status: 422 })
    }
    pesoTotal += 0.3 * item.quantidade // 300g por capivara
    subtotal += product.preco * item.quantidade
  }

  const freight = await calculateFreight({
    cep: endereco.cep,
    peso: pesoTotal,
    itens,
  })

  const total = subtotal + freight.valorFrete

  // Decrementar estoque e criar pedido atomicamente (simplificado para fins didáticos)
  for (const item of itens) {
    await decrementStock(item.productId, item.quantidade)
  }

  const orderId = await createOrder(userId, parsed.data, freight, total)

  return NextResponse.json({ orderId, total, freight })
}

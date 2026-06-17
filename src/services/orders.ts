import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { CheckoutInput, OrderStatus } from '@/schemas/order'
import type { FreightOutput } from '@/schemas/freight'

const COLLECTION = 'orders'

export async function createOrder(
  userId: string,
  checkout: CheckoutInput,
  freight: FreightOutput,
  total: number
) {
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    itens: checkout.itens,
    enderecoEntrega: checkout.endereco,
    frete: freight,
    cupomAplicado: checkout.cupom ?? null,
    total,
    status: 'pendente' as OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function listOrdersByUser(userId: string) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(doc(db, COLLECTION, orderId), {
    status,
    updatedAt: serverTimestamp(),
  })
}

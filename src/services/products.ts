import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Product } from '@/schemas/product'

const COLLECTION = 'products'

export async function listProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, COLLECTION))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Product))
    .filter((p) => p.estoque > 0)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Product
}

export async function decrementStock(id: string, quantidade: number): Promise<void> {
  const product = await getProduct(id)
  if (!product) throw new Error(`Produto ${id} não encontrado`)
  if (product.estoque < quantidade) throw new Error(`Estoque insuficiente para ${product.nome}`)
  await updateDoc(doc(db, COLLECTION, id), {
    estoque: product.estoque - quantidade,
    updatedAt: new Date(),
  })
}

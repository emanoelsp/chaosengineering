import { listProducts } from '@/services/products'
import type { Product } from '@/schemas/product'

export const dynamic = 'force-dynamic'

export default async function LojaPage() {
  let products: Product[] = []
  let fetchError = false
  try {
    products = await listProducts()
  } catch {
    fetchError = true
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Capivaras de Pelúcia</h1>
      <p className="mb-8 text-muted-foreground">A loja que vai ser quebrada de propósito.</p>

      {fetchError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
          <p className="font-semibold text-destructive">Não foi possível carregar os produtos.</p>
          <p className="text-sm text-muted-foreground">
            Verifique se o seed foi executado e se o índice composto do Firestore está criado
            (campo <code className="font-mono text-xs bg-muted px-1 rounded">estoque ASC + nome ASC</code> na coleção <code className="font-mono text-xs bg-muted px-1 rounded">products</code>).
          </p>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum produto disponível. Rode <code className="font-mono text-xs bg-muted px-1 rounded">npm run seed</code> para popular o banco.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-3 aspect-square overflow-hidden rounded-md bg-muted">
                {/* ProductCard component goes here */}
                <div className="flex h-full items-center justify-center text-4xl">🦫</div>
              </div>
              <h2 className="font-semibold">{product.nome}</h2>
              <p className="text-sm text-muted-foreground">{product.descricao}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                </span>
                <span className="text-xs text-muted-foreground">{product.estoque} em estoque</span>
              </div>
              {/* AddToCartButton client component goes here */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

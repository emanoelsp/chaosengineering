import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 bg-background">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">🦫</div>
        <h1 className="text-5xl font-black tracking-tight">Chaos GPT</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          E-commerce educacional de Engenharia do Caos com IA
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          href="/jornada"
          className="flex-1 text-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white font-black text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          🔥 Iniciar Jornada
        </Link>
        <Link
          href="/loja"
          className="flex-1 text-center rounded-xl border-2 border-border px-6 py-4 font-bold hover:bg-muted transition-colors"
        >
          🛒 Ir à Loja
        </Link>
      </div>

      <Link
        href="/login"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Entrar com login →
      </Link>

      <p className="max-w-md text-center text-sm text-muted-foreground italic border-t border-border pt-6">
        &quot;Testar não é apenas garantir que o código funciona quando tudo está perfeito.
        Testar é garantir que o sistema sobrevive quando o mundo ao redor está pegando fogo.&quot;
      </p>
    </main>
  )
}

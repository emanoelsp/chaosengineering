import Link from 'next/link'
import { GuestEntryForm } from '@/components/features/auth/guest-entry-form'

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

      <GuestEntryForm />

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <Link href="/loja" className="hover:text-foreground transition-colors">
          🛒 Ir à Loja
        </Link>
        <span>·</span>
        <Link href="/login" className="hover:text-foreground transition-colors">
          Entrar com conta →
        </Link>
      </div>

      <p className="max-w-md text-center text-sm text-muted-foreground italic border-t border-border pt-6">
        &quot;Testar não é apenas garantir que o código funciona quando tudo está perfeito.
        Testar é garantir que o sistema sobrevive quando o mundo ao redor está pegando fogo.&quot;
      </p>
    </main>
  )
}

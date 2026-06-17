'use client'

import { useRequireRole } from '@/hooks/use-auth'

export default function ChaosPage() {
  const { authorized, loading } = useRequireRole('professor')

  if (loading) return <div className="flex min-h-screen items-center justify-center">Carregando...</div>

  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
        <p className="text-muted-foreground">Apenas professores e admins podem acessar o Painel do Caos.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel de Controle do Caos</h1>
        <p className="mt-1 text-muted-foreground">
          Injete falhas controladas e observe como o sistema responde.
        </p>
      </div>

      {/* ChaosPanel, MetricsDisplay, CircuitBreakerStatus, ExperimentLog components go here */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Configurar Experimento</h2>
          <p className="text-sm text-muted-foreground">ChaosPanel component — a implementar</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Métricas em Tempo Real</h2>
          <p className="text-sm text-muted-foreground">MetricsDisplay component — a implementar</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Circuit Breaker</h2>
          <p className="text-sm text-muted-foreground">CircuitBreakerStatus component — a implementar</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Log de Experimentos</h2>
          <p className="text-sm text-muted-foreground">ExperimentLog component — a implementar</p>
        </div>
      </div>
    </div>
  )
}

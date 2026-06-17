'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { CircuitState } from '@/lib/circuit-breaker'

interface Status {
  state: CircuitState
  failureCount: number
  nextRetryTime?: number
}

const STATE_CONFIG: Record<CircuitState, { label: string; color: string }> = {
  CLOSED: { label: 'Fechado (Normal)', color: 'bg-chaos-closed text-white' },
  OPEN: { label: 'Aberto (Protegendo)', color: 'bg-chaos-open text-white' },
  HALF_OPEN: { label: 'Meio-Aberto (Testando)', color: 'bg-chaos-halfOpen text-white' },
}

export function CircuitBreakerStatus() {
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    const poll = async () => {
      const res = await fetch('/api/circuit-breaker/status')
      if (res.ok) setStatus(await res.json())
    }

    poll()
    const id = setInterval(poll, 2000)
    return () => clearInterval(id)
  }, [])

  if (!status) return null

  const config = STATE_CONFIG[status.state]

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Circuit Breaker</h3>
      <span className={cn('inline-flex rounded-full px-3 py-1 text-sm font-medium', config.color)}>
        {config.label}
      </span>
      <p className="mt-2 text-xs text-muted-foreground">
        Falhas consecutivas: {status.failureCount}
      </p>
      {status.state === 'OPEN' && status.nextRetryTime && (
        <p className="text-xs text-muted-foreground">
          Próxima tentativa: {new Date(status.nextRetryTime).toLocaleTimeString('pt-BR')}
        </p>
      )}
    </div>
  )
}

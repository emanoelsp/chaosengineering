'use client'

import { useState } from 'react'
import { useChaosStore } from '@/stores/chaos-store'
import type { ChaosType } from '@/schemas/chaos'

const CHAOS_TYPES: { value: ChaosType; label: string; description: string }[] = [
  { value: 'latency', label: 'Latência', description: 'Adiciona delay na resposta da API' },
  { value: 'error_500', label: 'Erro 500', description: 'API responde com erro de servidor' },
  { value: 'timeout', label: 'Timeout', description: 'API não responde (timeout)' },
  { value: 'unavailable', label: 'Indisponível', description: 'API completamente fora do ar' },
]

export function ChaosPanel() {
  const { setExperiment, activeExperiment } = useChaosStore()
  const [type, setType] = useState<ChaosType>('latency')
  const [delayMs, setDelayMs] = useState(15000)
  const [durationMs, setDurationMs] = useState(60000)
  const [blastRadius, setBlastRadius] = useState(100)
  const [loading, setLoading] = useState(false)

  const handleInject = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/chaos/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target: 'api-frete-ia', delayMs, durationMs, blastRadius }),
      })
      if (res.ok) {
        setExperiment({ type, target: 'api-frete-ia', delayMs, durationMs, blastRadius, startedAt: new Date() })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    await fetch('/api/chaos/stop', { method: 'POST' })
    setExperiment(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Tipo de falha</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ChaosType)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {CHAOS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label} — {t.description}</option>
          ))}
        </select>
      </div>

      {type === 'latency' && (
        <div>
          <label className="mb-1 block text-sm font-medium">Delay: {delayMs / 1000}s</label>
          <input
            type="range" min={1000} max={30000} step={1000}
            value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Duração: {durationMs / 1000}s</label>
        <input
          type="range" min={5000} max={300000} step={5000}
          value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Blast Radius: {blastRadius}% dos usuários</label>
        <input
          type="range" min={1} max={100}
          value={blastRadius} onChange={(e) => setBlastRadius(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleInject}
          disabled={loading || !!activeExperiment}
          className="flex-1 rounded-md bg-destructive py-2 text-sm text-white hover:bg-destructive/90 disabled:opacity-50"
        >
          {loading ? 'Injetando...' : 'Disparar Caos'}
        </button>
        <button
          onClick={handleStop}
          disabled={!activeExperiment}
          className="flex-1 rounded-md border py-2 text-sm hover:bg-accent disabled:opacity-50"
        >
          Parar
        </button>
      </div>

      {activeExperiment && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Experimento ativo: <strong>{activeExperiment.type}</strong> em {activeExperiment.target}
          &nbsp;({activeExperiment.blastRadius}% dos usuários)
        </div>
      )}
    </div>
  )
}

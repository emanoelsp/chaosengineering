'use client'

import { useState } from 'react'
import type { FreightOutput } from '@/schemas/freight'

interface UseFreightReturn {
  freight: FreightOutput | null
  loading: boolean
  error: string | null
  calculate: (cep: string, peso: number, itens: { id: string; quantidade: number }[]) => Promise<void>
  reset: () => void
}

export function useFreight(): UseFreightReturn {
  const [freight, setFreight] = useState<FreightOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = async (
    cep: string,
    peso: number,
    itens: { id: string; quantidade: number }[]
  ) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/frete-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, peso, itens }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erro ao calcular frete')
      }

      const data: FreightOutput = await res.json()
      setFreight(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return { freight, loading, error, calculate, reset: () => setFreight(null) }
}

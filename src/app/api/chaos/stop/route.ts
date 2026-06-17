import { NextResponse } from 'next/server'
import { stopChaos } from '@/services/chaos'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Não disponível em produção.' }, { status: 403 })
  }

  stopChaos()
  return NextResponse.json({ ok: true, message: 'Experimento de caos encerrado.' })
}

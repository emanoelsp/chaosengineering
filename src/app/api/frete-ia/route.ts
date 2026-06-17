import { NextRequest, NextResponse } from 'next/server'
import { calculateFreight } from '@/services/freight-ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await calculateFreight(body)
    return NextResponse.json(result)
  } catch (error) {
    const msg = (error as Error).message ?? 'Erro interno'

    if (msg.startsWith('INPUT_REJECTED:')) {
      return NextResponse.json({ error: 'Dados de entrada inválidos.' }, { status: 400 })
    }

    console.error('[api/frete-ia]', msg)
    return NextResponse.json({ error: 'Erro ao calcular frete.' }, { status: 500 })
  }
}

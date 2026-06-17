import { NextRequest, NextResponse } from 'next/server'
import { InjectChaosSchema } from '@/schemas/chaos'
import { injectChaos } from '@/services/chaos'

// Rota disponível apenas em ambientes não-produção
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Não disponível em produção.' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = InjectChaosSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
  }

  injectChaos(parsed.data)

  return NextResponse.json({
    ok: true,
    experiment: parsed.data,
    message: `Caos injetado: ${parsed.data.type} em ${parsed.data.target} por ${parsed.data.durationMs / 1000}s`,
  })
}

import { NextResponse } from 'next/server'
import { getCircuitBreakerStatus } from '@/services/freight-ai'

export async function GET() {
  const status = getCircuitBreakerStatus()
  return NextResponse.json(status)
}

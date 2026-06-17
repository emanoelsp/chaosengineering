import { NextResponse } from 'next/server'
import { getSystemMetrics } from '@/services/chaos'

export async function GET() {
  const metrics = getSystemMetrics()
  return NextResponse.json(metrics)
}

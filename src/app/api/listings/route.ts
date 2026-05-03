import { NextRequest, NextResponse } from 'next/server'
import { suggestPrice } from '@/lib/claude'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Claude API not yet configured' }, { status: 503 })
  }

  const { category, metadata } = (await req.json()) as {
    category: string
    metadata: Record<string, unknown>
  }

  const suggestion = await suggestPrice(category, metadata)
  return NextResponse.json(suggestion)
}

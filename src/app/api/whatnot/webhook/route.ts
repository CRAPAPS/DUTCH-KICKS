import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { adminClient } from '@/lib/supabase/admin'
import { buildFulfillmentPack } from '@/lib/claude'

async function fulfillAsync(itemId: string, salePrice: number) {
  const { data: item } = await adminClient
    .from('inventory')
    .select('*')
    .eq('id', itemId)
    .single()

  if (!item || !process.env.ANTHROPIC_API_KEY) return

  const pack = await buildFulfillmentPack(item, salePrice)
  // TODO: store pack in fulfillment table / trigger email
  console.log('Fulfillment pack generated', { itemId, pack })
}

export async function POST(req: NextRequest) {
  const body = await req.text()

  const secret = process.env.WHATNOT_WEBHOOK_SECRET
  if (secret) {
    const sig = req.headers.get('x-whatnot-signature') ?? ''
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
    if (sig !== `sha256=${expected}`) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const payload = JSON.parse(body) as { item_id: string; sale_price: number }
  const { item_id, sale_price } = payload

  await adminClient
    .from('inventory')
    .update({ status: 'sold' })
    .eq('id', item_id)

  // Fire-and-forget — return 200 before Claude runs
  fulfillAsync(item_id, sale_price).catch(console.error)

  return NextResponse.json({ ok: true })
}

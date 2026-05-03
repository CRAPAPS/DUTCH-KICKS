import Anthropic from '@anthropic-ai/sdk'

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured')
  return new Anthropic()
}

export async function verifyPhoto(
  imageBase64: string,
  refImageUrl: string | null
): Promise<{ match: boolean | null; confidence: number | null; notes: string }> {
  if (!refImageUrl) {
    return { match: null, confidence: null, notes: 'No reference image — verification skipped' }
  }

  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: [
      {
        type: 'text',
        text: 'You are a product authentication specialist. Compare the uploaded product photo against the reference image and determine if they are the same item.',
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'image', source: { type: 'url', url: refImageUrl } },
          { type: 'text', text: 'Do these images show the same product? Reply with JSON only: {"match":boolean,"confidence":number,"notes":string}' },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  return JSON.parse(text)
}

export async function suggestPrice(
  category: string,
  metadata: Record<string, unknown>
): Promise<{ suggested_start: number; rationale: string; comps: string[] }> {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: [
      {
        type: 'text',
        text: 'You are a resale market expert for sneakers and UFC trading cards. Provide Whatnot live auction starting bid recommendations based on recent sold comps.',
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Category: ${category}\nDetails: ${JSON.stringify(metadata)}\n\nReply with JSON only: {"suggested_start":number,"rationale":string,"comps":string[]}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  return JSON.parse(text)
}

export async function buildFulfillmentPack(
  item: { title: string; category: string; price: number | null; metadata: Record<string, unknown> },
  salePrice: number
): Promise<{
  invoice: { item: string; sale_price: number; tax: number; total: number }
  courier_manifest: { description: string; declared_value: number; packaging_notes: string }
}> {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: [
      {
        type: 'text',
        text: 'You are a fulfillment specialist generating post-sale documents for Whatnot resale transactions. Apply 10% GST where applicable.',
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Item: ${JSON.stringify(item)}\nSale price: $${salePrice}\n\nReply with JSON only: {"invoice":{"item":string,"sale_price":number,"tax":number,"total":number},"courier_manifest":{"description":string,"declared_value":number,"packaging_notes":string}}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  return JSON.parse(text)
}

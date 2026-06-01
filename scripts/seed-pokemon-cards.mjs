// Dutch Kicks — seed Pokemon cards (2026-06-01)
// Usage: node scripts/seed-pokemon-cards.mjs
//
// PREREQUISITE: Run migrate-categories.sql in Supabase Dashboard first
// to add 'pokemon' to the category check constraint.
//
// Images: INVENTORY/Pokemon cards/ (WhatsApp timestamp filenames)
// These are CGC-graded Korean Pokemon Playing Cards (2020s) Ninety-Nine collector series.
// Skips any title already present in DB (idempotent).

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dir, '..')

try {
  const env = readFileSync(resolve(projectRoot, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key?.trim() && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch { /* rely on process env */ }

const SUPABASE_URL = 'https://kovnrrblntwipabmeobq.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const BUCKET = 'inventory'
const CARDS_DIR = resolve(projectRoot, 'INVENTORY', 'Pokemon cards')

function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/[''"'']/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uploadImage(filename) {
  const localPath = join(CARDS_DIR, filename)
  if (!existsSync(localPath)) {
    console.warn(`    MISSING: ${filename}`)
    return null
  }
  const slug = slugify(filename)
  const storagePath = `pokemon/${slug}`
  const fileBuffer = readFileSync(localPath)
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) { console.error(`    ERROR uploading ${filename}: ${error.message}`); return null }
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  console.log(`    uploaded: ${filename}`)
  return publicUrl
}

// ─── Card inventory ───────────────────────────────────────────────────────────
// CGC cert numbers read from the slab labels in the images.
const CARDS = [
  {
    title: 'Pikachu – Pokemon Playing Cards KOR Ninety-Nine #5 CGC GEM MINT 10',
    price: null,
    metadata: {
      character: 'Pikachu',
      set_name: 'Pokemon Playing Cards (2020s) KOR Ninety-Nine',
      card_number: '5',
      serial: '6147388035',
      grade: 'CGC GEM MINT 10',
    },
    image: 'pokemon-pikachu-kor-ninety-nine-5-cgc-gem-mint-10.jpeg',
  },
  {
    title: 'Bulbasaur – Pokemon Playing Cards KOR Ninety-Nine #3 CGC PRISTINE 10',
    price: null,
    metadata: {
      character: 'Bulbasaur',
      set_name: 'Pokemon Playing Cards (2020s) KOR Ninety-Nine',
      card_number: '3',
      serial: '6147388023',
      grade: 'CGC PRISTINE 10',
    },
    image: 'pokemon-bulbasaur-kor-ninety-nine-3-cgc-pristine-10.jpeg',
  },
]

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log('\n=== Seed Pokemon cards ===\n')

let inserted = 0
let skipped = 0
let errors = 0

for (const item of CARDS) {
  console.log(`▶ ${item.title}`)

  const { data: existing } = await supabase
    .from('inventory')
    .select('id')
    .eq('title', item.title)
    .eq('category', 'pokemon')
    .maybeSingle()

  if (existing) {
    console.log('  ↷ already in DB — skipping\n')
    skipped++
    continue
  }

  const imageUrl = await uploadImage(item.image)
  if (!imageUrl) {
    console.log('  ✗ image missing — skipping\n')
    errors++
    continue
  }

  const { error } = await supabase.from('inventory').insert({
    title: item.title,
    category: 'pokemon',
    status: 'available',
    price: item.price,
    image_url: imageUrl,
    metadata: item.metadata,
  })

  if (error) {
    console.error(`  ✗ DB insert error: ${error.message}`)
    if (error.message.includes('inventory_category_check')) {
      console.error('  ⚠  Run scripts/migrate-categories.sql in Supabase Dashboard first!')
    }
    errors++
  } else {
    console.log('  ✓ inserted')
    inserted++
  }
  console.log('')
}

console.log(`=== Done — ${inserted} inserted, ${skipped} skipped, ${errors} errors ===`)

// Dutch Kicks — seed basketball cards (2026-06-01)
// Usage: node scripts/seed-basketball-cards.mjs
//
// PREREQUISITE: Run migrate-categories.sql in Supabase Dashboard first
// to add 'basketball' to the category check constraint.
//
// Images: INVENTORY/Basketball Cards/ (WhatsApp timestamp filenames)
// Each WhatsApp image is one unique card — no "(2)" convention, single image per card.
// Skips any title already present in DB (idempotent).
//
// NOTE: year=0 means the year could not be read from the image label — update manually.

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
const CARDS_DIR = resolve(projectRoot, 'INVENTORY', 'Basketball Cards')

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
  const storagePath = `basketball/${slug}`
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
// Identified by visual inspection of each image.
// The 9 Upper Deck "MJ" mini-cards are separate cards from the same collector series —
// they share the set name but have distinct subtitles and different photographs.
// year=0 where the release year could not be read directly from the card label.
const CARDS = [
  {
    title: 'Cade Cunningham – Panini Select Blue Cracked Ice',
    price: null,
    metadata: { player: 'Cade Cunningham', year: 0, set_name: 'Panini Select', serial: null, autograph: false, grade: null, parallel: 'Blue Cracked Ice Prizm' },
    image: 'WhatsApp Image 2026-05-27 at 00.08.19.jpeg',
  },
  {
    title: 'Armando Bacot – Wild Card Metallix RC Auto',
    price: null,
    metadata: { player: 'Armando Bacot', year: 0, set_name: 'Wild Card Metallix', serial: null, autograph: true, grade: null, parallel: 'RC' },
    image: 'WhatsApp Image 2026-05-27 at 00.08.30.jpeg',
  },
  {
    title: 'Anthony Edwards – Panini Select Blue Prizm',
    price: null,
    metadata: { player: 'Anthony Edwards', year: 0, set_name: 'Panini Select', serial: null, autograph: false, grade: null, parallel: 'Blue Prizm' },
    image: 'WhatsApp Image 2026-05-27 at 00.08.40.jpeg',
  },
  {
    title: 'Tyrese Haliburton – Panini Revolution',
    price: null,
    metadata: { player: 'Tyrese Haliburton', year: 0, set_name: 'Panini Revolution', serial: null, autograph: false, grade: null, parallel: null },
    image: 'WhatsApp Image 2026-05-27 at 00.08.50.jpeg',
  },
  {
    title: 'Magic Johnson – Topps Chrome Refractor',
    price: null,
    metadata: { player: 'Magic Johnson', year: 0, set_name: 'Topps Chrome', serial: null, autograph: false, grade: null, parallel: 'Refractor' },
    image: 'WhatsApp Image 2026-05-27 at 00.09.23.jpeg',
  },
  {
    title: 'Victor Wembanyama – 2023 Donruss Magicians RC #1 PSA 9',
    price: null,
    metadata: { player: 'Victor Wembanyama', year: 2023, set_name: 'Donruss Magicians', serial: null, autograph: false, grade: 'PSA 9', parallel: 'RC' },
    image: 'WhatsApp Image 2026-05-27 at 00.09.37.jpeg',
  },
  {
    title: 'Victor Wembanyama – Power Players Insert',
    price: null,
    metadata: { player: 'Victor Wembanyama', year: 0, set_name: 'Power Players', serial: null, autograph: false, grade: null, parallel: null },
    image: 'WhatsApp Image 2026-05-27 at 00.09.37.1.jpeg',
  },
  {
    title: 'Caitlin Clark – 2022 Bowman University Best Hardwood Warriors #HW21 PSA 9',
    price: null,
    metadata: { player: 'Caitlin Clark', year: 2022, set_name: 'Bowman University Best – Hardwood Warriors', serial: null, autograph: false, grade: 'PSA 9', parallel: null },
    image: 'WhatsApp Image 2026-05-27 at 00.09.38.jpeg',
  },
  {
    title: 'Victor Wembanyama – 2023 Panini Prizm Monopoly RC #81 PSA 9',
    price: null,
    metadata: { player: 'Victor Wembanyama', year: 2023, set_name: 'Panini Prizm Monopoly', serial: null, autograph: false, grade: 'PSA 9', parallel: 'RC' },
    image: 'WhatsApp Image 2026-05-27 at 00.09.38.1.jpeg',
  },
  {
    title: 'Caitlin Clark – Panini Chronicled Indiana Fever',
    price: null,
    metadata: { player: 'Caitlin Clark', year: 0, set_name: 'Panini Chronicled', serial: null, autograph: false, grade: null, parallel: null },
    image: 'WhatsApp Image 2026-05-27 at 00.09.38.2.jpeg',
  },
  {
    title: 'Michael Jordan – Fleer 1995-96',
    price: null,
    metadata: { player: 'Michael Jordan', year: 1995, set_name: 'Fleer', serial: null, autograph: false, grade: null, parallel: null },
    image: 'WhatsApp Image 2026-05-27 at 00.09.38.3.jpeg',
  },
  // ── Upper Deck MJ Collector Series (9 distinct cards, same set) ─────────────
  {
    title: 'Michael Jordan – Upper Deck MJ "Ball Control" (Red Jersey)',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: 'Ball Control – Red Jersey' },
    image: 'WhatsApp Image 2026-05-27 at 00.10.01.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "Who Said That?"',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: 'Who Said That?' },
    image: 'WhatsApp Image 2026-05-27 at 00.10.01.2.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "93-97"',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: '93-97' },
    image: 'WhatsApp Image 2026-05-27 at 00.10.01.3.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "1998 Final" (Going Up)',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: '1998 Final – Going Up' },
    image: 'WhatsApp Image 2026-05-27 at 00.10.01.4.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "Ball Control" (White Jersey vs Portland)',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: 'Ball Control – White Jersey vs Portland' },
    image: 'WhatsApp Image 2026-05-27 at 00.10.01.5.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "The Man"',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: 'The Man' },
    image: 'WhatsApp Image 2026-05-27 at 00.10.02.jpeg',
  },
  {
    title: 'VJ Edgecombe – Topps Chrome Activators RC',
    price: null,
    metadata: { player: 'VJ Edgecombe', year: 2025, set_name: 'Topps Chrome Activators', serial: null, autograph: false, grade: null, parallel: 'RC' },
    image: 'WhatsApp Image 2026-05-27 at 00.12.27.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "97-98"',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: '97-98' },
    image: 'WhatsApp Image 2026-05-27 at 00.12.27.2.jpeg',
  },
  {
    title: 'Victor Wembanyama – NBA Hoops 24-25 Halloween Border',
    price: null,
    metadata: { player: 'Victor Wembanyama', year: 2024, set_name: 'NBA Hoops 24-25', serial: null, autograph: false, grade: null, parallel: 'Halloween Border' },
    image: 'WhatsApp Image 2026-05-27 at 00.12.27.3.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "1998 Final" (Layup vs Jazz)',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: '1998 Final – Layup vs Jazz' },
    image: 'WhatsApp Image 2026-05-27 at 00.12.35.jpeg',
  },
  {
    title: 'Michael Jordan – Upper Deck MJ "Photographers"',
    price: null,
    metadata: { player: 'Michael Jordan', year: 0, set_name: 'Upper Deck MJ Collector Series', serial: null, autograph: false, grade: null, parallel: 'Photographers – Championship Celebration' },
    image: 'WhatsApp Image 2026-05-27 at 00.12.41.jpeg',
  },
  {
    title: 'Caitlin Clark – Panini Instant RC Indiana Fever (July 10 2024)',
    price: null,
    metadata: { player: 'Caitlin Clark', year: 2024, set_name: 'Panini Instant', serial: null, autograph: false, grade: null, parallel: 'RC' },
    image: 'WhatsApp Image 2026-05-27 at 00.12.46.jpeg',
  },
]

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log('\n=== Seed basketball cards ===\n')

let inserted = 0
let skipped = 0
let errors = 0

for (const item of CARDS) {
  console.log(`▶ ${item.title}`)

  const { data: existing } = await supabase
    .from('inventory')
    .select('id')
    .eq('title', item.title)
    .eq('category', 'basketball')
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
    category: 'basketball',
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

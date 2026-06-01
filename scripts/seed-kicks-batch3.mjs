// Dutch Kicks — seed kicks batch 3 (2026-06-01)
// Usage: node scripts/seed-kicks-batch3.mjs
//
// Convention: (2) filename = hero/display image_url; others → metadata.gallery
// Skips any title already present in DB (idempotent).
// For dual-gender shoes both entries share the same hero image.

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
const KICKS_DIR = resolve(projectRoot, 'INVENTORY', 'kicks')

function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/[''"'']/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uploadImage(filename) {
  const localPath = join(KICKS_DIR, filename)
  if (!existsSync(localPath)) {
    console.warn(`    MISSING: ${filename}`)
    return null
  }
  const slug = slugify(filename)
  const storagePath = `kicks/${slug}`
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

// ─── New inventory ────────────────────────────────────────────────────────────
// Dual-gender shoes get TWO entries sharing the same hero + gallery images.
// Women's entries for ASICS Gel-K1011, Samba JP, and Nike Dunk Low Valentines
// fill the gap left by batch 2 which only added the Men's side.
const KICKS = [
  {
    title: "Adidas Advantage Women's 7",
    price: 80,
    metadata: { sku: null, size: 7, colorway: 'Multi', gender: 'womens', size_label: "Women's 7" },
    heroImage: 'Adidas Advantage Womans 7 $80 (2).jpeg',
    galleryImages: ['Adidas Advantage Womans 7 $80.jpeg'],
  },
  {
    title: "Adidas Barreda Decode J Women's 7",
    price: 50,
    metadata: { sku: null, size: 7, colorway: 'Multi', gender: 'womens', size_label: "Women's 7" },
    heroImage: 'Adidas Barreda Decode J Woman 7 $50 (2).jpeg',
    galleryImages: ['Adidas Barreda Decode J Woman 7 $50.jpeg'],
  },
  {
    title: "Adidas Campus 00s Extra Laces Men's 8.5",
    price: 110,
    metadata: { sku: null, size: 8.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 8.5" },
    heroImage: 'Adidas Campus OOs Extra Laces Mens 8 half $110 (2).jpeg',
    galleryImages: ['Adidas Campus OOs Extra Laces Mens 8 half $110.jpeg'],
  },
  {
    title: "Adidas Gazelle Indoor W Women's 5",
    price: 115,
    metadata: { sku: null, size: 5, colorway: 'Multi', gender: 'womens', size_label: "Women's 5" },
    heroImage: 'Adidas Gazelle Indoor W Womans 5 $115 (2).jpeg',
    galleryImages: ['Adidas Gazelle Indoor W Womans 5 $115.jpeg'],
  },
  {
    title: "Adidas Gazelle LO Pro W Women's 8",
    price: 125,
    metadata: { sku: null, size: 8, colorway: 'Multi', gender: 'womens', size_label: "Women's 8" },
    heroImage: 'Adidas Gazelle LO Pro W Womans 8 $125 (2).jpeg',
    galleryImages: ['Adidas Gazelle LO Pro W Womans 8 $125.jpeg'],
  },
  {
    title: "Adidas Grand Court 2.0 Men's 8.5",
    price: 90,
    metadata: { sku: null, size: 8.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 8.5" },
    heroImage: 'Adidas Grand Court 2.0 Mens 8 half $90 (2).jpeg',
    galleryImages: ['Adidas Grand Court 2.0 Mens 8 half $90.jpeg'],
  },
  {
    title: "Adidas Handball Spezial Men's 7",
    price: 125,
    metadata: { sku: null, size: 7, colorway: 'Multi', gender: 'mens', size_label: "Men's 7" },
    heroImage: 'Adidas Handball Spezial Mens 7 $125 (2).jpeg',
    galleryImages: ['Adidas Handball Spezial Mens 7 $125.jpeg'],
  },
  {
    title: "Adidas Questar 3 W Women's 10",
    price: 90,
    metadata: { sku: null, size: 10, colorway: 'Multi', gender: 'womens', size_label: "Women's 10" },
    heroImage: 'Adidas Questar 3 W Womans 10 $90 (2).jpeg',
    galleryImages: ['Adidas Questar 3 W Womans 10 $90.jpeg'],
  },
  {
    title: "Adidas Racer Adapt 7.0 Men's 9.5",
    price: 65,
    metadata: { sku: null, size: 9.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 9.5" },
    heroImage: 'Adidas Racer Adapt 7-0 Mens 9 half $65 (2).jpeg',
    galleryImages: ['Adidas Racer Adapt 7-0 Mens 9 half $65.jpeg'],
  },
  // Samba JP Women's — Men's 11.5 was added in batch 2
  {
    title: "Adidas Samba JP Originals Women's 10",
    price: 55,
    metadata: { sku: null, size: 10, colorway: 'Multi', gender: 'womens', size_label: "Women's 10 / Men's 11.5" },
    heroImage: 'Adidas Samba JP Originals Mens 11 half Womans 10 $55 (2).jpeg',
    galleryImages: ['Adidas Samba JP Originals Mens 11 half Womans 10 $55.jpeg'],
  },
  // Streettalk Women's 6 — Women's 7 was added in batch 1
  {
    title: "Adidas Streettalk Women's 6",
    price: 55,
    metadata: { sku: null, size: 6, colorway: 'Multi', gender: 'womens', size_label: "Women's 6" },
    heroImage: 'Adidas Steettalk Woman 6 $55 (2).jpeg',
    galleryImages: ['Adidas Steettalk Woman 6 $55.jpeg'],
  },
  // ASICS Gel-K1011 Women's — Men's entries were added in batch 2
  {
    title: "ASICS Gel-K1011 White/Cream Women's 7.5 – Pair 1",
    price: 125,
    metadata: { sku: null, size: 7.5, colorway: 'White/Cream', gender: 'womens', size_label: "Women's 7.5 / Men's 6" },
    heroImage: 'ASICS Gel- K1011 White-cream Mens 6 Womans 7 half $125 (2).jpeg',
    galleryImages: ['ASICS Gel- K1011 White-cream Mens 6 Womans 7 half $125.jpeg'],
  },
  {
    title: "ASICS Gel-K1011 White/Cream Women's 7.5 – Pair 2",
    price: 130,
    metadata: { sku: null, size: 7.5, colorway: 'White/Cream', gender: 'womens', size_label: "Women's 7.5 / Men's 6" },
    heroImage: 'ASICS Gel- K1011 White-Cream Mens 6 Womans 7 half $130 (2).jpeg',
    galleryImages: ['ASICS Gel- K1011 White-Cream Mens 6 Womans 7 half $130.jpeg'],
  },
  // Guess Mason270 Boot — dual gender, two entries
  {
    title: "Guess Mason270 Boot Women's 11.5",
    price: 145,
    metadata: { sku: null, size: 11.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 11.5 / Men's 10" },
    heroImage: 'Guess Mason270 Boot Womans 11 half Mens 10 $145 (2).jpeg',
    galleryImages: ['Guess Mason270 Boot Womans 11 half Mens 10 $145.jpeg'],
  },
  {
    title: "Guess Mason270 Boot Men's 10",
    price: 145,
    metadata: { sku: null, size: 10, colorway: 'Multi', gender: 'mens', size_label: "Men's 10 / Women's 11.5" },
    heroImage: 'Guess Mason270 Boot Womans 11 half Mens 10 $145 (2).jpeg',
    galleryImages: ['Guess Mason270 Boot Womans 11 half Mens 10 $145.jpeg'],
  },
  {
    title: "Nike Air Max 2017 Men's 8.5",
    price: 135,
    metadata: { sku: null, size: 8.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 8.5" },
    heroImage: 'Nike Air Max 2017 Mens 8 half $135 (2).jpeg',
    galleryImages: ['Nike Air Max 2017 Mens 8 half $135.jpeg'],
  },
  {
    title: "Nike Air Max Invigor Men's 8",
    price: 70,
    metadata: { sku: null, size: 8, colorway: 'Multi', gender: 'mens', size_label: "Men's 8" },
    heroImage: 'Nike Air Max Invigor Mens 8 $70 (2).jpeg',
    galleryImages: ['Nike Air Max Invigor Mens 8 $70.jpeg'],
  },
  {
    title: "Nike Air Max LTD 3 Men's 8",
    price: 135,
    metadata: { sku: null, size: 8, colorway: 'Multi', gender: 'mens', size_label: "Men's 8" },
    heroImage: 'Air Max LTD 3 Mens 8 $135 (2).jpeg',
    galleryImages: ['Air Max LTD 3 Mens 8 $135.jpeg'],
  },
  {
    title: "Nike Air Max Torch 4 Men's 11.5",
    price: 70,
    metadata: { sku: null, size: 11.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 11.5" },
    heroImage: 'Air Max Torch 4 Mens 11 half $70 (2).jpeg',
    galleryImages: ['Air Max Torch 4 Mens 11 half $70.jpeg'],
  },
  {
    title: "Nike Air Zoom Upturn SC Men's 11.5",
    price: 70,
    metadata: { sku: null, size: 11.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 11.5" },
    heroImage: 'Nike Air Zoom Upturn SC Mens 11 half $70 (2).jpeg',
    galleryImages: ['Nike Air Zoom Upturn SC Mens 11 half $70.jpeg'],
  },
  // Nike Dunk Low Valentines Men's — Women's 11.5 was added in batch 2
  {
    title: "Nike Dunk Low Valentines Men's 10",
    price: 80,
    metadata: { sku: null, size: 10, colorway: 'Valentines', gender: 'mens', size_label: "Men's 10 / Women's 11.5" },
    heroImage: 'Nike Dunk Low Valentines Womans 11 half Mens 10 $80 (2).jpeg',
    galleryImages: ['Nike Dunk Low Valentines Womans 11 half Mens 10 $80.jpeg'],
  },
  {
    title: "Nike Dunk Low Coconut Milk Men's 11",
    price: 65,
    metadata: { sku: null, size: 11, colorway: 'Coconut Milk', gender: 'mens', size_label: "Men's 11" },
    heroImage: 'W Nike Dunk Low Coconut Milk W Mens 11 $65 (2).jpeg',
    galleryImages: ['W Nike Dunk Low Coconut Milk W Mens 11 $65.jpeg'],
  },
  {
    title: "Nike Revolution 8 Men's 10.5",
    price: 65,
    metadata: { sku: null, size: 10.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 10.5" },
    heroImage: 'Nike Revolution 8 Mens 10 half $65 (2).jpeg',
    galleryImages: ['Nike Revolution 8 Mens 10 half $65.jpeg'],
  },
  // Nike Revolution 8 Wide — dual gender
  {
    title: "Nike Revolution 8 Wide Men's 8",
    price: 90,
    metadata: { sku: null, size: 8, colorway: 'Multi', gender: 'mens', size_label: "Men's 8 / Women's 9.5" },
    heroImage: 'Nike Revolution 8 Wide - Mens 8 - Womans 9 half $90 (2).jpeg',
    galleryImages: ['Nike Revolution 8 Wide - Mens 8 - Womans 9 half $90.jpeg'],
  },
  {
    title: "Nike Revolution 8 Wide Women's 9.5",
    price: 90,
    metadata: { sku: null, size: 9.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 9.5 / Men's 8" },
    heroImage: 'Nike Revolution 8 Wide - Mens 8 - Womans 9 half $90 (2).jpeg',
    galleryImages: ['Nike Revolution 8 Wide - Mens 8 - Womans 9 half $90.jpeg'],
  },
  {
    title: "Nike Run Swift 3 Women's 8.5",
    price: 70,
    metadata: { sku: null, size: 8.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 8.5" },
    heroImage: 'W Nike Run Swift 3 Womans 8 half $70 (2).jpeg',
    galleryImages: ['W Nike Run Swift 3 Womans 8 half $70.jpeg'],
  },
  {
    title: "Nike Uplift SC Men's 10.5",
    price: 70,
    metadata: { sku: null, size: 10.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 10.5" },
    heroImage: 'Nike Uplift SC Mens 10 half $70 (2).jpeg',
    galleryImages: ['Nike Uplift SC Mens 10 half $70.jpeg'],
  },
  {
    title: "Adidas VL Courts 3.0 Men's 9.5",
    price: 140,
    metadata: { sku: null, size: 9.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 9.5" },
    heroImage: 'Adidas VL Courts 3.0 Mens 9 half $140 (2).jpeg',
    galleryImages: ['Adidas VL Courts 3.0 Mens 9 half $140.jpeg'],
  },
]

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log('\n=== Seed kicks batch 3 ===\n')

let inserted = 0
let skipped = 0
let errors = 0

for (const item of KICKS) {
  console.log(`▶ ${item.title}`)

  const { data: existing } = await supabase
    .from('inventory')
    .select('id')
    .eq('title', item.title)
    .eq('category', 'kicks')
    .maybeSingle()

  if (existing) {
    console.log('  ↷ already in DB — skipping\n')
    skipped++
    continue
  }

  const heroUrl = await uploadImage(item.heroImage)
  if (!heroUrl) {
    console.log('  ✗ hero image missing — skipping\n')
    errors++
    continue
  }

  const gallery = []
  for (const img of item.galleryImages) {
    const url = await uploadImage(img)
    if (url) gallery.push(url)
  }

  const { error } = await supabase.from('inventory').insert({
    title: item.title,
    category: 'kicks',
    status: 'available',
    price: item.price,
    image_url: heroUrl,
    metadata: { ...item.metadata, gallery },
  })

  if (error) {
    console.error(`  ✗ DB insert error: ${error.message}`)
    errors++
  } else {
    console.log('  ✓ inserted')
    inserted++
  }
  console.log('')
}

console.log(`=== Done — ${inserted} inserted, ${skipped} skipped, ${errors} errors ===`)

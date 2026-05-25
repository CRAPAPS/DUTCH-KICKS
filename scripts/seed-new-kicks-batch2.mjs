// Dutch Kicks — seed new kicks batch 2 (added 2026-05-25)
// Usage: node scripts/seed-new-kicks-batch2.mjs
//
// Convention: (2) image = hero/display image_url, all others go into metadata.gallery
// Skips any title already present in DB (idempotent)

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
    .replace(/[''"‘’]/g, '')
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
// heroImage  → image_url  (the (2) shot — the actual shoe)
// galleryImages → metadata.gallery  (box/label/supporting shots)
const KICKS = [
  {
    title: "Nike Pegasus Premium Sail/Off Noir Women's 6",
    price: null,
    metadata: { sku: null, size: 6, colorway: 'Sail/Off Noir/Metallic Silver', gender: 'womens', size_label: "Women's 6" },
    heroImage: 'W Nike Pegasus PREMIUM Sail-off Noir- Metallic Silver Womans 6 (2).jpeg',
    galleryImages: ['W Nike Pegasus PREMIUM Sail-off Noir- Metallic Silver Womans 6.jpeg'],
  },
  {
    title: "Air Jordan 1 Retro Low OG Men's 9.5",
    price: 130,
    metadata: { sku: null, size: 9.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 9.5" },
    heroImage: 'Air Jordan 1 Retro Low OG Mens 9.5 $130 (2).jpeg',
    galleryImages: ['Air Jordan 1 Retro Low OG Mens 9.5 $130.jpeg'],
  },
  {
    title: "Nike Air Max Torch 4 Men's 11",
    price: 85,
    metadata: { sku: null, size: 11, colorway: 'Multi', gender: 'mens', size_label: "Men's 11" },
    heroImage: 'Nike Air Max Torch 4 Mens 11 $85 (2).jpeg',
    galleryImages: ['Nike Air Max Torch 4 Mens 11 $85.jpeg'],
  },
  {
    title: "Adidas RunFalcon 5 Men's 7.5",
    price: 60,
    metadata: { sku: null, size: 7.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 7.5" },
    heroImage: 'Adidas RunFalcon 5 Mens 7 half $60 (2).jpeg',
    galleryImages: ['Adidas RunFalcon 5 Mens 7 half $60.jpeg'],
  },
  {
    title: "Adidas VL Courts Women's 7.5",
    price: 55,
    metadata: { sku: null, size: 7.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 7.5" },
    heroImage: 'Adidas VL Courts Womans 7 half $55 (2).jpeg',
    galleryImages: ['Adidas VL Courts Womans 7 half $55.jpeg'],
  },
  {
    title: "Adidas VL Court 3.0 White/Purple/Gum Women's 7.5",
    price: 70,
    metadata: { sku: null, size: 7.5, colorway: 'White/Purple/Gum', gender: 'womens', size_label: "Women's 7.5" },
    heroImage: 'Adidas VL Court 3-0 White-Purple-Gum Womans 7 half $70 (2).jpeg',
    galleryImages: ['Adidas VL Court 3-0 White-Purple-Gum Womans 7 half $70.jpeg'],
  },
  {
    title: "Brooks Revel 9 White/Grey/Black Women's 9",
    price: 160,
    metadata: { sku: null, size: 9, colorway: 'White/Ultimate Grey/Black', gender: 'womens', size_label: "Women's 9" },
    heroImage: 'Brooks Revel 9 White-ultimate-grey-black Womans 9 $160 (2).jpeg',
    galleryImages: ['Brooks Revel 9 White-ultimate-grey-black Womans 9 $160.jpeg'],
  },
  {
    title: "Adidas Samba OG W Women's 7",
    price: 110,
    metadata: { sku: null, size: 7, colorway: 'Multi', gender: 'womens', size_label: "Women's 7" },
    heroImage: 'Adidas Samba OG W Womans 7 $110 (2).jpeg',
    galleryImages: ['Adidas Samba OG W Womans 7 $110.jpeg'],
  },
  {
    title: "Nike Dunk Low Retro Pandas Men's 13",
    price: 120,
    metadata: { sku: null, size: 13, colorway: 'Panda (Black/White)', gender: 'mens', size_label: "Men's 13" },
    heroImage: 'Nike Dunk low retro Pandas Mens 13 $120 (2).jpeg',
    galleryImages: ['Nike Dunk low retro Pandas Mens 13 $120.jpeg'],
  },
  {
    title: "On Running Roger Advantage Men's 8",
    price: 180,
    metadata: { sku: null, size: 8, colorway: 'Multi', gender: 'mens', size_label: "Men's 8" },
    heroImage: 'The Roger Advantage On Cloud Mens 8 $180 (2).jpeg',
    galleryImages: ['The Roger Advantage On Cloud Mens 8 $180.jpeg'],
  },
  {
    title: "Brooks Revel 9 Cheetah Women's 8.5",
    price: 145,
    metadata: { sku: null, size: 8.5, colorway: 'Cheetah', gender: 'womens', size_label: "Women's 8.5" },
    heroImage: 'Brooks Revel 9 Cheetah Womans 8 half $145 (2).jpeg',
    galleryImages: ['Brooks Revel 9 Cheetah Womans 8 half $145.jpeg'],
  },
  {
    title: "Adidas Samba OG Gomme3 Men's 8",
    price: 110,
    metadata: { sku: null, size: 8, colorway: 'Gomme3/Gum', gender: 'mens', size_label: "Men's 8" },
    heroImage: 'Adidas Samba OG Gomme3 Gum Mens 8 $110 (2).jpeg',
    galleryImages: ['Adidas Samba OG Gomme3 Gum Mens 8 $110.jpeg'],
  },
  {
    title: "Adidas Treziod 2 Men's 8",
    price: 60,
    metadata: { sku: null, size: 8, colorway: 'Multi', gender: 'mens', size_label: "Men's 8" },
    heroImage: 'Addias Treziod 2 Mens 8 $60 (2).jpeg',
    galleryImages: [],
  },
  {
    title: "Adidas Handball Spezial Men's 10.5",
    price: 120,
    metadata: { sku: null, size: 10.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 10.5" },
    heroImage: 'Adidas Handball Spezial Mens 10 half $120 (2).jpeg',
    galleryImages: ['Adidas Handball Spezial Mens 10 half $120.jpeg'],
  },
  {
    title: "Adidas VL Court 3.0 Men's 11.5",
    price: 65,
    metadata: { sku: null, size: 11.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 11.5" },
    heroImage: 'Adidas VL Court 3point0 Mens 11 half $65 (2).jpeg',
    galleryImages: ['Adidas VL Court 3point0 Mens 11 half $65.jpeg'],
  },
  {
    title: "Adidas VL Courts 3.0 Men's 9",
    price: 60,
    metadata: { sku: null, size: 9, colorway: 'Multi', gender: 'mens', size_label: "Men's 9" },
    heroImage: 'Adidas VL Courts 3-0 Mens 9 $60 (2).jpeg',
    galleryImages: ['Adidas VL Courts 3-0 Mens 9 $60.jpeg'],
  },
  {
    title: "Adidas Busenitz Men's 10",
    price: 65,
    metadata: { sku: null, size: 10, colorway: 'Multi', gender: 'mens', size_label: "Men's 10" },
    heroImage: 'Adidas Busenitz Mens 10 $65 (2).jpeg',
    galleryImages: ['Adidas Busenitz Mens 10 $65.jpeg'],
  },
  {
    title: "Adidas VL Courts 3.0 Women's 9",
    price: 60,
    metadata: { sku: null, size: 9, colorway: 'Multi', gender: 'womens', size_label: "Women's 9" },
    heroImage: 'Adidas VL Courts 3-0 Womans 9 $60 (2).jpeg',
    galleryImages: ['Adidas VL Courts 3-0 Womans 9 $60.jpeg'],
  },
  {
    title: "New Balance 1906 Kids 6.5",
    price: 60,
    metadata: { sku: null, size: 6.5, colorway: 'Black/Green', gender: 'kids', size_label: "Kids 6.5" },
    heroImage: 'New Balance 1906 Kids size 6.5 Black-Green Unisex $60 (2).jpeg',
    galleryImages: ['New Balance 1906 Kids size 6.5 Black-Green Unisex $60.jpeg'],
  },
  {
    title: "Nike Dunk Low Valentines Women's 11.5",
    price: 80,
    metadata: { sku: null, size: 11.5, colorway: 'Valentines', gender: 'womens', size_label: "Women's 11.5 / Men's 10" },
    heroImage: 'Nike Dunk Low Valentines Womans 11 half Mens 10 $80 (2).jpeg',
    galleryImages: ['Nike Dunk Low Valentines Womans 11 half Mens 10 $80.jpeg'],
  },
  {
    title: "Adidas Grand Court LO Silver Women's 7",
    price: 55,
    metadata: { sku: null, size: 7, colorway: 'Silver', gender: 'womens', size_label: "Women's 7" },
    heroImage: 'Adidas Grand Court LO - Silver Womans 7 $55 (2).jpeg',
    galleryImages: ['Adidas Grand Court LO - Silver Womans 7 $55.jpeg'],
  },
  {
    title: "Nike Run Swift 3 Photon Dust Men's 8",
    price: null,
    metadata: { sku: null, size: 8, colorway: 'Photon Dust/Black/White', gender: 'mens', size_label: "Men's 8" },
    heroImage: 'Nike Run-swift 3 Photon-Dust-Black - White Mens 8 (2).jpeg',
    galleryImages: ['Nike Run-swift 3 Photon-Dust-Black - White Mens 8.jpeg'],
  },
  {
    title: "Adidas Samba JP Originals Men's 11.5",
    price: 55,
    metadata: { sku: null, size: 11.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 11.5 / Women's 10" },
    heroImage: 'Adidas Samba JP Originals Mens 11 half Womans 10 $55 (2).jpeg',
    galleryImages: ['Adidas Samba JP Originals Mens 11 half Womans 10 $55.jpeg'],
  },
  {
    title: "Adidas RunFalcon 3.0 W Women's 5.5",
    price: 60,
    metadata: { sku: null, size: 5.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 5.5" },
    heroImage: 'Adidas RunFalcon 3.0 W Womans 5 half $60 (2).jpeg',
    galleryImages: ['Adidas RunFalcon 3.0 W Womans 5 half $60.jpeg'],
  },
  {
    title: "Adidas VL Court Bold Women's 7.5",
    price: 60,
    metadata: { sku: null, size: 7.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 7.5" },
    heroImage: 'Adidas VL Court Bold Womans 7 half $60 (2).jpeg',
    galleryImages: ['Adidas VL Court Bold Womans 7 half $60.jpeg'],
  },
  {
    title: "Adidas VL Court 3.0 Black/Gum Women's 10.5",
    price: 55,
    metadata: { sku: null, size: 10.5, colorway: 'Black/Gum', gender: 'womens', size_label: "Women's 10.5" },
    heroImage: 'Adidas VL Court 3.0 Black- Gum Womans 10 half $55 (2).jpeg',
    galleryImages: ['Adidas VL Court 3.0 Black- Gum Womans 10 half $55.jpeg'],
  },
  {
    title: "ASICS Gel-K1011 White/Cream Men's 6 – Pair 1",
    price: 125,
    metadata: { sku: null, size: 6, colorway: 'White/Cream', gender: 'mens', size_label: "Men's 6 / Women's 7.5" },
    heroImage: 'ASICS Gel- K1011 White-cream Mens 6 Womans 7 half $125 (2).jpeg',
    galleryImages: ['ASICS Gel- K1011 White-cream Mens 6 Womans 7 half $125.jpeg'],
  },
  {
    title: "ASICS Gel-K1011 White/Cream Men's 6 – Pair 2",
    price: 130,
    metadata: { sku: null, size: 6, colorway: 'White/Cream', gender: 'mens', size_label: "Men's 6 / Women's 7.5" },
    heroImage: 'ASICS Gel- K1011 White-Cream Mens 6 Womans 7 half $130 (2).jpeg',
    galleryImages: ['ASICS Gel- K1011 White-Cream Mens 6 Womans 7 half $130.jpeg'],
  },
  {
    title: "ASICS Gel-Pulse 17 Morganite/Pearl Pink Women's 6.5",
    price: 85,
    metadata: { sku: null, size: 6.5, colorway: 'Morganite/Pearl Pink', gender: 'womens', size_label: "Women's 6.5" },
    heroImage: 'ASICS Gel- Pulse 17 Morganite-Pearl Pink Womans 6 half $85 (2).jpeg',
    galleryImages: ['ASICS Gel- Pulse 17 Morganite-Pearl Pink Womans 6 half $85.jpeg'],
  },
  {
    title: "Adidas Advantage Cheetah Women's 9.5",
    price: 65,
    metadata: { sku: null, size: 9.5, colorway: 'Cheetah', gender: 'womens', size_label: "Women's 9.5" },
    heroImage: 'Adidas Advantage Cheetah Womans 9 half $65 (2).jpeg',
    galleryImages: ['Adidas Advantage Cheetah Womans 9 half $65.jpeg'],
  },
  {
    title: "Adidas Atlanta W Off White Women's 6.5",
    price: 175,
    metadata: { sku: null, size: 6.5, colorway: 'Off White', gender: 'womens', size_label: "Women's 6.5" },
    heroImage: 'Adidas Atlanta W Off White Womans 6 half $175 (2).jpeg',
    galleryImages: ['Adidas Atlanta W Off White Womans 6 half $175.jpeg'],
  },
  {
    title: "Adidas Grand Court Alpha 00s Women's 6 – Pair 2",
    price: 60,
    metadata: { sku: null, size: 6, colorway: 'Multi', gender: 'womens', size_label: "Women's 6" },
    heroImage: 'Adidas Grand Court Alpha 00s Womans 6 $60 (2).jpeg',
    galleryImages: ['Adidas Grand Court Alpha 00s Womans 6 $60.jpeg'],
  },
  {
    title: "Grand Campis 00s Kids C12",
    price: 55,
    metadata: { sku: null, size: null, colorway: 'Multi', gender: 'kids', size_label: "Kids C12" },
    heroImage: 'Grand Campis 00s C 12 Kids $55 (2).jpeg',
    galleryImages: ['Grand Campis 00s C 12 Kids $55.jpeg'],
  },
]

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log('\n=== Seed new kicks batch 2 ===\n')

let inserted = 0
let skipped = 0
let errors = 0

for (const item of KICKS) {
  console.log(`▶ ${item.title}`)

  // Check if already in DB
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

  // Upload hero image
  const heroUrl = await uploadImage(item.heroImage)
  if (!heroUrl) {
    console.log('  ✗ hero image missing — skipping\n')
    errors++
    continue
  }

  // Upload gallery images
  const gallery = []
  for (const img of item.galleryImages) {
    const url = await uploadImage(img)
    if (url) gallery.push(url)
  }

  // Insert DB record
  const { error } = await supabase.from('inventory').insert({
    title: item.title,
    category: 'kicks',
    status: 'available',
    price: item.price,
    image_url: heroUrl,
    metadata: {
      ...item.metadata,
      gallery,
    },
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

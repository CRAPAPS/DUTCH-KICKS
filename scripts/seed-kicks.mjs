// Dutch Kicks — seed kicks inventory with images
// Usage: node scripts/seed-kicks.mjs
//
// What this does:
//   1. Creates (or verifies) the 'inventory' storage bucket
//   2. Uploads all images from INVENTORY/kicks/ to Supabase Storage
//   3. Inserts inventory records into the database (skips existing titles)

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dir, '..')

// Load .env.local
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

// ─── Inventory definitions ────────────────────────────────────────────────────
// Parsed from filenames. size = numeric US size, null when not in filename.
// gender: 'mens' | 'womens' | 'kids' | 'unisex'
// size_label: human-readable label shown on the card
const KICKS = [
  {
    title: 'Nike Air Force 1 Lockdown',
    price: 120,
    metadata: { sku: null, size: null, colorway: 'White/Black', gender: 'unisex', size_label: null },
    primaryImage: 'AIRFORCE LOCKDOWN.jpeg',
    extraImages: ['AIR FORCE LOCKDOWN-$120.jpeg'],
  },
  {
    title: 'Air Jordan 3 Retro',
    price: 170,
    metadata: { sku: null, size: null, colorway: 'White/Cement Grey', gender: 'mens', size_label: null },
    primaryImage: 'AIR JORDON 3 RETRO.jpeg',
    extraImages: ['AIR JORDON 3 RETRO-$170.jpeg'],
  },
  {
    title: "Adidas BL Courts 3.0 Women's 7",
    price: 60,
    metadata: { sku: null, size: 7, colorway: 'White/Black', gender: 'womens', size_label: "Women's 7" },
    primaryImage: "Adidas BL Courts 3.0 Woman's 7 $60.jpeg",
    extraImages: ["Adidas BL Courts 3.0 Woman's 7 $60 (2).jpeg"],
  },
  {
    title: 'Adidas VL Court Bold / Gazelle Bold Pink Bubble Gum',
    price: 95,
    metadata: { sku: null, size: 7, colorway: 'Pink Bubble Gum', gender: 'womens', size_label: "Women's 7" },
    primaryImage: 'Adidas VL Court Bold Gazelle Bold Pink Bubble Gum Womans 7 $95.jpeg',
    extraImages: ['Adidas VL Court Bold Gazelle Bold Pink Bubble Gum Womans 7 $95-image2.jpeg'],
  },
  {
    title: 'Air Jordan 1 Low SE ASW',
    price: 300,
    metadata: { sku: null, size: 9.5, colorway: 'All-Star Weekend Multi', gender: 'mens', size_label: "Men's 9.5" },
    primaryImage: 'Air Jordan 1 Low SE ASW Mens 9.5 $300.jpeg',
    extraImages: ['Air Jordan 1 Low SE ASW Mens 9.5 $300 (2).jpeg'],
  },
  {
    title: 'Nike AAF88 SP – Billie Eilish',
    price: 70,
    metadata: { sku: null, size: null, colorway: 'Billie Eilish Collab', gender: 'unisex', size_label: null },
    primaryImage: 'Billie Eilish Nike AAF88 SP.jpeg',
    extraImages: [
      'Billie Eilish Nike AAF88 SP-$70.jpeg',
      'Billie Eilish Nike AAF88 SP-$70-extra.jpeg',
      'Billie Eilish Nike AAF88 SP-$70-extra2.jpeg',
    ],
  },
  {
    title: "Brooks Adrenaline GTS 25 Women's 7.5",
    price: 120,
    metadata: { sku: null, size: 7.5, colorway: 'Multi', gender: 'womens', size_label: "Women's 7.5" },
    primaryImage: "Brooks Adrenaline GTS 25 Woman's 7.5 $120.jpeg",
    extraImages: ["Brooks Adrenaline GTS 25 Woman's 7.5 $120-image2.jpeg"],
  },
  {
    title: "Brooks Reveal 9 White/Ultimate Gray/Black Women's 7",
    price: 115,
    metadata: { sku: null, size: 7, colorway: 'White/Ultimate Gray/Black', gender: 'womens', size_label: "Women's 7" },
    primaryImage: 'Brooks Reveal 9 White Ultimate Gray Black Womans 7-$115.jpeg',
    extraImages: ['Brooks Reveal 9 White Ultimate Gray Black Womans 7-$115-image2.jpeg'],
  },
  {
    title: 'Adidas Grand Court 2 Kids',
    price: null,
    metadata: { sku: null, size: null, colorway: 'White', gender: 'kids', size_label: 'Kids' },
    primaryImage: 'Grand Court 2 kids.jpeg',
    extraImages: ['Grand Court 2 kids-image 2.jpeg'],
  },
  {
    title: "Adidas Grand Court 2.0 White/White Women's 9",
    price: 50,
    metadata: { sku: null, size: 9, colorway: 'White/White', gender: 'womens', size_label: "Women's 9" },
    primaryImage: "Grand Court 2.0 white-white Woman's 9 $50.jpeg",
    extraImages: ["Grand Court 2.0 white-white Woman's 9 $50 (2).jpeg"],
  },
  // HOKA — 2 pairs = 2 separate inventory records
  {
    title: "HOKA Skyward Women's 9 – Pair 1",
    price: 135,
    metadata: { sku: null, size: 9, colorway: 'Multi', gender: 'womens', size_label: "Women's 9" },
    primaryImage: 'HOKA W Skward Womans 9 $135.jpeg',
    extraImages: ['HOKA W Skward Womans 9 $135 (2).jpeg'],
  },
  {
    title: "HOKA Skyward Women's 9 – Pair 2",
    price: 135,
    metadata: { sku: null, size: 9, colorway: 'Multi', gender: 'womens', size_label: "Women's 9" },
    primaryImage: 'HOKA W Skward Womans 9 $135 (2 pairs).jpeg',
    extraImages: ['HOKA W Skward Womans 9 $135 (2 pairs)(2).jpeg'],
  },
  {
    title: 'Jordan Stadium 90',
    price: 110,
    metadata: { sku: null, size: null, colorway: 'White/Black', gender: 'mens', size_label: null },
    primaryImage: 'Jordan Stadium 90.jpeg',
    extraImages: ['Jordon Stadium 90-price $110.jpeg'],
  },
  {
    title: "Jordan One Take II Men's 12",
    price: 80,
    metadata: { sku: null, size: 12, colorway: 'Black/Red', gender: 'mens', size_label: "Men's 12" },
    primaryImage: 'Jordan one Take 11.jpeg',
    extraImages: ['Jordan one Take 11-MENS-SIZE12-$80.jpeg'],
  },
  {
    title: 'Jordan Spizike Low PS 11C',
    price: 65,
    metadata: { sku: null, size: 11, colorway: 'Multi', gender: 'kids', size_label: '11C (Preschool)' },
    primaryImage: 'Jordan spizike low-PS.jpeg',
    extraImages: ['Jordan spizike low-PS-11C-$65.jpeg'],
  },
  {
    title: 'Jordan Spizike Low TD',
    price: 35,
    metadata: { sku: null, size: null, colorway: 'Multi', gender: 'kids', size_label: 'Toddler' },
    primaryImage: 'Jordon Spizike Low-TD .jpeg',
    extraImages: ['Jordon Spizike Low-TD-$35.jpeg'],
  },
  {
    title: 'Nike Shox R4 GS',
    price: 65,
    metadata: { sku: null, size: null, colorway: 'White/Black', gender: 'kids', size_label: 'Grade School' },
    primaryImage: 'NIKE SHOX R4 GS.jpeg',
    extraImages: ['NIKE SHOX R4 GS $65.jpeg'],
  },
  {
    title: "Nike Air Zoom Drive SP Men's 9.5",
    price: 125,
    metadata: { sku: null, size: 9.5, colorway: 'Multi', gender: 'mens', size_label: "Men's 9.5" },
    primaryImage: 'Nike Air Zoom Drive SP Mens 9.5 $125.jpeg',
    extraImages: ['Nike Air Zoom Drive SP Mens 9.5 $125 (2).jpeg'],
  },
  {
    title: 'Nike Team Hustle D 12 x LEGO Col PS',
    price: 70,
    metadata: { sku: null, size: null, colorway: 'LEGO Multi', gender: 'kids', size_label: 'Preschool' },
    primaryImage: 'Team Hustle D 12 x LEGO Col PS.jpeg',
    extraImages: [
      'Team Hustle D 12 x LEGO Col PS-$70.jpeg',
      'Team Hustle D 12 x LEGO Col PS-EXTRAPIC.jpeg',
    ],
  },
  {
    title: "Nike Astrograbber Suede Pink Foam Muslin Women's 7.5",
    price: 70,
    metadata: { sku: null, size: 7.5, colorway: 'Pink Foam/Muslin', gender: 'womens', size_label: "Women's 7.5" },
    primaryImage: "W Nike Astrograbber suede - pink foam Muslin Woman's 7.5 $70.jpeg",
    extraImages: ["W Nike Astrograbber suede - pink foam Muslin Woman's 7.5 $70-image 2.jpeg"],
  },
  {
    title: "Nike Pegasus Premium Women's 9",
    price: 125,
    metadata: { sku: null, size: 9, colorway: 'Multi', gender: 'womens', size_label: "Women's 9" },
    primaryImage: 'W Nike Pegasus Premium Womans 9 $125.jpeg',
    extraImages: ['W Nike Pegasus Premium Womans 9 $125 (2).jpeg'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (buckets?.find(b => b.name === BUCKET)) {
    console.log(`  bucket '${BUCKET}' already exists`)
    return
  }
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  })
  if (error) throw new Error(`Failed to create bucket: ${error.message}`)
  console.log(`  created bucket '${BUCKET}'`)
}

async function uploadImage(filename) {
  const localPath = join(KICKS_DIR, filename)
  if (!existsSync(localPath)) {
    console.warn(`    MISSING FILE: ${filename}`)
    return null
  }
  const slug = slugify(filename)
  const storagePath = `kicks/${slug}`
  const fileBuffer = readFileSync(localPath)

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) {
    console.error(`    ERROR uploading ${filename}: ${error.message}`)
    return null
  }
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  console.log(`    uploaded: ${filename}`)
  return publicUrl
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n=== Dutch Kicks — Kicks Inventory Seed ===\n')

console.log('1. Storage bucket...')
await ensureBucket()

console.log('\n2. Processing shoes...\n')

let inserted = 0
let updated = 0
let skipped = 0

for (const shoe of KICKS) {
  console.log(`▶  ${shoe.title}`)

  // Upload primary image
  const primaryUrl = await uploadImage(shoe.primaryImage)

  // Upload extras (stored in bucket for future multi-image gallery use)
  for (const extra of shoe.extraImages) {
    await uploadImage(extra)
  }

  // Check for existing record
  const { data: existing } = await supabase
    .from('inventory')
    .select('id, image_url')
    .eq('title', shoe.title)
    .eq('category', 'kicks')
    .maybeSingle()

  if (existing) {
    if (primaryUrl && !existing.image_url) {
      await supabase.from('inventory').update({ image_url: primaryUrl }).eq('id', existing.id)
      console.log(`    patched image_url on existing record`)
      updated++
    } else {
      console.log(`    already in DB — skipped`)
      skipped++
    }
    console.log('')
    continue
  }

  // Insert new record
  const { error } = await supabase.from('inventory').insert({
    title: shoe.title,
    category: 'kicks',
    status: 'available',
    price: shoe.price,
    image_url: primaryUrl,
    ref_image_url: null,
    metadata: shoe.metadata,
  })

  if (error) {
    console.error(`    ERROR inserting: ${error.message}`)
  } else {
    console.log(`    ✓ inserted`)
    inserted++
  }
  console.log('')
}

console.log(`=== Done ===`)
console.log(`  Inserted : ${inserted}`)
console.log(`  Updated  : ${updated}`)
console.log(`  Skipped  : ${skipped}`)
console.log(`\nView at https://dutchkicks.com/inventory?category=kicks`)

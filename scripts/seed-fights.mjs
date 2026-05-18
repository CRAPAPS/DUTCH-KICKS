// Dutch Kicks — seed fight card inventory with images
// Usage: node scripts/seed-fights.mjs
//
// What this does:
//   1. Creates (or verifies) the 'inventory' storage bucket
//   2. Uploads all fight card images from INVENTORY/ to Supabase Storage
//   3. Upserts all fight card records into the database

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
const FIGHT_DIR = resolve(projectRoot, 'INVENTORY')

// ─── Fight card definitions ───────────────────────────────────────────────────
const FIGHTS = [
  // ── Original 8 (may already be in DB without images — script will patch) ──
  {
    title: 'Don Frye – Fighter Gear Relic',
    price: 120,
    metadata: {
      serial: '063/188',
      set_name: 'Topps Fighter Gear Relics',
      autograph: false,
      parallel: null,
      notes: 'Authentic Fighter-Worn Gear',
    },
    primaryImage: 'fight-don-frye-topps-fighter-gear-relic-100-serial63.jpg',
    extraImages: [],
  },
  {
    title: 'Nick Diaz – Chronicles /75',
    price: 160,
    metadata: {
      serial: '52/75',
      set_name: 'Chronicles',
      autograph: false,
      parallel: null,
    },
    primaryImage: 'fight-nick-diaz-chronicles-75-serial52.jpg',
    extraImages: [],
  },
  {
    title: 'Aljamain Sterling – Select Signatures',
    price: 350,
    metadata: {
      serial: null,
      set_name: 'Select Signatures',
      autograph: true,
      parallel: null,
      notes: 'Certified Autograph',
    },
    primaryImage: 'fight-aljamain-sterling-select-auto.jpg',
    extraImages: [
      'fight-aljamain-sterling-select-auto-2.jpg',
      'fight-aljamain-sterling-select-auto-3.jpg',
    ],
  },
  {
    title: 'Cain Velasquez – Fight Mat Relic',
    price: 180,
    metadata: {
      serial: null,
      set_name: 'Topps Finest',
      autograph: false,
      parallel: null,
      notes: 'Event-Used Fight Mat',
    },
    primaryImage: 'fight-cain-velasquez-topps-finest-mat-relic.jpg',
    extraImages: [],
  },
  {
    title: 'Petr Yan – Opti-Graphs Auto',
    price: 280,
    metadata: {
      serial: null,
      set_name: 'Donruss Optic Opti-Graphs',
      autograph: true,
      parallel: null,
    },
    primaryImage: 'fight-petr-yan-donruss-optic-optigraphs-auto.jpg',
    extraImages: [],
  },
  {
    title: 'Brian Ortega – Prizm Signatures',
    price: 260,
    metadata: {
      serial: null,
      set_name: 'Prizm Signatures',
      autograph: true,
      parallel: null,
    },
    primaryImage: 'fight-brian-ortega-prizm-auto.jpg',
    extraImages: [],
  },
  {
    title: 'Nate Diaz – Black Parallel',
    price: 320,
    metadata: {
      serial: null,
      set_name: 'UFC Black',
      autograph: false,
      parallel: 'Black',
    },
    primaryImage: 'fight-nate-diaz-ufc-black.jpg',
    extraImages: [],
  },
  {
    title: 'Don Frye – Octagon of Honor',
    price: 150,
    metadata: {
      serial: null,
      set_name: 'Octagon of Honor',
      autograph: false,
      parallel: null,
      card_number: 'OOH-7',
    },
    primaryImage: 'fight-don-frye-octagon-of-honor.jpg',
    extraImages: [],
  },

  // ── 12 new cards ──────────────────────────────────────────────────────────
  {
    title: 'Fabricio Werdum – Topps Finest Mat Relic',
    price: null,
    metadata: {
      serial: null,
      set_name: 'Topps Finest',
      autograph: false,
      parallel: null,
      notes: 'Authentic Event-Used Fight Mat',
    },
    primaryImage: 'fight-fabricio-werdum-topps-finest-mat-relic-front.jpg',
    extraImages: [],
  },
  {
    title: 'Khamzat Chimaev – Prizm RC PSA 9',
    price: null,
    metadata: {
      serial: '69725572',
      set_name: 'Prizm',
      autograph: false,
      parallel: null,
      grade: 'PSA 9',
      card_number: '7',
      notes: 'Rookie Card',
    },
    primaryImage: 'fight-khamzat-chimaev-prizm-rc-psa9.jpg',
    extraImages: [],
  },
  {
    title: 'Jiri Prochazka – Select Auto Relic',
    price: null,
    metadata: {
      serial: null,
      set_name: 'Select',
      autograph: true,
      parallel: null,
      weight_class: 'Light Heavyweight',
    },
    primaryImage: 'fight-jiri-prochazka-select-auto-relic.jpg',
    extraImages: [],
  },
  {
    title: 'Miesha Tate – Origins Auto',
    price: null,
    metadata: {
      serial: null,
      set_name: 'Origins',
      autograph: true,
      parallel: null,
      weight_class: 'Bantamweight',
    },
    primaryImage: 'fight-miesha-tate-origins-auto.jpg',
    extraImages: [],
  },
  {
    title: 'Royce Gracie – Topps Fighter Gear Relic',
    price: null,
    metadata: {
      serial: null,
      set_name: '2010 Topps UFC Main Event',
      autograph: false,
      parallel: null,
      card_number: 'FR-RG',
      notes: 'Authentic Fighter-Worn Gear',
    },
    primaryImage: 'fight-royce-gracie-topps-fighter-gear-relic-front.jpg',
    extraImages: [
      'fight-royce-gracie-topps-fighter-gear-relic-back.jpg',
      'fight-royce-gracie-topps-fighter-gear-relic-back-2.jpg',
    ],
  },
  {
    title: 'Royce Gracie – Panini Chronicles HOF Auto',
    price: null,
    metadata: {
      serial: null,
      set_name: '2022 Panini Chronicles UFC',
      autograph: true,
      parallel: null,
      card_number: 'HF-RGC',
      notes: 'Hall of Fame Relic Auto · PSA authenticated',
    },
    primaryImage: 'fight-royce-gracie-panini-chronicles-hof-auto-back.jpg',
    extraImages: [],
  },
  {
    title: 'Dricus Du Plessis – Prizm RC',
    price: null,
    metadata: {
      serial: null,
      set_name: 'Prizm',
      autograph: false,
      parallel: null,
      weight_class: 'Middleweight',
      notes: 'Rookie Card',
    },
    primaryImage: 'fight-dricus-du-plessis-prizm-rc.jpg',
    extraImages: [],
  },
  {
    title: 'Dricus Du Plessis – Select RC',
    price: null,
    metadata: {
      serial: null,
      set_name: '2022 Select',
      autograph: false,
      parallel: null,
      weight_class: 'Middleweight',
      notes: 'Rookie Card',
    },
    primaryImage: 'fight-dricus-du-plessis-select-rc.jpg',
    extraImages: [],
  },
  {
    title: 'Donald Cerrone – Select Mat Relic',
    price: null,
    metadata: {
      serial: null,
      set_name: '2022 Select',
      autograph: false,
      parallel: null,
      weight_class: 'Welterweight',
      notes: 'Fight Mat Relic',
    },
    primaryImage: 'fight-donald-cerrone-select-mat-relic.jpg',
    extraImages: [],
  },
  {
    title: 'Nick Diaz – Luminance /99',
    price: null,
    metadata: {
      serial: '43/99',
      set_name: 'Luminance',
      autograph: false,
      parallel: 'Luminance',
      weight_class: 'Middleweight',
    },
    primaryImage: 'fight-nick-diaz-luminance-99-serial43.jpg',
    extraImages: [],
  },
  {
    title: 'Chuck Liddell – Donruss Signature Series Auto',
    price: null,
    metadata: {
      serial: null,
      set_name: 'Donruss',
      autograph: true,
      parallel: 'Signature Series',
    },
    primaryImage: 'fight-chuck-liddell-donruss-signature-series-auto.jpg',
    extraImages: [],
  },
  {
    title: 'Robbie Lawler – Flux Auto',
    price: null,
    metadata: {
      serial: null,
      set_name: 'Flux',
      autograph: true,
      parallel: null,
      weight_class: 'Welterweight',
    },
    primaryImage: 'fight-robbie-lawler-flux-auto.jpg',
    extraImages: [],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  const localPath = join(FIGHT_DIR, filename)
  if (!existsSync(localPath)) {
    console.warn(`    MISSING FILE: ${filename}`)
    return null
  }
  const storagePath = `fight/${filename}`
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

console.log('\n=== Dutch Kicks — Fight Cards Inventory Seed ===\n')

console.log('1. Storage bucket...')
await ensureBucket()

console.log('\n2. Processing fight cards...\n')

let inserted = 0
let updated = 0
let skipped = 0

for (const card of FIGHTS) {
  console.log(`▶  ${card.title}`)

  const primaryUrl = await uploadImage(card.primaryImage)

  for (const extra of card.extraImages) {
    await uploadImage(extra)
  }

  const { data: existing } = await supabase
    .from('inventory')
    .select('id, image_url')
    .eq('title', card.title)
    .eq('category', 'fight')
    .maybeSingle()

  if (existing) {
    if (primaryUrl && !existing.image_url) {
      await supabase
        .from('inventory')
        .update({ image_url: primaryUrl, metadata: card.metadata })
        .eq('id', existing.id)
      console.log(`    patched image_url + metadata on existing record`)
      updated++
    } else {
      await supabase
        .from('inventory')
        .update({ metadata: card.metadata })
        .eq('id', existing.id)
      console.log(`    already in DB — metadata refreshed`)
      skipped++
    }
    console.log('')
    continue
  }

  const { error } = await supabase.from('inventory').insert({
    title: card.title,
    category: 'fight',
    status: 'available',
    price: card.price,
    image_url: primaryUrl,
    ref_image_url: null,
    metadata: card.metadata,
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
console.log(`\nView at https://dutchkicks.com/inventory?category=fight`)

// Dutch Kicks — populate metadata.gallery for all kicks inventory
// Uploads all shoe images (using upsert) and stores extra image URLs
// in metadata.gallery so the ProductCard thumbnail strip works.
// Usage: node scripts/patch-shoe-gallery.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, readdirSync } from 'fs'
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
const BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/kicks/`

// Read actual directory filenames once (handles Unicode apostrophes etc.)
const DIR_FILES = new Set(readdirSync(KICKS_DIR))

function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/['’‘‛`]/g, '') // strip all apostrophe variants
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Find the actual file on disk, handling apostrophe encoding differences
function resolveFile(name) {
  if (DIR_FILES.has(name)) return name
  // swap curly <-> straight apostrophe
  const alt = name.includes('’')
    ? name.replace(/’/g, "'")
    : name.replace(/'/g, '’')
  if (DIR_FILES.has(alt)) return alt
  return null
}

async function uploadImage(filename) {
  const actual = resolveFile(filename)
  if (!actual) {
    console.warn(`    SKIP  (not on disk): ${filename}`)
    return null
  }
  const localPath = join(KICKS_DIR, actual)
  if (!existsSync(localPath)) return null

  const slug = slugify(actual)
  const storagePath = `kicks/${slug}`
  const fileBuffer = readFileSync(localPath)

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) {
    console.error(`    ERROR uploading ${actual}: ${error.message}`)
    return null
  }
  console.log(`    UP  ${slug}`)
  return BASE + slug
}

// Each entry: title = DB title
// primaryFile = shoe photo to set as image_url (only for records with no image yet)
// galleryFiles = all supporting images to show as thumbnails (excludes primary)
const SHOES = [
  {
    title: 'Nike Air Force 1 Lockdown',
    galleryFiles: ['AIR FORCE LOCKDOWN-$120.jpeg', 'AIR FORCE LOCKDOWN-$120 (2).jpeg'],
  },
  {
    title: 'Air Jordan 3 Retro',
    galleryFiles: ['AIR JORDON 3 RETRO.jpeg', 'AIR JORDON 3 RETRO-$170 (2).jpeg'],
  },
  {
    title: "Adidas BL Courts 3.0 Women's 7",
    galleryFiles: ["Adidas BL Courts 3.0 Woman's 7 $60.jpeg", "Adidas BL Courts 3.0 Woman's 7 $60 (2).jpeg"],
  },
  {
    title: 'Adidas VL Court Bold / Gazelle Bold Pink Bubble Gum',
    galleryFiles: [
      'Adidas VL Court Bold Gazelle Bold Pink Bubble Gum Womans 7 $95.jpeg',
      'Adidas VL Court Bold Gazelle Bold Pink Bubble Gum Womans 7 $95 (2).jpeg',
    ],
  },
  {
    title: 'Air Jordan 1 Low SE ASW',
    galleryFiles: ['Air Jordan 1 Low SE ASW Mens 9.5 $300.jpeg', 'Air Jordan 1 Low SE ASW Mens 9.5 $300 (2).jpeg'],
  },
  {
    title: 'Nike AAF88 SP – Billie Eilish',
    galleryFiles: [
      'Billie Eilish Nike AAF88 SP.jpeg',
      'Billie Eilish Nike AAF88 SP-$70 (2).jpeg',
      'Billie Eilish Nike AAF88 SP-$70 (3).jpeg',
      'Billie Eilish Nike AAF88 SP-$70 (4).jpeg',
    ],
  },
  {
    title: "Brooks Adrenaline GTS 25 Women's 7.5",
    galleryFiles: [
      "Brooks Adrenaline GTS 25 Woman's 7.5 $120.jpeg",
      "Brooks Adrenaline GTS 25 Woman's 7.5 $120 (2).jpeg",
    ],
  },
  {
    title: "Brooks Reveal 9 White/Ultimate Gray/Black Women's 7",
    galleryFiles: [
      'Brooks Reveal 9 White Ultimate Gray Black Womans 7-$115.jpeg',
      'Brooks Reveal 9 White Ultimate Gray Black Womans 7 $115(2).jpeg',
    ],
  },
  {
    title: 'Adidas Grand Court 2 Kids',
    galleryFiles: ['Grand Court 2 kids.jpeg', 'Grand Court 2 kids-image 2.jpeg'],
  },
  {
    title: "Adidas Grand Court 2.0 White/White Women's 9",
    galleryFiles: [
      "Grand Court 2.0 white-white Woman's 9 $50.jpeg",
      "Grand Court 2.0 white-white Woman's 9 $50 (2).jpeg",
    ],
  },
  {
    title: "HOKA Skyward Women's 9 – Pair 1",
    galleryFiles: ['HOKA W Skward Womans 9 $135.jpeg', 'HOKA W Skward Womans 9 $135 (2) .jpeg'],
  },
  {
    title: "HOKA Skyward Women's 9 – Pair 2",
    galleryFiles: ['HOKA W Skward Womans 9 $135 (2 pairs).jpeg', 'HOKA W Skward Womans 9 $135 (2 pairs)(2).jpeg'],
  },
  {
    title: 'Jordan Stadium 90',
    galleryFiles: ['Jordan Stadium 90.jpeg', 'Jordon Stadium 90-price $110 (2).jpeg'],
  },
  {
    title: "Jordan One Take II Men's 12",
    galleryFiles: ['Jordan one Take 11-MENS-SIZE12-$80.jpeg', 'Jordan one Take 11 (2).jpeg'],
  },
  {
    title: 'Jordan Spizike Low PS 11C',
    galleryFiles: ['Jordan spizike low-PS.jpeg', 'Jordan spizike low-PS-11C-$65 (2).jpeg'],
  },
  {
    title: 'Jordan Spizike Low TD',
    galleryFiles: ['Jordon Spizike Low-TD .jpeg', 'Jordon Spizike Low-TD-$35 (2).jpeg'],
  },
  {
    title: 'Nike Shox R4 GS',
    galleryFiles: ['NIKE SHOX R4 GS.jpeg', 'NIKE SHOX R4 GS $65 (2).jpeg'],
  },
  {
    title: "Nike Air Zoom Drive SP Men's 9.5",
    galleryFiles: ['Nike Air Zoom Drive SP Mens 9.5 $125.jpeg', 'Nike Air Zoom Drive SP Mens 9.5 $125 (2).jpeg'],
  },
  {
    title: 'Nike Team Hustle D 12 x LEGO Col PS',
    galleryFiles: [
      'Team Hustle D 12 x LEGO Col PS.jpeg',
      'Team Hustle D 12 x LEGO Col PS-$70 (2).jpeg',
      'Team Hustle D 12 x LEGO Col PS-EXTRAPIC (2).jpeg',
    ],
  },
  {
    title: "Nike Astrograbber Suede Pink Foam Muslin Women's 7.5",
    galleryFiles: [
      "W Nike Astrograbber suede - pink foam Muslin Woman's 7.5 $70.jpeg",
      "W Nike Astrograbber suede - pink foam Muslin Woman's 7.5 $70 (2).jpeg",
    ],
  },
  {
    title: "Nike Pegasus Premium Women's 9",
    galleryFiles: ['W Nike Pegasus Premium Womans 9 $125.jpeg', 'W Nike Pegasus Premium Womans 9 $125 (2).jpeg'],
  },
  {
    title: "Adidas Tekkira Cup Men's 7",
    galleryFiles: ['Tekkira Cup Adidas Mens 7 $80.jpeg'],
  },
  {
    title: "Adidas Streettalk Women's 7",
    galleryFiles: ['Adidas Streettalk Woman 7 $70.jpeg'],
  },
  {
    // Grand Court Alpha has apostrophe filenames — script resolves them from disk
    title: "Adidas Grand Court Alpha 00s Women's 6",
    primaryFile: "Adidas Grand Court Alpha 00s Woman’s 6 $65 (2).jpeg",
    galleryFiles: ["Adidas Grand Court Alpha 00s Woman’s 6 $65.jpeg"],
  },
]

console.log('\n=== Dutch Kicks — Patch Shoe Gallery ===\n')

let done = 0
let failed = 0

for (const shoe of SHOES) {
  console.log(`▶  ${shoe.title}`)

  // Upload primary (only for records needing image_url set)
  let primaryUrl = null
  if (shoe.primaryFile) {
    primaryUrl = await uploadImage(shoe.primaryFile)
  }

  // Upload gallery files and collect URLs
  const galleryUrls = []
  for (const file of shoe.galleryFiles) {
    const url = await uploadImage(file)
    if (url) galleryUrls.push(url)
  }

  // Fetch existing record to get current image_url and merge metadata
  const { data: existing, error: fetchErr } = await supabase
    .from('inventory')
    .select('id, image_url, metadata')
    .eq('title', shoe.title)
    .eq('category', 'kicks')
    .maybeSingle()

  if (fetchErr || !existing) {
    console.error(`  MISS  ${shoe.title}: ${fetchErr?.message ?? 'not found'}`)
    failed++
    continue
  }

  const heroUrl = primaryUrl ?? existing.image_url
  // Gallery = all extra URLs that aren't the hero
  const filteredGallery = galleryUrls.filter(u => u !== heroUrl)

  const updatedMeta = { ...existing.metadata, gallery: filteredGallery }
  const update = primaryUrl
    ? { image_url: primaryUrl, metadata: updatedMeta }
    : { metadata: updatedMeta }

  const { error } = await supabase
    .from('inventory')
    .update(update)
    .eq('id', existing.id)

  if (error) {
    console.error(`  FAIL  ${shoe.title}: ${error.message}`)
    failed++
  } else {
    console.log(`  OK    thumbnails: ${filteredGallery.length}${primaryUrl ? '  +image_url' : ''}`)
    done++
  }
}

console.log(`\n=== Done: ${done} updated, ${failed} failed ===`)
console.log(`\nView at https://dutchkicks.com/inventory?category=kicks`)

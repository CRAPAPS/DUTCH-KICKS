// Dutch Kicks — fix primary shoe images so tile shows the shoe, not the label
// Usage: node scripts/patch-shoe-images.mjs
//
// From the screenshot, some tiles show the serial-number label instead of the shoe.
// This script swaps image_url to the shoe photo and saves the label photo into
// metadata.label_image_url so the detail view can show it as a secondary image.
// Shoes already displaying correctly (HOKA, Jordan One Take II, Grand Court Kids,
// Air Jordan 1 Low SE ASW) are left untouched for image_url but still get their
// label stored in metadata.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
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

const BASE = `${SUPABASE_URL}/storage/v1/object/public/inventory/kicks/`

// swapImage: true  → update image_url to shoeSlug (currently shows label)
// swapImage: false → image_url is already the shoe photo, just record labelSlug in metadata
const PATCHES = [
  // ── Currently showing LABEL — need swap ──────────────────────────────────
  {
    title: 'Nike Air Force 1 Lockdown',
    shoeSlug:  'air-force-lockdown-120.jpeg',
    labelSlug: 'airforce-lockdown.jpeg',
    swapImage: true,
  },
  {
    title: 'Air Jordan 3 Retro',
    shoeSlug:  'air-jordon-3-retro-170.jpeg',
    labelSlug: 'air-jordon-3-retro.jpeg',
    swapImage: true,
  },
  {
    title: 'Adidas VL Court Bold / Gazelle Bold Pink Bubble Gum',
    shoeSlug:  'adidas-vl-court-bold-gazelle-bold-pink-bubble-gum-womans-7-95-image2.jpeg',
    labelSlug: 'adidas-vl-court-bold-gazelle-bold-pink-bubble-gum-womans-7-95.jpeg',
    swapImage: true,
  },
  {
    title: 'Nike AAF88 SP – Billie Eilish',
    shoeSlug:  'billie-eilish-nike-aaf88-sp-70.jpeg',
    labelSlug: 'billie-eilish-nike-aaf88-sp.jpeg',
    swapImage: true,
  },
  {
    title: "Brooks Reveal 9 White/Ultimate Gray/Black Women's 7",
    shoeSlug:  'brooks-reveal-9-white-ultimate-gray-black-womans-7-115-image2.jpeg',
    labelSlug: 'brooks-reveal-9-white-ultimate-gray-black-womans-7-115.jpeg',
    swapImage: true,
  },
  {
    title: 'Jordan Stadium 90',
    shoeSlug:  'jordon-stadium-90-price-110.jpeg',
    labelSlug: 'jordan-stadium-90.jpeg',
    swapImage: true,
  },
  {
    title: 'Jordan Spizike Low PS 11C',
    shoeSlug:  'jordan-spizike-low-ps-11c-65.jpeg',
    labelSlug: 'jordan-spizike-low-ps.jpeg',
    swapImage: true,
  },
  {
    title: 'Jordan Spizike Low TD',
    shoeSlug:  'jordon-spizike-low-td-35.jpeg',
    labelSlug: 'jordon-spizike-low-td-.jpeg',
    swapImage: true,
  },
  {
    title: 'Nike Shox R4 GS',
    shoeSlug:  'nike-shox-r4-gs-65.jpeg',
    labelSlug: 'nike-shox-r4-gs.jpeg',
    swapImage: true,
  },
  {
    title: "Nike Air Zoom Drive SP Men's 9.5",
    shoeSlug:  'nike-air-zoom-drive-sp-mens-9-5-125-2.jpeg',
    labelSlug: 'nike-air-zoom-drive-sp-mens-9-5-125.jpeg',
    swapImage: true,
  },
  {
    title: 'Nike Team Hustle D 12 x LEGO Col PS',
    shoeSlug:  'team-hustle-d-12-x-lego-col-ps-70.jpeg',
    labelSlug: 'team-hustle-d-12-x-lego-col-ps.jpeg',
    swapImage: true,
  },
  {
    title: "Nike Pegasus Premium Women's 9",
    shoeSlug:  'w-nike-pegasus-premium-womans-9-125-2.jpeg',
    labelSlug: 'w-nike-pegasus-premium-womans-9-125.jpeg',
    swapImage: true,
  },

  // ── Already showing SHOE — just record label in metadata ─────────────────
  {
    title: "Jordan One Take II Men's 12",
    shoeSlug:  'jordan-one-take-11.jpeg',
    labelSlug: 'jordan-one-take-11-mens-size12-80.jpeg',
    swapImage: false,
  },
  {
    title: "HOKA Skyward Women's 9 – Pair 1",
    shoeSlug:  'hoka-w-skward-womans-9-135.jpeg',
    labelSlug: 'hoka-w-skward-womans-9-135-2.jpeg',
    swapImage: false,
  },
  {
    title: "HOKA Skyward Women's 9 – Pair 2",
    shoeSlug:  'hoka-w-skward-womans-9-135-2-pairs.jpeg',
    labelSlug: 'hoka-w-skward-womans-9-135-2-pairs-2.jpeg',
    swapImage: false,
  },
  {
    title: 'Adidas Grand Court 2 Kids',
    shoeSlug:  'grand-court-2-kids.jpeg',
    labelSlug: 'grand-court-2-kids-image-2.jpeg',
    swapImage: false,
  },
  {
    title: 'Air Jordan 1 Low SE ASW',
    shoeSlug:  'air-jordan-1-low-se-asw-mens-9-5-300.jpeg',
    labelSlug: 'air-jordan-1-low-se-asw-mens-9-5-300-2.jpeg',
    swapImage: false,
  },
]

console.log('\n=== Dutch Kicks — Patch Shoe Primary Images ===\n')

let swapped = 0
let metaOnly = 0
let failed = 0

for (const { title, shoeSlug, labelSlug, swapImage } of PATCHES) {
  const shoeUrl  = BASE + shoeSlug
  const labelUrl = BASE + labelSlug

  // Fetch current metadata so we can merge, not overwrite
  const { data: existing, error: fetchErr } = await supabase
    .from('inventory')
    .select('metadata')
    .eq('title', title)
    .eq('category', 'kicks')
    .maybeSingle()

  if (fetchErr || !existing) {
    console.error(`  MISS  ${title}: ${fetchErr?.message ?? 'not found'}`)
    failed++
    continue
  }

  const updatedMeta = { ...existing.metadata, label_image_url: labelUrl }
  const update = swapImage
    ? { image_url: shoeUrl, metadata: updatedMeta }
    : { metadata: updatedMeta }

  const { error } = await supabase
    .from('inventory')
    .update(update)
    .eq('title', title)
    .eq('category', 'kicks')

  if (error) {
    console.error(`  FAIL  ${title}: ${error.message}`)
    failed++
  } else if (swapImage) {
    console.log(`  SWAP  ${title}`)
    swapped++
  } else {
    console.log(`  META  ${title}`)
    metaOnly++
  }
}

console.log(`\n=== Done ===`)
console.log(`  Swapped image_url : ${swapped}`)
console.log(`  Metadata only     : ${metaOnly}`)
console.log(`  Failed            : ${failed}`)
console.log('\nView at https://dutchkicks.com/inventory?category=kicks')

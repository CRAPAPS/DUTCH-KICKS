// Fix hero image_url for shoes where the (2) image should be primary
// Usage: node scripts/fix-hero-images.mjs

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
} catch {}

const supabase = createClient('https://kovnrrblntwipabmeobq.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const BASE = 'https://kovnrrblntwipabmeobq.supabase.co/storage/v1/object/public/inventory/kicks/'

// For each shoe: newHero = the (2) image that should be image_url
// All (2) hero slugs come from patch-shoe-gallery.mjs slugify output — correct format
const FIXES = [
  // ── Already fixed ────────────────────────────────────────────────────────────
  { title: "HOKA Skyward Women's 9 – Pair 1",            newHero: BASE + 'hoka-w-skward-womans-9-135-2-.jpeg' },
  { title: "HOKA Skyward Women's 9 – Pair 2",            newHero: BASE + 'hoka-w-skward-womans-9-135-2-pairs-2-.jpeg' },
  { title: 'Air Jordan 1 Low SE ASW',                    newHero: BASE + 'air-jordan-1-low-se-asw-mens-9.5-300-2-.jpeg' },
  { title: "Adidas Grand Court 2.0 White/White Women's 9", newHero: BASE + 'grand-court-2.0-white-white-womans-9-50-2-.jpeg' },
  { title: "Adidas BL Courts 3.0 Women's 7",             newHero: BASE + 'adidas-bl-courts-3.0-womans-7-60-2-.jpeg' },
  { title: "Brooks Adrenaline GTS 25 Women's 7.5",       newHero: BASE + 'brooks-adrenaline-gts-25-womans-7.5-120-2-.jpeg' },
  { title: "Nike Astrograbber Suede Pink Foam Muslin Women's 7.5", newHero: BASE + 'w-nike-astrograbber-suede-pink-foam-muslin-womans-7.5-70-2-.jpeg' },

  // ── Wrong/broken slug from original patch — fix to correct (2) ────────────
  { title: "Nike Pegasus Premium Women's 9",             newHero: BASE + 'w-nike-pegasus-premium-womans-9-125-2-.jpeg' },
  { title: 'Air Jordan 3 Retro',                         newHero: BASE + 'air-jordon-3-retro-170-2-.jpeg' },
  { title: 'Adidas VL Court Bold / Gazelle Bold Pink Bubble Gum', newHero: BASE + 'adidas-vl-court-bold-gazelle-bold-pink-bubble-gum-womans-7-95-2-.jpeg' },
  { title: 'Nike AAF88 SP – Billie Eilish',              newHero: BASE + 'billie-eilish-nike-aaf88-sp-70-2-.jpeg' },
  { title: "Brooks Reveal 9 White/Ultimate Gray/Black Women's 7", newHero: BASE + 'brooks-reveal-9-white-ultimate-gray-black-womans-7-115-2-.jpeg' },
  { title: 'Jordan Stadium 90',                          newHero: BASE + 'jordon-stadium-90-price-110-2-.jpeg' },
  { title: 'Jordan Spizike Low PS 11C',                  newHero: BASE + 'jordan-spizike-low-ps-11c-65-2-.jpeg' },
  { title: 'Jordan Spizike Low TD',                      newHero: BASE + 'jordon-spizike-low-td-35-2-.jpeg' },
  { title: 'Nike Shox R4 GS',                            newHero: BASE + 'nike-shox-r4-gs-65-2-.jpeg' },
  { title: "Nike Air Zoom Drive SP Men's 9.5",           newHero: BASE + 'nike-air-zoom-drive-sp-mens-9.5-125-2-.jpeg' },
  { title: 'Nike Team Hustle D 12 x LEGO Col PS',        newHero: BASE + 'team-hustle-d-12-x-lego-col-ps-70-2-.jpeg' },
  { title: 'Nike Air Force 1 Lockdown',                  newHero: BASE + 'air-force-lockdown-120-2-.jpeg' },
]

console.log('\n=== Fix hero images ===\n')

for (const { title, newHero } of FIXES) {
  const { data, error: fetchErr } = await supabase
    .from('inventory')
    .select('id, image_url, metadata')
    .eq('title', title)
    .eq('category', 'kicks')
    .maybeSingle()

  if (fetchErr || !data) {
    console.error(`MISS  ${title}: ${fetchErr?.message ?? 'not found'}`)
    continue
  }

  const oldHero = data.image_url
  const currentGallery = data.metadata?.gallery ?? []
  // Move old hero into gallery; remove newHero from gallery (it's becoming the primary)
  const newGallery = oldHero && oldHero !== newHero && !currentGallery.includes(oldHero)
    ? [oldHero, ...currentGallery.filter(u => u !== newHero)]
    : currentGallery.filter(u => u !== newHero)

  const { error } = await supabase
    .from('inventory')
    .update({
      image_url: newHero,
      metadata: { ...data.metadata, gallery: newGallery }
    })
    .eq('id', data.id)

  if (error) {
    console.error(`FAIL  ${title}: ${error.message}`)
  } else {
    console.log(`OK    ${title}`)
    console.log(`      hero    → ${newHero.split('/').pop()}`)
    console.log(`      gallery : ${newGallery.length} image(s)`)
  }
}

console.log('\n=== Done ===')

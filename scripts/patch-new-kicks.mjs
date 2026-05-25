// One-off patch: upload images and set image_url + gallery for the 4 new kicks
// that were inserted with null image_url due to curly-apostrophe filename mismatch.
// Usage: node scripts/patch-new-kicks.mjs

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

// U+2019 RIGHT SINGLE QUOTATION MARK — actual character in these filenames
const Q = '’'

const PATCHES = [
  {
    title: "Adidas Light Racer 7.0 Men's 7",
    primaryImage: `Adidas light racer 7.0 white-grey Men${Q}s 7 & $50.jpeg`,
    extraImages:  [`Adidas light racer 7.0 white-grey Men${Q}s 7 & $50 (2).jpeg`],
  },
  {
    title: "Adidas SuperNova EASE W Women's 7",
    primaryImage: `Adidas SuperNova EASE W Woman${Q}s 7 $65.jpeg`,
    extraImages:  [`Adidas SuperNova EASE W Woman${Q}s 7 $65 (2).jpeg`],
  },
  {
    title: "Adidas VL Courts 3.0 Black-White-Gum Women's 11",
    primaryImage: `Adidas VL Courts 3.0 Black-White-Gum Woman${Q}s 11 $70.jpeg`,
    extraImages:  [`Adidas VL Courts 3.0 Black-White-Gum Woman${Q}s 11 $70 (2).jpeg`],
  },
  {
    title: "New Balance 1000 White Gris Women's 6.5",
    primaryImage: `New Balance 1000 White Gris Woman${Q}s 6 and half $135.jpeg`,
    extraImages:  [`New Balance 1000 White Gris Woman${Q}s 6 and half $135 (2).jpeg`],
  },
]

function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/['’"]/g, '')
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

console.log('\n=== Patch new kicks — images ===\n')

for (const patch of PATCHES) {
  console.log(`▶ ${patch.title}`)

  const primaryUrl = await uploadImage(patch.primaryImage)
  const galleryUrls = []
  for (const extra of patch.extraImages) {
    const url = await uploadImage(extra)
    if (url) galleryUrls.push(url)
  }

  if (!primaryUrl) {
    console.log('  ✗ primary image missing — skipping DB update\n')
    continue
  }

  const { data: existing } = await supabase
    .from('inventory')
    .select('id, metadata')
    .eq('title', patch.title)
    .eq('category', 'kicks')
    .maybeSingle()

  if (!existing) {
    console.log('  ✗ record not found in DB\n')
    continue
  }

  const updatedMeta = {
    ...(existing.metadata ?? {}),
    ...(galleryUrls.length > 0 ? { gallery: galleryUrls } : {}),
  }

  const { error } = await supabase
    .from('inventory')
    .update({ image_url: primaryUrl, metadata: updatedMeta })
    .eq('id', existing.id)

  if (error) console.error(`  ✗ DB update error: ${error.message}`)
  else console.log('  ✓ image_url + gallery patched')
  console.log('')
}

console.log('=== Done ===')

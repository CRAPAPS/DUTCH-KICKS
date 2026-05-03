// Dutch Kicks — seed admin users
// Usage: node scripts/seed-admins.mjs
// Requires SUPABASE_SERVICE_ROLE_KEY in environment or .env.local

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env.local if present
const __dir = dirname(fileURLToPath(import.meta.url))
try {
  const env = readFileSync(resolve(__dir, '../.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch { /* no .env.local — rely on process env */ }

const supabase = createClient(
  'https://kovnrrblntwipabmeobq.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ADMINS = [
  { email: 'ciso@shelinfosec.com',  role: 'super_admin', name: 'SHEL InfoSec CISO' },
  { email: 'tristan@thiinkvp.com',  role: 'director',    name: 'Tristan ThiinkVP' },
]

for (const { email, role, name } of ADMINS) {
  // Create or retrieve auth user
  const { data: existing } = await supabase.auth.admin.listUsers()
  const found = existing?.users?.find(u => u.email === email)

  let userId
  if (found) {
    userId = found.id
    console.log(`  already exists: ${email}`)
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name },
    })
    if (error) { console.error(`  ERROR creating ${email}:`, error.message); continue }
    userId = data.user.id
    console.log(`  created: ${email}`)
  }

  // Upsert role
  const { error: roleErr } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role }, { onConflict: 'user_id' })

  if (roleErr) {
    console.error(`  ERROR setting role for ${email}:`, roleErr.message)
  } else {
    console.log(`  role set: ${role}`)
  }

  console.log(`  ✓ ${name} (${email}) ready\n`)
}

console.log('Done. Send each user a password-reset email from Supabase Dashboard → Authentication → Users.')

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LiveDot from './LiveDot'

export default async function HUDHeader() {
  const supabase = await createClient()
  const { data } = await supabase.from('show_status').select('is_live').single()
  const isLive = data?.is_live ?? false

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 glass border-b border-white/10 flex items-center px-6 gap-4">
      <span className="font-display text-xl font-black tracking-widest text-gradient-gold uppercase">
        Dutch Kicks
      </span>

      <nav className="flex gap-6 ml-8 text-sm font-medium text-white/60">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/inventory" className="hover:text-white transition-colors">Inventory</Link>
      </nav>

      <div className="ml-auto">
        <LiveDot initialIsLive={isLive} />
      </div>
    </header>
  )
}

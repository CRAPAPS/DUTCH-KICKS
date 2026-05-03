'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LiveDot({ initialIsLive }: { initialIsLive: boolean }) {
  const [isLive, setIsLive] = useState(initialIsLive)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('show_status_live')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'show_status' },
        (payload) => { setIsLive((payload.new as { is_live: boolean }).is_live) }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (!isLive) return null

  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-lime">
      <span className="live-dot" />
      Live Now
    </div>
  )
}

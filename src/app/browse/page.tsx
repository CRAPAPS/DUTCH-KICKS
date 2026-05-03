import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SwipeDeck from '@/components/SwipeDeck'
import type { InventoryItem, ItemCategory } from '@/types/inventory'

interface Props {
  searchParams: Promise<{ category?: string }>
}

export const metadata = {
  title: 'Browse the Drop — Dutch Kicks',
  description: 'Swipe through our drops. Save what you want. Bid on Whatnot.',
}

export default async function BrowsePage({ searchParams }: Props) {
  const { category } = await searchParams
  const active = category as ItemCategory | undefined

  const supabase = await createClient()
  let query = supabase
    .from('inventory')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
  if (active) query = query.eq('category', active)
  const { data } = await query

  const items = (data ?? []) as InventoryItem[]

  const categories: { key: ItemCategory | 'all'; label: string }[] = [
    { key: 'all',        label: 'All'        },
    { key: 'fight',      label: 'UFC'        },
    { key: 'baseball',   label: 'Baseball'   },
    { key: 'basketball', label: 'Basketball' },
    { key: 'kicks',      label: 'Kicks'      },
    { key: 'watches',    label: 'Watches'    },
  ]

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-lg mx-auto">
        {/* heading */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-4xl text-gradient-gold uppercase tracking-tight">
            Browse the Drop
          </h1>
          <p className="text-white/40 text-sm font-mono mt-2">
            Swipe right to save · swipe left to pass · tap ℹ for details
          </p>
        </div>

        {/* category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(({ key, label }) => {
            const isActive = (key === 'all' && !active) || key === active
            return (
              <a
                key={key}
                href={key === 'all' ? '/browse' : `/browse?category=${key}`}
                className={`font-display font-bold text-xs tracking-widest px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-gold text-noir border border-gold'
                    : 'glass text-white/40 border border-white/10 hover:text-white/80'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        {/* deck */}
        <Suspense fallback={
          <div className="flex items-center justify-center h-[460px]">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {items.length > 0 ? (
            <SwipeDeck items={items} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[460px] gap-4 glass rounded-3xl border border-white/10">
              <span className="text-5xl opacity-30">📦</span>
              <p className="text-white/30 font-mono text-sm">No items in this category yet</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

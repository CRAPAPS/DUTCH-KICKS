'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useCartDrawer } from '@/store/cart-drawer'

export default function CartButton() {
  const { count } = useCart()
  const { open } = useCartDrawer()

  return (
    <button
      onClick={open}
      className="relative flex items-center gap-2 glass border border-white/10 rounded-full px-4 py-2 hover:border-lime/40 transition-all group"
      aria-label="Open cart"
    >
      <ShoppingBag size={16} className="text-white/60 group-hover:text-lime transition-colors" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-lime text-noir text-[10px] font-black flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}

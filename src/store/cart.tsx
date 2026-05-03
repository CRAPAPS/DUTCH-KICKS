'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { InventoryItem } from '@/types/inventory'

interface CartItem extends Record<string, unknown> {
  item: InventoryItem
  addedAt: number
}

interface CartCtx {
  items: CartItem[]
  add: (item: InventoryItem) => void
  remove: (id: string) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = useCallback((item: InventoryItem) => {
    setItems(prev =>
      prev.find(i => i.item.id === item.id)
        ? prev
        : [...prev, { item, addedAt: Date.now() }]
    )
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.item.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + (i.item.price ?? 0), 0)

  return (
    <CartContext.Provider value={{ items, add, remove, clear, count: items.length, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}

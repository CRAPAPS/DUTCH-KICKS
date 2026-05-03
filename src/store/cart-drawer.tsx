'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface DrawerCtx { isOpen: boolean; open: () => void; close: () => void }

const DrawerContext = createContext<DrawerCtx | null>(null)

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <DrawerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useCartDrawer must be inside CartDrawerProvider')
  return ctx
}

'use client'

import { CartProvider } from '@/store/cart'
import { CartDrawerProvider } from '@/store/cart-drawer'
import CartDrawer from '@/components/CartDrawer'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawerProvider>
        {children}
        <CartDrawer />
      </CartDrawerProvider>
    </CartProvider>
  )
}

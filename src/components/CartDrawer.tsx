'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, ExternalLink } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useCartDrawer } from '@/store/cart-drawer'

export default function CartDrawer() {
  const { items, remove, clear, count, total } = useCart()
  const { isOpen, close } = useCartDrawer()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-noir/70 backdrop-blur-sm z-40"
          />

          {/* drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 glass-gold border-l border-gold/20 flex flex-col"
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold" />
                <span className="font-display font-black text-lg text-gradient-gold uppercase tracking-widest">
                  Saved
                </span>
                {count > 0 && (
                  <span className="w-6 h-6 rounded-full bg-lime text-noir text-xs font-black flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <button onClick={close} className="text-white/40 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
                  <ShoppingBag size={32} className="text-white/20" />
                  <p className="text-white/30 font-mono text-sm">Swipe right on items you want</p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(({ item }) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="glass rounded-xl p-3 flex gap-3 items-center border border-white/5"
                    >
                      {/* thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-noir-2 shrink-0 flex items-center justify-center">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl opacity-30">
                            {item.category === 'fight' ? '🥊' : item.category === 'kicks' ? '👟' : item.category === 'baseball' ? '⚾' : item.category === 'basketball' ? '🏀' : item.category === 'watches' ? '⌚' : '📦'}
                          </span>
                        )}
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-sm text-white leading-tight truncate">{item.title}</p>
                        <p className="text-white/40 text-xs font-mono mt-0.5">{item.category.toUpperCase()}</p>
                        <p className="font-display font-black text-gold text-sm mt-1">
                          {item.price ? `$${item.price}` : 'TBD'}
                        </p>
                      </div>
                      <button onClick={() => remove(item.id)} className="text-white/20 hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* footer */}
            {count > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-white/40">Total value</span>
                  <span className="font-black text-gradient-gold">${total.toFixed(2)}</span>
                </div>
                <a
                  href="https://www.whatnot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-lime text-noir font-display font-black tracking-widest text-sm uppercase py-3 rounded-full glow-lime hover:scale-[1.02] transition-transform"
                >
                  Bid on Whatnot
                  <ExternalLink size={14} />
                </a>
                <button onClick={clear} className="w-full text-white/30 text-xs font-mono hover:text-white/60 transition-colors py-1">
                  Clear all
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

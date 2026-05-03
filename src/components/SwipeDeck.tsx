'use client'

import { useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Heart, X, RotateCcw, Info } from 'lucide-react'
import type { InventoryItem } from '@/types/inventory'
import { useCart } from '@/store/cart'
import { useCartDrawer } from '@/store/cart-drawer'

const SWIPE_THRESHOLD = 90

function categoryGlow(category: string) {
  if (category === 'fight' || category === 'baseball') return 'ring-gold/60 shadow-[0_0_40px_rgba(212,175,55,0.2)]'
  if (category === 'kicks' || category === 'skate')   return 'ring-lime/60 shadow-[0_0_40px_rgba(204,255,0,0.15)]'
  if (category === 'basketball')                      return 'ring-orange/60 shadow-[0_0_40px_rgba(255,107,26,0.2)]'
  return 'ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
}

function categoryBadgeStyle(category: string) {
  if (category === 'fight' || category === 'baseball') return 'bg-gold/15 text-gold border-gold/40'
  if (category === 'kicks' || category === 'skate')   return 'bg-lime/15 text-lime border-lime/40'
  if (category === 'basketball')                      return 'bg-orange/15 text-orange border-orange/40'
  return 'bg-white/10 text-white/60 border-white/20'
}

function cardIcon(category: string) {
  const icons: Record<string, string> = { kicks:'👟', skate:'🛹', fight:'🥊', baseball:'⚾', basketball:'🏀', watches:'⌚', comics:'📚' }
  return icons[category] ?? '📦'
}

function metaSummary(item: InventoryItem): string {
  if (item.category === 'kicks' || item.category === 'skate')
    return `Size US ${item.metadata.size} · ${item.metadata.colorway}`
  if (item.category === 'fight')
    return `${item.metadata.set_name}${item.metadata.serial ? ` · #${item.metadata.serial}` : ''}${item.metadata.autograph ? ' · AUTO' : ''}`
  if (item.category === 'baseball' || item.category === 'basketball')
    return `${item.metadata.year} · ${item.metadata.set_name}${item.metadata.autograph ? ' · AUTO' : ''}`
  if (item.category === 'watches')
    return `${item.metadata.brand} ${item.metadata.model} · ${item.metadata.condition}`
  if (item.category === 'comics')
    return `#${item.metadata.issue} · ${item.metadata.publisher}${item.metadata.grade ? ` · ${item.metadata.grade}` : ''}`
  return ''
}

/* ── Individual swipeable card ─────────────────────────────────── */
interface TopCardProps {
  item: InventoryItem
  onDone: (wanted: boolean) => void
}

function TopCard({ item, onDone }: TopCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-16, 16])
  const wantOpacity = useTransform(x, [50, 130], [0, 1])
  const passOpacity = useTransform(x, [-50, -130], [0, 1])
  const [gone, setGone] = useState<'l' | 'r' | null>(null)
  const [flipped, setFlipped] = useState(false)

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (gone) return
    if (info.offset.x > SWIPE_THRESHOLD) setGone('r')
    else if (info.offset.x < -SWIPE_THRESHOLD) setGone('l')
  }

  return (
    <motion.div
      className={`absolute inset-0 cursor-grab active:cursor-grabbing rounded-3xl ring-1 ${categoryGlow(item.category)}`}
      style={{ x: gone ? undefined : x, rotate }}
      drag={gone ? false : 'x'}
      dragElastic={0.08}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      animate={
        gone === 'r' ? { x: 650, rotate: 22, opacity: 0 } :
        gone === 'l' ? { x: -650, rotate: -22, opacity: 0 } :
        {}
      }
      transition={gone ? { duration: 0.28, ease: 'easeOut' } : { type: 'spring', stiffness: 500, damping: 50 }}
      onAnimationComplete={() => { if (gone) onDone(gone === 'r') }}
    >
      {/* ── WANT stamp ── */}
      <motion.div
        style={{ opacity: wantOpacity }}
        className="absolute inset-0 rounded-3xl bg-lime/10 z-20 pointer-events-none flex items-start justify-end p-6"
      >
        <span className="font-display font-black text-3xl text-lime border-4 border-lime rounded-xl px-4 py-1 rotate-[-18deg]">
          WANT IT
        </span>
      </motion.div>

      {/* ── PASS stamp ── */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute inset-0 rounded-3xl bg-red-500/10 z-20 pointer-events-none flex items-start justify-start p-6"
      >
        <span className="font-display font-black text-3xl text-red-400 border-4 border-red-400 rounded-xl px-4 py-1 rotate-[18deg]">
          PASS
        </span>
      </motion.div>

      {/* ── Card face (front / back toggle) ── */}
      <AnimatePresence mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)' }}
          >
            {/* image area */}
            <div className="relative flex-1 overflow-hidden bg-noir-2">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[90px] opacity-15">{cardIcon(item.category)}</span>
                </div>
              )}

              {/* category badge */}
              <span className={`absolute top-3 left-3 text-[10px] font-display font-black tracking-widest px-2.5 py-1 rounded-full border ${categoryBadgeStyle(item.category)}`}>
                {item.category.toUpperCase()}
              </span>

              {/* info flip button */}
              <button
                onClick={(e) => { e.stopPropagation(); setFlipped(true) }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <Info size={14} />
              </button>

              {/* bottom gradient */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-noir-2 to-transparent" />
            </div>

            {/* info bar */}
            <div className="px-5 py-4 bg-noir-2/80 backdrop-blur-sm">
              <h3 className="font-display font-black text-lg leading-tight text-gradient-gold line-clamp-1">
                {item.title}
              </h3>
              <p className="text-white/40 text-xs font-mono mt-1 truncate">{metaSummary(item)}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-display font-black text-2xl text-gradient-gold">
                  {item.price ? `$${item.price}` : 'TBD'}
                </span>
                <span className="text-white/20 text-[10px] font-mono">tap ℹ for details</span>
              </div>
            </div>
          </motion.div>

        ) : (

          <motion.div
            key="back"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col"
            style={{ background: 'rgba(212,175,55,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{cardIcon(item.category)}</span>
                <button onClick={(e) => { e.stopPropagation(); setFlipped(false) }}
                  className="text-white/40 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <h3 className="font-display font-black text-xl text-gradient-gold mb-4 leading-tight">{item.title}</h3>
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {Object.entries(item.metadata)
                  .filter(([, v]) => v != null && v !== '')
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center border-b border-white/8 pb-2">
                      <span className="text-white/40 text-xs font-mono capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-white/80 text-xs font-bold">{String(v)}</span>
                    </div>
                  ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-display font-black text-2xl text-gradient-gold">
                  {item.price ? `$${item.price}` : 'TBD'}
                </span>
                <span className="text-white/30 text-xs font-mono">swipe to act ↔</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Background card (non-interactive depth card) ────────────── */
function BackCard({ depth }: { depth: number }) {
  return (
    <div
      className="absolute inset-0 rounded-3xl glass border border-white/5"
      style={{
        transform: `scale(${1 - depth * 0.05}) translateY(${depth * 14}px)`,
        zIndex: 10 - depth,
        opacity: 1 - depth * 0.25,
      }}
    />
  )
}

/* ── Main SwipeDeck component ─────────────────────────────────── */
export default function SwipeDeck({ items }: { items: InventoryItem[] }) {
  const [idx, setIdx] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const { add, count } = useCart()
  const { open: openCart } = useCartDrawer()

  const current = items[idx]
  const hasNext = idx < items.length

  const handleDone = useCallback((wanted: boolean) => {
    if (wanted) {
      add(items[idx])
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40)
    }
    setHistory(h => [...h, idx])
    setIdx(i => i + 1)
  }, [idx, items, add])

  function undo() {
    if (!history.length) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setIdx(prev)
  }

  function reset() {
    setIdx(0)
    setHistory([])
  }

  const progress = items.length > 0 ? Math.round((idx / items.length) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* progress bar + counters */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white/30">{Math.max(0, items.length - idx)} remaining</span>
          <button onClick={openCart} className="text-lime font-bold hover:text-lime/80 transition-colors">
            {count} saved →
          </button>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-lime to-gold rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* deck */}
      <div className="relative w-full max-w-sm h-[460px]">
        {/* back cards */}
        {hasNext && items[idx + 2] && <BackCard depth={2} />}
        {hasNext && items[idx + 1] && <BackCard depth={1} />}

        {/* top card */}
        <AnimatePresence>
          {hasNext && current && (
            <TopCard key={`card-${idx}`} item={current} onDone={handleDone} />
          )}
        </AnimatePresence>

        {/* empty state */}
        {!hasNext && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-3xl glass border border-white/10 flex flex-col items-center justify-center gap-4 p-8 text-center"
          >
            <span className="text-6xl">🎉</span>
            <p className="font-display font-black text-2xl text-gradient-gold">You&apos;ve seen it all</p>
            <p className="text-white/40 text-sm font-mono">{count} item{count !== 1 ? 's' : ''} saved to your list</p>
            {count > 0 && (
              <button onClick={openCart}
                className="font-display font-black tracking-widest text-sm uppercase bg-lime text-noir px-6 py-2.5 rounded-full glow-lime">
                View Saved →
              </button>
            )}
            <button onClick={reset} className="text-white/30 text-xs font-mono hover:text-white/60 transition-colors mt-1">
              Start over
            </button>
          </motion.div>
        )}
      </div>

      {/* action buttons */}
      {hasNext && (
        <div className="flex items-center gap-6">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => handleDone(false)}
            className="w-16 h-16 rounded-full glass border border-red-400/30 flex items-center justify-center text-red-400 hover:bg-red-400/10 hover:border-red-400/60 transition-all"
            aria-label="Pass"
          >
            <X size={26} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={undo}
            disabled={!history.length}
            className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 disabled:opacity-20 transition-all"
            aria-label="Undo"
          >
            <RotateCcw size={15} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => handleDone(true)}
            className="w-16 h-16 rounded-full glass border border-lime/40 flex items-center justify-center text-lime hover:bg-lime/10 hover:border-lime/70 transition-all glow-lime"
            aria-label="Want it"
          >
            <Heart size={26} />
          </motion.button>
        </div>
      )}

      {hasNext && (
        <p className="text-white/20 text-[11px] font-mono tracking-wider">
          ← swipe to pass &nbsp;·&nbsp; swipe to save →
        </p>
      )}
    </div>
  )
}

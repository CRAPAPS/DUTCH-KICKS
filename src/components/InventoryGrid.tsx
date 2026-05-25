'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Layers } from 'lucide-react';
import ProductCard from './ProductCard';
import ItemModal from './ItemModal';
import SwipeDeck from './SwipeDeck';
import type { InventoryItem } from '@/types/inventory';

type ViewMode = 'grid' | 'browse';

export default function InventoryGrid({ items }: { items: InventoryItem[] }) {
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [view, setView] = useState<ViewMode>('grid');

  // Close on Escape key
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <>
      {/* View toggle */}
      <div className="flex justify-end mb-5">
        <div className="flex glass rounded-full p-1 gap-0.5 border border-white/8">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 font-display text-xs font-bold tracking-widest px-4 py-2 rounded-full transition-all duration-200 ${
              view === 'grid'
                ? 'bg-white/12 text-white'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            <LayoutGrid size={13} />
            GRID
          </button>
          <button
            onClick={() => setView('browse')}
            className={`flex items-center gap-1.5 font-display text-xs font-bold tracking-widest px-4 py-2 rounded-full transition-all duration-200 ${
              view === 'browse'
                ? 'bg-lime/15 text-lime'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            <Layers size={13} />
            BROWSE
          </button>
        </div>
      </div>

      {view === 'browse' ? (
        <SwipeDeck items={items} />
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {items.map(item => (
            <ProductCard
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selected && (
          <ItemModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

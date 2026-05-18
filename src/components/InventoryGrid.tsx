'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ItemModal from './ItemModal';
import type { InventoryItem } from '@/types/inventory';

export default function InventoryGrid({ items }: { items: InventoryItem[] }) {
  const [selected, setSelected] = useState<InventoryItem | null>(null);

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

      <AnimatePresence>
        {selected && (
          <ItemModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

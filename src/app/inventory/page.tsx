import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import InventoryFilter from '@/components/InventoryFilter';
import { MOCK_INVENTORY } from '@/lib/mock-inventory';
import type { ItemCategory } from '@/types/inventory';

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function InventoryPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const active = category as ItemCategory | undefined;

  const items = active
    ? MOCK_INVENTORY.filter(i => i.category === active)
    : MOCK_INVENTORY;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* header */}
      <div className="mb-10">
        <h1 className="font-display font-black text-5xl text-gradient-gold uppercase tracking-tight mb-2">
          Inventory
        </h1>
        <p className="text-white/40 font-mono text-sm">
          {items.length} item{items.length !== 1 ? 's' : ''}{active ? ` · ${active.toUpperCase()}` : ''}
        </p>
      </div>

      {/* filter bar */}
      <Suspense>
        <div className="mb-8">
          <InventoryFilter />
        </div>
      </Suspense>

      {/* grid */}
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center text-white/30 font-mono text-sm">
          No items in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

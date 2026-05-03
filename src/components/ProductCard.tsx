'use client';

import { motion } from 'framer-motion';
import type { InventoryItem } from '@/types/inventory';

const CATEGORY_LABEL: Record<string, string> = {
  kicks: 'KICKS',
  skate: 'SKATE',
  fight: 'FIGHT',
  comics: 'COMICS',
};

function categoryAccent(category: string) {
  if (category === 'fight') return 'ring-gold glow-gold border-gold/30';
  if (category === 'kicks' || category === 'skate') return 'ring-lime glow-lime border-lime/20';
  return 'ring-white/30 border-white/10';
}

function categoryBadge(category: string) {
  if (category === 'fight') return 'bg-gold/10 text-gold border border-gold/40';
  if (category === 'kicks' || category === 'skate') return 'bg-lime/10 text-lime border border-lime/40';
  return 'bg-white/5 text-white/60 border border-white/20';
}

function metaLine(item: InventoryItem): string {
  if (item.category === 'kicks' || item.category === 'skate') {
    const sku = item.metadata.sku ?? 'No SKU';
    return `${sku} · US ${item.metadata.size} · ${item.metadata.colorway}`;
  }
  if (item.category === 'fight') {
    const serial = item.metadata.serial ? `#${item.metadata.serial}` : 'No Serial';
    const auto = item.metadata.autograph ? ' · AUTO' : '';
    return `${serial}${auto} · ${item.metadata.set_name}`;
  }
  if (item.category === 'comics') {
    const grade = item.metadata.grade ? ` · ${item.metadata.grade}` : '';
    return `#${item.metadata.issue}${grade} · ${item.metadata.publisher}`;
  }
  return '';
}

function ImagePlaceholder({ category }: { category: string }) {
  const gradients: Record<string, string> = {
    kicks: 'from-lime/10 to-noir-2',
    skate: 'from-lime/10 to-noir-2',
    fight: 'from-gold/10 to-noir-2',
    comics: 'from-white/5 to-noir-2',
  };
  const icons: Record<string, string> = {
    kicks: '👟',
    skate: '🛹',
    fight: '🥊',
    comics: '📚',
  };
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[category] ?? 'from-white/5 to-noir-2'} flex items-center justify-center`}>
      <span className="text-4xl opacity-30">{icons[category] ?? '📦'}</span>
    </div>
  );
}

export default function ProductCard({ item }: { item: InventoryItem }) {
  const accent = categoryAccent(item.category);
  const badge = categoryBadge(item.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-xl overflow-hidden ring-1 ${accent} flex flex-col group cursor-pointer`}
    >
      {/* image */}
      <div className="relative h-44 overflow-hidden bg-noir-2">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder category={item.category} />
        )}

        {/* status badge */}
        {item.status !== 'available' && (
          <div className="absolute inset-0 bg-noir/70 flex items-center justify-center">
            <span className="text-white/80 font-display font-bold text-lg uppercase tracking-widest">
              {item.status}
            </span>
          </div>
        )}

        {/* category pill */}
        <span className={`absolute top-2 left-2 text-[10px] font-display font-bold tracking-widest px-2 py-0.5 rounded-full ${badge}`}>
          {CATEGORY_LABEL[item.category]}
        </span>
      </div>

      {/* body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-bold text-base leading-tight text-gradient-gold line-clamp-2">
          {item.title}
        </h3>

        <p className="text-[11px] text-white/40 font-mono truncate">{metaLine(item)}</p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          {item.price != null ? (
            <span className="font-display font-black text-xl text-gradient-gold">
              ${item.price}
            </span>
          ) : (
            <span className="text-white/30 text-sm font-mono">TBD</span>
          )}

          {(item.category === 'fight' && item.metadata.autograph) && (
            <span className="text-[10px] font-bold tracking-widest text-gold border border-gold/40 rounded-full px-2 py-0.5">
              AUTO
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

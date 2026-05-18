'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InventoryItem } from '@/types/inventory';

const CATEGORY_LABEL: Record<string, string> = {
  kicks:      'KICKS',
  skate:      'SKATE',
  fight:      'UFC',
  comics:     'COMICS',
  baseball:   'BASEBALL',
  basketball: 'HOOPS',
  watches:    'WATCHES',
};

function categoryAccent(category: string) {
  if (category === 'fight' || category === 'baseball') return 'ring-gold glow-gold border-gold/30';
  if (category === 'kicks' || category === 'skate')    return 'ring-lime glow-lime border-lime/20';
  if (category === 'basketball')                       return 'ring-orange glow-orange border-orange/30';
  return 'ring-white/30 border-white/10';
}

function categoryBadge(category: string) {
  if (category === 'fight' || category === 'baseball') return 'bg-gold/10 text-gold border border-gold/40';
  if (category === 'kicks' || category === 'skate')    return 'bg-lime/10 text-lime border border-lime/40';
  if (category === 'basketball')                       return 'bg-orange/10 text-orange border border-orange/40';
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
  if (item.category === 'baseball' || item.category === 'basketball') {
    const serial = item.metadata.serial ? ` #${item.metadata.serial}` : '';
    const auto = item.metadata.autograph ? ' · AUTO' : '';
    const grade = item.metadata.grade ? ` · ${item.metadata.grade}` : '';
    return `${item.metadata.year}${serial}${auto}${grade} · ${item.metadata.set_name}`;
  }
  if (item.category === 'watches') {
    const ref = item.metadata.reference ? ` · ${item.metadata.reference}` : '';
    const bp = item.metadata.box_papers ? ' · Box+Papers' : '';
    return `${item.metadata.brand} ${item.metadata.model}${ref} · ${item.metadata.condition}${bp}`;
  }
  if (item.category === 'comics') {
    const grade = item.metadata.grade ? ` · ${item.metadata.grade}` : '';
    return `#${item.metadata.issue}${grade} · ${item.metadata.publisher}`;
  }
  return '';
}

function ImagePlaceholder({ category }: { category: string }) {
  const gradients: Record<string, string> = {
    kicks:      'from-lime/10 to-noir-2',
    skate:      'from-lime/10 to-noir-2',
    fight:      'from-gold/10 to-noir-2',
    comics:     'from-white/5 to-noir-2',
    baseball:   'from-gold/10 to-noir-2',
    basketball: 'from-orange/10 to-noir-2',
    watches:    'from-white/8 to-noir-2',
  };
  const icons: Record<string, string> = {
    kicks:      '👟',
    skate:      '🛹',
    fight:      '🥊',
    comics:     '📚',
    baseball:   '⚾',
    basketball: '🏀',
    watches:    '⌚',
  };
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[category] ?? 'from-white/5 to-noir-2'} flex items-center justify-center`}>
      <span className="text-4xl opacity-30">{icons[category] ?? '📦'}</span>
    </div>
  );
}

export default function ProductCard({ item }: { item: InventoryItem }) {
  const accent = categoryAccent(item.category);
  const badge  = categoryBadge(item.category);
  const [showLabel, setShowLabel] = useState(false);

  const isAuto = (item.category === 'fight' || item.category === 'baseball' || item.category === 'basketball')
    && item.metadata.autograph;

  const labelImageUrl = (item.category === 'kicks' || item.category === 'skate')
    ? (item.metadata as { label_image_url?: string | null }).label_image_url
    : null;

  const displayUrl = showLabel && labelImageUrl ? labelImageUrl : item.image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-xl overflow-hidden ring-1 ${accent} flex flex-col group cursor-pointer`}
    >
      {/* image */}
      <div className="relative h-44 overflow-hidden bg-noir-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayUrl ?? 'placeholder'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {displayUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayUrl}
                alt={showLabel ? `${item.title} — box label` : item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <ImagePlaceholder category={item.category} />
            )}
          </motion.div>
        </AnimatePresence>

        {item.status !== 'available' && (
          <div className="absolute inset-0 bg-noir/70 flex items-center justify-center">
            <span className="text-white/80 font-display font-bold text-lg uppercase tracking-widest">
              {item.status}
            </span>
          </div>
        )}

        <span className={`absolute top-2 left-2 text-[10px] font-display font-bold tracking-widest px-2 py-0.5 rounded-full ${badge}`}>
          {CATEGORY_LABEL[item.category]}
        </span>

        {labelImageUrl && (
          <button
            onClick={e => { e.stopPropagation(); setShowLabel(v => !v); }}
            className={`absolute bottom-2 right-2 text-[9px] font-display font-bold tracking-widest px-2 py-0.5 rounded-full border transition-colors ${
              showLabel
                ? 'bg-lime/20 text-lime border-lime/50'
                : 'bg-noir/60 text-white/50 border-white/20 hover:border-white/40 hover:text-white/80'
            }`}
            title={showLabel ? 'Show shoe' : 'Show box label'}
          >
            {showLabel ? 'SHOE' : 'BOX'}
          </button>
        )}
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

          {isAuto && (
            <span className="text-[10px] font-bold tracking-widest text-gold border border-gold/40 rounded-full px-2 py-0.5">
              AUTO
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

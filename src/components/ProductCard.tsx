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

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProductCard({ item, onClick }: { item: InventoryItem; onClick?: () => void }) {
  const accent = categoryAccent(item.category);
  const badge  = categoryBadge(item.category);

  const isAuto = (item.category === 'fight' || item.category === 'baseball' || item.category === 'basketball')
    && item.metadata.autograph;

  // Universal gallery: primary image + any extras stored in metadata
  const meta = item.metadata as { label_image_url?: string | null; gallery?: string[] };
  const extras: string[] = meta.gallery?.length
    ? meta.gallery
    : meta.label_image_url
      ? [meta.label_image_url]
      : [];
  const allImages = [item.image_url, ...extras].filter((u): u is string => !!u);

  const [activeUrl, setActiveUrl] = useState<string | null>(item.image_url);
  const heroUrl = activeUrl ?? item.image_url;

  return (
    <motion.div
      variants={cardVariants}
      className={`glass rounded-xl overflow-hidden ring-1 ${accent} flex flex-col group cursor-pointer`}
      onClick={onClick}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
    >
      {/* hero image */}
      <div className="relative h-40 overflow-hidden bg-noir-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroUrl ?? 'placeholder'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0"
          >
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroUrl}
                alt={item.title}
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
      </div>

      {/* thumbnail strip — shown whenever multiple images are available */}
      {allImages.length > 1 && (
        <div className="flex gap-1 px-2 py-1.5 bg-noir-2/60 border-t border-white/5">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setActiveUrl(url); }}
              className={`h-9 w-11 flex-shrink-0 rounded overflow-hidden ring-1 transition-all duration-150 ${
                heroUrl === url
                  ? 'ring-lime opacity-100'
                  : 'ring-white/10 opacity-50 hover:opacity-90 hover:ring-white/30'
              }`}
              title={i === 0 ? 'Main photo' : `Detail ${i}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}


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

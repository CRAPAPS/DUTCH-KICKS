'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import type { InventoryItem } from '@/types/inventory';

// ─── helpers ──────────────────────────────────────────────────────────────────

function categoryLabel(cat: string) {
  const MAP: Record<string, string> = {
    kicks: 'KICKS', skate: 'SKATE', fight: 'UFC',
    comics: 'COMICS', baseball: 'BASEBALL', basketball: 'HOOPS', watches: 'WATCHES',
  };
  return MAP[cat] ?? cat.toUpperCase();
}

function categoryBadge(cat: string) {
  if (cat === 'fight' || cat === 'baseball') return 'bg-gold/10 text-gold border border-gold/40';
  if (cat === 'kicks' || cat === 'skate')    return 'bg-lime/10 text-lime border border-lime/40';
  if (cat === 'basketball')                  return 'bg-orange/10 text-orange border border-orange/40';
  return 'bg-white/5 text-white/60 border border-white/20';
}

function categoryAccent(cat: string) {
  if (cat === 'fight' || cat === 'baseball') return 'ring-gold';
  if (cat === 'kicks' || cat === 'skate')    return 'ring-lime';
  if (cat === 'basketball')                  return 'ring-orange';
  return 'ring-white/20';
}

function getMetaRows(item: InventoryItem): [string, string][] {
  const rows: [string, string][] = [];
  if (item.category === 'kicks' || item.category === 'skate') {
    const m = item.metadata;
    const sizeDisplay = (m as { size_label?: string | null }).size_label ?? (m.size ? `US ${m.size}` : null);
    if (sizeDisplay) rows.push(['Size', sizeDisplay]);
    if (m.colorway) rows.push(['Colorway', m.colorway]);
    if (m.sku) rows.push(['SKU', m.sku]);
  } else if (item.category === 'fight') {
    const m = item.metadata;
    rows.push(['Set', m.set_name]);
    if (m.serial) rows.push(['Serial', `#${m.serial}`]);
    rows.push(['Autograph', m.autograph ? 'Yes — Certified' : 'No']);
    if (m.parallel) rows.push(['Parallel', m.parallel]);
    const cn = (m as { card_number?: string }).card_number;
    if (cn) rows.push(['Card #', cn]);
  } else if (item.category === 'baseball' || item.category === 'basketball') {
    const m = item.metadata;
    rows.push(['Player', m.player]);
    rows.push(['Year', String(m.year)]);
    rows.push(['Set', m.set_name]);
    if (m.serial) rows.push(['Serial', `#${m.serial}`]);
    rows.push(['Autograph', m.autograph ? 'Yes — Certified' : 'No']);
    if (m.grade) rows.push(['Grade', m.grade]);
    if (m.parallel) rows.push(['Parallel', m.parallel]);
  } else if (item.category === 'watches') {
    const m = item.metadata;
    rows.push(['Brand', m.brand]);
    rows.push(['Model', m.model]);
    if (m.reference) rows.push(['Reference', m.reference]);
    rows.push(['Condition', m.condition]);
    if (m.box_papers) rows.push(['Box & Papers', 'Included']);
  } else if (item.category === 'comics') {
    const m = item.metadata;
    rows.push(['Issue', `#${m.issue}`]);
    rows.push(['Publisher', m.publisher]);
    if (m.grade) rows.push(['Grade', m.grade]);
    rows.push(['Key Issue', m.key_issue ? 'Yes' : 'No']);
  }
  return rows;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>
      <motion.img
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        // eslint-disable-next-line @next/next/no-img-element
        src={url}
        alt=""
        className="max-w-[92vw] max-h-[92vh] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ItemModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const meta = item.metadata as { gallery?: string[]; label_image_url?: string | null };
  const extras: string[] = meta.gallery?.length
    ? meta.gallery
    : meta.label_image_url ? [meta.label_image_url] : [];
  const allImages = [item.image_url, ...extras].filter((u): u is string => !!u);

  const [activeUrl, setActiveUrl] = useState<string>(allImages[0] ?? '');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const badge    = categoryBadge(item.category);
  const accent   = categoryAccent(item.category);
  const metaRows = getMetaRows(item);
  const isSold   = item.status !== 'available';

  return (
    <>
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-noir/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className={`fixed inset-x-3 top-[4%] bottom-[4%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-50 glass rounded-2xl ring-1 ${accent} overflow-hidden flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white transition-all"
        >
          <X size={15} />
        </button>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid md:grid-cols-2 min-h-full">

            {/* left — images */}
            <div className="bg-noir-2/50 flex flex-col">
              <div
                className="relative aspect-square overflow-hidden cursor-zoom-in group/zoom"
                onClick={() => activeUrl && setLightboxUrl(activeUrl)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeUrl}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    // eslint-disable-next-line @next/next/no-img-element
                    src={activeUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity bg-noir/30">
                  <ZoomIn size={32} className="text-white drop-shadow-lg" />
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 flex-wrap">
                  {allImages.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveUrl(url)}
                      className={`w-14 h-14 rounded-lg overflow-hidden ring-2 transition-all duration-150 flex-shrink-0 ${
                        activeUrl === url
                          ? 'ring-lime opacity-100 scale-105'
                          : 'ring-white/10 opacity-50 hover:opacity-90 hover:ring-white/30 hover:scale-105'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* right — details */}
            <div className="p-6 flex flex-col gap-5">
              {/* badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-display font-bold tracking-widest px-2.5 py-1 rounded-full ${badge}`}>
                  {categoryLabel(item.category)}
                </span>
                {isSold && (
                  <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
                    {item.status.toUpperCase()}
                  </span>
                )}
              </div>

              {/* title */}
              <h2 className="font-display font-black text-2xl leading-tight text-gradient-gold uppercase tracking-tight">
                {item.title}
              </h2>

              {/* price */}
              <div>
                {item.price != null ? (
                  <span className="font-display font-black text-4xl text-gradient-gold">
                    ${item.price}
                  </span>
                ) : (
                  <span className="text-white/30 font-mono text-lg">Price TBD</span>
                )}
              </div>

              <div className="h-px bg-white/8" />

              {/* metadata */}
              {metaRows.length > 0 && (
                <dl className="space-y-3">
                  {metaRows.map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <dt className="text-[11px] font-mono text-white/35 uppercase tracking-widest shrink-0">
                        {label}
                      </dt>
                      <dd className="text-[13px] font-mono text-white/80 text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="flex-1" />

              {/* CTA */}
              {!isSold && (
                <a
                  href="https://www.whatnot.com/user/dutchkicks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-display font-black text-sm uppercase tracking-widest px-6 py-3.5 rounded-xl bg-gold text-noir hover:bg-gold/90 active:scale-95 transition-all"
                >
                  Buy on Whatnot
                </a>
              )}

              <p className="text-[10px] text-white/20 font-mono text-center leading-relaxed">
                All sales are final · Ships within 3 business days
              </p>
            </div>

          </div>
        </div>
      </motion.div>

      {/* lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

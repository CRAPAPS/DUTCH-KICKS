import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/server';
import type { InventoryItem, FightItem } from '@/types/inventory';

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('inventory')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  const items = (data ?? []) as InventoryItem[];

  const stats = [
    { label: 'Sneakers',   count: items.filter(i => i.category === 'kicks').length,      accent: 'text-lime' },
    { label: 'UFC Cards',  count: items.filter(i => i.category === 'fight').length,      accent: 'text-gold' },
    { label: 'Baseball',   count: items.filter(i => i.category === 'baseball').length,   accent: 'text-gold' },
    { label: 'Basketball', count: items.filter(i => i.category === 'basketball').length, accent: 'text-orange' },
    { label: 'Watches',    count: items.filter(i => i.category === 'watches').length,    accent: 'text-white/70' },
    { label: 'Skate',      count: items.filter(i => i.category === 'skate').length,      accent: 'text-lime' },
  ];

  const tickerItems = items.map(i => i.title);

  const featured: InventoryItem[] = [
    ...items.filter((i): i is FightItem => i.category === 'fight' && i.metadata.autograph).slice(0, 2),
    ...items.filter(i => i.category === 'kicks').slice(0, 2),
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative scanlines min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* ── Fighter ghost background ── */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* fighter image — pulled up so text in original is off-frame */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-fighter.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
            style={{ objectPosition: 'center 28%', filter: 'sepia(0.3) saturate(0.6)' }}
          />
          {/* top mask — buries the source text */}
          <div className="absolute top-0 inset-x-0 h-[38%] bg-gradient-to-b from-noir to-transparent" />
          {/* bottom mask — buries the source text */}
          <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-noir to-transparent" />
          {/* left + right vignette */}
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-noir to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-noir to-transparent" />
          {/* warm gold wash to tie into brand */}
          <div className="absolute inset-0 bg-gold/[0.04]" />
        </div>

        {/* radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-lime/5 blur-3xl" />
        </div>

        {/* logo badge */}
        <div className="relative z-10 mb-8">
          <div className="relative w-36 h-36 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl scale-110" />
            <Image
              src="/logo.png"
              alt="The Dutch — Precision Heat"
              width={144}
              height={144}
              className="relative rounded-full ring-2 ring-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
              priority
            />
          </div>
        </div>

        <p className="font-display font-bold tracking-[0.4em] text-sm text-white/40 uppercase mb-6 z-10">
          Whatnot Live Commerce · Sneakers · UFC · Comics
        </p>

        <h1
          className="glitch font-display font-black text-[clamp(3rem,10vw,8rem)] leading-none uppercase tracking-tight z-10"
          data-text="DUTCH KICKS"
        >
          <span className="text-gradient-gold">DUTCH</span>{' '}
          <span className="text-gradient-lime">KICKS</span>
        </h1>

        <p className="font-display font-bold text-[clamp(1rem,3vw,1.75rem)] tracking-[0.3em] uppercase text-white/60 mt-4 z-10">
          The Drop Never Stops
        </p>

        {/* stat row */}
        <div className="flex flex-wrap gap-6 justify-center mt-12 z-10">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-xl px-6 py-4 text-center min-w-[100px]">
              <div className={`font-display font-black text-3xl ${s.accent}`}>{s.count}</div>
              <div className="text-white/40 text-xs tracking-widest uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-4 mt-10 z-10">
          <Link
            href="/inventory"
            className="font-display font-black tracking-widest text-sm uppercase bg-lime text-noir px-8 py-3 rounded-full glow-lime hover:scale-105 transition-transform"
          >
            Browse Inventory
          </Link>
          <a
            href="https://www.whatnot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-black tracking-widest text-sm uppercase glass border border-gold/40 text-gold px-8 py-3 rounded-full hover:scale-105 transition-all"
          >
            Watch Live
          </a>
        </div>
      </section>

      {/* ── Ticker ── */}
      {tickerItems.length > 0 && (
        <div className="overflow-hidden border-y border-white/5 bg-white/2 py-3">
          <div className="ticker-track flex gap-12 whitespace-nowrap text-white/30 text-xs font-mono tracking-widest uppercase">
            {[...tickerItems, ...tickerItems].map((name, i) => (
              <span key={i}>
                <span className="text-gold mr-3">◆</span>{name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Featured ── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display font-black text-3xl text-gradient-gold uppercase tracking-wide">
              Featured Drops
            </h2>
            <Link
              href="/inventory"
              className="text-sm font-mono text-white/40 hover:text-lime transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* ── Category cards ── */}
      {(() => {
        const cats = [
          { key: 'kicks',      emoji: '👟', label: 'Kicks',      unit: 'pairs',      glass: 'glass-lime',                    text: 'text-lime'     },
          { key: 'fight',      emoji: '🥊', label: 'UFC Cards',  unit: 'grails',     glass: 'glass-gold',                    text: 'text-gold'     },
          { key: 'baseball',   emoji: '⚾', label: 'Baseball',   unit: 'cards',      glass: 'glass-gold',                    text: 'text-gold'     },
          { key: 'basketball', emoji: '🏀', label: 'Basketball', unit: 'cards',      glass: 'glass border border-orange/30', text: 'text-orange'   },
          { key: 'watches',    emoji: '⌚', label: 'Watches',    unit: 'timepieces', glass: 'glass border border-white/15',  text: 'text-white/80' },
          { key: 'skate',      emoji: '🛹', label: 'Skate',      unit: 'drops',      glass: 'glass border border-lime/20',   text: 'text-lime'     },
        ] as const;

        return (
          <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {cats.map(({ key, emoji, label, unit, glass, text }) => {
              const count = items.filter(i => i.category === key).length;
              const href  = count > 0 ? `/inventory?category=${key}` : '/inventory';
              return (
                <Link key={key} href={href} className={`relative ${glass} rounded-2xl p-6 hover:opacity-90 transition-all overflow-hidden`}>
                  {count === 0 && (
                    <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest uppercase text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      Soon
                    </span>
                  )}
                  <div className="text-4xl mb-3">{emoji}</div>
                  <div className={`font-display font-black text-xl ${text} uppercase tracking-wide`}>{label}</div>
                  <div className="text-white/40 text-sm mt-1">
                    {count > 0 ? `${count} ${unit}` : 'Dropping soon'}
                  </div>
                </Link>
              );
            })}
          </section>
        );
      })()}
    </>
  );
}

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { MOCK_INVENTORY } from '@/lib/mock-inventory';

const STATS = [
  { label: 'Sneakers', count: MOCK_INVENTORY.filter(i => i.category === 'kicks').length, accent: 'text-lime' },
  { label: 'Skate',    count: MOCK_INVENTORY.filter(i => i.category === 'skate').length, accent: 'text-lime' },
  { label: 'UFC Cards', count: MOCK_INVENTORY.filter(i => i.category === 'fight').length, accent: 'text-gold' },
  { label: 'Comics',   count: MOCK_INVENTORY.filter(i => i.category === 'comics').length, accent: 'text-white/60' },
];

const TICKER_ITEMS = MOCK_INVENTORY.map(i => i.title);

const FEATURED = [
  ...MOCK_INVENTORY.filter(i => i.category === 'fight' && i.metadata.autograph).slice(0, 2),
  ...MOCK_INVENTORY.filter(i => i.category === 'kicks').slice(0, 2),
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative scanlines min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-lime/5 blur-3xl" />
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
          {STATS.map(s => (
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
      <div className="overflow-hidden border-y border-white/5 bg-white/2 py-3">
        <div className="ticker-track flex gap-12 whitespace-nowrap text-white/30 text-xs font-mono tracking-widest uppercase">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((name, i) => (
            <span key={i}>
              <span className="text-gold mr-3">◆</span>{name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured ── */}
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
          {FEATURED.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── Category cards ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/inventory?category=kicks" className="glass-lime rounded-2xl p-8 group hover:opacity-90 transition-all">
          <div className="text-5xl mb-4">👟</div>
          <div className="font-display font-black text-2xl text-lime uppercase tracking-wide">Kicks</div>
          <div className="text-white/40 text-sm mt-1">
            {MOCK_INVENTORY.filter(i => i.category === 'kicks').length} pairs dropping
          </div>
        </Link>

        <Link href="/inventory?category=fight" className="glass-gold rounded-2xl p-8 group hover:opacity-90 transition-all">
          <div className="text-5xl mb-4">🥊</div>
          <div className="font-display font-black text-2xl text-gold uppercase tracking-wide">Fight Cards</div>
          <div className="text-white/40 text-sm mt-1">
            {MOCK_INVENTORY.filter(i => i.category === 'fight').length} UFC grails
          </div>
        </Link>

        <Link href="/inventory?category=skate" className="glass rounded-2xl p-8 group hover:opacity-90 transition-all border border-lime/20">
          <div className="text-5xl mb-4">🛹</div>
          <div className="font-display font-black text-2xl text-lime uppercase tracking-wide">Skate</div>
          <div className="text-white/40 text-sm mt-1">
            {MOCK_INVENTORY.filter(i => i.category === 'skate').length} skate drops
          </div>
        </Link>
      </section>
    </>
  );
}

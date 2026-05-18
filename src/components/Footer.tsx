import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/8 bg-noir/80 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <Image
                src="/logo.png"
                alt="Dutch Kicks"
                width={36}
                height={36}
                className="rounded-full ring-1 ring-gold/30"
              />
              <span className="font-display font-black text-lg tracking-widest text-gradient-gold uppercase">
                Dutch Kicks
              </span>
            </Link>
            <p className="text-white/30 text-xs font-mono leading-relaxed max-w-[220px]">
              Live sneaker, card &amp; collector resale. Powered by Whatnot. The Drop Never Stops.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="font-display font-black text-xs tracking-widest text-white/40 uppercase mb-4">Shop</p>
            <nav className="flex flex-col gap-2.5 text-sm text-white/50 font-mono">
              <Link href="/inventory" className="hover:text-lime transition-colors">Inventory</Link>
              <Link href="/browse"    className="hover:text-lime transition-colors">Browse the Drop</Link>
              <a
                href="https://www.whatnot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Watch Live on Whatnot ↗
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="font-display font-black text-xs tracking-widest text-white/40 uppercase mb-4">Legal</p>
            <nav className="flex flex-col gap-2.5 text-sm text-white/50 font-mono">
              <Link href="/privacy"  className="hover:text-white/80 transition-colors">Privacy Policy</Link>
              <Link href="/terms"    className="hover:text-white/80 transition-colors">Terms &amp; Conditions</Link>
              <Link href="/returns"  className="hover:text-white/80 transition-colors">Returns Policy</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs font-mono">
            © {year} Dutch Kicks. All rights reserved.
          </p>
          <p className="text-white/15 text-xs font-mono">
            Sales conducted via Whatnot · Authenticity guaranteed
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function HUDHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 glass border-b border-white/10 flex items-center px-6 gap-4">
      <span className="font-display text-xl font-black tracking-widest text-gradient-gold uppercase">
        Dutch Kicks
      </span>

      <nav className="flex gap-6 ml-8 text-sm font-medium text-white/60">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <a href="/inventory" className="hover:text-white transition-colors">Inventory</a>
      </nav>

      <div className="ml-auto flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-lime">
        <span className="live-dot" />
        Live Now
      </div>
    </header>
  );
}

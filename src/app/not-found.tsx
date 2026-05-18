import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl scale-150" />
        <span className="relative text-[120px] leading-none select-none">👟</span>
      </div>

      <h1 className="font-display font-black text-[clamp(4rem,15vw,10rem)] leading-none text-gradient-gold uppercase tracking-tight">
        404
      </h1>

      <p className="font-display font-black text-2xl text-white/60 uppercase tracking-widest mt-2">
        That Drop Doesn&apos;t Exist
      </p>

      <p className="text-white/30 font-mono text-sm mt-4 max-w-sm">
        Looks like this page got swiped left. Head back and find something worth saving.
      </p>

      <div className="flex gap-4 mt-10">
        <Link
          href="/"
          className="font-display font-black tracking-widest text-sm uppercase bg-gold text-noir px-8 py-3 rounded-full hover:scale-105 transition-transform"
        >
          Back to Home
        </Link>
        <Link
          href="/browse"
          className="font-display font-black tracking-widest text-sm uppercase glass border border-lime/40 text-lime px-8 py-3 rounded-full hover:scale-105 transition-all glow-lime"
        >
          Browse Drops
        </Link>
      </div>
    </div>
  )
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0b] py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-white/80">
          josho<span className="text-violet-400">.pro</span>
        </div>
        <nav className="flex items-center gap-5 text-xs text-white/40">
          <Link href="/games" className="hover:text-white/70 transition-colors">Games</Link>
          <Link href="/wave" className="hover:text-white/70 transition-colors">Wavelength</Link>
          <Link href="/uptrend" className="hover:text-white/70 transition-colors">Uptrend</Link>
          <Link href="/premium" className="hover:text-white/70 transition-colors">Premium</Link>
        </nav>
        <div className="text-xs text-white/25">© 2026 Josh Osborne</div>
      </div>
    </footer>
  );
}

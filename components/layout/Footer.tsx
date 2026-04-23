import Link from "next/link";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={`border-t border-[var(--border)] mt-auto ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇱🇹</span>
            <span className="font-bold text-amber-400">LithuanianBD</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-gray-600 text-center">
            Made with ❤️ for the Bangladeshi community in Lithuania
            <br />
            <span className="font-bengali">বাংলাদেশি কমিউনিটির জন্য ভালোবাসার সাথে তৈরি</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-border bg-card/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <span className="text-accent font-bold text-xl">EarningsWatch</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="https://10am.pro" className="hover:text-white transition-colors">
              10am.pro
            </Link>
            <Link href="https://10ampro-hub.vercel.app/" className="hover:text-white transition-colors">
              Dashboards
            </Link>
            <Link
              href="https://twitter.com/holdmybirra"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @holdmybirra
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

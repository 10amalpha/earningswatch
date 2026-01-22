import { TrendingUp, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import EarningsCard from '@/components/EarningsCard';
import NextEarningsBanner from '@/components/NextEarningsBanner';
import StatsRow from '@/components/StatsRow';
import { getEarningsData, EarningsData } from '@/lib/finnhub';
import { getDaysUntil } from '@/lib/calendar';

// Revalidate data every 6 hours
export const revalidate = 21600;

export default async function Home() {
  const earnings = await getEarningsData();

  // Find next upcoming earnings (first with a future date)
  const nextEarnings = earnings.find((e) => {
    const days = getDaysUntil(e.date);
    return days !== null && days >= 0;
  });

  // Get last update time
  const lastUpdated = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <main className="min-h-screen bg-background text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">📅 Earnings Calendar</h1>
          <p className="text-gray-500 text-sm">
            Track earnings dates. Add to calendar with one click.
          </p>
          <p className="text-gray-600 text-xs mt-2 flex items-center justify-center gap-1">
            <RefreshCw size={10} />
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Next Earnings Banner */}
        <NextEarningsBanner stock={nextEarnings || null} />

        {/* Stats Row */}
        <StatsRow earnings={earnings} />

        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-accent" />
          <span className="text-accent font-semibold">Earnings Schedule</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {earnings.map((stock, index) => (
            <EarningsCard key={stock.ticker} stock={stock} index={index} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm border-t border-border pt-8">
          <p className="italic">
            "El algoritmo es el mapa, la ejecución disciplinada es el territorio."
          </p>
          <p className="mt-4">
            Part of the <span className="text-accent">10AMPRO</span> ecosystem
          </p>
        </div>
      </div>
    </main>
  );
}

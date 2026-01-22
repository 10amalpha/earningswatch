import { EarningsData } from '@/lib/finnhub';
import { formatDate, getDaysUntil } from '@/lib/calendar';

interface NextEarningsBannerProps {
  stock: EarningsData | null;
}

export default function NextEarningsBanner({ stock }: NextEarningsBannerProps) {
  if (!stock || !stock.date) {
    return null;
  }

  const daysUntil = getDaysUntil(stock.date);

  return (
    <div className="bg-card border border-accent-border rounded-lg mb-8 overflow-hidden animate-fade-in">
      <div className="border-l-4 border-accent p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Next Earnings
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">{stock.emoji}</span>
              <span className="text-white text-xl font-bold">{stock.ticker}</span>
              <span className="text-gray-400">{stock.name}</span>
            </div>
            {stock.quarter && (
              <div className="text-gray-500 text-sm mt-1">{stock.quarter}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-accent text-3xl font-bold font-mono">
              {daysUntil !== null ? `${daysUntil}d` : '—'}
            </div>
            <div className="text-gray-500 text-sm">{formatDate(stock.date)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

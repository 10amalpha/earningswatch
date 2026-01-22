import { EarningsData } from '@/lib/finnhub';
import { getDaysUntil } from '@/lib/calendar';

interface StatsRowProps {
  earnings: EarningsData[];
}

export default function StatsRow({ earnings }: StatsRowProps) {
  const thisWeekCount = earnings.filter((e) => {
    const days = getDaysUntil(e.date);
    return days !== null && days >= 0 && days <= 7;
  }).length;

  const totalTracked = earnings.length;

  // Determine current quarter
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  let quarter: string;
  if (month < 3) {
    quarter = `Q4 ${year - 1}`;
  } else if (month < 6) {
    quarter = `Q1 ${year}`;
  } else if (month < 9) {
    quarter = `Q2 ${year}`;
  } else {
    quarter = `Q3 ${year}`;
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-card border border-border rounded-lg p-4 animate-fade-in stagger-1">
        <div className="border-l-2 border-accent pl-3">
          <div className="text-gray-500 text-xs uppercase tracking-wider">This Week</div>
          <div className="text-accent text-2xl font-bold font-mono">{thisWeekCount}</div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 animate-fade-in stagger-2">
        <div className="border-l-2 border-secondary pl-3">
          <div className="text-gray-500 text-xs uppercase tracking-wider">Total Tracked</div>
          <div className="text-secondary text-2xl font-bold font-mono">{totalTracked}</div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 animate-fade-in stagger-3">
        <div className="border-l-2 border-purple-500 pl-3">
          <div className="text-gray-500 text-xs uppercase tracking-wider">{quarter}</div>
          <div className="text-purple-400 text-2xl font-bold">Season</div>
        </div>
      </div>
    </div>
  );
}

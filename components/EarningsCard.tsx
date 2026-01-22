'use client';

import { Calendar, Clock, ExternalLink, Apple } from 'lucide-react';
import { EarningsData } from '@/lib/finnhub';
import {
  generateGoogleCalendarUrl,
  generateAppleCalendarUrl,
  formatDate,
  getDaysUntil,
  getTimeLabel,
} from '@/lib/calendar';

interface EarningsCardProps {
  stock: EarningsData;
  index: number;
}

export default function EarningsCard({ stock, index }: EarningsCardProps) {
  const daysUntil = getDaysUntil(stock.date);
  const isUpcoming = daysUntil !== null && daysUntil <= 7 && daysUntil >= 0;
  const isPast = daysUntil !== null && daysUntil < 0;
  const hasDate = stock.date !== null;

  const getBorderColor = () => {
    if (!hasDate) return 'bg-gray-600';
    if (isPast) return 'bg-gray-600';
    if (isUpcoming) return 'bg-accent';
    return 'bg-secondary';
  };

  const getTimeStyles = () => {
    switch (stock.time) {
      case 'bmo':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'amc':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div
      className={`relative bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-border-hover opacity-0 animate-fade-in ${
        isPast ? 'opacity-40' : ''
      }`}
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
    >
      {/* Left accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getBorderColor()}`} />

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{stock.emoji}</span>
            <div>
              <span className="text-white font-bold text-base">{stock.ticker}</span>
              <span className="text-gray-500 text-sm ml-2">{stock.name}</span>
            </div>
          </div>

          {/* Status badge */}
          {hasDate && !isPast && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isUpcoming
                  ? 'bg-accent/20 text-accent'
                  : 'bg-secondary/20 text-secondary'
              }`}
            >
              {isUpcoming ? 'SOON' : 'UPCOMING'}
            </span>
          )}
          {isPast && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-700/50 text-gray-400">
              REPORTED
            </span>
          )}
          {!hasDate && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-700/50 text-gray-400">
              TBD
            </span>
          )}
        </div>

        {/* Days + Date row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`text-2xl font-bold font-mono ${
                !hasDate
                  ? 'text-gray-500'
                  : isPast
                  ? 'text-gray-500'
                  : isUpcoming
                  ? 'text-accent'
                  : 'text-white'
              }`}
            >
              {!hasDate ? '—' : isPast ? '—' : `${daysUntil}d`}
            </div>
            <div className="text-gray-500 text-sm">{formatDate(stock.date)}</div>
          </div>

          {hasDate && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getTimeStyles()}`}
            >
              <Clock size={10} />
              {getTimeLabel(stock.time)}
            </div>
          )}
        </div>

        {/* Quarter info */}
        {stock.quarter && (
          <div className="text-gray-500 text-xs mb-3">{stock.quarter}</div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <a
            href={generateGoogleCalendarUrl(stock)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-1.5 bg-button hover:bg-button-hover border border-button-border text-gray-300 text-xs font-medium py-2 px-2 rounded transition-all ${
              !hasDate ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <Calendar size={12} />
            Google
          </a>

          <a
            href={generateAppleCalendarUrl(stock)}
            download={`${stock.ticker}-earnings.ics`}
            className={`flex-1 flex items-center justify-center gap-1.5 bg-button hover:bg-button-hover border border-button-border text-gray-300 text-xs font-medium py-2 px-2 rounded transition-all ${
              !hasDate ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <Apple size={12} />
            Apple
          </a>

          <a
            href={stock.ir}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-accent-dim hover:bg-accent/20 border border-accent-border text-accent text-xs font-medium py-2 px-3 rounded transition-all"
          >
            IR
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
}

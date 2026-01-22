import { EarningsData } from './finnhub';

// Generate Google Calendar URL
export function generateGoogleCalendarUrl(stock: EarningsData): string {
  if (!stock.date) return '#';

  const date = new Date(stock.date);
  const startTime = stock.time === 'bmo' ? '08:00:00' : '16:30:00';
  const endTime = stock.time === 'bmo' ? '09:00:00' : '17:30:00';

  const formatGoogleDate = (d: Date, time: string): string => {
    const [h, m, s] = time.split(':').map(Number);
    d.setHours(h, m, s);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatGoogleDate(new Date(date), startTime);
  const end = formatGoogleDate(new Date(date), endTime);

  const title = encodeURIComponent(`${stock.ticker} Earnings Report`);
  const details = encodeURIComponent(
    `${stock.name} ${stock.quarter || ''} Earnings Call\n\nInvestor Relations: ${stock.ir}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
}

// Generate Apple Calendar (ICS) data URL
export function generateAppleCalendarUrl(stock: EarningsData): string {
  if (!stock.date) return '#';

  const date = new Date(stock.date);
  const startTime = stock.time === 'bmo' ? 'T080000' : 'T163000';
  const endTime = stock.time === 'bmo' ? 'T090000' : 'T173000';
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${dateStr}${startTime}
DTEND:${dateStr}${endTime}
SUMMARY:${stock.ticker} Earnings Report
DESCRIPTION:${stock.name} Earnings Call\\nIR: ${stock.ir}
END:VEVENT
END:VCALENDAR`;

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

// Format date for display
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Get days until earnings
export function getDaysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const earnings = new Date(dateStr);
  earnings.setHours(0, 0, 0, 0);
  const diff = Math.ceil((earnings.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

// Get time label
export function getTimeLabel(time: string | null): string {
  switch (time) {
    case 'bmo':
      return 'Pre-Market';
    case 'amc':
      return 'After Hours';
    case 'dmh':
      return 'During Market';
    default:
      return 'TBD';
  }
}

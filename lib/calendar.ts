import { EarningsData } from './finnhub';

// Parse date string (YYYY-MM-DD) as local date to avoid timezone issues
// When parsing "2026-02-02" with new Date(), JavaScript interprets it as UTC midnight,
// which shifts to the previous day in western timezones. This helper fixes that.
function parseLocalDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
}

// Generate Google Calendar URL
export function generateGoogleCalendarUrl(stock: EarningsData): string {
    if (!stock.date) return '#';

  const date = parseLocalDate(stock.date);
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

// Generate Apple Calendar (ICS) URL
export function generateAppleCalendarUrl(stock: EarningsData): string {
    if (!stock.date) return '#';

  const date = parseLocalDate(stock.date);
    const startTime = stock.time === 'bmo' ? '08:00:00' : '16:30:00';
    const endTime = stock.time === 'bmo' ? '09:00:00' : '17:30:00';

  const formatICSDate = (d: Date, time: string): string => {
        const [h, m, s] = time.split(':').map(Number);
        d.setHours(h, m, s);
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatICSDate(new Date(date), startTime);
    const end = formatICSDate(new Date(date), endTime);

  const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  DTSTART:${start}
  DTEND:${end}
  SUMMARY:${stock.ticker} Earnings Report
  DESCRIPTION:${stock.name} ${stock.quarter || ''} Earnings Call\\n\\nInvestor Relations: ${stock.ir}
  END:VEVENT
  END:VCALENDAR`;

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

// Format date for display
export function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'TBD';
    const date = parseLocalDate(dateStr);
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
    const earnings = parseLocalDate(dateStr);
    earnings.setHours(0, 0, 0, 0);
    const diff = Math.ceil((earnings.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
}

// Get time label
export function getTimeLabel(time: string | null): string {
    switch (time) {
      case 'bmo':
              return 'Before Open';
      case 'amc':
              return 'After Close';
      case 'dmh':
              return 'During Hours';
      default:
              return 'Time TBD';
    }
}

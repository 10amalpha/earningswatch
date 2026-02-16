import { EarningsData } from './finnhub';

// Parse date string (YYYY-MM-DD) as local date to avoid timezone issues
// When parsing "2026-02-02" with new Date(), JavaScript interprets it as UTC midnight,
// which shifts to the previous day in western timezones. This helper fixes that.
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

// Convert EST time to UTC for calendar entries
// EST = UTC-5, EDT = UTC-4
// For simplicity we use America/New_York which handles DST automatically
function estToUtcHours(estHour: number, estMinute: number, date: Date): { hour: number; minute: number } {
  // Check if date is in EDT (March second Sunday to November first Sunday)
  const year = date.getFullYear();
  // Second Sunday in March
  const marchFirst = new Date(year, 2, 1);
  const dstStart = new Date(year, 2, 8 + (7 - marchFirst.getDay()) % 7);
  // First Sunday in November
  const novFirst = new Date(year, 10, 1);
  const dstEnd = new Date(year, 10, 1 + (7 - novFirst.getDay()) % 7);

  const isDST = date >= dstStart && date < dstEnd;
  const offset = isDST ? 4 : 5; // EDT = UTC-4, EST = UTC-5

  return {
    hour: estHour + offset,
    minute: estMinute,
  };
}

// Generate Google Calendar URL with proper EST/ET times
export function generateGoogleCalendarUrl(stock: EarningsData): string {
  if (!stock.date) return '#';

  const date = parseLocalDate(stock.date);

  // Earnings call times in ET (Eastern Time)
  // BMO = 8:00 AM ET, AMC = 4:30 PM ET (most calls are 4:30-5:30 PM ET)
  const estStartHour = stock.time === 'bmo' ? 8 : 16;
  const estStartMin = stock.time === 'bmo' ? 0 : 30;
  const estEndHour = stock.time === 'bmo' ? 9 : 17;
  const estEndMin = stock.time === 'bmo' ? 0 : 30;

  const utcStart = estToUtcHours(estStartHour, estStartMin, date);
  const utcEnd = estToUtcHours(estEndHour, estEndMin, date);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

  const start = `${ymd}T${pad(utcStart.hour)}${pad(utcStart.minute)}00Z`;
  const end = `${ymd}T${pad(utcEnd.hour)}${pad(utcEnd.minute)}00Z`;

  const title = encodeURIComponent(`${stock.ticker} Earnings Report`);
  const details = encodeURIComponent(
    `${stock.name} ${stock.quarter || ''} Earnings Call\n\nInvestor Relations: ${stock.ir}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
}

// Generate Apple Calendar (ICS) URL with proper EST/ET times
export function generateAppleCalendarUrl(stock: EarningsData): string {
  if (!stock.date) return '#';

  const date = parseLocalDate(stock.date);

  const estStartHour = stock.time === 'bmo' ? 8 : 16;
  const estStartMin = stock.time === 'bmo' ? 0 : 30;
  const estEndHour = stock.time === 'bmo' ? 9 : 17;
  const estEndMin = stock.time === 'bmo' ? 0 : 30;

  const utcStart = estToUtcHours(estStartHour, estStartMin, date);
  const utcEnd = estToUtcHours(estEndHour, estEndMin, date);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

  const start = `${ymd}T${pad(utcStart.hour)}${pad(utcStart.minute)}00Z`;
  const end = `${ymd}T${pad(utcEnd.hour)}${pad(utcEnd.minute)}00Z`;

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

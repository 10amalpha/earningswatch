import { WATCHLIST } from './watchlist';

// Manual date overrides — verified Feb 16, 2026
// CONFIRMED = company press release or IR page
// TBD = not yet announced by company, date is null so UI shows "TBD"
//
// ┌─────────┬────────────┬──────────┬──────────────────────────────────────────────┐
// │ Ticker  │ Date       │ Quarter  │ Source / Notes                               │
// ├─────────┼────────────┼──────────┼──────────────────────────────────────────────┤
// │ MSTR    │ TBD        │ Q1 2026  │ Q4 2025 REPORTED Feb 5. Next ~Apr 30/May 7   │
// │ STKE    │ 2026-02-18 │ Q1 2026  │ CONFIRMED. Results Feb 17, Call Feb 18 4:30ET │
// │ HIMS    │ 2026-02-23 │ Q4 2025  │ CONFIRMED. investors.hims.com, call 5pm ET    │
// │ NVDA    │ 2026-02-25 │ Q4 2026  │ CONFIRMED. investor.nvidia.com, call 5pm ET   │
// │ MP      │ 2026-02-26 │ Q4 2025  │ CONFIRMED. BusinessWire, call 5pm ET          │
// │ DUOL    │ 2026-02-26 │ Q4 2025  │ CONFIRMED. GlobeNewswire, webcast 5:30pm ET   │
// │ QSI     │ 2026-03-03 │ Q4 2025  │ CONFIRMED. BusinessWire, call 4:30pm ET       │
// │ OKLO    │ TBD        │ Q4 2025  │ NOT CONFIRMED. ~Mar 30 estimated              │
// │ TSLA    │ TBD        │ Q1 2026  │ NOT CONFIRMED. ~Apr 21-28 estimated           │
// │ HOOD    │ TBD        │ Q1 2026  │ NOT CONFIRMED. ~Apr 29/May 13 estimated       │
// │ BE      │ TBD        │ Q1 2026  │ NOT CONFIRMED. ~May 6 estimated               │
// │ PLTR    │ TBD        │ Q1 2026  │ NOT CONFIRMED. ~May 4-11 estimated            │
// │ AMD     │ TBD        │ Q1 2026  │ NOT CONFIRMED. ~Apr 28/May 5 estimated        │
// └─────────┴────────────┴──────────┴──────────────────────────────────────────────┘

const DATE_OVERRIDES: Record<string, { date: string | null; time: 'bmo' | 'amc' | 'dmh' | null; quarter: string }> = {
  // === REPORTED — show next session as TBD ===
  'MSTR': { date: null, time: null, quarter: 'Q1 2026' },
  // === CONFIRMED dates ===
  'STKE': { date: '2026-02-18', time: 'amc', quarter: 'Q1 2026' },  // Results Feb 17, Call Feb 18 4:30pm ET
  'HIMS': { date: '2026-02-23', time: 'amc', quarter: 'Q4 2025' },
  'NVDA': { date: '2026-02-25', time: 'amc', quarter: 'Q4 2026' },
  'MP':   { date: '2026-02-26', time: 'amc', quarter: 'Q4 2025' },
  'DUOL': { date: '2026-02-26', time: 'amc', quarter: 'Q4 2025' },
  'QSI':  { date: '2026-03-03', time: 'amc', quarter: 'Q4 2025' },
  // === NOT CONFIRMED — show TBD ===
  'OKLO': { date: null, time: null, quarter: 'Q4 2025' },
  'TSLA': { date: null, time: null, quarter: 'Q1 2026' },
  'HOOD': { date: null, time: null, quarter: 'Q1 2026' },
  'BE':   { date: null, time: null, quarter: 'Q1 2026' },
  'PLTR': { date: null, time: null, quarter: 'Q1 2026' },
  'AMD':  { date: null, time: null, quarter: 'Q1 2026' },
};

export interface EarningsData {
  ticker: string;
  name: string;
  ir: string;
  emoji: string;
  date: string | null;
  time: 'bmo' | 'amc' | 'dmh' | null;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
  quarter: string | null;
}

interface FinnhubEarning {
  date: string;
  epsActual: number | null;
  epsEstimate: number | null;
  hour: string;
  quarter: number;
  revenueActual: number | null;
  revenueEstimate: number | null;
  symbol: string;
  year: number;
}

// Fetch earnings for a single ticker from Finnhub
async function fetchTickerEarnings(ticker: string, apiKey: string): Promise<FinnhubEarning[]> {
  const today = new Date();
  const from = today.toISOString().split('T')[0];
  const to = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const url = `https://finnhub.io/api/v1/calendar/earnings?symbol=${ticker}&from=${from}&to=${to}&token=${apiKey}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 21600 }, // Cache for 6 hours
    });

    if (!response.ok) {
      console.error(`Finnhub error for ${ticker}:`, response.status);
      return [];
    }

    const data = await response.json();
    return data.earningsCalendar || [];
  } catch (error) {
    console.error(`Error fetching earnings for ${ticker}:`, error);
    return [];
  }
}

// Get all earnings data for watchlist
export async function getEarningsData(): Promise<EarningsData[]> {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    console.warn('FINNHUB_API_KEY not set, using fallback data');
    return getFallbackData();
  }

  const results: EarningsData[] = [];

  for (const item of WATCHLIST) {
    const override = DATE_OVERRIDES[item.ticker];
    const earnings = await fetchTickerEarnings(item.ticker, apiKey);

    const sortedEarnings = [...earnings].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const nextEarning = sortedEarnings.find((e) => new Date(e.date) >= new Date());

    // If we have an override, it takes full priority (including null dates for TBD)
    if (override) {
      results.push({
        ticker: item.ticker,
        name: item.name,
        ir: item.ir,
        emoji: item.emoji,
        date: override.date,
        time: override.time,
        epsEstimate: nextEarning?.epsEstimate || null,
        epsActual: nextEarning?.epsActual || null,
        revenueEstimate: nextEarning?.revenueEstimate || null,
        revenueActual: nextEarning?.revenueActual || null,
        quarter: override.quarter,
      });
    } else {
      // No override — use Finnhub data as-is
      results.push({
        ticker: item.ticker,
        name: item.name,
        ir: item.ir,
        emoji: item.emoji,
        date: nextEarning?.date || null,
        time: (nextEarning?.hour as 'bmo' | 'amc' | 'dmh') || null,
        epsEstimate: nextEarning?.epsEstimate || null,
        epsActual: nextEarning?.epsActual || null,
        revenueEstimate: nextEarning?.revenueEstimate || null,
        revenueActual: nextEarning?.revenueActual || null,
        quarter: nextEarning ? `Q${nextEarning.quarter} ${nextEarning.year}` : null,
      });
    }
  }

  // Sort by date (soonest first), nulls at end
  return results.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

// Fallback data when API key is not configured
function getFallbackData(): EarningsData[] {
  return WATCHLIST.map((item) => ({
    ticker: item.ticker,
    name: item.name,
    ir: item.ir,
    emoji: item.emoji,
    date: DATE_OVERRIDES[item.ticker]?.date || null,
    time: DATE_OVERRIDES[item.ticker]?.time || null,
    epsEstimate: null,
    epsActual: null,
    revenueEstimate: null,
    revenueActual: null,
    quarter: DATE_OVERRIDES[item.ticker]?.quarter || null,
  }));
}

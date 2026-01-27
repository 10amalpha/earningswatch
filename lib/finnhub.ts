import { WATCHLIST } from './watchlist';

export interface EarningsData {
  ticker: string;
  name: string;
  ir: string;
  emoji: string;
  date: string | null;
  time: 'bmo' | 'amc' | 'dmh' | null; // before market open, after market close, during market hours
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
  hour: string; // 'bmo', 'amc', 'dmh'
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
  
  // Look 90 days ahead
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

  // Fetch earnings for each ticker in watchlist
  for (const item of WATCHLIST) {
    const earnings = await fetchTickerEarnings(item.ticker, apiKey);

    // Find the next upcoming earnings (first future date)
    // Sort earnings by date (ascending) and find the first future date
        const sortedEarnings = [...earnings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const nextEarning = sortedEarnings.find((e) => new Date(e.date) >= new Date());
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
    date: null,
    time: null,
    epsEstimate: null,
    epsActual: null,
    revenueEstimate: null,
    revenueActual: null,
    quarter: null,
  }));
}

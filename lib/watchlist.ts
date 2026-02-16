// Watchlist configuration - tickers to track
export const WATCHLIST = [
  { ticker: 'PLTR', name: 'Palantir', ir: 'https://investors.palantir.com', emoji: '🚀' },
  { ticker: 'HOOD', name: 'Robinhood', ir: 'https://investors.robinhood.com', emoji: '⚡' },
  { ticker: 'TSLA', name: 'Tesla', ir: 'https://ir.tesla.com', emoji: '🎯' },
  { ticker: 'STKE', name: 'Sol Strategies', ir: 'https://solstrategies.io/investors', emoji: '☀️' },
  { ticker: 'QSI', name: 'Quantum-Si', ir: 'https://investors.quantum-si.com', emoji: '🔬' },
  { ticker: 'MP', name: 'MP Materials', ir: 'https://investors.mpmaterials.com', emoji: '⛏️' },
  { ticker: 'HIMS', name: 'Hims & Hers', ir: 'https://investors.forhims.com', emoji: '💊' },
  { ticker: 'OKLO', name: 'Oklo', ir: 'https://investors.oklo.com', emoji: '⚛️' },
  { ticker: 'AMD', name: 'AMD', ir: 'https://ir.amd.com', emoji: '🔺' },
  { ticker: 'NVDA', name: 'NVIDIA', ir: 'https://investor.nvidia.com', emoji: '💚' },
  { ticker: 'DUOL', name: 'Duolingo', ir: 'https://investors.duolingo.com', emoji: '🦉' },
  { ticker: 'MSTR', name: 'Strategy', ir: 'https://www.strategy.com/investor-relations', emoji: '₿' },
  { ticker: 'BE', name: 'Bloom Energy', ir: 'https://investor.bloomenergy.com', emoji: '🔋' },
] as const;

export type WatchlistItem = typeof WATCHLIST[number];

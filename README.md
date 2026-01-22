# 📅 EarningsWatch

Track earnings dates for your watchlist. Add to calendar with one click.

Part of the **10AMPRO** ecosystem.

## Features

- 📅 Live earnings dates from Finnhub API
- 🔔 Countdown to next earnings
- 📱 One-click add to Google Calendar or Apple Calendar
- 🔗 Direct links to Investor Relations pages
- 🎨 10AMPRO design system (dark theme)
- ⚡ Server-side caching (refreshes every 6 hours)

## Watchlist

Currently tracking:
- PLTR, HOOD, TSLA, STKE, QSI, MP, HIMS, OKLO, AMD, NVDA, DUOL, MSTR, BE

Edit `lib/watchlist.ts` to customize your tickers.

## Setup

### 1. Get Finnhub API Key (Free)

1. Go to [finnhub.io/register](https://finnhub.io/register)
2. Sign up for free account
3. Copy your API key from the dashboard

### 2. Local Development

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your API key to .env.local
FINNHUB_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable:
   - Name: `FINNHUB_API_KEY`
   - Value: Your Finnhub API key
4. Deploy!

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Finnhub API
- Vercel (hosting)

## Customization

### Add/Remove Tickers

Edit `lib/watchlist.ts`:

```typescript
export const WATCHLIST = [
  { ticker: 'AAPL', name: 'Apple', ir: 'https://investor.apple.com', emoji: '🍎' },
  // Add more tickers...
];
```

### Change Refresh Interval

In `app/page.tsx`, adjust the revalidation time:

```typescript
export const revalidate = 21600; // 6 hours in seconds
```

## License

MIT - Built for the 10AMPRO community

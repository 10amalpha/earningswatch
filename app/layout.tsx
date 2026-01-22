import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EarningsWatch | 10AMPRO',
  description: 'Track earnings dates for your watchlist. Add to calendar with one click.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen">{children}</body>
    </html>
  )
}

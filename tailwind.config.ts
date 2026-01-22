import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 10AMPRO Design System
        background: '#0a0c10',
        card: '#0d1117',
        border: '#1e2530',
        'border-hover': '#2d3748',
        accent: '#22c55e',
        'accent-dim': 'rgba(34, 197, 94, 0.1)',
        'accent-border': 'rgba(34, 197, 94, 0.3)',
        secondary: '#3b82f6',
        'secondary-dim': 'rgba(59, 130, 246, 0.1)',
        button: '#161b22',
        'button-hover': '#1c2128',
        'button-border': '#2d333b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

/**
 * Market AI Tracker — the featured project.
 * Features and stack verified against the real repository README:
 * github.com/RAGULG19/Market-AI-Tracker
 */

export interface Candle {
  /** x position in the SVG viewBox */
  x: number
  high: number
  low: number
  open: number
  close: number
}

export interface ProjectExplainer {
  question: string
  answer: string
}

export const marketTracker = {
  index: '001',
  title: 'MARKET AI TRACKER',
  subtitle: 'AI-Powered Stock Market Analytics',

  description:
    'An AI-powered stock market analytics platform that combines technical indicators and machine learning-based trend forecasting to help users explore historical market patterns. Built with React.js, Flask, Python, yFinance, and scikit-learn, the platform presents market indicators and forecast visualizations in an interactive dashboard.',

  links: {
    demo: 'https://market-ai-tracker.vercel.app',
    github: 'https://github.com/RAGULG19/Market-AI-Tracker',
    backend: 'https://market-ai-tracker.onrender.com',
  },

  tech: [
    'React.js',
    'Flask',
    'scikit-learn',
    'yFinance',
    'LinearRegression',
  ],

  features: [
    'Candlestick chart with SMA20 & SMA50 overlays',
    'AI prediction line with confidence levels',
    'Buy/Sell signals with alerts',
    'RSI-based momentum analysis',
    'SMA20 & SMA50 crossover detection',
    'Historical market trend visualization',
    '14-day forecast',
    'Responsive modern dashboard UI',
  ],

  stats: [
    { label: 'RSI', value: 'DEMO', hint: 'Illustrative' },
    { label: 'SMA 20', value: 'DEMO', hint: 'Illustrative' },
    { label: 'SMA 50', value: 'DEMO', hint: 'Illustrative' },
    { label: 'FORECAST', value: '7–30D', hint: 'Adjustable' },
  ],

  disclaimer:
    'Forecast values are statistical estimates from historical data — not financial advice.',

  /** Illustrative candlestick geometry for the product preview (SVG coords). */
  candles: [
    { x: 30, high: 170, low: 138, open: 162, close: 146 },
    { x: 64, high: 176, low: 146, open: 150, close: 168 },
    { x: 98, high: 158, low: 126, open: 154, close: 132 },
    { x: 132, high: 150, low: 118, open: 136, close: 124 },
    { x: 166, high: 154, low: 124, open: 128, close: 146 },
    { x: 200, high: 142, low: 110, open: 140, close: 118 },
    { x: 234, high: 134, low: 100, open: 120, close: 108 },
    { x: 268, high: 140, low: 108, open: 110, close: 130 },
    { x: 302, high: 128, low: 94, open: 126, close: 102 },
    { x: 336, high: 120, low: 88, open: 104, close: 94 },
    { x: 370, high: 124, low: 92, open: 96, close: 114 },
    { x: 404, high: 112, low: 80, open: 110, close: 86 },
    { x: 438, high: 104, low: 72, open: 88, close: 78 },
    { x: 472, high: 110, low: 78, open: 80, close: 98 },
  ] satisfies Candle[],

  sma20Points:
    '30,154 64,152 98,142 132,138 166,140 200,130 234,124 268,122 302,116 336,112 370,110 404,104 438,100 472,96',

  sma50Points:
    '30,158 64,156 98,150 132,146 166,144 200,138 234,134 268,130 302,126 336,120 370,116 404,112 438,108 472,104',

  forecastPoints: '472,98 492,88 512,76',

  forecastBand: '472,104 492,98 512,92 512,60 492,78 472,92',

  /** "ASK AI ABOUT THIS PROJECT" — answered locally from confirmed info. */
  explainer: [
    {
      question: 'What problem does it solve?',
      answer:
        'Market AI Tracker brings scattered stock-market analysis into one place. It combines live market data (via yfinance), technical indicators — RSI, SMA20, SMA50 — candlestick visualization and machine learning trend forecasting with confidence scores into a single dashboard, instead of switching between separate charting and analysis tools.',
    },
    {
      question: 'What technologies are used?',
      answer:
        'Frontend: React.js with Chart.js and ApexCharts for visualization. Backend: Flask (Python) using yfinance for market data and scikit-learn (Linear Regression) for trend forecasting. The frontend is deployed on Vercel and the API on Render.',
    },
    {
      question: 'How does forecasting work?',
      answer:
        'The Flask backend pulls historical market data through yfinance, computes technical indicators (RSI, SMA20, SMA50), and a scikit-learn Linear Regression model estimates the trend from that history. The dashboard renders the prediction line with a confidence score plus a 14-day forecast. Forecasts are statistical estimates from historical data — not financial advice.',
    },
    {
      question: 'What are the main features?',
      answer:
        '• Candlestick chart with SMA20 & SMA50 overlays\n• AI prediction line with confidence levels\n• Buy/Sell signals with alerts\n• RSI-based momentum analysis\n• SMA20 & SMA50 crossover detection\n• Historical market trend visualization\n• 14-day forecast\n• Responsive modern dashboard UI',
    },
  ] satisfies ProjectExplainer[],
} as const

export const parentConnect = {
  index: '002',
  title: 'ParentConnect AI',
  category: 'AI & Generative Applications',
  status: 'In Development — concept prototype, not yet deployed',
  description:
    'AI-powered parent-school communication platform concept featuring an AI chatbot assistant, smart notifications, role-based dashboards and student management. Currently in development — features shown are the planned scope of the working prototype.',
  tech: ['FastAPI', 'React.js', 'Firebase', 'Gemini API', 'Python'],
  features: [
    'Real-time AI Assistant for school queries',
    'Automated parent updates',
    'Dynamic dashboard',
  ],
  links: {
    github: null,
    demo: null,
  },
} as const

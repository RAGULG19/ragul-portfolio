import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const HISTORY = [62, 66, 63, 70, 67, 73, 70, 76, 72, 78, 75, 81, 77, 84, 80, 87, 82, 89, 86, 92, 88, 95, 91, 98, 93, 100, 96, 103, 99, 106, 102, 109, 105, 112, 108, 115, 111, 118, 114, 121, 117, 124]

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { display: false } },
    y: { min: 50, max: 140, grid: { color: 'rgba(148,170,195,.11)', tickLength: 0 }, border: { display: false }, ticks: { color: 'rgba(139,154,171,.7)', count: 4, font: { size: 9 }, padding: 8 } },
  },
}

interface ForecastPoint { value: number; spread: number }

export function InteractiveForecastChart() {
  const [confidence, setConfidence] = useState(72)
  const [days, setDays] = useState(14)

  const data = useMemo<ChartData<'line', (number | null)[], string>>(() => {
    const lastValue = HISTORY[HISTORY.length - 1]
    const dailyDrift = (lastValue - HISTORY[HISTORY.length - 8]) / 7
    const points: ForecastPoint[] = Array.from({ length: days }, (_, index) => {
      const progress = index + 1
      return {
        value: lastValue + dailyDrift * progress + Math.sin(progress * 0.8) * 2.1,
        spread: ((100 - confidence) * 0.15 + 2.5) * Math.sqrt(progress / days),
      }
    })
    const labels = [...HISTORY.map((_, index) => `H-${HISTORY.length - index}`), ...points.map((_, index) => `D+${index + 1}`)]
    const movingAverage = (period: number) => [...HISTORY.map((_, index) => {
      const window = HISTORY.slice(Math.max(0, index - period + 1), index + 1)
      return Number((window.reduce((sum, value) => sum + value, 0) / window.length).toFixed(2))
    }), ...Array<number | null>(days).fill(null)]
    const forecastBand = (edge: 'upper' | 'lower') => [
      ...Array<number | null>(HISTORY.length - 1).fill(null),
      lastValue,
      ...points.map(({ value, spread }) => Number((value + (edge === 'upper' ? spread : -spread)).toFixed(2))),
    ]
    const forecastLine = [
      ...Array<number | null>(HISTORY.length - 1).fill(null),
      lastValue,
      ...points.map(({ value }) => Number(value.toFixed(2))),
    ]

    return {
      labels,
      datasets: [
        { label: 'Confidence upper', data: forecastBand('upper'), borderColor: 'transparent', pointRadius: 0, borderWidth: 0, fill: false, tension: 0.3 },
        { label: 'Confidence range', data: forecastBand('lower'), borderColor: 'transparent', pointRadius: 0, borderWidth: 0, backgroundColor: 'rgba(138,43,226,.18)', fill: '-1', tension: 0.3 },
        { label: 'SMA 50', data: movingAverage(50), borderColor: '#7ea8ff', pointRadius: 0, borderWidth: 1.8, borderDash: [5, 4], tension: 0.32 },
        { label: 'SMA 20', data: movingAverage(20), borderColor: '#00f0ff', pointRadius: 0, borderWidth: 2, tension: 0.32 },
        { label: 'Historical trend', data: [...HISTORY, ...Array<number | null>(days).fill(null)], borderColor: 'rgba(238,243,249,.62)', pointRadius: 0, borderWidth: 1.4, tension: 0.22 },
        { label: 'Forecast', data: forecastLine, borderColor: '#8a2be2', pointRadius: 0, borderWidth: 2.4, borderDash: [6, 4], tension: 0.32 },
      ],
    }
  }, [confidence, days])

  const rsi = Math.round(48 + confidence * 0.12 + Math.sin(days) * 4)

  return (
    <div className="interactive-forecast">
      <div className="forecast-chart-head">
        <div><span>SIMULATED TREND MODEL</span><strong>Forecast horizon · {days} days</strong></div>
        <span className="forecast-rsi"><small>RSI</small>{rsi}</span>
      </div>
      <motion.div className="interactive-forecast-chart" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} role="img" aria-label={`Illustrative trend chart with SMA20, SMA50, and a ${days}-day forecast at ${confidence}% confidence`}>
        <Line data={data} options={chartOptions} aria-hidden="true" />
      </motion.div>
      <div className="chart-legend" aria-hidden="true">
        <span className="legend-item">PRICE</span><span className="legend-item legend-sma20">SMA 20</span><span className="legend-item legend-sma50">SMA 50</span><span className="legend-item legend-forecast">FORECAST</span>
      </div>
      <div className="forecast-controls">
        <label htmlFor="forecast-confidence">Confidence level <output htmlFor="forecast-confidence">{confidence}%</output></label>
        <input id="forecast-confidence" type="range" min="50" max="95" step="1" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} />
        <label htmlFor="forecast-days">Prediction days <output htmlFor="forecast-days">{days} days</output></label>
        <input id="forecast-days" type="range" min="7" max="30" step="1" value={days} onChange={(event) => setDays(Number(event.target.value))} />
      </div>
      <p className="forecast-note">Illustrative simulation for portfolio interaction; values are not live market data.</p>
    </div>
  )
}

import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const ForecastChart = lazy(() => import('./InteractiveForecastChart').then((module) => ({ default: module.InteractiveForecastChart })))

export function ForecastChartLoader() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '220px 0px' })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="forecast-chart-loader">
      {nearViewport ? <Suspense fallback={<div className="forecast-loading" aria-label="Loading interactive chart" />}>
        <ForecastChart />
      </Suspense> : <div className="forecast-loading" aria-hidden="true" />}
    </div>
  )
}

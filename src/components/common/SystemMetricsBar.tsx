import { motion } from 'framer-motion'
import { Activity, ChartNoAxesCombined, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'

import { marketTracker } from '../../data/projects'
import { profile } from '../../data/profile'

import './SystemMetricsBar.css'

type BackendStatus = 'checking' | 'operational' | 'unverified'

export function SystemMetricsBar() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking')

  useEffect(() => {
    let disposed = false
    let pollId = 0

    const checkBackend = async () => {
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), 7000)
      try {
        const response = await fetch(marketTracker.links.backend, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!disposed) setBackendStatus(response.ok ? 'operational' : 'unverified')
      } catch {
        if (!disposed) setBackendStatus('unverified')
      } finally {
        window.clearTimeout(timeoutId)
      }
    }

    void checkBackend()
    pollId = window.setInterval(() => void checkBackend(), 60_000)
    return () => {
      disposed = true
      window.clearInterval(pollId)
    }
  }, [])

  const backendLabel = backendStatus === 'operational'
    ? 'Operational'
    : backendStatus === 'checking'
      ? 'Checking'
      : 'Offline / unreachable'

  return (
    <motion.aside
      className="system-metrics-bar"
      aria-label="Live portfolio and project status"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`system-metric backend-${backendStatus}`} aria-live="polite">
        <motion.span className="system-status-dot" animate={backendStatus === 'operational' ? { opacity: [0.58, 1, 0.58], scale: [0.86, 1, 0.86] } : { opacity: 1, scale: 1 }} transition={{ duration: 1.8, repeat: backendStatus === 'operational' ? Infinity : 0 }} aria-hidden="true" />
        <Activity size={14} aria-hidden="true" />
        <span>Flask Backend: <strong>{backendLabel}</strong></span>
      </div>
      <a className="system-metric" href={marketTracker.links.demo} target="_blank" rel="noreferrer">
        <ChartNoAxesCombined size={14} aria-hidden="true" />
        <span>Live Project: <strong>Market AI Tracker Active</strong></span>
      </a>
      <div className="system-metric">
        <GraduationCap size={15} aria-hidden="true" />
        <span>CGPA: <strong>{profile.cgpa}</strong><i aria-hidden="true">|</i>Batch: <strong>{profile.batch}</strong></span>
      </div>
    </motion.aside>
  )
}

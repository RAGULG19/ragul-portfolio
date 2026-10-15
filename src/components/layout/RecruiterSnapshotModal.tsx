import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Download, X, Zap } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { profile } from '../../data/profile'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'

import './RecruiterSnapshotModal.css'

interface RecruiterSnapshotModalProps {
  open: boolean
  onClose: () => void
}

export function RecruiterSnapshotModal({ open, onClose }: RecruiterSnapshotModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return <AnimatePresence>
    {open ? <div className="snapshot-backdrop" role="presentation" onClick={onClose}>
      <motion.aside className="snapshot-drawer" role="dialog" aria-modal="true" aria-labelledby="snapshot-title" onClick={(event) => event.stopPropagation()}
        initial={{ x: '100%', opacity: 0.7 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0.7 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
        <div className="snapshot-topline"><span><Zap size={14} /> RECRUITER SNAPSHOT · 15 SEC</span><button ref={closeRef} type="button" onClick={onClose} aria-label="Close recruiter summary"><X size={19} /></button></div>
        <div className="snapshot-heading"><span className="snapshot-kicker">QUICK OVERVIEW / 2027</span><h2 id="snapshot-title">Ragul G</h2><p>{profile.degree}</p></div>
        <div className="snapshot-facts">
          <div><span>CGPA</span><strong>{profile.cgpa}</strong></div>
          <div><span>FIELD</span><strong>AI &amp; Data Science</strong></div>
          <div><span>GRADUATING</span><strong>{profile.graduation}</strong></div>
        </div>
        <section className="snapshot-section"><span className="snapshot-kicker">CORE COMPETENCIES</span><p>Python · SQL · Machine Learning · Generative AI · Power BI · React.js · Flask</p></section>
        <a className="snapshot-project" href="https://market-ai-tracker.vercel.app" target="_blank" rel="noreferrer">
          <span className="snapshot-kicker">KEY VERIFIED PROJECT</span><strong>Market AI Tracker</strong><span>Stock analytics with technical indicators and machine learning trend forecasting <ArrowUpRight size={15} /></span>
        </a>
        <div className="snapshot-actions">
          <a className="btn btn-primary" href={profile.resume.href} download={profile.resume.filename}><Download size={16} /> Download Resume</a>
          <a className="btn btn-secondary" href={`mailto:${profile.email}`}>Send Email <ArrowUpRight size={15} /></a>
          <a className="btn btn-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn Profile <ArrowUpRight size={15} /></a>
        </div>
      </motion.aside>
    </div> : null}
  </AnimatePresence>
}

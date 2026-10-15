import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid2X2,
  Pause,
  Play,
  Rows3,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'

import { certificates } from '../../data/certificates'
import type { RecruiterRole } from '../../data/roleFocus'
import { isRoleRelevant } from '../../data/roleFocus'
import { CertificateLightbox } from '../certificates/CertificateLightbox'
import { SectionHeading } from '../shared/SectionHeading'
import { TiltCard } from '../shared/TiltCard'

import './Certifications.css'

interface CertificationsProps {
  selectedIndex: number | null
  onSelect: (index: number) => void
  onClose: () => void
  onNavigate: (index: number) => void
  role: RecruiterRole
}

const SLIDE_INTERVAL = 6000
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const categories = ['All', 'AI & Machine Learning', 'Data Analytics & Power BI', 'Software & Web'] as const

/* ---------- Cinematic slide choreography ---------- */

/** One slide at a time: horizontal + 3D entry, ghost state when idle. */
const slideVariants: Variants = {
  hidden: (rel: number) => ({
    opacity: 0.08,
    scale: 0.9,
    rotateY: rel > 0 ? -19 : 19,
    filter: 'blur(14px)',
    transition: { duration: 0.7, ease: EASE },
  }),
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: EASE,
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
  'visible-dimmed': {
    opacity: 0.48,
    scale: 0.985,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: EASE },
  },
}

/** Image column: scale + blur-to-sharp rise. */
const imageVariants: Variants = {
  hidden: {
    opacity: 0.8,
    y: 28,
    filter: 'blur(12px)',
    transition: { duration: 0.5, ease: EASE },
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE },
  },
  'visible-dimmed': {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE },
  },
}

/** Info column: staggered children sliding in from the side. */
const infoParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } },
  'visible-dimmed': { transition: { staggerChildren: 0.1, delayChildren: 0.18 } },
}

const infoChild: Variants = {
  hidden: {
    opacity: 0.8,
    x: 44,
    filter: 'blur(8px)',
    transition: { duration: 0.5, ease: EASE },
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
  'visible-dimmed': {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
}

export function Certifications({
  selectedIndex,
  onSelect,
  onClose,
  onNavigate,
  role,
}: CertificationsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLSpanElement | null>(null)
  const progressRef = useRef(0)
  const swipeRef = useRef<number | null>(null)
  const swipedRef = useRef(false)

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [view, setView] = useState<'slider' | 'grid'>('slider')

  const visibleCertificates = category === 'All'
    ? certificates
    : certificates.filter((certificate) => certificate.category === category)
  const total = visibleCertificates.length

  const lightboxOpen = selectedIndex !== null
  const autoplay = inView && isPlaying && !isHovering && !lightboxOpen && view === 'slider'

  // The automatic presentation runs while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.22 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const resetTimer = useCallback(() => {
    progressRef.current = 0
    if (fillRef.current) fillRef.current.style.transform = 'scaleX(0)'
  }, [])

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total)
      resetTimer()
    },
    [resetTimer, total],
  )

  const step = useCallback(
    (delta: number) => {
      setIndex((prev) => (prev + delta + total) % total)
      resetTimer()
    },
    [resetTimer, total],
  )

  // Auto-advance every ~6 s; the rAF timeline drives the progress fill
  // directly (no React re-render per frame).
  useEffect(() => {
    if (!autoplay) return

    let rafId = 0
    let last = performance.now()

    const tick = (now: number) => {
      const delta = Math.min(now - last, 150)
      last = now
      progressRef.current += delta / SLIDE_INTERVAL

      if (progressRef.current >= 1) {
        progressRef.current = 0
        setIndex((prev) => (prev + 1) % total)
        if (fillRef.current) fillRef.current.style.transform = 'scaleX(0)'
      } else if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progressRef.current})`
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [autoplay, total])

  // Keep the slider in sync while browsing inside the fullscreen viewer —
  // arrow keys and prev/next inside the lightbox flow through this handler.
  const handleLightboxNavigate = useCallback(
    (i: number) => {
      setIndex(i)
      resetTimer()
      onNavigate(i)
    },
    [onNavigate, resetTimer],
  )

  /* ---------------- interaction ---------------- */

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setIsHovering(true)
  }

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setIsHovering(false)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    swipeRef.current = event.clientX
    swipedRef.current = false
  }

  const handlePointerCancel = () => {
    swipeRef.current = null
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (start === null) return

    const delta = event.clientX - start
    if (Math.abs(delta) > 10) swipedRef.current = true

    // Swipe gestures are for touch / pen — mouse drag only suppresses click.
    if (event.pointerType === 'mouse') return
    if (Math.abs(delta) >= 48) step(delta < 0 ? 1 : -1)
  }

  const openCertificate = (i: number) => {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    onSelect(i)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    const tag = target?.tagName
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target?.isContentEditable
    ) {
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    } else if (event.key === ' ' || event.key === 'Spacebar') {
      // Let a focused button/link handle its own Space activation.
      if (tag === 'BUTTON' || tag === 'A') return
      event.preventDefault()
      setIsPlaying((playing) => !playing)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="section-shell certs-section"
    >
      <div className="container">
        <SectionHeading
          index="06"
          kicker="Certifications"
          title={
            <>
              The certification <span className="accent">journey.</span>
            </>
          }
          description="14 verified certifications in a cinematic auto-playing slider — real image on the left, story on the right. Hover to pause, use the controls or arrow keys to browse, and click any certificate to open the fullscreen viewer."
        />

        <div className="cert-browser-toolbar">
          <div className="cert-filter-chips" role="group" aria-label="Filter certificates by category">
            {categories.map((item) => {
              const count = item === 'All' ? certificates.length : certificates.filter((certificate) => certificate.category === item).length
              return <button key={item} type="button" className={`cert-filter-chip${category === item ? ' is-active' : ''}`} onClick={() => { setCategory(item); setIndex(0); resetTimer() }} aria-pressed={category === item}>{item} <span>{count}</span></button>
            })}
          </div>
          <div className="cert-view-toggle" role="group" aria-label="Certificate layout">
            <button type="button" className={view === 'slider' ? 'is-active' : ''} onClick={() => setView('slider')} aria-pressed={view === 'slider'}><Rows3 size={15} /> Cinematic Slider View</button>
            <button type="button" className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-pressed={view === 'grid'}><Grid2X2 size={15} /> Clean Grid View</button>
          </div>
        </div>

        <div
          className={`cert-carousel${view === 'grid' ? ' is-grid-hidden' : ''}`}
          role="group"
          aria-roledescription="carousel"
          aria-label="Certifications"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <div
            className="cert-stage"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div
              className="cert-track"
              style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
            >
              {visibleCertificates.map((certificate, i) => (
                <motion.div
                  key={certificate.id}
                  className={`cert-slide${role !== 'all' ? isRoleRelevant(role, [certificate.title]) ? ' is-role-relevant' : ' is-role-dimmed' : ''}`}
                  custom={i - index}
                  variants={slideVariants}
                  initial="hidden"
                  animate={i !== index ? 'hidden' : role !== 'all' && !isRoleRelevant(role, [certificate.title]) ? 'visible-dimmed' : 'visible'}
                >
                  <motion.div
                    className="cert-slide-image"
                    variants={imageVariants}
                    onClick={() => openCertificate(i)}
                  >
                    <TiltCard className="cert-frame" maxTilt={9}>
                      <span className="cert-frame-glow" aria-hidden="true" />

                      <div className="cert-frame-inner">
                        <img
                          src={certificate.image}
                          alt={`${certificate.title} certificate issued by ${certificate.organization}`}
                          loading={i === index ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>

                      <button
                        type="button"
                        className="cert-open"
                        onClick={(event) => {
                          event.stopPropagation()
                          openCertificate(i)
                        }}
                        aria-label={`Open certificate: ${certificate.title} — ${certificate.organization}`}
                      >
                        <span className="cert-open-inner">
                          <Eye size={15} aria-hidden="true" />
                          View certificate
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                      </button>
                    </TiltCard>
                  </motion.div>

                  <motion.div className="cert-info" variants={infoParent}>
                    <div className="cert-meta">
                      <motion.span className="cert-number" variants={infoChild}>
                        {String(i + 1).padStart(2, '0')}
                      </motion.span>
                      <motion.span className="cert-org" variants={infoChild}>
                        {certificate.shortOrg}
                      </motion.span>
                    </div>

                    <motion.h3 className="cert-title" variants={infoChild}>
                      {certificate.title}
                    </motion.h3>

                    <motion.blockquote
                      className="cert-takeaway"
                      variants={infoChild}
                    >
                      <span className="cert-takeaway-label">Key takeaway</span>
                      <p>&ldquo;{certificate.takeaway}&rdquo;</p>
                    </motion.blockquote>

                    <motion.div className="cert-foot" variants={infoChild}>
                      <span className="cert-organization">
                        {certificate.organization}
                      </span>
                      {certificate.date ? (
                        <time className="cert-date">{certificate.date}</time>
                      ) : (
                        <span className="cert-date cert-date-empty">
                          Date not specified
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="cert-controls">
            <div className="cert-controls-row">
              <div className="cert-nav-group">
                <button
                  type="button"
                  className="cert-ctrl"
                  onClick={() => step(-1)}
                  aria-label="Previous certificate"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="cert-ctrl cert-ctrl-play"
                  onClick={() => setIsPlaying((playing) => !playing)}
                  aria-label={
                    isPlaying
                      ? 'Pause automatic slideshow'
                      : 'Play automatic slideshow'
                  }
                >
                  {isPlaying ? (
                    <Pause size={16} aria-hidden="true" />
                  ) : (
                    <Play size={16} aria-hidden="true" />
                  )}
                  <span className="cert-ctrl-label">
                    {isPlaying ? 'Pause' : 'Play'}
                  </span>
                </button>

                <button
                  type="button"
                  className="cert-ctrl"
                  onClick={() => step(1)}
                  aria-label="Next certificate"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="cert-counter">
                <strong key={index} className="cert-counter-num">
                  {String(index + 1).padStart(2, '0')}
                </strong>
                <span> / {String(total).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="cert-progress">
              {visibleCertificates.map((certificate, i) => (
                <button
                  key={certificate.id}
                  type="button"
                  className={`cert-tick${i === index ? ' is-active' : ''}${
                    i < index ? ' is-past' : ''
                  }`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to certificate ${i + 1}: ${certificate.title}`}
                  aria-current={i === index ? 'true' : undefined}
                >
                  <span className="cert-tick-bar">
                    <span
                      ref={i === index ? fillRef : undefined}
                      className="cert-tick-fill"
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {view === 'grid' ? <div className="cert-grid">
          {visibleCertificates.map((certificate, i) => <motion.button key={certificate.id} type="button" className={`cert-grid-card${role !== 'all' ? isRoleRelevant(role, [certificate.title]) ? ' is-role-relevant' : ' is-role-dimmed' : ''}`} animate={{ opacity: role !== 'all' && !isRoleRelevant(role, [certificate.title]) ? 0.46 : 1, scale: role !== 'all' && isRoleRelevant(role, [certificate.title]) ? 1.015 : 1 }} whileHover={{ y: -4 }} transition={{ duration: 0.24 }} onClick={() => onSelect(i)} aria-label={`Open certificate: ${certificate.title}`}>
            <img src={certificate.image} alt="" loading="lazy" decoding="async" />
            <span className="cert-grid-category">{certificate.category}</span>
            <strong>{certificate.title}</strong>
            <span className="cert-grid-issuer">{certificate.organization} · {certificate.year ?? 'Year not specified'}</span>
          </motion.button>)}
        </div> : null}
      </div>

      <CertificateLightbox
        certificates={visibleCertificates}
        selectedIndex={selectedIndex}
        onClose={onClose}
        onNavigate={handleLightboxNavigate}
      />
    </section>
  )
}




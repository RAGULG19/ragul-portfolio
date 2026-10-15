import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import type { Certificate } from '../../data/certificates'

interface CertificateLightboxProps {
  certificates: Certificate[]
  selectedIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function CertificateLightbox({
  certificates,
  selectedIndex,
  onClose,
  onNavigate,
}: CertificateLightboxProps) {
  const isOpen = selectedIndex !== null
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)

  useBodyScrollLock(isOpen)

  // Focus the close button when opened; restore focus on close.
  useEffect(() => {
    if (isOpen) {
      lastTriggerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      closeRef.current?.focus()
    } else {
      lastTriggerRef.current?.focus()
      lastTriggerRef.current = null
    }
  }, [isOpen])

  // Keyboard controls: Escape + arrow navigation.
  useEffect(() => {
    if (selectedIndex === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNavigate((selectedIndex + 1) % certificates.length)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onNavigate(
          (selectedIndex - 1 + certificates.length) % certificates.length,
        )
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIndex, certificates.length, onClose, onNavigate])

  const active =
    selectedIndex !== null ? certificates[selectedIndex] : undefined
  const counter =
    selectedIndex !== null
      ? `${String(selectedIndex + 1).padStart(2, '0')} / ${String(
          certificates.length,
        ).padStart(2, '0')}`
      : ''

  return (
    <AnimatePresence>
      {active && selectedIndex !== null ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate viewer: ${active.title}`}
          onClick={onClose}
        >
          <motion.div
            className="lightbox-panel"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="lightbox-head">
              <div className="lightbox-head-text">
                <span className="lightbox-kicker">
                  Certificate {counter}
                </span>
                <h3 id="lightbox-title">{active.title}</h3>
                <p>
                  {active.organization}
                  {active.date ? <span> · {active.date}</span> : null}
                </p>
              </div>

              <button
                ref={closeRef}
                type="button"
                className="lightbox-close"
                onClick={onClose}
                aria-label="Close certificate viewer"
              >
                <X size={19} />
              </button>
            </header>

            <div className="lightbox-details">
              <div><span>ISSUER</span><strong>{active.organization}</strong></div>
              <div><span>YEAR</span><strong>{active.year ?? 'Not specified'}</strong></div>
              <div className="lightbox-skills"><span>SKILLS VALIDATED</span><div>{active.skillsValidated.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
            </div>

            <div className="lightbox-stage">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt={`${active.title} certificate issued by ${active.organization}`}
                  initial={{ opacity: 0, scale: 0.965, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  decoding="async"
                />
              </AnimatePresence>
            </div>

            <footer className="lightbox-foot">
              <button
                type="button"
                className="lightbox-nav"
                onClick={() =>
                  onNavigate(
                    (selectedIndex - 1 + certificates.length) %
                      certificates.length,
                  )
                }
                aria-label="Previous certificate"
              >
                <ChevronLeft size={17} />
                Prev
              </button>

              <span className="lightbox-hint">
                ← → to browse · Esc to close
              </span>

              <button
                type="button"
                className="lightbox-nav lightbox-nav-next"
                onClick={() => onNavigate((selectedIndex + 1) % certificates.length)}
                aria-label="Next certificate"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </footer>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

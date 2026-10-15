import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

import { navItems } from '../../data/navigation'
import { profile } from '../../data/profile'
import { RecruiterSnapshotModal } from '../layout/RecruiterSnapshotModal'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { GithubIcon, LinkedinIcon } from '../shared/BrandIcons'
import { Magnetic } from '../shared/Magnetic'

import './Navbar.css'

interface NavbarProps {
  activeSection: string
  isScrolled: boolean
}

export function Navbar({ activeSection, isScrolled }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [snapshotOpen, setSnapshotOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useBodyScrollLock(menuOpen)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
    <header
      className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${
        menuOpen ? 'menu-open' : ''
      }`}
    >
      <nav className="nav container" aria-label="Main navigation">
        <a href="#home" className="nav-brand" aria-label="Ragul G — back to top">
          RAGUL<span className="nav-brand-accent">G</span>
          <span className="nav-brand-dot" aria-hidden="true" />
        </a>

        <ul className="nav-links">
          {navItems.map((item) => {
            const active = activeSection === item.id

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'true' : undefined}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="nav-link-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="nav-actions">
          <button type="button" className="nav-snapshot-button" onClick={() => setSnapshotOpen(true)} aria-label="Recruiter 15s Summary">
            <Zap size={14} aria-hidden="true" /><span className="nav-snapshot-full">Recruiter 15s Summary</span><span className="nav-snapshot-compact">15s Summary</span>
          </button>
          <Magnetic strength={6}>
            <a
              className="nav-resume"
              href={profile.resume.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </Magnetic>

          <button
            type="button"
            className="nav-burger"
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`burger-bar ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      {/* Real scroll progress line */}
      <div className="nav-progress-track" aria-hidden="true">
        <motion.div
          className="nav-progress-bar"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="mobile-menu-links"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.08 },
                },
              }}
            >
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <a
                    href={`#${item.id}`}
                    className={`mobile-menu-link ${
                      activeSection === item.id ? 'is-active' : ''
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-menu-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="mobile-menu-footer"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <a
                className="btn btn-primary"
                href={profile.resume.href}
                download={profile.resume.filename}
                onClick={() => setMenuOpen(false)}
              >
                Download Resume
              </a>

              <a
                className="btn btn-ghost"
                href={profile.resume.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                View Resume
              </a>

              <div className="mobile-menu-socials">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  onClick={() => setMenuOpen(false)}
                >
                  <GithubIcon size={19} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  onClick={() => setMenuOpen(false)}
                >
                  <LinkedinIcon size={19} />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="mobile-menu-email-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {profile.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
    <RecruiterSnapshotModal open={snapshotOpen} onClose={() => setSnapshotOpen(false)} />
    </>
  )
}

import { ArrowUp, Mail } from 'lucide-react'

import { profile } from '../../data/profile'
import { GithubIcon, LinkedinIcon } from '../shared/BrandIcons'

import './Footer.css'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="container footer-inner">
        <div className="footer-brand-block">
          <span className="footer-brand">
            RAGUL<span>G</span>
          </span>
          <p>{profile.heroTitle} — Turning Data Into Intelligence.</p>
        </div>

        <nav className="footer-links" aria-label="Footer links">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GithubIcon size={17} />
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={17} />
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email">
            <Mail size={16} />
            Email
          </a>
        </nav>

        <div className="footer-meta">
          <span>© 2026 Ragul G. All rights reserved.</span>

          <button type="button" className="back-to-top" onClick={scrollToTop}>
            <ArrowUp size={14} aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
